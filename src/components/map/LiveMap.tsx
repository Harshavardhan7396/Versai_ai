import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  Bus, 
  Train, 
  Navigation, 
  Info, 
  Radio, 
  Layers, 
  X,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Clock,
  ArrowRight,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Filter,
  Eye,
  RefreshCw,
  Search,
  Route,
  Activity,
  Users,
  Compass,
  Zap
} from 'lucide-react';
import { 
  VehicleLocation, 
  StationNode, 
  CrowdLevel, 
  BusTimetableEntry, 
  TrainTimetableEntry, 
  RegionalBusEntry, 
  StudentReport 
} from '../../types';
import { REGION_NODES } from '../../data/seedData';
import { store } from '../../services/store';
import { soundService } from '../../services/soundService';
import { 
  MAP_ROUTES, 
  MapRoute, 
  getUpcomingDeparturesForNode, 
  getRealtimeUpdateForNode, 
  StationUpcomingDeparture, 
  StationRealtimeUpdate 
} from '../../data/mapRoutesData';

interface LiveMapProps {
  vehicles?: VehicleLocation[];
  onNavigateTab?: (tab: string) => void;
}

export const LiveMap: React.FC<LiveMapProps> = ({ 
  vehicles: initialVehicles,
  onNavigateTab 
}) => {
  // Store subscriptions and state
  const [vehicles, setVehicles] = useState<VehicleLocation[]>(
    initialVehicles || store.getVehicles()
  );
  const [buses, setBuses] = useState<BusTimetableEntry[]>(store.getBuses());
  const [trains, setTrains] = useState<TrainTimetableEntry[]>(store.getTrains());
  const [regionalBuses, setRegionalBuses] = useState<RegionalBusEntry[]>(store.getRegionalBuses());
  const [reports, setReports] = useState<StudentReport[]>(store.getReports());

  // Interactive selection states
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleLocation | null>(null);
  const [selectedNode, setSelectedNode] = useState<StationNode | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [hoveredRouteId, setHoveredRouteId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Filters & controls
  const [filterType, setFilterType] = useState<'all' | 'bus' | 'train' | 'shuttle'>('all');
  const [departureFilter, setDepartureFilter] = useState<'all' | 'campus_bus' | 'train' | 'regional_bus'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showRoutesLayer, setShowRoutesLayer] = useState(true);
  const [showStopsLayer, setShowStopsLayer] = useState(true);
  const [showVehiclesLayer, setShowVehiclesLayer] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Listen to store updates
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setVehicles(store.getVehicles());
      setBuses(store.getBuses());
      setTrains(store.getTrains());
      setRegionalBuses(store.getRegionalBuses());
      setReports(store.getReports());
    });
    return () => unsubscribe();
  }, []);

  // Sync initialVehicles if prop changes
  useEffect(() => {
    if (initialVehicles) {
      setVehicles(initialVehicles);
    }
  }, [initialVehicles]);

  // Bounding box for mapping coordinates into SVG viewBox (800x600)
  // Region: Lat 8.05 to 8.42, Lng 77.40 to 77.68
  const minLat = 8.05;
  const maxLat = 8.42;
  const minLng = 77.40;
  const maxLng = 77.68;

  const latToY = (lat: number) => {
    return 550 - ((lat - minLat) / (maxLat - minLat)) * 500;
  };

  const lngToX = (lng: number) => {
    return 50 + ((lng - minLng) / (maxLng - minLng)) * 700;
  };

  // Find currently selected route object
  const selectedRoute = useMemo(() => {
    return MAP_ROUTES.find((r) => r.id === selectedRouteId) || null;
  }, [selectedRouteId]);

  // Nodes belonging to the selected route (for stop highlighting)
  const highlightedNodeIds = useMemo(() => {
    if (!selectedRoute) return new Set<string>();
    return new Set(selectedRoute.stops.map((s) => s.nodeId).filter(Boolean) as string[]);
  }, [selectedRoute]);

  // Departures for the selected node
  const upcomingDepartures = useMemo(() => {
    if (!selectedNode) return [];
    const all = getUpcomingDeparturesForNode(selectedNode, buses, trains, regionalBuses);
    if (departureFilter === 'all') return all;
    return all.filter((d) => d.type === departureFilter);
  }, [selectedNode, buses, trains, regionalBuses, departureFilter]);

  // Real-time updates for selected node
  const nodeRealtimeUpdate: StationRealtimeUpdate | null = useMemo(() => {
    if (!selectedNode) return null;
    const nodeNameLower = selectedNode.name.toLowerCase();
    const reportsForNode = reports.filter((r) => 
      (r.destination && r.destination.toLowerCase().includes(nodeNameLower)) ||
      (r.description && r.description.toLowerCase().includes(nodeNameLower)) ||
      (selectedNode.code && r.description && r.description.toLowerCase().includes(selectedNode.code.toLowerCase()))
    ).length;
    return getRealtimeUpdateForNode(selectedNode, vehicles, reportsForNode);
  }, [selectedNode, vehicles, reports]);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    if (!showVehiclesLayer) return [];
    return vehicles.filter((v) => {
      if (filterType === 'all') return true;
      return v.type === filterType;
    });
  }, [vehicles, filterType, showVehiclesLayer]);

  // Handle clicking a node / stop
  const handleSelectNode = (node: StationNode) => {
    soundService.playClick();
    setSelectedNode(node);
    setSelectedVehicle(null);
    setDepartureFilter('all');
  };

  // Handle clicking a route to highlight it
  const handleSelectRoute = (routeId: string | null) => {
    soundService.playClick();
    if (selectedRouteId === routeId) {
      setSelectedRouteId(null);
    } else {
      setSelectedRouteId(routeId);
      // If we clicked a route, keep drawer focused on the route
      if (routeId) {
        setSelectedVehicle(null);
      }
    }
  };

  // Handle clicking a vehicle
  const handleSelectVehicle = (veh: VehicleLocation) => {
    soundService.playClick();
    setSelectedVehicle(veh);
    setSelectedNode(null);
  };

  // Manual refresh animation
  const handleRefresh = () => {
    soundService.playClick();
    setIsRefreshing(true);
    setTimeout(() => {
      setVehicles(store.getVehicles());
      setIsRefreshing(false);
    }, 600);
  };

  // Helper for Crowd Badges
  const getCrowdBadge = (crowd: CrowdLevel) => {
    switch (crowd) {
      case 'LOW':
        return <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">🟢 Low Flow</span>;
      case 'MODERATE':
        return <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">🟡 Moderate Flow</span>;
      case 'HIGH':
        return <span className="inline-flex items-center gap-1 text-orange-400 font-semibold">🟠 Busy Corridor</span>;
      case 'VERY HIGH':
        return <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">🔴 Heavy Congestion</span>;
      case 'NOT AVAILABLE':
      default:
        return <span className="text-gray-400">⚪ Not Available</span>;
    }
  };

  // Search filtered items
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    
    const matchedNodes = REGION_NODES.filter((n) => 
      n.name.toLowerCase().includes(query) || 
      n.description.toLowerCase().includes(query) ||
      (n.code && n.code.toLowerCase().includes(query))
    ).map((n) => ({ type: 'node' as const, item: n }));

    const matchedRoutes = MAP_ROUTES.filter((r) => 
      r.routeNumber.toLowerCase().includes(query) || 
      r.name.toLowerCase().includes(query) ||
      r.operator.toLowerCase().includes(query)
    ).map((r) => ({ type: 'route' as const, item: r }));

    const matchedVehicles = vehicles.filter((v) => 
      v.vehicleNumber.toLowerCase().includes(query) || 
      v.route.toLowerCase().includes(query) ||
      v.destination.toLowerCase().includes(query)
    ).map((v) => ({ type: 'vehicle' as const, item: v }));

    return [...matchedNodes, ...matchedRoutes, ...matchedVehicles].slice(0, 6);
  }, [searchQuery, vehicles]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                INTERACTIVE LIVE MAP
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Click Any Stop or Route to Inspect
              </span>
              <span className="text-xs text-gray-400 hidden sm:inline">Joy University Transit Corridor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
              Interactive Regional Transit Map
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl">
              Click any <strong className="text-white">Bus Stop</strong> or <strong className="text-white">Train Station</strong> to view upcoming departures and real-time updates. Click any <strong className="text-pink-300">Bus Route</strong> to highlight its full path.
            </p>
          </div>

          {/* Quick Search & Refresh Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Find stop, route, or station..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Quick Search Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 glass-panel-glow rounded-2xl border border-purple-500/30 shadow-2xl p-2 space-y-1">
                  {searchResults.map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (result.type === 'node') {
                          handleSelectNode(result.item);
                        } else if (result.type === 'route') {
                          handleSelectRoute(result.item.id);
                        } else {
                          handleSelectVehicle(result.item);
                        }
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 flex items-center justify-between text-xs text-gray-200 transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {result.type === 'node' && <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
                        {result.type === 'route' && <Route className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />}
                        {result.type === 'vehicle' && <Bus className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />}
                        <span className="font-semibold truncate">
                          {result.type === 'node' && result.item.name}
                          {result.type === 'route' && `${result.item.routeNumber}: ${result.item.name}`}
                          {result.type === 'vehicle' && `${result.item.vehicleNumber} (${result.item.route})`}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider ml-2 flex-shrink-0">
                        {result.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleRefresh}
              className={`p-2.5 rounded-xl border border-white/10 bg-black/40 text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 text-xs font-semibold ${
                isRefreshing ? 'opacity-70' : ''
              }`}
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Route Quick Selector Pills Bar */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
            <Route className="w-4 h-4 text-pink-400" />
            <span>Interactive Bus & Rail Routes:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => handleSelectRoute(null)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedRouteId === null
                  ? 'bg-white/20 text-white border-white/30 shadow-sm'
                  : 'bg-black/30 text-gray-400 border-white/5 hover:text-white'
              }`}
            >
              All Routes
            </button>

            {MAP_ROUTES.map((route) => {
              const isSelected = selectedRouteId === route.id;
              return (
                <button
                  key={route.id}
                  onClick={() => handleSelectRoute(route.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'text-white shadow-lg border-current'
                      : 'bg-black/30 text-gray-400 border-white/5 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: isSelected ? `${route.color}25` : undefined,
                    borderColor: isSelected ? route.color : undefined,
                    color: isSelected ? '#ffffff' : undefined,
                  }}
                  title={`Click to highlight ${route.routeNumber}`}
                >
                  <span 
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: route.color }}
                  />
                  <span>{route.routeNumber}</span>
                  {isSelected && (
                    <span className="ml-1 text-[10px] bg-white/20 px-1 rounded uppercase font-bold">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Map Interactive Canvas Card */}
      <div className="relative glass-panel rounded-3xl border border-white/15 overflow-hidden shadow-2xl h-[620px] bg-[#070517]">
        {/* Top Left Floating Map Controls */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {/* Zoom controls */}
          <div className="glass-panel p-1.5 rounded-2xl border border-white/10 flex flex-col gap-1 shadow-xl">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2.0))}
              className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
              className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Reset Zoom"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Layer toggles */}
          <div className="glass-panel p-2 rounded-2xl border border-white/10 flex flex-col gap-1.5 shadow-xl text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-1">Layers</span>
            <button
              onClick={() => setShowRoutesLayer(!showRoutesLayer)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${
                showRoutesLayer ? 'text-pink-300 bg-pink-500/20' : 'text-gray-500 hover:text-gray-300'
              }`}
              title="Toggle Bus & Rail Routes"
            >
              <Route className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Routes</span>
            </button>
            <button
              onClick={() => setShowStopsLayer(!showStopsLayer)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${
                showStopsLayer ? 'text-cyan-300 bg-cyan-500/20' : 'text-gray-500 hover:text-gray-300'
              }`}
              title="Toggle Stops & Stations"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Stops</span>
            </button>
            <button
              onClick={() => setShowVehiclesLayer(!showVehiclesLayer)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${
                showVehiclesLayer ? 'text-purple-300 bg-purple-500/20' : 'text-gray-500 hover:text-gray-300'
              }`}
              title="Toggle Vehicles"
            >
              <Bus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Vehicles</span>
            </button>
          </div>
        </div>

        {/* Top Right Floating Vehicle Filter (When no drawer is open) */}
        {!selectedNode && !selectedRoute && !selectedVehicle && (
          <div className="absolute top-4 right-4 z-20 flex rounded-2xl bg-black/60 backdrop-blur-md p-1 border border-white/10 shadow-xl">
            {(['all', 'bus', 'train', 'shuttle'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all ${
                  filterType === type
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {type === 'all' ? 'All Vehicles' : `${type}s`}
              </button>
            ))}
          </div>
        )}

        {/* Active Highlight Banner (Top Center) */}
        {selectedRoute && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 glass-panel-glow px-4 py-2 rounded-2xl border border-pink-500/40 shadow-2xl flex items-center gap-3 animate-in fade-in duration-200">
            <span 
              className="w-3 h-3 rounded-full animate-ping"
              style={{ backgroundColor: selectedRoute.color }}
            />
            <div className="text-xs">
              <span className="text-gray-400">Highlighted Route: </span>
              <strong className="text-white font-bold">{selectedRoute.routeNumber}</strong>
              <span className="text-gray-400 hidden sm:inline"> ({selectedRoute.name})</span>
            </div>
            <button
              onClick={() => handleSelectRoute(null)}
              className="px-2 py-0.5 rounded-lg bg-white/10 text-gray-300 hover:text-white text-[11px] font-semibold"
            >
              Clear
            </button>
          </div>
        )}

        {/* Bottom Legend */}
        <div className="absolute bottom-4 left-4 z-20 glass-panel p-2.5 rounded-2xl border border-white/10 hidden md:flex items-center gap-4 text-xs shadow-lg">
          <div className="flex items-center gap-1.5 text-gray-300">
            <span className="w-3 h-3 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50" />
            <span>Joy Campus Hub</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-300">
            <span className="w-3 h-3 rounded-full bg-cyan-400" />
            <span>Railway Station</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-300">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span>Bus Stop Node</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-300">
            <span className="w-2.5 h-0.5 bg-pink-500 rounded" />
            <span>Bus Route Path</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-300">
            <span className="w-2.5 h-0.5 bg-sky-400 rounded" />
            <span>Railway Line</span>
          </div>
        </div>

        {/* SVG Vector Map Rendering */}
        <div 
          className="w-full h-full flex items-center justify-center transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 800 600"
            className="w-full h-full select-none"
            style={{ filter: 'drop-shadow(0 0 14px rgba(0,0,0,0.6))' }}
          >
            {/* Gradients and Filters */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.025)" strokeWidth="1" />
              </pattern>

              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Route Gradients */}
              <linearGradient id="routeGradient15" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="routeGradient17d" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#9333ea" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="routeGradient17f" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="routeGradient111" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="routeGradient5a" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="railwayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            {/* Background Grid */}
            <rect width="800" height="600" fill="url(#grid)" />

            {/* Geographical Boundary Hints / Water / Region Outline */}
            <path
              d="M 50 560 Q 200 570 380 575 Q 500 580 750 560"
              fill="none"
              stroke="rgba(56, 189, 248, 0.08)"
              strokeWidth="12"
              strokeDasharray="16 8"
            />
            <text x="350" y="585" fill="rgba(56, 189, 248, 0.25)" fontSize="10" fontWeight="bold">
              INDIAN OCEAN COASTAL CORRIDOR (KANYAKUMARI REGION)
            </text>

            {/* 1. ROUTES LAYER */}
            {showRoutesLayer && MAP_ROUTES.map((route) => {
              const isSelected = selectedRouteId === route.id;
              const isHovered = hoveredRouteId === route.id;
              const isDimmed = selectedRouteId !== null && !isSelected;
              const pathD = route.getPathD(lngToX, latToY);

              return (
                <g 
                  key={route.id}
                  className="cursor-pointer group"
                  onClick={() => handleSelectRoute(route.id)}
                  onMouseEnter={() => setHoveredRouteId(route.id)}
                  onMouseLeave={() => setHoveredRouteId(null)}
                >
                  {/* Invisible wide hit area for effortless clicking on touch / mouse */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="28"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Pulsing Neon Glow layer when selected */}
                  {isSelected && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke={route.color}
                      strokeWidth="10"
                      strokeOpacity="0.4"
                      strokeLinecap="round"
                      filter="url(#neonGlow)"
                      className="animate-pulse"
                    />
                  )}

                  {/* Hover halo */}
                  {isHovered && !isSelected && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke={route.color}
                      strokeWidth="8"
                      strokeOpacity="0.3"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Main Visual Route Path Line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={`url(#${route.gradientId})`}
                    strokeWidth={isSelected ? 5.5 : isHovered ? 4 : 3}
                    strokeDasharray={isSelected ? '8 4' : route.strokeDash || undefined}
                    strokeOpacity={isDimmed ? 0.2 : isSelected ? 1 : 0.85}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-all duration-300 ${isSelected ? 'animate-pulse' : ''}`}
                  />
                </g>
              );
            })}

            {/* 2. STOPS & STATIONS NODES LAYER */}
            {showStopsLayer && REGION_NODES.map((node) => {
              const x = lngToX(node.lng);
              const y = latToY(node.lat);
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNodeId === node.id;
              const isJoy = node.type === 'college';
              const isRailway = node.type === 'railway_station';
              const isStopInSelectedRoute = highlightedNodeIds.has(node.id);

              return (
                <g
                  key={node.id}
                  className="cursor-pointer group"
                  onClick={() => handleSelectNode(node)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                >
                  {/* Outer pulse circle for Joy University Central Hub */}
                  {isJoy && (
                    <circle
                      cx={x}
                      cy={y}
                      r="26"
                      fill="#a855f7"
                      fillOpacity="0.25"
                      className="animate-ping"
                    />
                  )}

                  {/* Glowing ring if node belongs to currently highlighted route */}
                  {isStopInSelectedRoute && (
                    <circle
                      cx={x}
                      cy={y}
                      r={isJoy ? 20 : 16}
                      fill="none"
                      stroke={selectedRoute?.color || '#ec4899'}
                      strokeWidth="2.5"
                      strokeDasharray="4 3"
                      className="animate-spin"
                      style={{ animationDuration: '6s', transformOrigin: `${x}px ${y}px` }}
                    />
                  )}

                  {/* Selection indicator ring */}
                  {isSelected && (
                    <circle
                      cx={x}
                      cy={y}
                      r={isJoy ? 18 : 14}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeDasharray="6 3"
                      className="animate-pulse"
                    />
                  )}

                  {/* Marker Node Dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isJoy ? 12 : isRailway ? 9 : 7.5}
                    fill={
                      isJoy 
                        ? '#c084fc' 
                        : isRailway 
                        ? '#38bdf8' 
                        : isStopInSelectedRoute 
                        ? (selectedRoute?.color || '#fbbf24') 
                        : '#fbbf24'
                    }
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
                    className="transition-transform group-hover:scale-125 duration-200"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
                  />

                  {/* Icon indicator inside college or railway */}
                  {isRailway && (
                    <text
                      x={x}
                      y={y + 3}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#032541"
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      🚆
                    </text>
                  )}
                  {isJoy && (
                    <text
                      x={x}
                      y={y + 3.5}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#1e1b4b"
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      🏫
                    </text>
                  )}

                  {/* Label Text with background card for crisp legibility */}
                  <g className="pointer-events-none transition-transform group-hover:scale-105 duration-200">
                    <rect
                      x={x + (isJoy ? 16 : 12)}
                      y={y - 8}
                      width={node.name.length * (isJoy ? 7.2 : 6.2) + 12}
                      height={isJoy ? 18 : 16}
                      rx="4"
                      fill="rgba(8, 6, 24, 0.75)"
                      stroke={isSelected ? '#38bdf8' : isStopInSelectedRoute ? (selectedRoute?.color || '#a855f7') : 'rgba(255,255,255,0.1)'}
                      strokeWidth="1"
                    />
                    <text
                      x={x + (isJoy ? 22 : 18)}
                      y={y + (isJoy ? 5 : 4)}
                      fill={isJoy ? '#e9d5ff' : isRailway ? '#bae6fd' : '#ffffff'}
                      fontSize={isJoy ? '11.5' : '10'}
                      fontWeight={isJoy ? 'bold' : 'medium'}
                    >
                      {node.name.replace(' Bus Stop', '').replace(' Stop', '')}
                      {node.code ? ` (${node.code})` : ''}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* 3. VEHICLE MARKERS LAYER */}
            {filteredVehicles.map((veh) => {
              const x = lngToX(veh.lng);
              const y = latToY(veh.lat);
              const isSelected = selectedVehicle?.id === veh.id;

              return (
                <g
                  key={veh.id}
                  className="cursor-pointer group"
                  onClick={() => handleSelectVehicle(veh)}
                >
                  {/* Halo pulse */}
                  <circle
                    cx={x}
                    cy={y}
                    r="18"
                    fill={veh.type === 'train' ? '#0284c7' : '#9333ea'}
                    fillOpacity="0.35"
                    className="animate-pulse"
                  />

                  {/* Icon Card Box */}
                  <rect
                    x={x - 15}
                    y={y - 15}
                    width="30"
                    height="30"
                    rx="9"
                    fill="#181335"
                    stroke={isSelected ? '#38bdf8' : '#a855f7'}
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="transition-transform group-hover:scale-110 shadow-lg"
                  />

                  <text
                    x={x}
                    y={y + 5}
                    textAnchor="middle"
                    fontSize="15"
                    className="pointer-events-none"
                  >
                    {veh.type === 'bus' ? '🚌' : veh.type === 'train' ? '🚆' : '🚐'}
                  </text>

                  {/* Vehicle Number Badge */}
                  <rect
                    x={x - 22}
                    y={y - 30}
                    width="44"
                    height="14"
                    rx="4"
                    fill="#08061a"
                    stroke={isSelected ? '#38bdf8' : '#a855f7'}
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={y - 20}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="9"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {veh.vehicleNumber}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* ========================================================================= */}
        {/* DRAWER 1: SELECTED BUS STOP OR TRAIN STATION DETAIL PANEL                 */}
        {/* Displays Stop Name, Upcoming Departures, and Real-Time Telemetry Updates  */}
        {/* ========================================================================= */}
        {selectedNode && (
          <div className="absolute top-3 right-3 bottom-3 z-30 w-96 max-w-[92vw] glass-panel-glow rounded-3xl p-5 border border-cyan-500/40 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                    selectedNode.type === 'college'
                      ? 'bg-purple-500/25 text-purple-300 border border-purple-500/40'
                      : selectedNode.type === 'railway_station'
                      ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40'
                      : 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                  }`}>
                    {selectedNode.type === 'college' ? (
                      <Compass className="w-5 h-5 text-purple-300" />
                    ) : selectedNode.type === 'railway_station' ? (
                      <Train className="w-5 h-5 text-cyan-300" />
                    ) : (
                      <MapPin className="w-5 h-5 text-amber-300" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                        {selectedNode.type === 'college'
                          ? 'Central Campus Hub'
                          : selectedNode.type === 'railway_station'
                          ? 'Railway Junction'
                          : 'Bus Stop Node'}
                      </span>
                      {selectedNode.code && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {selectedNode.code}
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-white tracking-tight leading-tight">
                      {selectedNode.name}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Close station panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Description & Coordinates */}
              <div className="my-3 p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs text-gray-300">
                <p>{selectedNode.description}</p>
                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-white/5">
                  <span>Coordinates:</span>
                  <span className="font-mono text-cyan-300">{selectedNode.lat.toFixed(4)}°N, {selectedNode.lng.toFixed(4)}°E</span>
                </div>
              </div>

              {/* REAL-TIME UPDATES SECTION */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    <span>Real-Time Updates & Corridor Status</span>
                  </div>
                  <span className="text-[10px] text-gray-400">Live Telemetry</span>
                </div>

                {nodeRealtimeUpdate && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-black/60 border border-emerald-500/30 space-y-2.5">
                    {/* Active vehicles in corridor */}
                    {nodeRealtimeUpdate.activeVehiclesNearby.length > 0 ? (
                      <div className="space-y-2">
                        {nodeRealtimeUpdate.activeVehiclesNearby.map((veh) => (
                          <div 
                            key={veh.id}
                            className="p-2.5 rounded-xl bg-black/50 border border-emerald-500/20 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base">{veh.type === 'train' ? '🚆' : '🚌'}</span>
                              <div>
                                <span className="font-bold text-white block">{veh.vehicleNumber}</span>
                                <span className="text-[11px] text-gray-400">
                                  Next: <strong className="text-cyan-300">{veh.nextStop}</strong>
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                {veh.trackingType}
                              </span>
                              <span className="text-[10px] text-gray-400 block mt-0.5">ETA: ~8 mins</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white block">{nodeRealtimeUpdate.serviceAlert.title}</span>
                          <span className="text-[11px] text-gray-400">{nodeRealtimeUpdate.serviceAlert.message}</span>
                        </div>
                      </div>
                    )}

                    {/* Crowd Footfall */}
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span>Platform Crowd:</span>
                      </div>
                      <div>{getCrowdBadge(nodeRealtimeUpdate.crowdStatus)}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* UPCOMING DEPARTURES SECTION */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    <span>Upcoming Departures (Timetable Data)</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{upcomingDepartures.length} scheduled</span>
                </div>

                {/* Filter pills if multiple transport types serve this station */}
                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                  {(['all', 'campus_bus', 'train', 'regional_bus'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setDepartureFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                        departureFilter === cat
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-black/30 text-gray-400 hover:text-white'
                      }`}
                    >
                      {cat === 'all' 
                        ? 'All' 
                        : cat === 'campus_bus' 
                        ? 'Campus Bus' 
                        : cat === 'train' 
                        ? 'Trains' 
                        : 'Regional'}
                    </button>
                  ))}
                </div>

                {/* Departures List */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {upcomingDepartures.length > 0 ? (
                    upcomingDepartures.map((dep) => (
                      <div
                        key={dep.id}
                        className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-purple-500/40 transition-all flex flex-col gap-1.5 group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {dep.time}
                            </span>
                            <span className="text-xs font-bold text-white">
                              {dep.serviceNumber}
                            </span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            {dep.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-gray-300 truncate">
                            <span className="text-gray-400">To:</span>
                            <span className="font-semibold text-cyan-300 truncate">{dep.destination}</span>
                          </div>
                          {dep.platformOrBay && (
                            <span className="text-[10px] text-gray-400 flex-shrink-0">
                              {dep.platformOrBay}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-gray-400">
                          <span className="truncate">{dep.operator}</span>
                          {dep.routeId && (
                            <button
                              onClick={() => handleSelectRoute(dep.routeId || null)}
                              className="text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1 transition-colors"
                              title="Highlight this route on map"
                            >
                              <Route className="w-3 h-3" />
                              <span>Highlight Path</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-gray-400 bg-black/30 rounded-2xl p-4">
                      No departures matching filter at this time.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom actions */}
            <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                Official Joy Univ Timetable Board
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              >
                Close Station
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DRAWER 2: SELECTED BUS ROUTE DETAIL PANEL                                 */}
        {/* Displays Route Info, Step-by-Step Waypoints / Stops, and Highlight Clear */}
        {/* ========================================================================= */}
        {selectedRoute && !selectedNode && !selectedVehicle && (
          <div className="absolute top-3 right-3 bottom-3 z-30 w-96 max-w-[92vw] glass-panel-glow rounded-3xl p-5 border shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200 flex flex-col justify-between"
            style={{ borderColor: `${selectedRoute.color}60` }}
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ 
                      backgroundColor: `${selectedRoute.color}25`,
                      color: selectedRoute.color,
                      border: `1px solid ${selectedRoute.color}50`
                    }}
                  >
                    <Route className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span 
                        className="text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: selectedRoute.color }}
                      >
                        {selectedRoute.type === 'train' ? 'Rail Corridor' : 'Active Bus Route'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-white">
                        {selectedRoute.routeNumber}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white tracking-tight leading-tight">
                      {selectedRoute.name}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRouteId(null)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Clear route highlight"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Stats pill row */}
              <div className="grid grid-cols-3 gap-2 my-3">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
                  <span className="text-[10px] text-gray-400 block">Stops</span>
                  <span className="text-sm font-bold text-white">{selectedRoute.stops.length} Nodes</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
                  <span className="text-[10px] text-gray-400 block">Distance</span>
                  <span className="text-sm font-bold text-white">~{selectedRoute.distanceKm} km</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
                  <span className="text-[10px] text-gray-400 block">Est. Time</span>
                  <span className="text-sm font-bold text-white">{selectedRoute.durationMinutes}m</span>
                </div>
              </div>

              {/* Route Summary */}
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs text-gray-300 mb-4">
                <p>{selectedRoute.description}</p>
                <div className="pt-2 border-t border-white/5 space-y-1 text-[11px] text-gray-400">
                  <div className="flex justify-between">
                    <span>Operator:</span>
                    <span className="text-white font-medium">{selectedRoute.operator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frequency:</span>
                    <span className="text-cyan-300 font-medium">{selectedRoute.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operating Hours:</span>
                    <span className="text-white">{selectedRoute.operatingHours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fare:</span>
                    <span className="text-amber-300 font-medium">{selectedRoute.fare}</span>
                  </div>
                </div>
              </div>

              {/* ORDERED STOPS WAYPOINT TIMELINE */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Navigation className="w-3.5 h-3.5 text-pink-400" />
                    <span>Path Waypoints & Stops (In Order)</span>
                  </div>
                  <span className="text-[10px] text-gray-400">Click stop to inspect</span>
                </div>

                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                  {selectedRoute.stops.map((stop, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === selectedRoute.stops.length - 1;
                    const correspondingNode = REGION_NODES.find((n) => n.id === stop.nodeId);

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (correspondingNode) {
                            handleSelectNode(correspondingNode);
                          }
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-black/40 hover:bg-white/10 border border-white/5 hover:border-pink-500/40 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5">
                          {/* Step number badge */}
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono"
                            style={{ 
                              backgroundColor: isFirst || isLast ? selectedRoute.color : 'rgba(255,255,255,0.1)',
                              color: isFirst || isLast ? '#ffffff' : '#9ca3af'
                            }}
                          >
                            {idx + 1}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block group-hover:text-pink-300 transition-colors">
                              {stop.name}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {isFirst ? 'Origin Terminal' : isLast ? 'Final Destination' : 'Transit Corridor Stop'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-gray-400 font-mono">
                          <span>{stop.etaFromStart}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-white/10 mt-4 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedRouteId(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              >
                Clear Path Highlight
              </button>
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab(selectedRoute.type === 'train' ? 'trains' : 'buses')}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-md transition-colors"
                >
                  View Timetable
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DRAWER 3: SELECTED VEHICLE DETAIL PANEL                                   */}
        {/* ========================================================================= */}
        {selectedVehicle && (
          <div className="absolute top-3 right-3 z-30 w-80 max-w-[92vw] glass-panel-glow rounded-3xl p-5 border border-purple-500/40 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-start justify-between mb-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">
                  {selectedVehicle.type === 'bus' ? '🚌' : selectedVehicle.type === 'train' ? '🚆' : '🚐'}
                </span>
                <div>
                  <span className="text-[11px] font-semibold text-amber-400 block">
                    {selectedVehicle.trackingType}
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {selectedVehicle.vehicleNumber}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-gray-300 bg-black/40 p-3 rounded-2xl border border-white/5 mb-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Route:</span>
                <span className="text-white font-medium text-right">{selectedVehicle.route}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Destination:</span>
                <span className="text-cyan-300 font-semibold">{selectedVehicle.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current Location:</span>
                <span className="text-white">{selectedVehicle.currentStop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Next Stop:</span>
                <span className="text-white">{selectedVehicle.nextStop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Arrival (ETA):</span>
                <span className="text-gray-400 italic">{selectedVehicle.eta}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Speed Telemetry:</span>
                <span className="text-gray-400 italic">{selectedVehicle.speed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Crowd Level:</span>
                <span>{getCrowdBadge(selectedVehicle.crowd)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/5">
                <span className="text-gray-400">Last Telemetry Sync:</span>
                <span className="text-gray-400">{selectedVehicle.lastUpdated}</span>
              </div>
            </div>

            {/* Quick route highlight button from vehicle */}
            {selectedVehicle.route.includes('15') && (
              <button
                onClick={() => handleSelectRoute('route-15')}
                className="w-full py-2 mb-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Route className="w-3.5 h-3.5" />
                <span>Highlight Route 15 on Map</span>
              </button>
            )}
            {selectedVehicle.route.includes('17D') && (
              <button
                onClick={() => handleSelectRoute('route-17d')}
                className="w-full py-2 mb-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Route className="w-3.5 h-3.5" />
                <span>Highlight Route 17D on Map</span>
              </button>
            )}
            {selectedVehicle.route.includes('17F') && (
              <button
                onClick={() => handleSelectRoute('route-17f')}
                className="w-full py-2 mb-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Route className="w-3.5 h-3.5" />
                <span>Highlight Route 17F on Map</span>
              </button>
            )}

            <div className="text-[11px] text-gray-400 text-center">
              Requires IoT GPS hardware connected to campus transit gateway.
            </div>
          </div>
        )}
      </div>

      {/* Guide Cards Row below Map */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-white mb-0.5">Click Any Bus Stop / Station</h4>
            <p className="text-gray-300">
              Inspect verified timetables, upcoming morning/evening departures, and live telemetry for stops across the corridor.
            </p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-300 flex-shrink-0">
            <Route className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-white mb-0.5">Click Any Bus Route</h4>
            <p className="text-gray-300">
              Click Route 15, 17D, 17F, 111, or 5A on the map or toolbar to highlight its path, waypoints, and travel time.
            </p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 flex-shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-white mb-0.5">Real-Time GPS Integration</h4>
            <p className="text-gray-300">
              Map supports real-time vehicle telemetry, simulated demo tracking, and campus notice board synchronizations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  Bus, 
  Search, 
  Clock, 
  MapPin, 
  Star, 
  Users, 
  Calendar,
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { BusTimetableEntry, TimeOfDay, CrowdLevel } from '../../types';
import { store } from '../../services/store';

interface BusExplorerProps {
  buses: BusTimetableEntry[];
  onSelectBus?: (bus: BusTimetableEntry) => void;
}

export const BusExplorer: React.FC<BusExplorerProps> = ({ buses, onSelectBus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState<'all' | TimeOfDay>('all');
  const [destinationFilter, setDestinationFilter] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Extract unique destinations
  const uniqueDestinations = useMemo(() => {
    const set = new Set<string>();
    buses.forEach((b) => set.add(b.destination));
    return Array.from(set).sort();
  }, [buses]);

  // Filtered buses
  const filteredBuses = useMemo(() => {
    return buses.filter((bus) => {
      const matchesSearch =
        bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.time.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTime = timeFilter === 'all' || bus.timeOfDay === timeFilter;
      const matchesDest = destinationFilter === 'all' || bus.destination === destinationFilter;
      const isFav = store.isFavorite(bus.id);
      const matchesFav = !onlyFavorites || isFav;

      return matchesSearch && matchesTime && matchesDest && matchesFav;
    });
  }, [buses, searchTerm, timeFilter, destinationFilter, onlyFavorites]);

  const handleToggleFavorite = (bus: BusTimetableEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    store.toggleFavorite({
      type: 'bus',
      title: `Bus ${bus.busNumber} → ${bus.destination}`,
      subtitle: `${bus.time} (${bus.timeOfDay})`,
      referenceId: bus.id,
    });
  };

  const getCrowdBadge = (crowd: CrowdLevel) => {
    switch (crowd) {
      case 'LOW':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">🟢 LOW</span>;
      case 'MODERATE':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">🟡 MODERATE</span>;
      case 'HIGH':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30">🟠 HIGH</span>;
      case 'VERY HIGH':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">🔴 VERY HIGH</span>;
      case 'NOT AVAILABLE':
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700/50 text-gray-400 border border-gray-600/30">⚪ Not Available</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="vesper-card p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/[0.06] text-gray-200 border border-white/15 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                Joy University Campus Transit
              </span>
              <span className="text-xs text-gray-400">22 Official Departures</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white leading-tight">
              Bus Timetable <span className="font-display italic text-[#e6e6e6]">Explorer</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Direct seed dataset from the Joy University transport timetable board.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                onlyFavorites
                  ? 'bg-gradient-to-r from-[#1c1c1c] via-[#333333] to-[#4f4f4f] text-white border-white/40 shadow-sm font-semibold'
                  : 'bg-white/[0.04] text-gray-300 hover:text-white border-white/10 hover:bg-white/[0.08]'
              }`}
            >
              <Star className={`w-4 h-4 ${onlyFavorites ? 'fill-white text-white' : 'text-gray-400'}`} />
              <span>{onlyFavorites ? 'Show All Buses' : 'Favorites Only'}</span>
            </button>
          </div>
        </div>

        {/* Timetable Integrity Notice */}
        <div className="mt-4 p-3 rounded-2xl bg-black/50 border border-white/10 flex items-start gap-2.5 text-xs text-gray-300">
          <Info className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
          <span>
            <strong className="text-white">Timetable Rule:</strong> All departure times are verified timetable values from the campus transport board. In accordance with data integrity guidelines, intermediate travel durations, live GPS telemetry, and passenger crowd counts are marked <span className="text-white font-semibold">"Timetable Data"</span> and <span className="text-gray-400 font-semibold">"Not Available"</span> until telemetry sensors are linked.
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="vesper-card p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search bus (15, 17D, 17F...) or destination..."
              className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/20 transition-all"
            />
          </div>

          {/* Time of Day Filter */}
          <div className="flex rounded-xl bg-black/60 p-1 border border-white/15">
            {(['all', 'morning', 'afternoon', 'evening'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeFilter(period)}
                className={`flex-1 py-1.5 text-xs rounded-lg capitalize transition-all ${
                  timeFilter === period
                    ? 'bg-gradient-to-r from-[#1c1c1c] via-[#333333] to-[#4f4f4f] text-white border border-white/40 shadow-sm font-semibold'
                    : 'text-gray-400 hover:text-white font-medium'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Destination Dropdown */}
          <div>
            <select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-white/50"
            >
              <option value="all">All Destinations ({uniqueDestinations.length})</option>
              {uniqueDestinations.map((dest) => (
                <option key={dest} value={dest}>
                  {dest}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
          <span>Showing <strong className="text-white">{filteredBuses.length}</strong> departures</span>
          {(searchTerm || timeFilter !== 'all' || destinationFilter !== 'all' || onlyFavorites) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setTimeFilter('all');
                setDestinationFilter('all');
                setOnlyFavorites(false);
              }}
              className="text-gray-300 hover:text-white underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Bus Grid */}
      {filteredBuses.length === 0 ? (
        <div className="vesper-card p-12 text-center rounded-3xl border border-white/10">
          <Bus className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No matching bus schedules found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Try adjusting your search criteria or clearing active filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBuses.map((bus) => {
            const isFav = store.isFavorite(bus.id);

            return (
              <div
                key={bus.id}
                onClick={() => onSelectBus?.(bus)}
                className="vesper-card p-5 rounded-2xl border border-white/10 hover:border-white/30 hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Bus Number + Favorite Button */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#1a1a1a] via-[#2c2c2c] to-[#454545] border border-white/20 flex items-center justify-center text-white font-extrabold text-base group-hover:scale-105 transition-transform shadow-md">
                        {bus.busNumber}
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                          Joy University Bus
                        </span>
                        <h3 className="text-lg font-bold text-white group-hover:text-[#e6e6e6] transition-colors">
                          BUS {bus.busNumber}
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleToggleFavorite(bus, e)}
                      className={`p-2 rounded-xl border transition-all ${
                        isFav
                          ? 'bg-white/20 text-white border-white/40'
                          : 'bg-white/5 text-gray-400 hover:text-white border-white/10 hover:bg-white/10'
                      }`}
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-white text-white' : ''}`} />
                    </button>
                  </div>

                  {/* Destination & Departure Time */}
                  <div className="space-y-2 mb-4 bg-black/40 p-3 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-300" />
                        Destination:
                      </span>
                      <strong className="text-white font-semibold text-right">
                        {bus.destination}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                        Departure:
                      </span>
                      <strong className="text-white font-mono font-bold text-base">
                        {bus.time}
                      </strong>
                    </div>
                  </div>

                  {/* Operational Tags */}
                  <div className="space-y-1.5 text-xs text-gray-300">
                    <div className="flex items-center justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">Schedule Status:</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-white/[0.06] text-gray-200 border border-white/15">
                        {bus.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">Crowd Level:</span>
                      {getCrowdBadge(bus.crowdLevel)}
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-gray-400">Live Location:</span>
                      <span className="text-gray-400 font-mono text-[11px]">
                        Not Available
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="capitalize">{bus.timeOfDay} schedule</span>
                  <span>Operating: {bus.operatingDays || 'All Days'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

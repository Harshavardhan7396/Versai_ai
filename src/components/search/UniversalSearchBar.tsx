import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  Bus, 
  Train, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Navigation,
  Building,
  Globe2,
  Clock
} from 'lucide-react';
import { 
  BusTimetableEntry, 
  TrainTimetableEntry, 
  RegionalBusEntry, 
  StateBusEntry,
  StationNode 
} from '../../types';
import { DataTrustBadge } from '../common/DataTrustBadge';
import { soundService } from '../../services/soundService';
import { store } from '../../services/store';

interface UniversalSearchBarProps {
  buses: BusTimetableEntry[];
  trains: TrainTimetableEntry[];
  regionalBuses: RegionalBusEntry[];
  stateBuses: StateBusEntry[];
  onSelectResult: (category: string, item: unknown) => void;
  className?: string;
}

export const UniversalSearchBar: React.FC<UniversalSearchBarProps> = ({
  buses,
  trains,
  regionalBuses,
  stateBuses,
  onSelectResult,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'college' | 'regional' | 'state' | 'train'>('all');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const matches: Array<{
      category: 'college' | 'regional' | 'state' | 'train';
      title: string;
      subtitle: string;
      timeOrFreq: string;
      status: string;
      data: unknown;
    }> = [];

    // College Buses
    if (selectedFilter === 'all' || selectedFilter === 'college') {
      buses.forEach((b) => {
        if (
          b.busNumber.toLowerCase().includes(q) ||
          b.destination.toLowerCase().includes(q) ||
          'joy university'.includes(q) ||
          'college'.includes(q)
        ) {
          matches.push({
            category: 'college',
            title: `Joy University Bus ${b.busNumber} → ${b.destination}`,
            subtitle: `Departure at ${b.time} (${b.timeOfDay}) • Campus Notice Board verified`,
            timeOrFreq: b.time,
            status: 'TIMETABLE',
            data: b,
          });
        }
      });
    }

    // Regional Buses
    if (selectedFilter === 'all' || selectedFilter === 'regional') {
      regionalBuses.forEach((rb) => {
        if (
          rb.routeNumber.toLowerCase().includes(q) ||
          rb.routeName.toLowerCase().includes(q) ||
          rb.from.toLowerCase().includes(q) ||
          rb.to.toLowerCase().includes(q) ||
          rb.viaStops.some((s) => s.toLowerCase().includes(q))
        ) {
          matches.push({
            category: 'regional',
            title: `${rb.routeNumber}: ${rb.routeName}`,
            subtitle: `Via ${rb.viaStops.slice(0, 3).join(', ')} • ${rb.operatingAgency}`,
            timeOrFreq: rb.frequency,
            status: rb.dataStatus,
            data: rb,
          });
        }
      });
    }

    // State Buses
    if (selectedFilter === 'all' || selectedFilter === 'state') {
      stateBuses.forEach((sb) => {
        if (
          sb.busNumber.toLowerCase().includes(q) ||
          sb.routeName.toLowerCase().includes(q) ||
          sb.originTerminal.toLowerCase().includes(q) ||
          sb.destinationTerminal.toLowerCase().includes(q) ||
          sb.viaPoints.some((p) => p.toLowerCase().includes(q))
        ) {
          matches.push({
            category: 'state',
            title: `${sb.serviceType}: ${sb.routeName}`,
            subtitle: `${sb.durationHours} (${sb.distanceKm} km) • ${sb.originTerminal}`,
            timeOrFreq: sb.departureTimes[0] ? `Next: ${sb.departureTimes[0]}` : 'Timetable',
            status: sb.dataStatus,
            data: sb,
          });
        }
      });
    }

    // Trains
    if (selectedFilter === 'all' || selectedFilter === 'train') {
      trains.forEach((t) => {
        if (
          t.trainNumber.toLowerCase().includes(q) ||
          t.trainName.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q) ||
          t.departureStation.toLowerCase().includes(q)
        ) {
          matches.push({
            category: 'train',
            title: `Train ${t.trainNumber}: ${t.trainName}`,
            subtitle: `${t.departureStation} → ${t.destination} • ${t.operatingDays}`,
            timeOrFreq: t.departureTime,
            status: 'TIMETABLE',
            data: t,
          });
        }
      });
    }

    return matches.slice(0, 10);
  }, [query, selectedFilter, buses, regionalBuses, stateBuses, trains]);

  const handleSelect = (category: string, item: unknown) => {
    soundService.playWhoosh();

    try {
      if (category === 'college') {
        const bus = item as BusTimetableEntry;
        store.addRecentJourney({
          from: 'Joy University (Vadakkankulam)',
          to: bus.destination,
          primaryRoute: `Bus ${bus.busNumber} (${bus.time})`,
          category: 'college',
          estimatedDuration: '35-45 mins',
          estimatedCost: 'Campus Pass / Free',
        });
      } else if (category === 'regional') {
        const rbus = item as RegionalBusEntry;
        store.addRecentJourney({
          from: rbus.from,
          to: rbus.to,
          primaryRoute: `${rbus.routeNumber} (${rbus.routeName})`,
          category: 'regional',
          estimatedDuration: `${rbus.durationMinutes} mins`,
          estimatedCost: rbus.fareEstimate || '₹25',
        });
      } else if (category === 'state') {
        const sbus = item as StateBusEntry;
        store.addRecentJourney({
          from: sbus.originTerminal,
          to: sbus.destinationTerminal,
          primaryRoute: `${sbus.serviceType} (${sbus.routeName})`,
          category: 'state',
          estimatedDuration: sbus.durationHours,
          estimatedCost: sbus.approximateFare || 'State Fare',
        });
      } else if (category === 'train') {
        const trn = item as TrainTimetableEntry;
        store.addRecentJourney({
          from: trn.departureStation,
          to: trn.destination,
          primaryRoute: `Train ${trn.trainNumber} (${trn.trainName})`,
          category: 'railways',
          estimatedDuration: 'Direct Rail Corridor',
          estimatedCost: 'Standard Fare',
        });
      }
    } catch (e) {
      console.warn('Could not record recent search:', e);
    }

    onSelectResult(category, item);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            soundService.registerUserInteraction();
            setIsOpen(true);
          }}
          placeholder="Where do you want to go? (e.g. Nagercoil, Mathaganeri, Train 16382, Chennai...)"
          className="w-full pl-12 pr-10 py-3.5 sm:py-4 rounded-2xl bg-[rgba(10,10,10,0.85)] border border-white/16 text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:border-white/60 focus:ring-1 focus:ring-white/20 shadow-2xl backdrop-blur-xl transition-all"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs - Monochrome Liquid-metal styling */}
      <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto scrollbar-none py-1">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mr-1 hidden sm:inline">
          Filter:
        </span>
        {[
          { id: 'all', label: 'All Modes' },
          { id: 'college', label: 'Joy Univ Buses' },
          { id: 'regional', label: 'Regional TNSTC' },
          { id: 'state', label: 'State Express' },
          { id: 'train', label: 'Railways' },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => {
              soundService.playClick();
              setSelectedFilter(filter.id as typeof selectedFilter);
            }}
            className={`px-3 py-1 rounded-xl text-xs whitespace-nowrap transition-all border ${
              selectedFilter === filter.id
                ? 'bg-gradient-to-r from-[#1c1c1c] via-[#333333] to-[#4f4f4f] text-white border-white/40 shadow-sm font-semibold'
                : 'bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] border-white/10 font-medium'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Search Dropdown Results */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-[#0c0c0c]/98 border border-white/16 shadow-2xl backdrop-blur-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-white/10 flex items-center justify-between text-xs text-gray-400">
            <span>Found {results.length} verified connections</span>
            <span className="text-[10px] text-cyan-400 font-medium">Timetable Verified Records</span>
          </div>

          <div className="max-h-[360px] overflow-y-auto divide-y divide-white/5">
            {results.length > 0 ? (
              results.map((res, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(res.category, res.data)}
                  className="w-full p-3.5 text-left hover:bg-white/[0.08] transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/[0.06] border border-white/15 text-white">
                      {res.category === 'train' ? <Train className="w-4 h-4 text-white" /> : <Bus className="w-4 h-4 text-white" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-sm text-white group-hover:text-[#e6e6e6] transition-colors">
                          {res.title}
                        </span>
                        <DataTrustBadge status={res.status} size="sm" />
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-1">{res.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 text-right">
                    <span className="text-xs font-mono font-semibold text-gray-200 bg-white/[0.08] border border-white/10 px-2 py-1 rounded-lg">
                      {res.timeOrFreq}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-gray-400">
                <p className="mb-1 font-semibold text-gray-300">No official schedule matched "{query}"</p>
                <p>Try searching "Nagercoil", "Mathaganeri", "Vallioor", "Chennai", or "Train"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

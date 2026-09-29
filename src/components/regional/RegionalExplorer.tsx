import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Bus, 
  ArrowRight, 
  Building, 
  Star, 
  Check, 
  Filter, 
  Info,
  ChevronDown,
  Layers,
  Sparkles
} from 'lucide-react';
import { RegionalBusEntry } from '../../types';
import { REGIONS_LIST } from '../../data/regionalStateData';
import { DataTrustBadge } from '../common/DataTrustBadge';
import { store } from '../../services/store';
import { soundService } from '../../services/soundService';

interface RegionalExplorerProps {
  regionalBuses: RegionalBusEntry[];
  onSelectBus?: (bus: RegionalBusEntry) => void;
}

export const RegionalExplorer: React.FC<RegionalExplorerProps> = ({
  regionalBuses,
  onSelectBus,
}) => {
  const [selectedRegion, setSelectedRegion] = useState('kanyakumari');
  const [searchFilter, setSearchFilter] = useState('');
  const [favoriteSuccess, setFavoriteSuccess] = useState<string | null>(null);

  const filteredBuses = regionalBuses.filter((b) => {
    const q = searchFilter.toLowerCase();
    return (
      b.routeNumber.toLowerCase().includes(q) ||
      b.routeName.toLowerCase().includes(q) ||
      b.from.toLowerCase().includes(q) ||
      b.to.toLowerCase().includes(q) ||
      b.viaStops.some((s) => s.toLowerCase().includes(q))
    );
  });

  const handleFavorite = (bus: RegionalBusEntry) => {
    soundService.playChime();
    store.addFavorite({
      type: 'regional',
      title: `${bus.routeNumber}: ${bus.routeName}`,
      subtitle: `${bus.frequency} • ${bus.operatingAgency}`,
      referenceId: bus.id,
      category: 'regional',
    });
    setFavoriteSuccess(bus.id);
    setTimeout(() => setFavoriteSuccess(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="vesper-card p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-gray-200 text-xs font-medium backdrop-blur-md">
              <Navigation className="w-3.5 h-3.5 text-white" />
              <span>REGIONAL TRANSPORT NETWORK • TAMIL NADU</span>
            </div>

            <DataTrustBadge status="TIMETABLE" source="TNSTC Tirunelveli & Kanyakumari Division" showSourceButton />
          </div>

          <h1 className="text-2xl sm:text-4xl font-medium tracking-tight text-white mb-2 leading-tight">
            Regional Buses & <span className="font-display italic text-[#e6e6e6]">City Corridors</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-3xl leading-relaxed">
            Explore transportation around your city, campus connections, and neighboring towns in the Kanyakumari and Tirunelveli district clusters. Verified official schedules from state road transport corporation divisions.
          </p>
        </div>
      </div>

      {/* Region Selector Bar */}
      <div className="vesper-card p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-gray-300" />
            <span>Region:</span>
          </span>
          {REGIONS_LIST.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                soundService.playClick();
                setSelectedRegion(r.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all border ${
                selectedRegion === r.id
                  ? 'bg-gradient-to-r from-[#1c1c1c] via-[#333333] to-[#4f4f4f] text-white border-white/40 shadow-sm font-semibold'
                  : 'bg-white/[0.04] text-gray-300 hover:text-white border-white/10 font-medium'
              }`}
            >
              <span>{r.name}</span>
            </button>
          ))}
        </div>

        {/* Quick Route Filter */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter by stop, stop name, or route..."
            className="w-full px-3.5 py-2 pl-9 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-white/50"
          />
          <Filter className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Regional Connections List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBuses.map((bus) => (
          <div
            key={bus.id}
            className="vesper-card p-5 sm:p-6 rounded-3xl border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Route Badge & Source Status */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-gradient-to-tr from-[#1a1a1a] via-[#2c2c2c] to-[#454545] text-white font-extrabold text-sm border border-white/20 font-mono shadow-sm">
                    {bus.routeNumber}
                  </span>
                  <span className="text-xs font-semibold text-gray-300">
                    {bus.operatingAgency}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <DataTrustBadge status={bus.dataStatus} source={bus.source} showSourceButton />
                  <button
                    onClick={() => handleFavorite(bus)}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors border border-white/10"
                    title="Bookmark route to favorites"
                  >
                    {favoriteSuccess === bus.id ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Star className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Route Name */}
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-[#e6e6e6] transition-colors">
                {bus.routeName}
              </h3>

              {/* Via Stops Corridor */}
              <div className="mb-4 bg-black/40 p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Intermediate Corridor Stops:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {bus.viaStops.map((stop, i) => (
                    <span 
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[11px] bg-white/[0.06] text-gray-300 border border-white/10"
                    >
                      {stop}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timings */}
              <div className="mb-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Scheduled Departures ({bus.frequency}):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto scrollbar-none">
                  {bus.departureTimes.map((time, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-white/[0.06] text-gray-200 text-xs font-mono border border-white/15"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-3">
                <span>⏱️ {bus.durationMinutes} mins</span>
                {bus.fareEstimate && <span>🎟️ {bus.fareEstimate}</span>}
              </div>

              <span className="text-[11px] text-gray-500">
                Official Timetable Source
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

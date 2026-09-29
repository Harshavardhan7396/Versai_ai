import React, { useState } from 'react';
import { 
  Globe2, 
  Bus, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Star, 
  Check, 
  Filter, 
  ShieldCheck, 
  Compass,
  ArrowRight,
  Info
} from 'lucide-react';
import { StateBusEntry } from '../../types';
import { DataTrustBadge } from '../common/DataTrustBadge';
import { store } from '../../services/store';
import { soundService } from '../../services/soundService';

interface StateTransportExplorerProps {
  stateBuses: StateBusEntry[];
}

export const StateTransportExplorer: React.FC<StateTransportExplorerProps> = ({
  stateBuses,
}) => {
  const [selectedService, setSelectedService] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteSuccess, setFavoriteSuccess] = useState<string | null>(null);

  const filtered = stateBuses.filter((b) => {
    const matchesService = selectedService === 'all' || b.serviceType === selectedService;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      b.routeName.toLowerCase().includes(q) ||
      b.originTerminal.toLowerCase().includes(q) ||
      b.destinationTerminal.toLowerCase().includes(q) ||
      b.viaPoints.some((v) => v.toLowerCase().includes(q));
    return matchesService && matchesSearch;
  });

  const handleFavorite = (bus: StateBusEntry) => {
    soundService.playChime();
    store.addFavorite({
      type: 'state',
      title: `${bus.serviceType}: ${bus.routeName}`,
      subtitle: `${bus.originTerminal} → ${bus.destinationTerminal}`,
      referenceId: bus.id,
      category: 'state',
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
              <Globe2 className="w-3.5 h-3.5 text-white" />
              <span>TAMIL NADU STATE ROAD TRANSPORT CORPORATION (TNSTC & SETC)</span>
            </div>

            <DataTrustBadge status="TIMETABLE" source="State Express Transport Corporation Official Portal" showSourceButton />
          </div>

          <h1 className="text-2xl sm:text-4xl font-medium tracking-tight text-white mb-2 leading-tight">
            State-Level Intercity <span className="font-display italic text-[#e6e6e6]">Bus Network</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-3xl leading-relaxed">
            Long-distance and intercity transportation spanning Tamil Nadu from Kanyakumari and Nagercoil to Madurai, Tiruchirappalli, Coimbatore, and Chennai. Verified from government transport portals.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="vesper-card p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Service Type Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Class:
          </span>
          {[
            { id: 'all', label: 'All Services' },
            { id: 'Ultra Deluxe', label: 'Ultra Deluxe' },
            { id: 'Super Deluxe', label: 'Super Deluxe' },
            { id: 'Express', label: 'Express' },
            { id: 'Point-to-Point', label: 'Point-to-Point' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => {
                soundService.playClick();
                setSelectedService(type.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all border ${
                selectedService === type.id
                  ? 'bg-gradient-to-r from-[#1c1c1c] via-[#333333] to-[#4f4f4f] text-white border-white/40 shadow-sm font-semibold'
                  : 'bg-white/[0.04] text-gray-300 hover:text-white border-white/10 font-medium'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search terminal (Chennai, Madurai, KCBT...)"
            className="w-full px-3.5 py-2 pl-9 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-white/50"
          />
          <Filter className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* State Bus Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((bus) => (
          <div
            key={bus.id}
            className="vesper-card p-5 sm:p-6 rounded-3xl border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-gradient-to-tr from-[#1a1a1a] via-[#2c2c2c] to-[#454545] text-white font-extrabold text-xs border border-white/20 uppercase tracking-wider shadow-sm">
                    {bus.serviceType}
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    {bus.busNumber}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <DataTrustBadge status={bus.dataStatus} source={bus.source} showSourceButton />
                  <button
                    onClick={() => handleFavorite(bus)}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors border border-white/10"
                    title="Bookmark route"
                  >
                    {favoriteSuccess === bus.id ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Star className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Route Title */}
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-[#e6e6e6] transition-colors">
                {bus.routeName}
              </h3>

              {/* Terminal Pair */}
              <div className="bg-black/40 p-3 rounded-2xl border border-white/10 mb-3 text-xs space-y-1.5">
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 font-bold">Origin:</span>
                  <span className="text-gray-200">{bus.originTerminal}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 font-bold">Destination:</span>
                  <span className="text-gray-200">{bus.destinationTerminal}</span>
                </div>
              </div>

              {/* Via Points */}
              <div className="mb-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Major Transit Interchanges:
                </span>
                <p className="text-xs text-gray-300">
                  {bus.viaPoints.join(' → ')}
                </p>
              </div>

              {/* Departure Schedules */}
              <div className="mb-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Scheduled Daily Departures:
                </span>
                <div className="flex flex-wrap gap-1.5">
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

            {/* Bottom Meta & Booking Link */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <div className="text-gray-300 space-x-2">
                <span>⏱️ {bus.durationHours}</span>
                <span>🛣️ {bus.distanceKm} km</span>
                {bus.approximateFare && <span className="text-white font-semibold">• {bus.approximateFare}</span>}
              </div>

              {bus.bookingPortalUrl && (
                <a
                  href={bus.bookingPortalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-gray-300 hover:text-white underline font-semibold text-[11px]"
                >
                  <span>TNSTC Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

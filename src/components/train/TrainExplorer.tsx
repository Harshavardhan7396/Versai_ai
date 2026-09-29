import React, { useState, useMemo } from 'react';
import { 
  Train, 
  Search, 
  Clock, 
  MapPin, 
  Calendar, 
  Star, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink,
  Info
} from 'lucide-react';
import { TrainTimetableEntry } from '../../types';
import { store } from '../../services/store';

interface TrainExplorerProps {
  trains: TrainTimetableEntry[];
}

export const TrainExplorer: React.FC<TrainExplorerProps> = ({ trains }) => {
  const [activeStation, setActiveStation] = useState<'CAPE' | 'NCJ'>('CAPE');
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Filtered trains
  const filteredTrains = useMemo(() => {
    return trains.filter((train) => {
      const matchesStation = train.stationCode === activeStation;
      const matchesSearch =
        train.trainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        train.trainNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        train.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        train.operatingDays.toLowerCase().includes(searchTerm.toLowerCase());

      const isFav = store.isFavorite(train.id);
      const matchesFav = !onlyFavorites || isFav;

      return matchesStation && matchesSearch && matchesFav;
    });
  }, [trains, activeStation, searchTerm, onlyFavorites]);

  const handleToggleFavorite = (train: TrainTimetableEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    store.toggleFavorite({
      type: 'train',
      title: `${train.trainName} (${train.trainNumber})`,
      subtitle: `${train.departureStation} → ${train.destination} @ ${train.departureTime}`,
      referenceId: train.id,
    });
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
                <Train className="w-3.5 h-3.5 text-white" />
                Indian Railways Regional Junctions
              </span>
              <span className="text-xs text-gray-400">16 Verified Express Trains</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white leading-tight">
              Train Timetable <span className="font-display italic text-[#e6e6e6]">Explorer</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Direct railway connection schedules from Kanyakumari (CAPE) & Nagercoil (NCJ).
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
              <span>{onlyFavorites ? 'Show All Trains' : 'Favorites Only'}</span>
            </button>
          </div>
        </div>

        {/* Timetable Integrity Notice */}
        <div className="mt-4 p-3 rounded-2xl bg-black/50 border border-white/10 flex items-start gap-2.5 text-xs text-gray-300">
          <Info className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
          <span>
            <strong className="text-white">Railway Timetable Integrity:</strong> These train records are official timetable entries from the Joy University transport notice board. We do not claim that these trains are currently running or offer fake GPS tracking.
          </span>
        </div>
      </div>

      {/* Station Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex rounded-2xl bg-black/60 p-1.5 border border-white/15 w-full sm:w-auto">
          <button
            onClick={() => setActiveStation('CAPE')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-none justify-center ${
              activeStation === 'CAPE'
                ? 'bg-gradient-to-r from-[#1c1c1c] via-[#333333] to-[#4f4f4f] text-white border border-white/40 shadow-sm font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Train className="w-4 h-4" />
            <span>KANYAKUMARI (CAPE)</span>
          </button>

          <button
            onClick={() => setActiveStation('NCJ')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-none justify-center ${
              activeStation === 'NCJ'
                ? 'bg-gradient-to-r from-[#1c1c1c] via-[#333333] to-[#4f4f4f] text-white border border-white/40 shadow-sm font-semibold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Train className="w-4 h-4" />
            <span>NAGERCOIL (NCJ)</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search train name, number (16382) or destination..."
            className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/20 transition-all"
          />
        </div>
      </div>

      {/* Train Cards Grid */}
      {filteredTrains.length === 0 ? (
        <div className="vesper-card p-12 text-center rounded-3xl border border-white/10">
          <Train className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No matching train records found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Try switching station tabs or clearing your search term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrains.map((train) => {
            const isFav = store.isFavorite(train.id);

            return (
              <div
                key={train.id}
                className="vesper-card p-5 rounded-2xl border border-white/10 hover:border-white/30 hover:shadow-2xl transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Icon + Train Name + Favorite */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#1a1a1a] via-[#2c2c2c] to-[#454545] border border-white/20 flex items-center justify-center text-white font-extrabold text-base group-hover:scale-105 transition-transform shadow-md">
                        🚆
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-gray-400 font-mono tracking-wider block">
                          Train #{train.trainNumber}
                        </span>
                        <h3 className="text-lg font-bold text-white group-hover:text-[#e6e6e6] transition-colors">
                          {train.trainName}
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleToggleFavorite(train, e)}
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

                  {/* Route Corridor */}
                  <div className="space-y-2 mb-4 bg-black/40 p-3 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        From:
                      </span>
                      <strong className="text-white font-medium">
                        {train.departureStation}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        Destination:
                      </span>
                      <strong className="text-white font-bold text-right">
                        {train.destination}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-1 border-t border-white/5">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                        Departure:
                      </span>
                      <strong className="text-white font-mono font-bold text-base">
                        {train.departureTime}
                      </strong>
                    </div>
                  </div>

                  {/* Operating Days & Status */}
                  <div className="space-y-1.5 text-xs text-gray-300">
                    <div className="flex items-center justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        Days of Operation:
                      </span>
                      <span className="font-semibold text-white">
                        {train.operatingDays}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-gray-400">Timetable Status:</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {train.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
                  <span>Station Code: {train.stationCode}</span>
                  <span className="text-gray-400 italic">No live tracking claimed</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Calendar, 
  Clock, 
  Bus, 
  Train, 
  ArrowRight, 
  Sparkles,
  Info,
  CheckCircle2,
  Filter,
  ShieldCheck,
  DollarSign,
  Users,
  Footprints,
  Accessibility
} from 'lucide-react';
import { 
  BusTimetableEntry, 
  TrainTimetableEntry, 
  RegionalBusEntry, 
  StateBusEntry,
  JourneyPlanOption 
} from '../../types';
import { SAMPLE_JOURNEY_PLANS } from '../../data/regionalStateData';
import { DataTrustBadge } from '../common/DataTrustBadge';
import { soundService } from '../../services/soundService';
import { store } from '../../services/store';

interface RoutePlannerProps {
  buses: BusTimetableEntry[];
  trains: TrainTimetableEntry[];
  regionalBuses?: RegionalBusEntry[];
  stateBuses?: StateBusEntry[];
  onSelectBus?: (bus: BusTimetableEntry) => void;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  buses,
  trains,
  regionalBuses = [],
  stateBuses = [],
  onSelectBus,
}) => {
  const [fromLocation, setFromLocation] = useState('Joy University (Vadakkankulam)');
  const [toLocation, setToLocation] = useState('Nagercoil');
  const [journeyDate, setJourneyDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [journeyTime, setJourneyTime] = useState('08:00');
  const [preference, setPreference] = useState<'fastest' | 'fewest_transfers' | 'lowest_cost' | 'less_walking' | 'accessible' | 'lower_crowd'>('fastest');
  const [isCalculated, setIsCalculated] = useState(true);

  // Check if an active query was requested from Recent Journeys in Profile
  React.useEffect(() => {
    const activeQuery = store.getActiveJourneyQuery();
    if (activeQuery) {
      if (activeQuery.from) setFromLocation(activeQuery.from);
      if (activeQuery.to) setToLocation(activeQuery.to);
      setIsCalculated(true);
      store.setActiveJourneyQuery(null);
    }
  }, []);

  const originOptions = [
    'Joy University (Vadakkankulam)',
    'Nagercoil Central (Vadasery)',
    'Kanyakumari (CAPE)',
    'Vallioor Junction',
    'Panagudi Main Stand',
    'Mathaganeri',
  ];

  const destinationOptions = [
    'Nagercoil',
    'Mathaganeri',
    'Vallioor',
    'Kannangulam',
    'Panagudi',
    'Kanyakumari',
    'Chennai (KCBT / Central)',
    'Madurai (Mattuthavani)',
    'Coimbatore',
    'Thiruvananthapuram (Tampanoor)',
    'Howrah Jn (HWH)',
    'Bengaluru (SBC)',
  ];

  // Dynamic calculation based on user selection
  const matchingPlans: JourneyPlanOption[] = SAMPLE_JOURNEY_PLANS.filter((p) => {
    const toL = toLocation.toLowerCase();
    return p.title.toLowerCase().includes(toL) || toL.includes('nagercoil') || toL.includes('chennai') || toL.includes('madurai');
  });

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playWhoosh();
    setIsCalculated(true);

    const topPlan = matchingPlans[0];
    store.addRecentJourney({
      from: fromLocation,
      to: toLocation,
      date: journeyDate,
      time: journeyTime,
      preferredMode: preference,
      primaryRoute: topPlan ? topPlan.title : `Direct Corridor to ${toLocation}`,
      category: toLocation.toLowerCase().includes('chennai') || toLocation.toLowerCase().includes('madurai') || toLocation.toLowerCase().includes('coimbatore')
        ? 'state'
        : toLocation.toLowerCase().includes('howrah') || toLocation.toLowerCase().includes('bengaluru')
        ? 'railways'
        : fromLocation.toLowerCase().includes('joy')
        ? 'college'
        : 'regional',
      estimatedDuration: topPlan ? `${topPlan.durationMinutes} mins` : '45 mins',
      estimatedCost: topPlan?.estimatedCost || 'Campus Pass / Free',
      matchingRoutesCount: matchingPlans.length || 1,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="vesper-card p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-normal bg-white/[0.06] text-gray-200 border border-white/15 backdrop-blur-md">
              <Navigation className="w-3.5 h-3.5 text-white" />
              <span>MULTI-MODAL JOURNEY ENGINE • COLLEGE → REGION → STATE → RAIL</span>
            </div>

            <DataTrustBadge status="TIMETABLE" />
          </div>

          <h1 className="text-2xl sm:text-4xl font-medium tracking-tight text-white mb-2 leading-tight">
            Plan My <span className="font-display italic text-[#e6e6e6]">Journey</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-2xl font-light">
            "How can I get from where I am to where I need to go?" Calculate optimal connections combining Joy University campus buses, regional TNSTC feeders, state express buses, and Southern Railway trains.
          </p>
        </div>
      </div>

      {/* Journey Query Planner Form */}
      <form onSubmit={handlePlanSubmit} className="vesper-card p-6 sm:p-7 rounded-3xl border border-white/10 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* FROM */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-300" />
              FROM (ORIGIN)
            </label>
            <select
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-white/50 cursor-pointer"
            >
              {originOptions.map((o) => (
                <option key={o} value={o} className="bg-black text-white">
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* TO */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-300" />
              TO (DESTINATION)
            </label>
            <select
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-white/50 cursor-pointer"
            >
              {destinationOptions.map((d) => (
                <option key={d} value={d} className="bg-black text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* DATE */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-300" />
              JOURNEY DATE
            </label>
            <input
              type="date"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-white/50"
            />
          </div>

          {/* TIME */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-300" />
              DEPARTURE TIME
            </label>
            <input
              type="time"
              value={journeyTime}
              onChange={(e) => setJourneyTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-white/50"
            />
          </div>
        </div>

        {/* TRANSPORT PREFERENCES (Section 11) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Route Preference:
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'fastest', label: '⚡ Fastest Route' },
              { id: 'fewest_transfers', label: '🔀 Fewest Transfers' },
              { id: 'lowest_cost', label: '💰 Lowest Cost' },
              { id: 'less_walking', label: '🚶 Less Walking' },
              { id: 'accessible', label: '♿ Accessible Transit' },
              { id: 'lower_crowd', label: '👥 Lower Crowd' },
            ].map((pref) => (
              <button
                key={pref.id}
                type="button"
                onClick={() => {
                  soundService.playClick();
                  setPreference(pref.id as typeof preference);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  preference === pref.id
                    ? 'bg-gradient-to-r from-[#1c1c1c] via-[#333333] to-[#4f4f4f] text-white border border-white/40 shadow-sm font-semibold'
                    : 'bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/10'
                }`}
              >
                {pref.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto vesper-btn-solid flex items-center justify-center gap-2"
          >
            <span>CALCULATE OPTIMAL ROUTE</span>
            <ArrowRight className="w-4 h-4 text-[#111111]" />
          </button>
        </div>
      </form>

      {/* Available Routing Options Results */}
      {isCalculated && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Available Transit Options</span>
              <span className="text-xs font-mono text-gray-400">({matchingPlans.length} verified plans)</span>
            </h3>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4 text-gray-300" />
              <span>Strict data verification • No speculative times</span>
            </div>
          </div>

          <div className="space-y-4">
            {matchingPlans.map((plan, idx) => (
              <div
                key={plan.id}
                className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-purple-500/40 transition-all space-y-4"
              >
                {/* Plan Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-purple-400">
                        OPTION #{idx + 1}
                      </span>
                      <DataTrustBadge status={plan.dataStatus} source={plan.source} showSourceButton />
                    </div>
                    <h4 className="text-lg font-extrabold text-white">
                      {plan.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-300">
                    <div className="text-right">
                      <span className="text-gray-400 block text-[10px] uppercase">Departure → Arrival</span>
                      <span className="font-mono font-bold text-white text-sm">
                        {plan.departureTime} → {plan.arrivalTime}
                      </span>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-center font-mono font-bold text-cyan-300 text-xs">
                      {plan.durationMinutes} mins
                    </div>
                  </div>
                </div>

                {/* Step by step itinerary */}
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Step-by-Step Connection Guide:
                  </span>
                  {plan.steps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-3 text-xs"
                    >
                      <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {step.mode === 'train' ? (
                          <Train className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <Bus className="w-4 h-4 text-purple-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white mb-0.5">
                          {step.instruction}
                        </p>
                        <p className="text-gray-400 text-[11px]">
                          From: <strong className="text-gray-200">{step.from}</strong> → To: <strong className="text-gray-200">{step.to}</strong>
                        </p>
                        {step.vehicleDetails && (
                          <p className="text-purple-300 text-[11px] font-mono mt-1">
                            {step.vehicleDetails}
                          </p>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-gray-400 bg-white/5 px-2 py-1 rounded">
                        {step.duration}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Meta details footer */}
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
                  <div className="flex items-center gap-4">
                    <span>Transfers: <strong className="text-white">{plan.transfersCount}</strong></span>
                    {plan.estimatedCost ? (
                      <span>Estimated Fare: <strong className="text-emerald-300">{plan.estimatedCost}</strong></span>
                    ) : (
                      <span>Fare: <em>Information unavailable</em></span>
                    )}
                    <span>Crowd Status: <strong className="text-gray-300">{plan.crowdLevel}</strong></span>
                  </div>

                  <span className="text-[11px] text-gray-500">
                    Source: {plan.source}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

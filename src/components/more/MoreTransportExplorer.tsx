import React from 'react';
import { 
  Rocket, 
  PlaneTakeoff, 
  BusFront, 
  TrainTrack, 
  Car, 
  UsersRound, 
  ShieldAlert, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { FutureTransportItem } from '../../types';
import { INITIAL_FUTURE_TRANSPORTS } from '../../data/regionalStateData';

export const MoreTransportExplorer: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'PlaneTakeoff':
        return <PlaneTakeoff className="w-6 h-6 text-cyan-400" />;
      case 'BusFront':
        return <BusFront className="w-6 h-6 text-amber-400" />;
      case 'TrainTrack':
        return <TrainTrack className="w-6 h-6 text-purple-400" />;
      case 'Car':
        return <Car className="w-6 h-6 text-emerald-400" />;
      case 'UsersRound':
        return <UsersRound className="w-6 h-6 text-rose-400" />;
      case 'ShieldAlert':
      default:
        return <ShieldAlert className="w-6 h-6 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/70 border border-amber-500/30 text-amber-200 text-xs font-semibold mb-3">
            <Rocket className="w-3.5 h-3.5 text-amber-400" />
            <span>MORE TRANSPORT • EXPANSION ROADMAP</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight mb-2">
            Future Multi-Modal Transit Services
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-3xl leading-relaxed">
            Student Transit AI is architected to scale from campus to national level. In accordance with our strict data integrity policy, all unintegrated modes are transparently labeled as "Coming Soon" or "In Integration". We never display fabricated schedules or fake live vehicles.
          </p>
        </div>
      </div>

      {/* Grid of Future Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {INITIAL_FUTURE_TRANSPORTS.map((item) => (
          <div
            key={item.id}
            className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Category Badge & Status */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">
                  {item.category}
                </span>

                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                  {item.statusText}
                </span>
              </div>

              {/* Icon & Title */}
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  {getIcon(item.iconName)}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                  {item.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-300 leading-relaxed mb-4 font-light">
                {item.description}
              </p>
            </div>

            {/* Hub Coverage footer */}
            <div className="pt-3 border-t border-white/10">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Connected Corridors:
              </span>
              <div className="flex flex-wrap gap-1">
                {item.connectedHubs.map((hub, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md text-[10px] bg-black/40 text-gray-300 border border-white/5"
                  >
                    {hub}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

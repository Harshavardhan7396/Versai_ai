import React, { useState } from 'react';
import { 
  Radio, 
  Clock, 
  AlertTriangle, 
  Users, 
  FlaskConical, 
  HelpCircle, 
  CheckCircle2, 
  ExternalLink, 
  Info,
  X 
} from 'lucide-react';
import { DataTrustStatus, TransportSource } from '../../types';

interface DataTrustBadgeProps {
  status: DataTrustStatus | string;
  source?: TransportSource | string;
  showSourceButton?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const DataTrustBadge: React.FC<DataTrustBadgeProps> = ({
  status,
  source,
  showSourceButton = false,
  className = '',
  size = 'sm',
}) => {
  const [showSourceModal, setShowSourceModal] = useState(false);

  const normalized = (status || 'TIMETABLE').toUpperCase();

  const getBadgeConfig = () => {
    switch (normalized) {
      case 'LIVE':
      case 'LIVE TRACKING':
      case 'REAL-TIME':
        return {
          icon: <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />,
          label: 'LIVE',
          classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          tooltip: 'Live connected vehicle GPS / real-time feed',
        };
      case 'TIMETABLE':
      case 'TIMETABLE DATA':
        return {
          icon: <Clock className="w-3 h-3 text-cyan-400" />,
          label: 'TIMETABLE',
          classes: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          tooltip: 'Verified static timetable data. Real-time GPS not active.',
        };
      case 'RECENTLY UPDATED':
        return {
          icon: <CheckCircle2 className="w-3 h-3 text-purple-400" />,
          label: 'RECENTLY UPDATED',
          classes: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          tooltip: 'Timetable verified with latest campus or operator update.',
        };
      case 'ESTIMATED':
        return {
          icon: <AlertTriangle className="w-3 h-3 text-amber-400" />,
          label: 'ESTIMATED',
          classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          tooltip: 'Calculated approximation based on typical corridor speed.',
        };
      case 'USER REPORTED':
        return {
          icon: <Users className="w-3 h-3 text-indigo-400" />,
          label: 'USER REPORTED',
          classes: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
          tooltip: 'Reported by peer student commuters on this route.',
        };
      case 'DEMO':
      case 'DEMO TRACKING':
        return {
          icon: <FlaskConical className="w-3 h-3 text-rose-400" />,
          label: 'DEMO TRACKING',
          classes: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          tooltip: 'Simulation mode. Actual IoT vehicle hardware is not yet linked.',
        };
      case 'UNAVAILABLE':
      case 'DATA NOT AVAILABLE':
      default:
        return {
          icon: <HelpCircle className="w-3 h-3 text-gray-400" />,
          label: 'DATA UNAVAILABLE',
          classes: 'bg-gray-500/15 text-gray-300 border-gray-500/30',
          tooltip: 'No telemetry or verified timetable entry configured.',
        };
    }
  };

  const config = getBadgeConfig();
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1';

  return (
    <>
      <div className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wider border ${padding} ${textSize} ${config.classes} ${className}`}>
        {config.icon}
        <span>{config.label}</span>

        {showSourceButton && source && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowSourceModal(true);
            }}
            className="ml-1 opacity-70 hover:opacity-100 hover:text-white transition-opacity"
            title="Inspect Data Source Transparency"
          >
            <Info className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Source transparency modal */}
      {showSourceModal && (
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div className="w-full max-w-md bg-[#0d0924] border border-purple-500/30 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowSourceModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Data Transparency Record</h3>
                <p className="text-xs text-gray-400">Student Transit AI Trust Verification</p>
              </div>
            </div>

            <div className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/10 text-xs">
              <div className="flex justify-between items-start">
                <span className="text-gray-400">Data Status:</span>
                <span className="font-semibold text-cyan-300">{config.label}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-400">Data Policy:</span>
                <span className="font-medium text-gray-300 text-right max-w-[240px]">{config.tooltip}</span>
              </div>
              {typeof source === 'object' && source ? (
                <>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400">Source:</span>
                    <span className="font-medium text-white text-right">{source.source_name}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400">Source Type:</span>
                    <span className="font-medium text-purple-300">{source.source_type}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400">Region:</span>
                    <span className="font-medium text-gray-300">{source.region}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400">Last Verified:</span>
                    <span className="font-medium text-gray-300">{source.last_updated}</span>
                  </div>
                  {source.source_url && (
                    <div className="pt-2 border-t border-white/10">
                      <a
                        href={source.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 underline font-semibold"
                      >
                        <span>Official Source Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-between items-start">
                  <span className="text-gray-400">Source:</span>
                  <span className="font-medium text-white">{String(source || 'Official Transport Notice Board')}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowSourceModal(false)}
              className="w-full mt-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-semibold text-xs text-white transition-colors"
            >
              Close Verification
            </button>
          </div>
        </div>
      )}
    </>
  );
};

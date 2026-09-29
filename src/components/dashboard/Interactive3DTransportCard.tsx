import React, { useState } from 'react';
import { 
  Bus, 
  Train, 
  MapPin, 
  ArrowRight, 
  Globe2, 
  Sparkles, 
  Rocket, 
  Navigation, 
  Compass, 
  Bot 
} from 'lucide-react';
import { soundService } from '../../services/soundService';

interface Interactive3DTransportCardProps {
  id: string;
  categoryNumber: number;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  statBadge: string;
  iconType: 'college' | 'regional' | 'state' | 'railways' | 'more' | 'ai' | 'planner';
  accentColor: 'purple' | 'indigo' | 'emerald' | 'cyan' | 'amber';
  buttonText?: string;
  onExplore: (id: string) => void;
}

export const Interactive3DTransportCard: React.FC<Interactive3DTransportCardProps> = ({
  id,
  categoryNumber,
  title,
  subtitle,
  description,
  tag,
  statBadge,
  iconType,
  accentColor,
  buttonText = 'EXPLORE →',
  onExplore,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getColorStyles = () => {
    switch (accentColor) {
      case 'purple':
        return {
          glow: 'from-purple-600/30 via-indigo-600/15 to-transparent',
          border: 'border-purple-500/35 hover:border-purple-400/80',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          iconBg: 'bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-purple-600/40',
          btnBg: 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30',
          routeGlow: 'bg-purple-500',
        };
      case 'indigo':
        return {
          glow: 'from-indigo-600/30 via-blue-600/15 to-transparent',
          border: 'border-indigo-500/35 hover:border-indigo-400/80',
          badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          iconBg: 'bg-gradient-to-tr from-indigo-600 to-blue-600 shadow-indigo-600/40',
          btnBg: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30',
          routeGlow: 'bg-indigo-500',
        };
      case 'emerald':
        return {
          glow: 'from-emerald-600/30 via-teal-600/15 to-transparent',
          border: 'border-emerald-500/35 hover:border-emerald-400/80',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-600 shadow-emerald-600/40',
          btnBg: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30',
          routeGlow: 'bg-emerald-500',
        };
      case 'cyan':
        return {
          glow: 'from-cyan-600/30 via-sky-600/15 to-transparent',
          border: 'border-cyan-500/35 hover:border-cyan-400/80',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          iconBg: 'bg-gradient-to-tr from-cyan-600 to-sky-600 shadow-cyan-600/40',
          btnBg: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/30',
          routeGlow: 'bg-cyan-500',
        };
      case 'amber':
      default:
        return {
          glow: 'from-amber-600/30 via-orange-600/15 to-transparent',
          border: 'border-amber-500/35 hover:border-amber-400/80',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          iconBg: 'bg-gradient-to-tr from-amber-600 to-rose-600 shadow-amber-600/40',
          btnBg: 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30',
          routeGlow: 'bg-amber-500',
        };
    }
  };

  const colors = getColorStyles();

  const renderIcon = () => {
    switch (iconType) {
      case 'college':
        return <Bus className="w-7 h-7 text-white" />;
      case 'regional':
        return <Navigation className="w-7 h-7 text-white" />;
      case 'state':
        return <Globe2 className="w-7 h-7 text-white" />;
      case 'railways':
        return <Train className="w-7 h-7 text-white" />;
      case 'planner':
        return <Compass className="w-7 h-7 text-white" />;
      case 'ai':
        return <Bot className="w-7 h-7 text-white" />;
      case 'more':
      default:
        return <Rocket className="w-7 h-7 text-white" />;
    }
  };

  const handleClick = () => {
    soundService.playWhoosh();
    onExplore(id);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => {
        setIsHovered(true);
        soundService.playClick();
      }}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-3xl p-6 sm:p-7 vesper-card border border-white/14 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl hover:border-white/35 cursor-pointer flex flex-col justify-between overflow-hidden select-none"
      style={{
        perspective: '1000px',
      }}
    >
      {/* Background soft ambient spotlight */}
      <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/[0.04] to-transparent rounded-full blur-3xl pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-30'}`} />

      {/* 3D Animated Glowing Transit Corridor Route Line */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-white/5 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-transparent via-white/80 to-transparent transition-all duration-700 ease-out"
          style={{
            width: isHovered ? '100%' : '20%',
            boxShadow: isHovered ? '0 0 15px rgba(255,255,255,0.4)' : 'none',
          }}
        />
      </div>

      <div>
        {/* Top Header Row with Option Tag & Stat */}
        <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">
              CATEGORY {categoryNumber}
            </span>
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-white/15 bg-white/[0.06] text-gray-200">
              {tag}
            </span>
          </div>

          <span className="text-[11px] font-medium text-gray-300 bg-black/60 px-2.5 py-0.5 rounded-full border border-white/10">
            {statBadge}
          </span>
        </div>

        {/* 3D Icon and Title Block */}
        <div className="flex items-center gap-4 mb-3.5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1a1a1a] via-[#2a2a2a] to-[#444444] border border-white/20 text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105 flex-shrink-0">
            {renderIcon()}
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight group-hover:text-[#e6e6e6] transition-colors">
              {title}
            </h3>
            <p className="text-xs font-medium text-gray-400 tracking-wide">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6 font-light relative z-10">
          {description}
        </p>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10 relative z-10">
        <span className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors flex items-center gap-1.5">
          <span>{tag}</span>
          <Sparkles className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        </span>

        <button
          type="button"
          className="vesper-btn-solid flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#111111] transition-all transform group-hover:translate-x-1 active:scale-95"
        >
          <span>{buttonText}</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#111111]" />
        </button>
      </div>
    </div>
  );
};

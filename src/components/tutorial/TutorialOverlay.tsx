import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  Bus, 
  Train, 
  MapPin, 
  Users, 
  Bot, 
  UserCheck, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { store } from '../../services/store';

interface TutorialStepData {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  badge: string;
}

const TUTORIAL_STEPS: TutorialStepData[] = [
  {
    step: 1,
    title: 'Student Transit Dashboard',
    description: 'This is your Student Transit dashboard. Access all real-time schedules, campus links, and quick transport cards in one unified futuristic view.',
    icon: <Compass className="w-8 h-8 text-white" />,
    accent: 'border-white/20 shadow-black/40',
    badge: 'Overview',
  },
  {
    step: 2,
    title: 'Smart Instant Search',
    description: 'Search for buses, trains and destinations here. Quickly find Mathaganeri, Vallioor, Panagudi, Nagercoil or Kanyakumari routes.',
    icon: <Search className="w-8 h-8 text-white" />,
    accent: 'border-white/20 shadow-black/40',
    badge: 'Discovery',
  },
  {
    step: 3,
    title: 'Bus Timetable Explorer',
    description: 'Check your bus timetable here. Verified seed data from the official Joy University transport board categorized by morning, afternoon, and evening departures.',
    icon: <Bus className="w-8 h-8 text-white" />,
    accent: 'border-white/20 shadow-black/40',
    badge: 'Campus Bus',
  },
  {
    step: 4,
    title: 'Kanyakumari & Nagercoil Trains',
    description: 'Find train timings from Kanyakumari (CAPE) and Nagercoil (NCJ) connecting to Chennai, Howrah, Mumbai, Pune, and Bengaluru.',
    icon: <Train className="w-8 h-8 text-white" />,
    accent: 'border-white/20 shadow-black/40',
    badge: 'Rail Transit',
  },
  {
    step: 5,
    title: 'Interactive Region Map',
    description: 'Use the map to view connected vehicles and university hubs. View demonstration tracking corridors before GPS telemetry goes live.',
    icon: <MapPin className="w-8 h-8 text-white" />,
    accent: 'border-white/20 shadow-black/40',
    badge: 'Live Map',
  },
  {
    step: 6,
    title: 'Crowd Intelligence System',
    description: 'Check crowd information when available. Monitored through campus administrator logs and peer student reports (Low, Moderate, High, or Not Available).',
    icon: <Users className="w-8 h-8 text-white" />,
    accent: 'border-white/20 shadow-black/40',
    badge: 'Occupancy',
  },
  {
    step: 7,
    title: 'Vesper AI Assistant',
    description: 'Ask Vesper AI for intelligent transportation guidance! Get instant answers on next departures, routes, and emergency hotlines without guessing.',
    icon: <Bot className="w-8 h-8 text-white" />,
    accent: 'border-white/20 shadow-black/40',
    badge: 'Vesper AI',
  },
  {
    step: 8,
    title: 'Profile & Favorites Personalization',
    description: 'Use your profile and favorites to personalize the app. Bookmark your daily bus routes and stations for single-tap navigation.',
    icon: <UserCheck className="w-8 h-8 text-white" />,
    accent: 'border-white/20 shadow-black/40',
    badge: 'Customization',
  },
];

interface TutorialOverlayProps {
  onComplete: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const step = TUTORIAL_STEPS[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      store.completeTutorial();
      onComplete();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    store.completeTutorial();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      {/* Background ambient subtle scrim */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full border border-white/5 animate-pulse-slow opacity-20" />
      </div>

      <div className="relative w-full max-w-lg vesper-card rounded-3xl p-6 sm:p-8 border border-white/20 transition-all duration-300 shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-normal bg-white/[0.06] text-gray-200 border border-white/15 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              Tutorial • Step {step.step} of 8
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/[0.06] border border-white/10 text-gray-300">
              {step.badge}
            </span>
          </div>

          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 flex items-center gap-1 text-xs"
            title="Skip Tutorial"
          >
            <span>Skip</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Visual / Icon container */}
        <div className="flex items-center justify-center my-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#1a1a1a] via-[#2c2c2c] to-[#454545] border border-white/20 flex items-center justify-center shadow-xl">
              {step.icon}
            </div>
            {/* Beacon dot */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white border border-black"></span>
            </span>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-3 mb-8">
          <h2 className="text-2xl font-bold font-heading text-white tracking-tight">
            {step.title}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed px-2 font-light">
            {step.description}
          </p>
        </div>

        {/* Step Progress Indicators */}
        <div className="flex justify-center items-center gap-2 mb-8">
          {TUTORIAL_STEPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setCurrentStepIndex(idx)}
              aria-label={`Jump to tutorial step ${s.step}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStepIndex
                  ? 'w-8 bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)]'
                  : idx < currentStepIndex
                  ? 'w-2.5 bg-white/40'
                  : 'w-2.5 bg-white/15 hover:bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
          <button
            onClick={handleBack}
            disabled={isFirst}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isFirst
                ? 'opacity-30 cursor-not-allowed text-gray-500'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSkip}
              className="text-xs text-gray-400 hover:text-white px-3 py-2 transition-colors"
            >
              SKIP ALL
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold vesper-btn-solid transition-all transform active:scale-95"
            >
              <span>{isLast ? 'FINISH' : 'NEXT'}</span>
              {isLast ? <CheckCircle2 className="w-4 h-4 text-[#111111]" /> : <ArrowRight className="w-4 h-4 text-[#111111]" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

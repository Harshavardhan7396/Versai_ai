import React, { useEffect, useState } from 'react';
import { Compass, Sparkles, Bus, Train, ArrowRight } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface VesperCinematicTransitionProps {
  onComplete: () => void;
  userName?: string;
}

export const VesperCinematicTransition: React.FC<VesperCinematicTransitionProps> = ({
  onComplete,
  userName = 'Student',
}) => {
  const [step, setStep] = useState<number>(1);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    soundService.playWhoosh();

    // Sequence timer:
    // Step 1: Authentication Verified (0-400ms)
    // Step 2: Dark Violet Space & Core Activation (400-800ms)
    // Step 3: Transportation Network Online (800-1300ms)
    // Step 4: Fade into Dashboard (1300-1600ms)
    const timer1 = setTimeout(() => {
      setStep(2);
      soundService.playChime();
    }, 450);

    const timer2 = setTimeout(() => {
      setStep(3);
    }, 900);

    const timer3 = setTimeout(() => {
      setIsFadingOut(true);
    }, 1350);

    const timer4 = setTimeout(() => {
      onComplete();
    }, 1650);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#04020a] text-white cursor-pointer transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 bg-radial from-purple-900/30 via-indigo-950/20 to-black pointer-events-none" />

      {/* Orbiting rings */}
      <div className="absolute w-96 h-96 rounded-full border border-purple-500/20 animate-spin pointer-events-none" style={{ animationDuration: '14s' }} />
      <div className="absolute w-[500px] h-[500px] rounded-full border border-cyan-500/15 animate-spin pointer-events-none" style={{ animationDuration: '22s', animationDirection: 'reverse' }} />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
        {/* Vesper Emblem */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-purple-600/50 border border-white/25 animate-pulse">
            <Compass className="w-10 h-10 text-white" />
          </div>
          <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-400 text-black shadow-md">
            ONLINE
          </span>
        </div>

        {/* Step-by-step telemetry messages */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>AUTHENTICATION VERIFIED • ACCESSING COMMAND CENTER</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
            VESPER<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">.AI</span>
          </h2>

          <p className="text-sm text-gray-300 font-light italic">
            "Your journey. Connected."
          </p>

          {/* Sequential Status Indicator */}
          <div className="pt-4 flex flex-col items-center gap-2">
            <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
              <span className={step >= 1 ? 'text-cyan-400 font-bold' : 'opacity-40'}>
                [1] IDENTITY SYNC
              </span>
              <span>→</span>
              <span className={step >= 2 ? 'text-purple-400 font-bold' : 'opacity-40'}>
                [2] CORRIDORS
              </span>
              <span>→</span>
              <span className={step >= 3 ? 'text-emerald-400 font-bold' : 'opacity-40'}>
                [3] TIMETABLE
              </span>
            </div>

            {/* Glowing progress line */}
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-500 ease-out"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          className="mt-8 text-[11px] text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors"
        >
          <span>Tap anywhere to skip</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

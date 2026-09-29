import React from 'react';
import { Music, Volume2, Sparkles, X } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface VesperAmbientPromptProps {
  onEnable: () => void;
  onDismiss: () => void;
}

export const VesperAmbientPrompt: React.FC<VesperAmbientPromptProps> = ({
  onEnable,
  onDismiss,
}) => {
  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-40 max-w-sm w-[calc(100vw-2rem)] p-4 rounded-2xl bg-[#090417]/90 border border-purple-500/40 backdrop-blur-2xl shadow-2xl shadow-purple-950/80 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0 border border-purple-500/30">
          <Music className="w-4 h-4 animate-pulse" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Enable ambient sound?</span>
              <Sparkles className="w-3 h-3 text-cyan-400" />
            </span>
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
            Enhance your command center session with subtle generative synthesizer soundscapes.
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => {
                soundService.playClick();
                onEnable();
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/30 transition-all active:scale-95"
            >
              ENABLE
            </button>

            <button
              onClick={onDismiss}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              NOT NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

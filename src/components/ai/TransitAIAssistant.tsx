import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  Bus, 
  Train, 
  HelpCircle, 
  Users, 
  Navigation, 
  Globe2, 
  Compass, 
  MapPin, 
  ShieldCheck 
} from 'lucide-react';
import { BusTimetableEntry, TrainTimetableEntry } from '../../types';
import { INSTITUTION_INFO } from '../../data/seedData';
import { soundService } from '../../services/soundService';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  chips?: string[];
}

interface TransitAIAssistantProps {
  buses: BusTimetableEntry[];
  trains: TrainTimetableEntry[];
  isOpen: boolean;
  onClose: () => void;
  onNavigateTo?: (tab: string) => void;
}

export const TransitAIAssistant: React.FC<TransitAIAssistantProps> = ({
  buses,
  trains,
  isOpen,
  onClose,
  onNavigateTo,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Greetings! I am VESPER AI 🤖, your intelligent transportation assistant.
I am connected directly to Joy University campus timetables, Southern Railway schedules, and regional transit corridors.

How can I help connect your journey today?`,
      timestamp: 'Just now',
      chips: [
        'How do I reach Joy University?',
        'What bus goes to Nagercoil?',
        'What trains are available?',
        'Show regional transport',
        'Show state transport',
        'How do I use the journey planner?',
        'Where is the nearest railway station?',
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  // Rule-based verified timetable solver
  // Strict rule: If information is unavailable: "I don't have reliable information for that right now."
  const processQueryLocally = (query: string): string => {
    const q = query.toLowerCase().trim();

    // 1. "How do I reach Joy University?"
    if (q.includes('reach joy') || q.includes('reach university') || q.includes('how do i reach') || q.includes('directions')) {
      return `[VESPER.AI TRANSIT GUIDANCE]
Joy University is located at Vadakkankulam near Vallioor and Panagudi in the Kanyakumari/Tirunelveli corridor.

• College Buses: Joy University operates 22 daily scheduled buses from Mathaganeri, Vallioor, Kannangulam, Panagudi, and Nagercoil.
• Regional Buses: Take any TNSTC bus toward Vallioor or Nagercoil and disembark at Vadakkankulam Stop.
• Railways: Nearest stations are Vallioor (VLY, ~8 km), Nagercoil Junction (NCJ, ~22 km), and Kanyakumari (CAPE, ~28 km).`;
    }

    // 2. "What bus goes to Nagercoil?"
    if (q.includes('nagercoil') && (q.includes('bus') || q.includes('what bus') || q.includes('next'))) {
      const nagercoilBuses = buses.filter((b) => b.destination.toLowerCase() === 'nagercoil');
      if (nagercoilBuses.length > 0) {
        const timings = nagercoilBuses.map((b) => `• Bus ${b.busNumber} at ${b.time} (${b.timeOfDay})`).join('\n');
        return `[VESPER.AI BUS SCHEDULE]
Scheduled college departures to Nagercoil:\n\n${timings}\n\nNote: All timings are verified timetable records. Estimated travel time is 35–45 minutes.`;
      }
    }

    // 3. "What trains are available?"
    if (q.includes('train') || q.includes('railway') || q.includes('express')) {
      const list = trains.slice(0, 5).map((t) => `• ${t.trainNumber} - ${t.trainName} (${t.departureStation} @ ${t.departureTime} → ${t.destination})`).join('\n');
      return `[VESPER.AI RAILWAY TIMETABLE]
Verified Southern Railway trains connecting the region:\n\n${list}\n\n(More trains available in the Railways tab.)`;
    }

    // 4. "Show regional transport"
    if (q.includes('regional')) {
      return `[VESPER.AI REGIONAL NETWORK]
Regional routes connect Joy University, Vallioor Bus Stand, Vadakkankulam, Panagudi, and Nagercoil Vadasery Terminal with local feeder buses (Routes 5A, 11B, 18, 22C, 33). Check the Regional tab for detailed stops and transfer hubs.`;
    }

    // 5. "Show state transport"
    if (q.includes('state')) {
      return `[VESPER.AI STATE TRANSPORT]
Tamil Nadu State Transport (TNSTC & SETC) runs intercity Super Deluxe, Ultra Deluxe, and AC Sleeper routes from Nagercoil Central and Kanyakumari to Madurai, Trichy, Coimbatore, and Chennai CMBT.`;
    }

    // 6. "How do I use the journey planner?" / "Help me find a route."
    if (q.includes('journey planner') || q.includes('plan') || q.includes('find a route')) {
      return `[VESPER.AI JOURNEY PLANNER]
To plan a multi-modal trip:
1. Open the "Journey Planner" tab from the sidebar.
2. Select your origin (FROM) and destination (TO).
3. Set your preferred departure time.
4. Choose your routing criteria (Fastest, Fewest Transfers, or Lowest Cost).
Vesper will calculate verified connections combining campus buses, regional feeders, state express buses, and Southern Railway.`;
    }

    // 7. "Where is the nearest railway station?"
    if (q.includes('nearest') && q.includes('railway') || q.includes('station')) {
      return `[VESPER.AI STATION DIRECTORY]
• Vallioor Railway Station (VLY): ~8 km from campus (12 mins via Bus/Auto)
• Nagercoil Junction (NCJ): ~22 km from campus (30 mins via NH-44)
• Kanyakumari Terminal (CAPE): ~28 km from campus (38 mins)`;
    }

    // Default strict response if information is not verified
    return `I don't have reliable information for that right now. I only provide verified schedules from institutional transit records, Southern Railway, and TNSTC timetables.`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    soundService.playClick();
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    let reply = '';
    try {
      const res = await fetch('/api/igris-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });
      if (res.ok) {
        const data = await res.json();
        reply = data.text || processQueryLocally(query);
      } else {
        reply = processQueryLocally(query);
      }
    } catch {
      reply = processQueryLocally(query);
    }

    setTimeout(() => {
      setIsTyping(false);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      soundService.playChime();
    }, 350);
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[85vh] h-[590px] glass-panel-glow rounded-3xl border border-purple-500/40 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
      {/* Background glow atmosphere */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between relative z-10 bg-black/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1a1a1a] via-[#2c2c2c] to-[#454545] border border-white/20 flex items-center justify-center text-white shadow-md shadow-black/50">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-white border border-black animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white font-heading tracking-wide">
                VESPER<span className="font-display italic text-[#e6e6e6]">.AI</span>
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/[0.06] text-gray-200 border border-white/15">
                Transport Assistant
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Your journey. Connected.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Close Vesper AI"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Chips Bar */}
      <div className="px-3 py-2 bg-black/40 border-b border-white/10 flex items-center gap-1.5 overflow-x-auto text-[11px] relative z-10 scrollbar-none">
        <button
          onClick={() => handleSendMessage('How do I reach Joy University?')}
          className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-gray-300 hover:text-white hover:bg-white/[0.08] border border-white/10 flex items-center gap-1 flex-shrink-0 transition-colors"
        >
          <Compass className="w-3 h-3 text-gray-300" />
          <span>Reach Campus</span>
        </button>

        <button
          onClick={() => handleSendMessage('What bus goes to Nagercoil?')}
          className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-gray-300 hover:text-white hover:bg-white/[0.08] border border-white/10 flex items-center gap-1 flex-shrink-0 transition-colors"
        >
          <Bus className="w-3 h-3 text-gray-300" />
          <span>Nagercoil Bus</span>
        </button>

        <button
          onClick={() => handleSendMessage('What trains are available?')}
          className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-gray-300 hover:text-white hover:bg-white/[0.08] border border-white/10 flex items-center gap-1 flex-shrink-0 transition-colors"
        >
          <Train className="w-3 h-3 text-gray-300" />
          <span>Trains</span>
        </button>

        <button
          onClick={() => handleSendMessage('How do I use the journey planner?')}
          className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-gray-300 hover:text-white hover:bg-white/[0.08] border border-white/10 flex items-center gap-1 flex-shrink-0 transition-colors"
        >
          <Navigation className="w-3 h-3 text-gray-300" />
          <span>Journey Planner</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 relative z-10 text-xs sm:text-sm">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-gradient-to-b from-white via-[#f0f0f0] to-[#d6d6d6] text-[#111111] font-medium rounded-tr-none shadow-lg'
                  : 'vesper-card text-gray-200 border border-white/15 rounded-tl-none shadow-sm'
              }`}
            >
              {m.text}
            </div>

            {m.chips && m.chips.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-[85%]">
                {m.chips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip)}
                    className="px-2.5 py-1 rounded-full text-[11px] bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-gray-200 transition-all text-left"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            <span className="text-[10px] text-gray-500 mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 text-gray-400 p-2.5 bg-black/60 border border-white/15 rounded-xl w-20">
            <span className="w-2 h-2 rounded-full bg-white animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-white/10 bg-black/60 relative z-10 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Vesper AI about routes, buses, trains..."
          className="flex-1 bg-white/[0.05] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/50 transition-colors"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl vesper-btn-solid text-[#111111] disabled:opacity-40 transition-all shadow-md active:scale-95 flex items-center justify-center"
          title="Send message"
        >
          <Send className="w-4 h-4 text-[#111111]" />
        </button>
      </form>
    </div>
  );
};

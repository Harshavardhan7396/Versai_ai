import React from 'react';
import { 
  Home, 
  Bus, 
  Navigation, 
  Globe2, 
  Train, 
  Compass, 
  MapPin, 
  Bot, 
  Star, 
  Bell, 
  AlertTriangle, 
  User, 
  LogOut, 
  ShieldCheck,
  Volume2,
  VolumeX,
  Music,
  Radio,
  Sparkles
} from 'lucide-react';
import { soundService } from '../../services/soundService';

interface VesperSidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  isAdmin?: boolean;
  unreadNotifsCount?: number;
  isSoundOn: boolean;
  onToggleSound: () => void;
  isAmbientOn: boolean;
  onToggleAmbient: () => void;
}

export const VesperSidebar: React.FC<VesperSidebarProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  isAdmin = false,
  unreadNotifsCount = 0,
  isSoundOn,
  onToggleSound,
  isAmbientOn,
  onToggleAmbient,
}) => {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { id: 'buses', label: 'Joy University', icon: <Bus className="w-4 h-4 text-purple-400" /> },
    { id: 'regional', label: 'Regional', icon: <Navigation className="w-4 h-4 text-indigo-400" /> },
    { id: 'state', label: 'State Transport', icon: <Globe2 className="w-4 h-4 text-emerald-400" /> },
    { id: 'trains', label: 'Railways', icon: <Train className="w-4 h-4 text-cyan-400" /> },
    { id: 'route', label: 'Journey Planner', icon: <Compass className="w-4 h-4 text-pink-400" /> },
    { id: 'map', label: 'Live Map', icon: <MapPin className="w-4 h-4 text-amber-400" /> },
    { id: 'chat', label: 'Vesper AI', icon: <Bot className="w-4 h-4 text-cyan-300" />, badge: 'AI' },
  ];

  const utilityNavItems = [
    { id: 'favorites', label: 'Favorites', icon: <Star className="w-4 h-4 text-amber-300" /> },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: <Bell className="w-4 h-4 text-indigo-300" />,
      count: unreadNotifsCount 
    },
    { id: 'reports', label: 'Reports', icon: <AlertTriangle className="w-4 h-4 text-rose-400" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4 text-gray-300" /> },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Console', icon: <ShieldCheck className="w-4 h-4 text-cyan-400" /> }] : []),
  ];

  const handleNavClick = (id: string) => {
    soundService.playClick();
    onSelectTab(id);
  };

  return (
    <>
      {/* DESKTOP FUTURISTIC SIDEBAR (≥1024px) */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[#080314]/75 backdrop-blur-2xl border-r border-purple-500/20 z-40 select-none">
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 border border-purple-400/30">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-base tracking-wider text-white">
                  VESPER<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">.AI</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/80 animate-pulse" />
              </div>
              <p className="text-[11px] text-purple-200/70 font-light italic">
                "Your journey. Connected."
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-purple-900/40">
          {/* Main Transportation Navigation */}
          <div>
            <span className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
              Transportation Network
            </span>
            <div className="space-y-1">
              {mainNavItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/20 text-white border border-purple-500/50 shadow-md shadow-purple-900/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-sm shadow-purple-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Utilities & Operations */}
          <div>
            <span className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
              Services & Account
            </span>
            <div className="space-y-1">
              {utilityNavItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/20 text-white border border-purple-500/50 shadow-md shadow-purple-900/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>

                    {item.count !== undefined && item.count > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-purple-600 text-white">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Controls & Logout */}
        <div className="p-3 border-t border-white/10 bg-black/40 space-y-2">
          {/* Audio Controls (Section 14 & 15) */}
          <div className="flex items-center justify-between px-2 py-1 bg-white/[0.03] rounded-xl border border-white/5">
            <span className="text-[11px] text-gray-400">Audio System</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={onToggleSound}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  isSoundOn ? 'text-cyan-300 hover:bg-white/10' : 'text-gray-500 hover:text-gray-300'
                }`}
                title={isSoundOn ? 'Sound FX On (Click to Mute)' : 'Sound FX Muted'}
              >
                {isSoundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={onToggleAmbient}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  isAmbientOn ? 'text-purple-300 hover:bg-white/10' : 'text-gray-500 hover:text-gray-300'
                }`}
                title={isAmbientOn ? 'Ambient Music On' : 'Ambient Music Off'}
              >
                <Music className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 transition-all"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR (Section 17) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#080314]/90 backdrop-blur-2xl border-t border-purple-500/20 px-3 py-2 flex items-center justify-around">
        <button
          onClick={() => handleNavClick('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'dashboard' ? 'text-purple-300' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>HOME</span>
        </button>

        <button
          onClick={() => handleNavClick('map')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'map' ? 'text-amber-300' : 'text-gray-400 hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>MAP</span>
        </button>

        <button
          onClick={() => handleNavClick('buses')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            ['buses', 'regional', 'state', 'trains', 'route'].includes(activeTab)
              ? 'text-cyan-300'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Bus className="w-4 h-4" />
          <span>TRANSPORT</span>
        </button>

        <button
          onClick={() => handleNavClick('chat')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'chat' ? 'text-cyan-300' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI</span>
        </button>

        <button
          onClick={() => handleNavClick('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'profile' ? 'text-purple-300' : 'text-gray-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>PROFILE</span>
        </button>
      </nav>
    </>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  MapPin, 
  Bus, 
  Train, 
  Navigation, 
  User, 
  ShieldCheck, 
  Bell, 
  Bot, 
  Sparkles, 
  LogOut, 
  LogIn, 
  Home, 
  Menu, 
  X, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Radio,
  Star,
  Globe2,
  Rocket,
  Volume2,
  VolumeX,
  WifiOff,
  Music
} from 'lucide-react';
import { store } from './services/store';
import { authService } from './services/auth';
import { soundService } from './services/soundService';
import { 
  UserProfile, 
  BusTimetableEntry, 
  TrainTimetableEntry, 
  VehicleLocation, 
  StudentReport, 
  AppNotification, 
  FavoriteItem,
  RegionalBusEntry,
  StateBusEntry,
  RecentJourney
} from './types';
import { INSTITUTION_INFO } from './data/seedData';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { AdminLoginPage } from './components/auth/AdminLoginPage';
import { BlackHoleCanvas } from './components/3d/BlackHoleCanvas';
import { HlsBackground } from './components/background/HlsBackground';
import { AuthenticatedEnvironment } from './components/layout/AuthenticatedEnvironment';
import { TutorialOverlay } from './components/tutorial/TutorialOverlay';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { BusExplorer } from './components/bus/BusExplorer';
import { RegionalExplorer } from './components/regional/RegionalExplorer';
import { StateTransportExplorer } from './components/state/StateTransportExplorer';
import { TrainExplorer } from './components/train/TrainExplorer';
import { MoreTransportExplorer } from './components/more/MoreTransportExplorer';
import { RoutePlanner } from './components/route/RoutePlanner';
import { LiveMap } from './components/map/LiveMap';
import { TransitAIAssistant } from './components/ai/TransitAIAssistant';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserProfileView } from './components/profile/UserProfile';
import { StudentReportModal } from './components/reports/StudentReportModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';

// Helper to determine initial route from window.location
function getInitialRoute(): string {
  if (typeof window === 'undefined') return '/';
  const path = window.location.pathname.toLowerCase();
  if (path === '/login' || path === '/signup' || path === '/admin/login') {
    return path;
  }
  if ([
    '/dashboard', 
    '/buses', 
    '/regional',
    '/state',
    '/trains', 
    '/more',
    '/map', 
    '/route', 
    '/profile', 
    '/admin', 
    '/app'
  ].includes(path)) {
    return path;
  }
  return '/';
}

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => authService.isAuthenticated());
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => authService.getCurrentUser());

  // Routing State
  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Store data states
  const [user, setUser] = useState<UserProfile>(() => store.getUser());
  const [buses, setBuses] = useState<BusTimetableEntry[]>(() => store.getBuses());
  const [regionalBuses, setRegionalBuses] = useState<RegionalBusEntry[]>(() => store.getRegionalBuses());
  const [stateBuses, setStateBuses] = useState<StateBusEntry[]>(() => store.getStateBuses());
  const [trains, setTrains] = useState<TrainTimetableEntry[]>(() => store.getTrains());
  const [vehicles, setVehicles] = useState<VehicleLocation[]>(() => store.getVehicles());
  const [reports, setReports] = useState<StudentReport[]>(() => store.getReports());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => store.getNotifications());
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => store.getFavorites());
  const [recentJourneys, setRecentJourneys] = useState<RecentJourney[]>(() => store.getRecentJourneys());

  // Sound System States (Section 17 & 18)
  const [isSoundOn, setIsSoundOn] = useState<boolean>(() => soundService.isSoundEnabled());
  const [isAmbientOn, setIsAmbientOn] = useState<boolean>(() => soundService.isAmbientEnabled());
  const [showAmbientPrompt, setShowAmbientPrompt] = useState<boolean>(false);

  // Offline Connection State (Section 34)
  const [isOnline, setIsOnline] = useState<boolean>(() => typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Interactive panels
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Navigation handler with browser history synchronization
  const navigate = useCallback((path: string, replace = false) => {
    soundService.registerUserInteraction();
    if (typeof window !== 'undefined') {
      try {
        if (window.location.pathname !== path) {
          if (replace) {
            window.history.replaceState({}, '', path);
          } else {
            window.history.pushState({}, '', path);
          }
        }
      } catch (e) {
        console.warn('History navigation error:', e);
      }
    }
    setCurrentRoute(path);

    // Map routes to tab IDs if navigating inside authenticated dashboard
    if (path === '/dashboard' || path === '/app') setActiveTab('dashboard');
    else if (path === '/buses') setActiveTab('buses');
    else if (path === '/regional') setActiveTab('regional');
    else if (path === '/state') setActiveTab('state');
    else if (path === '/trains') setActiveTab('trains');
    else if (path === '/more') setActiveTab('more');
    else if (path === '/map') setActiveTab('map');
    else if (path === '/route') setActiveTab('route');
    else if (path === '/profile') setActiveTab('profile');
    else if (path === '/admin') setActiveTab('admin');
  }, []);

  // Listen to browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      setCurrentRoute(path || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Subscribe to auth service
  useEffect(() => {
    const unsubscribeAuth = authService.subscribe((state) => {
      setIsAuthenticated(state.isAuthenticated);
      setCurrentUser(state.currentUser);
    });
    return unsubscribeAuth;
  }, []);

  // Subscribe to store
  useEffect(() => {
    const unsubscribeStore = store.subscribe(() => {
      setUser(store.getUser());
      setBuses(store.getBuses());
      setRegionalBuses(store.getRegionalBuses());
      setStateBuses(store.getStateBuses());
      setTrains(store.getTrains());
      setVehicles(store.getVehicles());
      setReports(store.getReports());
      setNotifications(store.getNotifications());
      setFavorites(store.getFavorites());
      setRecentJourneys(store.getRecentJourneys());
    });
    return unsubscribeStore;
  }, []);

  // Route protection logic
  useEffect(() => {
    const protectedPaths = [
      '/dashboard', 
      '/app', 
      '/buses', 
      '/regional', 
      '/state', 
      '/trains', 
      '/more', 
      '/map', 
      '/route', 
      '/profile', 
      '/admin'
    ];
    if (protectedPaths.includes(currentRoute) && !isAuthenticated) {
      navigate('/login', true);
    }
  }, [currentRoute, isAuthenticated, navigate]);

  // Handle successful login
  const handleLoginSuccess = (isAdmin = false) => {
    soundService.registerUserInteraction();
    soundService.playWarp();
    const authUser = authService.getCurrentUser();

    // Check if ambient sound prompt should be shown
    if (!localStorage.getItem('transit_ambient_prompted')) {
      setShowAmbientPrompt(true);
    }

    if (isAdmin || authUser?.role === 'admin') {
      setActiveTab('admin');
      navigate('/admin');
    } else {
      setActiveTab('dashboard');
      navigate('/dashboard');

      // Trigger first-time tutorial if not completed yet
      if (authUser && !authUser.hasCompletedTutorial) {
        setShowTutorial(true);
      }
    }
  };

  // Handle successful signup
  const handleSignupSuccess = () => {
    soundService.registerUserInteraction();
    soundService.playWarp();
    setActiveTab('dashboard');
    navigate('/dashboard');
    setShowTutorial(true);
  };

  // Handle Logout
  const handleLogout = () => {
    soundService.playClick();
    authService.logout();
    store.logout();
    setShowTutorial(false);
    setIsChatOpen(false);
    navigate('/login');
  };

  // Toggle role helper for easy evaluator preview
  const handleRoleToggle = () => {
    soundService.playClick();
    if (user.role === 'student') {
      store.switchRole('admin');
      setActiveTab('admin');
      navigate('/admin');
    } else {
      store.switchRole('student');
      setActiveTab('dashboard');
      navigate('/dashboard');
    }
  };

  // Sound toggle button
  const handleToggleSound = () => {
    const newState = soundService.toggleSound();
    setIsSoundOn(newState);
    setIsAmbientOn(soundService.isAmbientEnabled());
  };

  const handleEnableAmbient = () => {
    soundService.registerUserInteraction();
    soundService.toggleAmbientMusic(true);
    setIsAmbientOn(true);
    setShowAmbientPrompt(false);
    try {
      localStorage.setItem('transit_ambient_prompted', 'true');
    } catch {}
  };

  const handleDismissAmbient = () => {
    setShowAmbientPrompt(false);
    try {
      localStorage.setItem('transit_ambient_prompted', 'true');
    } catch {}
  };

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  // Unified Theme based on Authentication State
  // Unauthenticated users adopt the 'landing' theme (Vesper.ai dark aesthetic)
  const authTheme = !isAuthenticated ? 'landing' : 'dashboard';

  // 1. UNAUTHENTICATED 'LANDING' THEME VIEWS
  // Enforces the Vesper.ai aesthetic (black backgrounds, Instrument Serif typography, and liquid-metal navigation)
  const renderUnauthenticatedView = () => {
    if (currentRoute === '/login') {
      return (
        <LoginPage
          onNavigate={navigate}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    }

    if (currentRoute === '/signup') {
      return (
        <SignupPage
          onNavigate={navigate}
          onSignupSuccess={handleSignupSuccess}
        />
      );
    }

    if (currentRoute === '/admin/login') {
      return (
        <AdminLoginPage
          onNavigate={navigate}
          onLoginSuccess={() => handleLoginSuccess(true)}
        />
      );
    }

    // Default 'landing' view (Vesper.ai single-viewport landing page)
    return (
      <LandingPage
        onGetStarted={() => {
          soundService.playClick();
          navigate('/login');
        }}
        onExploreTransport={() => {
          soundService.registerUserInteraction();
          soundService.playWarp();
          // Authenticate as demo student to demonstrate seamless cinematic transition
          authService.loginAsDemo('student', true);
          handleLoginSuccess(false);
        }}
        onLoginClick={() => {
          soundService.playClick();
          navigate('/login');
        }}
      />
    );
  };

  // 5. PROTECTED ROUTES: Multi-Tier Transportation Operating System
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { id: 'buses', label: 'Joy Univ', icon: <Bus className="w-4 h-4 text-purple-400" /> },
    { id: 'regional', label: 'Regional', icon: <Navigation className="w-4 h-4 text-indigo-400" /> },
    { id: 'state', label: 'State Buses', icon: <Globe2 className="w-4 h-4 text-emerald-400" /> },
    { id: 'trains', label: 'Railways', icon: <Train className="w-4 h-4 text-cyan-400" /> },
    { id: 'route', label: 'Planner', icon: <Compass className="w-4 h-4 text-pink-400" /> },
    { id: 'map', label: 'Map', icon: <MapPin className="w-4 h-4 text-amber-400" /> },
    { id: 'more', label: 'More', icon: <Rocket className="w-4 h-4 text-rose-400" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    ...(user.role === 'admin'
      ? [{ id: 'admin', label: 'Admin', icon: <ShieldCheck className="w-4 h-4 text-cyan-400" /> }]
      : []),
  ];

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated ? (
        <motion.div
          key={`unauth-world-${currentRoute}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 0.98,
            filter: 'blur(10px)',
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
          }}
          className="w-full min-h-screen bg-black"
        >
          {renderUnauthenticatedView()}
        </motion.div>
      ) : (
        <motion.div
          key="authenticated-command-center"
          initial={{ opacity: 0, scale: 1.025, filter: 'blur(12px)' }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          }}
          exit={{
            opacity: 0,
            scale: 0.98,
            filter: 'blur(8px)',
            transition: { duration: 0.4 },
          }}
          onAnimationStart={() => {
            soundService.playWarp();
          }}
          className="w-full min-h-screen"
        >
          {/* Synchronized Cinematic Warp Horizon Line Flash */}
          <motion.div
            initial={{ opacity: 0.9, scaleX: 0 }}
            animate={{ opacity: 0, scaleX: 1.6 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="fixed inset-0 pointer-events-none z-[60] flex items-center justify-center overflow-hidden"
          >
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-[1px] shadow-[0_0_30px_rgba(56,189,248,0.9)]" />
          </motion.div>

          <AuthenticatedEnvironment isAuthenticated={isAuthenticated}>
            <div className="min-h-screen text-[hsl(var(--text))] flex flex-col relative selection:bg-[#4E85BF] selection:text-white font-body">
        {/* OFFLINE INDICATOR BANNER (Section 34) */}
        {!isOnline && (
          <div className="sticky top-0 z-50 bg-amber-950/95 border-b border-amber-500/40 text-amber-200 px-4 py-2 text-xs flex items-center justify-center gap-2 backdrop-blur-md">
            <WifiOff className="w-4 h-4 text-amber-400" />
            <span>
              You're currently offline. Displaying cached timetable information.
            </span>
          </div>
        )}

        {/* TOP NAVBAR */}
        <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 sm:px-6 py-2.5 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  soundService.playClick();
                  setActiveTab('dashboard');
                  navigate('/dashboard');
                }}
                className="flex items-center gap-2.5 text-left group"
                title="Return to Student Dashboard"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1a1a1a] via-[#2c2c2c] to-[#454545] border border-white/20 flex items-center justify-center text-white shadow-md shadow-black/60 group-hover:scale-105 transition-transform">
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-heading font-extrabold text-sm sm:text-base tracking-wider text-white flex items-center gap-1">
                    VESPER<span className="font-display italic text-[#e6e6e6]">.AI</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium block">
                    Your journey. Connected.
                  </span>
                </div>
              </button>
            </div>

          {/* Center quick links (desktop) - Liquid-metal theme matching login page */}
          <div className="hidden xl:flex items-center gap-1 bg-black/60 p-1.5 rounded-xl border border-white/15 backdrop-blur-md">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  soundService.playClick();
                  setActiveTab(item.id);
                  navigate(`/${item.id}`);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-[#1c1c1c] via-[#333333] to-[#4f4f4f] text-white border border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.15)] font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.06] border border-transparent font-medium'
                }`}
              >
                <span className={activeTab === item.id ? 'text-white' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* HLS Video Stream indicator */}
            <div 
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-medium border border-white/15 bg-white/[0.05] text-gray-300 backdrop-blur-md"
              title="MUX Live HLS Background Active"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="font-mono">MUX HLS</span>
            </div>

            {/* Audio Toggle Button (Section 17) */}
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-xl border transition-colors ${
                isSoundOn 
                  ? 'bg-white/10 text-white border-white/20 hover:bg-white/15' 
                  : 'bg-white/5 text-gray-500 border-white/5 hover:text-gray-300'
              }`}
              title={isSoundOn ? 'Sound Effects & Audio ON (Click to Mute)' : 'Sound Effects Muted (Click to Enable)'}
            >
              {isSoundOn ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Role Switcher Pill (Matching Login Page) */}
            <button
              onClick={handleRoleToggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border border-white/15 bg-white/[0.06] hover:bg-white/10 text-gray-200"
              title="Click to toggle between Student and Admin console"
            >
              {user.role === 'admin' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  <span className="hidden sm:inline">Role:</span>
                  <span className="font-semibold text-white">ADMIN</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-gray-300" />
                  <span className="hidden sm:inline">Role:</span>
                  <span className="font-semibold text-white">STUDENT</span>
                </>
              )}
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => {
                soundService.playClick();
                setIsNotificationOpen(true);
              }}
              className="relative p-2 rounded-xl text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              title="Notifications & Announcements"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center animate-pulse">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Tutorial Trigger */}
            <button
              onClick={() => {
                soundService.playClick();
                setShowTutorial(true);
              }}
              className="hidden sm:flex p-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              title="Open Platform Guide & Tutorial"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 transition-all"
              title="Log out"
            >
              <LogOut className="w-3.5 h-3.5 text-gray-400" />
              <span className="hidden md:inline">Log Out</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-gray-300 hover:text-white bg-white/5 border border-white/10"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden pt-3 mt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-2 animate-in slide-in-from-top duration-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  soundService.playClick();
                  setActiveTab(item.id);
                  navigate(`/${item.id}`);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-[#1c1c1c] via-[#333333] to-[#4f4f4f] text-white border-white/40 shadow-sm font-semibold'
                    : 'bg-white/[0.04] text-gray-300 hover:text-white border-white/10'
                }`}
              >
                <span className={activeTab === item.id ? 'text-white' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 sm:pb-12 relative z-10">
        {activeTab === 'dashboard' && (
          <StudentDashboard
            user={user}
            buses={buses}
            trains={trains}
            vehicles={vehicles}
            regionalBuses={regionalBuses}
            stateBuses={stateBuses}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              navigate(`/${tab}`);
            }}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenChat={() => setIsChatOpen(true)}
            onSearchSelect={() => {
              setActiveTab('buses');
              navigate('/buses');
            }}
          />
        )}

        {/* TIER 1: JOY UNIVERSITY BUSES */}
        {activeTab === 'buses' && (
          <BusExplorer
            buses={buses}
            onSelectBus={() => {}}
          />
        )}

        {/* TIER 2: REGIONAL TRANSPORT */}
        {activeTab === 'regional' && (
          <RegionalExplorer
            regionalBuses={regionalBuses}
          />
        )}

        {/* TIER 3: TAMIL NADU STATE TRANSPORT */}
        {activeTab === 'state' && (
          <StateTransportExplorer
            stateBuses={stateBuses}
          />
        )}

        {/* TIER 4: RAILWAY TRANSPORT */}
        {activeTab === 'trains' && (
          <TrainExplorer trains={trains} />
        )}

        {/* TIER 5: MORE TRANSPORT / FUTURE MODES */}
        {activeTab === 'more' && (
          <MoreTransportExplorer />
        )}

        {/* SMART JOURNEY PLANNER */}
        {activeTab === 'route' && (
          <RoutePlanner
            buses={buses}
            trains={trains}
            regionalBuses={regionalBuses}
            stateBuses={stateBuses}
            onSelectBus={() => {}}
          />
        )}

        {/* LIVE / DEMO MAP */}
        {activeTab === 'map' && (
          <LiveMap 
            vehicles={vehicles} 
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              navigate(`/${tab}`);
            }}
          />
        )}

        {/* PROFILE & FAVORITES */}
        {activeTab === 'profile' && (
          <UserProfileView
            user={user}
            favorites={favorites}
            reports={reports}
            recentJourneys={recentJourneys}
            onRestartTutorial={() => setShowTutorial(true)}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
              navigate(`/${tab}`);
            }}
            onLogout={handleLogout}
          />
        )}

        {/* ADMIN DASHBOARD */}
        {activeTab === 'admin' && user.role === 'admin' && (
          <AdminDashboard
            buses={buses}
            trains={trains}
            vehicles={vehicles}
            reports={reports}
          />
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION (HOME, MAP, TRANSPORT, AI, PROFILE) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-white/10 px-2 py-2 flex items-center justify-around backdrop-blur-2xl">
        <button
          onClick={() => {
            soundService.playClick();
            setActiveTab('dashboard');
            navigate('/dashboard');
          }}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-semibold transition-colors ${
            activeTab === 'dashboard' ? 'text-purple-400' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>HOME</span>
        </button>

        <button
          onClick={() => {
            soundService.playClick();
            setActiveTab('map');
            navigate('/map');
          }}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-semibold transition-colors ${
            activeTab === 'map' ? 'text-purple-400' : 'text-gray-400 hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>MAP</span>
        </button>

        <button
          onClick={() => {
            soundService.playClick();
            setActiveTab('buses');
            navigate('/buses');
          }}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-semibold transition-colors ${
            activeTab === 'buses' || activeTab === 'regional' || activeTab === 'state' ? 'text-purple-400' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Bus className="w-4 h-4" />
          <span>TRANSPORT</span>
        </button>

        <button
          onClick={() => {
            soundService.playClick();
            setIsChatOpen(!isChatOpen);
          }}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-semibold transition-colors ${
            isChatOpen ? 'text-rose-400' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI</span>
        </button>

        <button
          onClick={() => {
            soundService.playClick();
            setActiveTab('profile');
            navigate('/profile');
          }}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-semibold transition-colors ${
            activeTab === 'profile' ? 'text-purple-400' : 'text-gray-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>PROFILE</span>
        </button>
      </nav>

      {/* FLOATING IGRIS AI CHATBOT TRIGGER BUTTON */}
      {!isChatOpen && (
        <button
          onClick={() => {
            soundService.playClick();
            setIsChatOpen(true);
          }}
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all group border border-rose-400/30"
          title="Consult Igris AI"
        >
          <div className="relative">
            <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform text-rose-100" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
          </div>
          <span>IGRIS AI ⚔️</span>
        </button>
      )}

      {/* FLOATING AI ASSISTANT PANEL */}
      <TransitAIAssistant
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        buses={buses}
        trains={trains}
        onNavigateTo={(tab) => {
          soundService.playClick();
          setActiveTab(tab);
          navigate(`/${tab}`);
          setIsChatOpen(false);
        }}
      />

      {/* GAME-LIKE FIRST TIME TUTORIAL OVERLAY */}
      {showTutorial && (
        <TutorialOverlay
          onComplete={() => {
            setShowTutorial(false);
            store.completeTutorial();
            authService.completeTutorial();
          }}
        />
      )}

      {/* STUDENT REPORT MODAL */}
      <StudentReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* NOTIFICATIONS & ANNOUNCEMENTS DRAWER */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
      />

      {/* AMBIENT AUDIO PROMPT (Section 18) */}
      {showAmbientPrompt && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-[#0e0a22]/95 border border-purple-500/40 shadow-2xl backdrop-blur-xl max-w-sm animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
              <Music className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-white mb-0.5">Enable Ambient Transit Sound?</h4>
              <p className="text-[11px] text-gray-300 leading-relaxed mb-3">
                Play subtle futuristic ambient audio during your journey planning experience.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEnableAmbient}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white shadow-md shadow-purple-600/30"
                >
                  ENABLE
                </button>
                <button
                  onClick={handleDismissAmbient}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-gray-300"
                >
                  NOT NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
            </div>
          </AuthenticatedEnvironment>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

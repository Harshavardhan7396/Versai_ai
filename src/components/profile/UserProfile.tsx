import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, 
  Mail, 
  BookOpen, 
  Building, 
  Calendar, 
  Phone, 
  Star, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Trash2, 
  AlertTriangle,
  Bus,
  Train,
  MapPin,
  LogOut,
  Navigation,
  History,
  ArrowRight,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  Compass
} from 'lucide-react';
import { 
  UserProfile as UserProfileType, 
  FavoriteItem, 
  StudentReport, 
  RecentJourney 
} from '../../types';
import { store } from '../../services/store';
import { soundService } from '../../services/soundService';

interface UserProfileProps {
  user: UserProfileType;
  favorites: FavoriteItem[];
  reports: StudentReport[];
  recentJourneys?: RecentJourney[];
  onRestartTutorial: () => void;
  onNavigateToTab: (tab: string) => void;
  onLogout?: () => void;
}

export const UserProfileView: React.FC<UserProfileProps> = ({
  user,
  favorites,
  reports,
  recentJourneys: initialRecentJourneys,
  onRestartTutorial,
  onNavigateToTab,
  onLogout,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);
  const [department, setDepartment] = useState(user.department);
  const [year, setYear] = useState(user.year);
  const [preferredDest, setPreferredDest] = useState(user.preferredDestination || 'Nagercoil');
  const [phone, setPhone] = useState(user.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Recent Journeys State & Filtering
  const [recentJourneys, setRecentJourneys] = useState<RecentJourney[]>(
    initialRecentJourneys || store.getRecentJourneys()
  );
  const [journeyFilter, setJourneyFilter] = useState<'all' | 'college' | 'regional' | 'state' | 'railways'>('all');
  const [journeySearchQuery, setJourneySearchQuery] = useState('');
  const [isConfirmingClearAll, setIsConfirmingClearAll] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync recent journeys from store subscriptions
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setRecentJourneys(store.getRecentJourneys());
    });
    return () => unsubscribe();
  }, []);

  // Sync prop changes
  useEffect(() => {
    if (initialRecentJourneys) {
      setRecentJourneys(initialRecentJourneys);
    }
  }, [initialRecentJourneys]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateUserProfile({
      fullName,
      department,
      year,
      preferredDestination: preferredDest,
      phone,
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Re-search a recent journey in Route Planner
  const handleSearchAgain = (journey: RecentJourney) => {
    soundService.playClick();
    store.setActiveJourneyQuery({ from: journey.from, to: journey.to });
    onNavigateToTab('route');
  };

  // Delete a single journey from history
  const handleDeleteJourney = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundService.playClick();
    store.deleteRecentJourney(id);
    showToast('Journey removed from history');
  };

  // Clear all recent journeys
  const handleClearAllJourneys = () => {
    soundService.playClick();
    store.clearRecentJourneys();
    setIsConfirmingClearAll(false);
    showToast('Journey search history cleared');
  };

  // Bookmark a recent journey into favorites
  const handleToggleBookmark = (journey: RecentJourney, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundService.playClick();
    const referenceId = `journey-${journey.from}-${journey.to}`.toLowerCase().replace(/\s+/g, '-');
    const favCategory = (journey.category === 'multi-modal' ? 'college' : journey.category) || 'college';
    store.toggleFavorite({
      type: 'route',
      title: `${journey.from} → ${journey.to}`,
      subtitle: journey.primaryRoute || 'Saved Transit Journey',
      referenceId,
      category: favCategory,
    });
    showToast(store.isFavorite(referenceId) ? 'Route saved to Bookmarked Favorites ⭐' : 'Removed from Bookmarked Favorites');
  };

  // Check if a journey route is already bookmarked
  const isJourneyBookmarked = (journey: RecentJourney) => {
    const referenceId = `journey-${journey.from}-${journey.to}`.toLowerCase().replace(/\s+/g, '-');
    return store.isFavorite(referenceId);
  };

  // Filtered recent journeys
  const filteredJourneys = useMemo(() => {
    return recentJourneys.filter((j) => {
      // Category filter
      if (journeyFilter !== 'all' && j.category !== journeyFilter) {
        return false;
      }
      // Text search query
      if (journeySearchQuery.trim()) {
        const q = journeySearchQuery.toLowerCase();
        const matchesFrom = j.from.toLowerCase().includes(q);
        const matchesTo = j.to.toLowerCase().includes(q);
        const matchesRoute = j.primaryRoute?.toLowerCase().includes(q) || false;
        return matchesFrom || matchesTo || matchesRoute;
      }
      return true;
    });
  }, [recentJourneys, journeyFilter, journeySearchQuery]);

  const myReports = reports.filter((r) => r.studentId === user.studentId);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel-glow px-4 py-2.5 rounded-2xl border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Profile Header */}
      <div className="vesper-card p-6 sm:p-8 rounded-3xl border border-white/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#1a1a1a] via-[#2c2c2c] to-[#454545] flex items-center justify-center text-white font-extrabold text-2xl sm:text-3xl shadow-xl border border-white/20">
              {user.fullName.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-normal bg-white/[0.06] text-gray-200 border border-white/15 backdrop-blur-md">
                  {user.role === 'admin' ? 'Campus Administrator' : 'Joy University Student'}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {user.studentId}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white leading-tight">
                {user.fullName}
              </h1>
              <p className="text-sm text-gray-400">
                {user.department} • {user.year}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onRestartTutorial}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-white" />
              <span>Restart App Tutorial</span>
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold vesper-btn-solid"
            >
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 transition-all"
              >
                <LogOut className="w-3.5 h-3.5 text-gray-400" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Profile details updated successfully!</span>
          </div>
        )}
      </div>

      {/* Profile Edit or Info Grid */}
      {isEditing ? (
        <form onSubmit={handleSave} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h2 className="text-lg font-bold font-heading text-white mb-2">Edit Student Profile</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                Academic Year
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                Preferred Campus Destination
              </label>
              <input
                type="text"
                value={preferredDest}
                onChange={(e) => setPreferredDest(e.target.value)}
                className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                placeholder="e.g. Nagercoil, Vallioor, Mathaganeri"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                placeholder="+91..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-md shadow-purple-600/30"
            >
              Save Profile
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Campus Affiliation
            </span>
            <div className="text-white font-bold text-base flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-400" />
              <span>{user.college}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Joy University Campus Transit Registered</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Primary Destination
            </span>
            <div className="text-white font-bold text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>{user.preferredDestination || 'Nagercoil'}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Bus 15, 38K, 7D corridor</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Registered Email
            </span>
            <div className="text-white font-bold text-base flex items-center gap-2 truncate">
              <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Joy University Account Active</p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RECENT JOURNEYS SECTION                                                   */}
      {/* Tracks and displays previously searched transit routes from app state      */}
      {/* ========================================================================= */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/20 space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/25 to-purple-500/25 text-cyan-300 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/10 flex-shrink-0">
              <History className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-heading text-white">
                  Recent Journeys
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {recentJourneys.length} Tracked
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                Previously searched transit routes, connections, and calculated timetables from your app session.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            <button
              onClick={() => onNavigateToTab('route')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/25 transition-all"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Plan New Journey</span>
            </button>

            {recentJourneys.length > 0 && (
              isConfirmingClearAll ? (
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-rose-500/40">
                  <span className="text-[11px] text-rose-300 px-2 font-medium">Clear all?</span>
                  <button
                    onClick={handleClearAllJourneys}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setIsConfirmingClearAll(false)}
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 text-[11px] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsConfirmingClearAll(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-rose-300 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/25 transition-all"
                  title="Clear all search history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear History</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Filter and Search Bar */}
        {recentJourneys.length > 0 && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-white/10 relative z-10">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {(
                [
                  { id: 'all', label: 'All Modes' },
                  { id: 'college', label: 'Campus Buses' },
                  { id: 'regional', label: 'Regional Feeders' },
                  { id: 'state', label: 'State Express' },
                  { id: 'railways', label: 'Railways' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundService.playClick();
                    setJourneyFilter(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    journeyFilter === cat.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                      : 'bg-black/30 text-gray-400 border-white/5 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Quick search input */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter recent searches..."
                value={journeySearchQuery}
                onChange={(e) => setJourneySearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              {journeySearchQuery && (
                <button
                  onClick={() => setJourneySearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        )}

        {/* Recent Journeys Grid */}
        {recentJourneys.length === 0 ? (
          <div className="p-10 text-center bg-black/30 rounded-3xl border border-white/5 relative z-10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mx-auto">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No Recent Journeys Recorded</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                Whenever you search for routes or calculate connections in the Journey Planner, they will automatically appear here for rapid one-click re-searching.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('route')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/30 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Plan Your First Journey</span>
            </button>
          </div>
        ) : filteredJourneys.length === 0 ? (
          <div className="p-8 text-center bg-black/30 rounded-2xl border border-white/5 text-xs text-gray-400">
            No recent journeys match the selected filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            {filteredJourneys.map((journey) => {
              const bookmarked = isJourneyBookmarked(journey);

              return (
                <div
                  key={journey.id}
                  onClick={() => handleSearchAgain(journey)}
                  className="glass-panel-subtle p-5 rounded-2xl border border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.04] transition-all cursor-pointer group flex flex-col justify-between space-y-3 shadow-lg"
                >
                  {/* Top Bar: Mode Badge & Timestamp */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        journey.category === 'college'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          : journey.category === 'regional'
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                          : journey.category === 'state'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : journey.category === 'railways'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                          : 'bg-white/10 text-gray-300 border-white/20'
                      }`}>
                        {journey.category === 'college'
                          ? 'Campus Corridor'
                          : journey.category === 'regional'
                          ? 'Regional Feeder'
                          : journey.category === 'state'
                          ? 'State Express'
                          : journey.category === 'railways'
                          ? 'Southern Railway'
                          : 'Multi-Modal Route'}
                      </span>

                      {journey.preferredMode && (
                        <span className="text-[10px] text-gray-400 hidden sm:inline capitalize">
                          • {journey.preferredMode.replace('_', ' ')}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span>{journey.timestamp}</span>
                    </div>
                  </div>

                  {/* Route Trajectory (FROM → TO) */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50 flex-shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] text-gray-400 uppercase font-semibold block">Origin</span>
                        <span className="text-xs sm:text-sm font-bold text-white truncate block">
                          {journey.from}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pl-1">
                      <div className="w-0.5 h-4 bg-gradient-to-b from-cyan-400 via-purple-400 to-pink-500 ml-[3px]" />
                      <div className="flex items-center gap-1.5 text-[10px] text-purple-300 font-semibold bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                        <ArrowRight className="w-3 h-3 text-purple-400" />
                        <span>Transit Corridor</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-sm shadow-pink-500/50 flex-shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] text-gray-400 uppercase font-semibold block">Destination</span>
                        <span className="text-xs sm:text-sm font-bold text-cyan-300 group-hover:text-cyan-200 truncate block">
                          {journey.to}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats and Primary Route */}
                  <div className="space-y-1.5 text-xs text-gray-300 pt-1">
                    {journey.primaryRoute && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Primary Service:</span>
                        <span className="font-semibold text-white truncate max-w-[200px] text-right">
                          {journey.primaryRoute}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        {journey.estimatedDuration && (
                          <span>⏱️ {journey.estimatedDuration}</span>
                        )}
                        {journey.estimatedCost && (
                          <span className="text-amber-300 font-medium">🏷️ {journey.estimatedCost}</span>
                        )}
                      </div>
                      {journey.matchingRoutesCount && (
                        <span className="text-gray-400">{journey.matchingRoutesCount} option(s)</span>
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <button
                      onClick={() => handleSearchAgain(journey)}
                      className="flex items-center gap-1 text-cyan-400 group-hover:text-cyan-300 font-semibold transition-colors"
                      title="Re-open this search in Route Planner"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Re-plan / View Options</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* Bookmark button */}
                      <button
                        onClick={(e) => handleToggleBookmark(journey, e)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          bookmarked 
                            ? 'text-amber-400 bg-amber-500/20' 
                            : 'text-gray-400 hover:text-amber-400 hover:bg-white/10'
                        }`}
                        title={bookmarked ? 'Remove from favorites' : 'Bookmark route in profile'}
                      >
                        <Star className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={(e) => handleDeleteJourney(journey.id, e)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remove from history"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bookmarked Favorites Section */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-white">
                My Bookmarked Favorites
              </h2>
              <p className="text-xs text-gray-400">
                Quick access to preferred buses, train stations, and destinations.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {favorites.length} Saved
          </span>
        </div>

        {favorites.length === 0 ? (
          <div className="p-8 text-center bg-black/30 rounded-2xl border border-white/5">
            <Star className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-xs text-gray-400">
              No favorites saved yet. Click the star icon (⭐) on any bus, train, or recent journey card to bookmark it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {favorites.map((fav) => (
              <div
                key={fav.id}
                className="glass-panel-subtle p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-3 group hover:border-amber-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300 flex-shrink-0">
                    {fav.type === 'bus' ? (
                      <Bus className="w-5 h-5" />
                    ) : fav.type === 'train' ? (
                      <Train className="w-5 h-5" />
                    ) : fav.type === 'route' ? (
                      <Navigation className="w-5 h-5 text-cyan-300" />
                    ) : (
                      <MapPin className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {fav.title}
                    </h4>
                    <p className="text-[11px] text-gray-400">{fav.subtitle}</p>
                  </div>
                </div>

                <button
                  onClick={() => store.toggleFavorite(fav)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Remove favorite"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Student Transport Reports History */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-white">
                My Transport Reports
              </h2>
              <p className="text-xs text-gray-400">
                Tracking status of issues reported to campus transport operations.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {myReports.length} Submitted
          </span>
        </div>

        {myReports.length === 0 ? (
          <div className="p-8 text-center bg-black/30 rounded-2xl border border-white/5">
            <p className="text-xs text-gray-400">
              You haven't submitted any transport reports yet. Use the "Submit Report" button to alert operations about delays or delays.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {myReports.map((report) => (
              <div
                key={report.id}
                className="glass-panel-subtle p-4 rounded-2xl border border-white/10 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {report.issueType}
                      </span>
                      {report.busOrTrainNumber && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300">
                          Route: {report.busOrTrainNumber}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400">
                      Filed on {report.createdAt}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      report.status === 'Resolved'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : report.status === 'Investigating'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-gray-700/50 text-gray-300'
                    }`}
                  >
                    {report.status}
                  </span>
                </div>

                <p className="text-xs text-gray-300 bg-black/40 p-2.5 rounded-xl border border-white/5">
                  {report.description}
                </p>

                {report.adminNote && (
                  <div className="text-xs text-cyan-300 bg-cyan-950/30 p-2 rounded-xl border border-cyan-500/20">
                    <strong>Admin Note:</strong> {report.adminNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

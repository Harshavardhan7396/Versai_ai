import React, { useState } from 'react';
import { 
  Bus, 
  Train, 
  MapPin, 
  Clock, 
  Users, 
  Radio, 
  Navigation, 
  Bot, 
  Sparkles, 
  ArrowRight, 
  Star, 
  Phone, 
  Globe2, 
  CheckCircle2,
  Info,
  ShieldCheck,
  AlertTriangle,
  Compass,
  History,
  Bell
} from 'lucide-react';
import { 
  BusTimetableEntry, 
  TrainTimetableEntry, 
  VehicleLocation, 
  UserProfile,
  RegionalBusEntry,
  StateBusEntry 
} from '../../types';
import { INSTITUTION_INFO } from '../../data/seedData';
import { UniversalSearchBar } from '../search/UniversalSearchBar';
import { Interactive3DTransportCard } from './Interactive3DTransportCard';
import { DataTrustBadge } from '../common/DataTrustBadge';
import { soundService } from '../../services/soundService';
import { store } from '../../services/store';

interface StudentDashboardProps {
  user: UserProfile;
  buses: BusTimetableEntry[];
  trains: TrainTimetableEntry[];
  vehicles: VehicleLocation[];
  regionalBuses: RegionalBusEntry[];
  stateBuses: StateBusEntry[];
  onNavigateTab: (tab: string) => void;
  onOpenReportModal: () => void;
  onOpenChat: () => void;
  onSearchSelect?: (destination: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  buses,
  trains,
  vehicles,
  regionalBuses,
  stateBuses,
  onNavigateTab,
  onOpenReportModal,
  onOpenChat,
  onSearchSelect,
}) => {
  const nextBus = buses[0] || null;
  const nextTrain = trains[0] || null;
  const favorites = store.getFavorites();
  const recentJourneys = store.getRecentJourneys();
  const notifications = store.getNotifications();
  const alerts = notifications.filter((n) => n.type === 'alert' || n.type === 'regional_alert');

  const handleCardExplore = (id: string) => {
    soundService.playWhoosh();
    if (id === 'chat') {
      onOpenChat();
    } else {
      onNavigateTab(id);
    }
  };

  const handleSearchResult = (category: string, item: unknown) => {
    if (category === 'college') {
      onNavigateTab('buses');
    } else if (category === 'regional') {
      onNavigateTab('regional');
    } else if (category === 'state') {
      onNavigateTab('state');
    } else if (category === 'train') {
      onNavigateTab('trains');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ========================================================================= */}
      {/* 10. VESPER.AI DASHBOARD HEADER BANNER                                      */}
      {/* ========================================================================= */}
      <div className="vesper-card p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-6">
            <div>
              {/* Brand & Tagline Header */}
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium bg-white/[0.06] text-gray-200 border border-white/15 backdrop-blur-md shadow-sm">
                  <Compass className="w-3.5 h-3.5 text-white animate-spin" style={{ animationDuration: '8s' }} />
                  <span>VESPER.AI TRANSPORTATION COMMAND CENTER</span>
                </span>
                <DataTrustBadge status="TIMETABLE" />
              </div>

              <h1 className="text-2xl sm:text-4xl font-medium tracking-tight text-white leading-tight">
                Welcome back to <span className="font-display italic text-[#e6e6e6]">{user.fullName.split(' ')[0]}</span>
              </h1>

              <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-400 font-light">
                <span className="text-[#e6e6e6] font-medium italic">"Your journey. Connected."</span>
                <span className="hidden sm:inline text-gray-600">•</span>
                <span className="text-gray-400">AI-powered transportation for students. Where are you going today?</span>
              </div>
            </div>

            {/* Quick Action Button to Open Vesper AI */}
            <div className="flex items-center gap-2.5 self-start md:self-auto flex-shrink-0">
              <button
                onClick={() => {
                  soundService.playClick();
                  onOpenChat();
                }}
                className="vesper-btn-solid flex items-center gap-2 text-xs sm:text-sm font-semibold"
              >
                <Bot className="w-4 h-4 text-[#111111]" />
                <span>Open Vesper AI</span>
                <Sparkles className="w-3.5 h-3.5 text-[#333333]" />
              </button>
            </div>
          </div>

          {/* Universal Search Bar */}
          <div className="pt-2">
            <UniversalSearchBar
              buses={buses}
              trains={trains}
              regionalBuses={regionalBuses}
              stateBuses={stateBuses}
              onSelectResult={handleSearchResult}
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 11 & 12. 3D GLASSMORPHISM CARDS: 6 PRIMARY TRANSPORTATION CATEGORIES      */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-white tracking-tight flex items-center gap-2">
              <span>Transportation Categories</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Select a transportation tier to explore verified routes, schedules, and connections.
            </p>
          </div>
        </div>

        {/* 3D Transport Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* CATEGORY 1: JOY UNIVERSITY TRANSPORT */}
          <Interactive3DTransportCard
            id="buses"
            categoryNumber={1}
            title="JOY UNIVERSITY TRANSPORT"
            subtitle="College buses, routes and schedules"
            description="Dedicated student bus fleet connecting Joy University campus quadrangle to Mathaganeri, Kannangulam, Vallioor, Panagudi, and Nagercoil. 22 scheduled departures from verified transport board records."
            tag="College Transit"
            statBadge="22 Departures"
            iconType="college"
            accentColor="purple"
            buttonText="EXPLORE →"
            onExplore={handleCardExplore}
          />

          {/* CATEGORY 2: REGIONAL TRANSPORT */}
          <Interactive3DTransportCard
            id="regional"
            categoryNumber={2}
            title="REGIONAL TRANSPORT"
            subtitle="Explore nearby transportation"
            description="Explore transportation around your city and nearby regions. TNSTC local bus routes, feeder stops, and suburban connections spanning Kanyakumari, Vallioor, Panagudi, and Tirunelveli corridors."
            tag="Local & Regional"
            statBadge="5 Regional Routes"
            iconType="regional"
            accentColor="indigo"
            buttonText="EXPLORE →"
            onExplore={handleCardExplore}
          />

          {/* CATEGORY 3: STATE TRANSPORT */}
          <Interactive3DTransportCard
            id="state"
            categoryNumber={3}
            title="STATE TRANSPORT"
            subtitle="Explore Tamil Nadu transportation"
            description="Explore state-level bus transportation across Tamil Nadu. Intercity Super Deluxe, Ultra Deluxe, and AC Sleeper services connecting Nagercoil Central (Vadasery) and Kanyakumari to Madurai, Trichy, Coimbatore, and Chennai."
            tag="State Express"
            statBadge="State-wide Corridors"
            iconType="state"
            accentColor="emerald"
            buttonText="EXPLORE →"
            onExplore={handleCardExplore}
          />

          {/* CATEGORY 4: RAILWAYS */}
          <Interactive3DTransportCard
            id="trains"
            categoryNumber={4}
            title="RAILWAYS"
            subtitle="Explore trains and railway stations"
            description="Explore railway stations, express trains, and timetables. Verified departures from Kanyakumari (CAPE) and Nagercoil Junction (NCJ) connecting to Howrah, Mumbai, Bengaluru, Chennai, and Pune."
            tag="Southern Railway"
            statBadge="16 Express Trains"
            iconType="railways"
            accentColor="cyan"
            buttonText="EXPLORE →"
            onExplore={handleCardExplore}
          />

          {/* CATEGORY 5: JOURNEY PLANNER */}
          <Interactive3DTransportCard
            id="route"
            categoryNumber={5}
            title="JOURNEY PLANNER"
            subtitle="Plan your journey across modes"
            description="Plan your route from where you are to where you need to go. Combines college buses, local feeders, state express buses, and regional trains with step-by-step transfer instructions."
            tag="Multi-Modal Engine"
            statBadge="Instant Optimization"
            iconType="planner"
            accentColor="purple"
            buttonText="PLAN →"
            onExplore={handleCardExplore}
          />

          {/* CATEGORY 6: VESPER AI ASSISTANT */}
          <Interactive3DTransportCard
            id="chat"
            categoryNumber={6}
            title="VESPER AI"
            subtitle="Your intelligent transportation assistant"
            description="Consult Vesper AI for timetable lookups, fastest route queries, rail schedules, and real-time guidance grounded strictly in verified institutional timetable records."
            tag="AI Intelligence"
            statBadge="Always Active"
            iconType="ai"
            accentColor="cyan"
            buttonText="OPEN AI →"
            onExplore={handleCardExplore}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 18. QUICK STATUS CARDS: NEXT BUS, NEXT TRAIN, CROWD, FAVORITES, JOURNEYS  */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
          Operational Status & Quick Access
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: NEXT BUS */}
          <div 
            onClick={() => {
              soundService.playClick();
              onNavigateTab('buses');
            }}
            className="vesper-card p-4 rounded-2xl border border-white/10 hover:border-white/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                <Bus className="w-3.5 h-3.5 text-white" />
                <span>NEXT BUS</span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono">Quad 2</span>
            </div>
            {nextBus ? (
              <div>
                <div className="text-base font-bold text-white group-hover:text-[#e6e6e6] transition-colors">
                  Bus {nextBus.busNumber} → {nextBus.destination}
                </div>
                <div className="text-xs font-mono font-bold text-gray-300 mt-0.5">
                  {nextBus.time} ({nextBus.timeOfDay})
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400">No scheduled departures</p>
            )}
          </div>

          {/* Card 2: NEXT TRAIN */}
          <div 
            onClick={() => {
              soundService.playClick();
              onNavigateTab('trains');
            }}
            className="vesper-card p-4 rounded-2xl border border-white/10 hover:border-white/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                <Train className="w-3.5 h-3.5 text-white" />
                <span>NEXT TRAIN</span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono">CAPE / NCJ</span>
            </div>
            {nextTrain ? (
              <div>
                <div className="text-base font-bold text-white group-hover:text-[#e6e6e6] transition-colors truncate">
                  {nextTrain.trainName}
                </div>
                <div className="text-xs font-mono font-bold text-gray-300 mt-0.5">
                  {nextTrain.departureStation} @ {nextTrain.departureTime}
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400">No scheduled trains</p>
            )}
          </div>

          {/* Card 3: LIVE VEHICLES & CROWD STATUS */}
          <div 
            onClick={() => {
              soundService.playClick();
              onNavigateTab('map');
            }}
            className="vesper-card p-4 rounded-2xl border border-white/10 hover:border-white/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-white" />
                <span>LIVE VEHICLES</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-gray-200 border border-white/15 font-mono">
                DEMO DATA
              </span>
            </div>
            <div className="text-base font-bold text-white">
              {vehicles.length} Monitored Units
            </div>
            <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-2">
              <span>Crowd:</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.06] text-gray-200 border border-white/15">
                MODERATE
              </span>
            </div>
          </div>

          {/* Card 4: MY FAVORITES & RECENT SEARCHES */}
          <div 
            onClick={() => {
              soundService.playClick();
              onNavigateTab('profile');
            }}
            className="vesper-card p-4 rounded-2xl border border-white/10 hover:border-white/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-white" />
                <span>MY FAVORITES</span>
              </span>
              <span className="text-[10px] text-gray-300 font-mono">
                {favorites.length} Saved
              </span>
            </div>
            <div className="text-base font-bold text-white truncate">
              {recentJourneys[0] ? `${recentJourneys[0].from} → ${recentJourneys[0].to}` : 'Saved Transit Routes'}
            </div>
            <p className="text-[11px] text-gray-400 mt-1 truncate">
              {recentJourneys.length} recent journey search(es)
            </p>
          </div>
        </div>
      </div>

      {/* University Contact Helpline & Info */}
      <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-center text-xs text-gray-300 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-white" />
          <span>Joy University Campus Transit Board Helpline: <strong className="text-white">{INSTITUTION_INFO.contacts.join(' • ')}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <span>Official Portal: {INSTITUTION_INFO.website}</span>
        </div>
      </div>
    </div>
  );
};

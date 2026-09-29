import {
  BusTimetableEntry,
  TrainTimetableEntry,
  VehicleLocation,
  StudentReport,
  AppNotification,
  FavoriteItem,
  UserProfile,
  CrowdLevel,
  ReportStatus,
  ReportIssueType,
  RegionalBusEntry,
  StateBusEntry,
  TransportSource,
  JourneyPlanOption,
  RecentJourney
} from '../types';
import {
  INITIAL_BUSES,
  INITIAL_KANYAKUMARI_TRAINS,
  INITIAL_NAGERCOIL_TRAINS,
  INITIAL_VEHICLES,
  INITIAL_NOTIFICATIONS,
  INSTITUTION_INFO
} from '../data/seedData';
import {
  INITIAL_DATA_SOURCES,
  INITIAL_REGIONAL_BUSES,
  INITIAL_STATE_BUSES,
  SAMPLE_JOURNEY_PLANS
} from '../data/regionalStateData';
import { authService, DEMO_STUDENT_USER, DEMO_ADMIN_USER } from './auth';

const STORAGE_KEYS = {
  USER: 'student_transit_user',
  BUSES: 'student_transit_buses',
  REGIONAL_BUSES: 'student_transit_regional_buses',
  STATE_BUSES: 'student_transit_state_buses',
  DATA_SOURCES: 'student_transit_data_sources',
  TRAINS: 'student_transit_trains',
  VEHICLES: 'student_transit_vehicles',
  REPORTS: 'student_transit_reports',
  NOTIFICATIONS: 'student_transit_notifications',
  FAVORITES: 'student_transit_favorites',
  RECENT_JOURNEYS: 'student_transit_recent_journeys',
  APP_SETTINGS: 'student_transit_settings',
};

// Initial Seed Recent Journeys History
export const INITIAL_RECENT_JOURNEYS: RecentJourney[] = [
  {
    id: 'rec-j-1',
    from: 'Joy University (Vadakkankulam)',
    to: 'Nagercoil',
    timestamp: 'Today at 08:15 AM',
    searchedAt: Date.now() - 1000 * 60 * 45,
    date: new Date().toISOString().split('T')[0],
    time: '08:30 AM',
    preferredMode: 'fastest',
    primaryRoute: 'Campus Bus 15 (Direct Corridor)',
    category: 'college',
    estimatedDuration: '45 mins',
    estimatedCost: 'Campus Pass / Free',
    matchingRoutesCount: 4,
  },
  {
    id: 'rec-j-2',
    from: 'Joy University (Vadakkankulam)',
    to: 'Vallioor Junction',
    timestamp: 'Today at 07:10 AM',
    searchedAt: Date.now() - 1000 * 60 * 120,
    date: new Date().toISOString().split('T')[0],
    time: '07:15 AM',
    preferredMode: 'fewest_transfers',
    primaryRoute: 'Campus Bus 17D',
    category: 'college',
    estimatedDuration: '25 mins',
    estimatedCost: 'Campus Pass / Free',
    matchingRoutesCount: 3,
  },
  {
    id: 'rec-j-3',
    from: 'Nagercoil Central (Vadasery)',
    to: 'Chennai (KCBT / Central)',
    timestamp: 'Yesterday at 06:40 PM',
    searchedAt: Date.now() - 1000 * 60 * 60 * 22,
    date: '2026-09-27',
    time: '07:00 PM',
    preferredMode: 'fastest',
    primaryRoute: 'SETC Ultra Deluxe Express',
    category: 'state',
    estimatedDuration: '11h 45m',
    estimatedCost: '₹680 - ₹850',
    matchingRoutesCount: 2,
  },
  {
    id: 'rec-j-4',
    from: 'Kanyakumari (CAPE)',
    to: 'Joy University (Vadakkankulam)',
    timestamp: '2 days ago',
    searchedAt: Date.now() - 1000 * 60 * 60 * 48,
    date: '2026-09-26',
    time: '09:00 AM',
    preferredMode: 'lowest_cost',
    primaryRoute: 'TNSTC Route 11A + Route 5A Feeder',
    category: 'regional',
    estimatedDuration: '55 mins',
    estimatedCost: '₹35',
    matchingRoutesCount: 2,
  },
];

// Default Student profile
export const DEFAULT_STUDENT_USER: UserProfile = {
  id: 'usr-student-01',
  studentId: 'JU2024CS042',
  fullName: 'Arun Kumar',
  email: 'arun.k@joyuniversity.edu.in',
  college: 'Joy University',
  department: 'Computer Science & Engineering',
  year: '3rd Year (B.Tech)',
  role: 'student',
  hasCompletedTutorial: false,
  preferredDestination: 'Nagercoil',
  phone: '+91 98765 43210',
};

// Default Admin profile
export const DEFAULT_ADMIN_USER: UserProfile = {
  id: 'usr-admin-01',
  studentId: 'ADM-JU-001',
  fullName: 'Prof. S. Ramanathan',
  email: 'admin@joyuniversity.edu.in',
  college: 'Joy University',
  department: 'Campus Transport Operations & Logistics',
  year: 'Faculty Administrator',
  role: 'admin',
  hasCompletedTutorial: true,
  phone: '7029 200 200',
};

// Initial Reports
const INITIAL_REPORTS: StudentReport[] = [
  {
    id: 'rep-01',
    studentId: 'JU2024CS042',
    studentName: 'Arun Kumar',
    issueType: 'Crowded bus',
    busOrTrainNumber: '15',
    destination: 'Nagercoil',
    description: 'High evening rush at 04:15 PM slot near main quadrangle. Please consider extra shuttle.',
    status: 'Investigating',
    adminNote: 'Operations team is monitoring seat availability for upcoming semester timetable.',
    createdAt: '2026-09-25 16:30',
    updatedAt: '2026-09-26 09:15',
  },
  {
    id: 'rep-02',
    studentId: 'JU2024EC018',
    studentName: 'Priya Sundaram',
    issueType: 'Route problem',
    busOrTrainNumber: '17D',
    destination: 'Mathaganeri',
    description: 'Road works on southern connecting highway. Bus delayed by 10 mins during morning loop.',
    status: 'Resolved',
    adminNote: 'Temporary diversion active; drivers notified.',
    createdAt: '2026-09-24 07:45',
    updatedAt: '2026-09-24 14:00',
  },
];

// Helper to safely read from localStorage
function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

// Helper to safely write to localStorage
function writeStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Storage write error:', err);
  }
}

export class TransitStore {
  private static instance: TransitStore;

  private user: UserProfile;
  private buses: BusTimetableEntry[];
  private regionalBuses: RegionalBusEntry[];
  private stateBuses: StateBusEntry[];
  private dataSources: TransportSource[];
  private journeyPlans: JourneyPlanOption[];
  private trains: TrainTimetableEntry[];
  private vehicles: VehicleLocation[];
  private reports: StudentReport[];
  private notifications: AppNotification[];
  private favorites: FavoriteItem[];
  private recentJourneys: RecentJourney[];
  private activeJourneyQuery: { from: string; to: string } | null = null;
  private listeners: Set<() => void> = new Set();

  private constructor() {
    const currentAuthUser = authService.getCurrentUser();
    this.user = currentAuthUser || readStorage<UserProfile>(STORAGE_KEYS.USER, DEFAULT_STUDENT_USER);
    this.buses = readStorage<BusTimetableEntry[]>(STORAGE_KEYS.BUSES, INITIAL_BUSES);
    this.regionalBuses = readStorage<RegionalBusEntry[]>(STORAGE_KEYS.REGIONAL_BUSES, INITIAL_REGIONAL_BUSES);
    this.stateBuses = readStorage<StateBusEntry[]>(STORAGE_KEYS.STATE_BUSES, INITIAL_STATE_BUSES);
    this.dataSources = readStorage<TransportSource[]>(STORAGE_KEYS.DATA_SOURCES, INITIAL_DATA_SOURCES);
    this.journeyPlans = SAMPLE_JOURNEY_PLANS;
    
    const combinedTrains = [...INITIAL_KANYAKUMARI_TRAINS, ...INITIAL_NAGERCOIL_TRAINS];
    this.trains = readStorage<TrainTimetableEntry[]>(STORAGE_KEYS.TRAINS, combinedTrains);
    this.vehicles = readStorage<VehicleLocation[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    this.reports = readStorage<StudentReport[]>(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
    this.notifications = readStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    this.recentJourneys = readStorage<RecentJourney[]>(STORAGE_KEYS.RECENT_JOURNEYS, INITIAL_RECENT_JOURNEYS);
    this.favorites = readStorage<FavoriteItem[]>(STORAGE_KEYS.FAVORITES, [
      {
        id: 'fav-1',
        type: 'bus',
        title: 'Bus 15 → Nagercoil',
        subtitle: '04:15 PM Departure',
        referenceId: 'bus-14',
        category: 'college',
        addedAt: new Date().toISOString(),
      },
      {
        id: 'fav-2',
        type: 'station',
        title: 'Nagercoil Junction Railway Station',
        subtitle: 'NCJ Station - Connects to Express trains',
        referenceId: 'node-ncj-station',
        category: 'railways',
        addedAt: new Date().toISOString(),
      }
    ]);

    // Keep store synchronized when authService triggers logins/logouts/profile updates
    authService.subscribe((authState) => {
      if (authState.currentUser) {
        this.user = authState.currentUser;
      } else {
        this.user = DEFAULT_STUDENT_USER;
      }
      this.notify();
    });
  }

  public static getInstance(): TransitStore {
    if (!TransitStore.instance) {
      TransitStore.instance = new TransitStore();
    }
    return TransitStore.instance;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  // User & Auth Management
  public getUser(): UserProfile {
    return authService.getCurrentUser() || this.user;
  }

  public setUser(newUser: UserProfile): void {
    this.user = newUser;
    writeStorage(STORAGE_KEYS.USER, newUser);
    this.notify();
  }

  public switchRole(role: 'student' | 'admin'): void {
    if (role === 'admin') {
      authService.loginAsDemo('admin', true);
      this.user = { ...DEFAULT_ADMIN_USER };
    } else {
      authService.loginAsDemo('student', true);
      this.user = { ...DEFAULT_STUDENT_USER };
    }
    writeStorage(STORAGE_KEYS.USER, this.user);
    this.notify();
  }

  public completeTutorial(): void {
    this.user = { ...this.user, hasCompletedTutorial: true };
    writeStorage(STORAGE_KEYS.USER, this.user);
    authService.completeTutorial();
    this.notify();
  }

  public resetTutorial(): void {
    this.user = { ...this.user, hasCompletedTutorial: false };
    writeStorage(STORAGE_KEYS.USER, this.user);
    authService.resetTutorial();
    this.notify();
  }

  public updateUserProfile(updates: Partial<UserProfile>): void {
    this.user = { ...this.user, ...updates };
    writeStorage(STORAGE_KEYS.USER, this.user);
    authService.updateProfile(updates);
    this.notify();
  }

  public logout(): void {
    authService.logout();
    this.user = DEFAULT_STUDENT_USER;
    this.notify();
  }

  // Regional Transport Management
  public getRegionalBuses(): RegionalBusEntry[] {
    return this.regionalBuses;
  }

  public addRegionalBus(bus: Omit<RegionalBusEntry, 'id'>): void {
    const newBus: RegionalBusEntry = {
      ...bus,
      id: `reg-bus-${Date.now()}`,
    };
    this.regionalBuses = [newBus, ...this.regionalBuses];
    writeStorage(STORAGE_KEYS.REGIONAL_BUSES, this.regionalBuses);
    this.addNotification({
      title: 'Regional Route Added',
      message: `New regional route ${newBus.routeNumber} (${newBus.routeName}) has been registered.`,
      type: 'regional_alert',
      category: 'regional',
    });
    this.notify();
  }

  public updateRegionalBus(id: string, updates: Partial<RegionalBusEntry>): void {
    this.regionalBuses = this.regionalBuses.map((b) => (b.id === id ? { ...b, ...updates } : b));
    writeStorage(STORAGE_KEYS.REGIONAL_BUSES, this.regionalBuses);
    this.notify();
  }

  public deleteRegionalBus(id: string): void {
    this.regionalBuses = this.regionalBuses.filter((b) => b.id !== id);
    writeStorage(STORAGE_KEYS.REGIONAL_BUSES, this.regionalBuses);
    this.notify();
  }

  // State Transport Management
  public getStateBuses(): StateBusEntry[] {
    return this.stateBuses;
  }

  public addStateBus(bus: Omit<StateBusEntry, 'id'>): void {
    const newBus: StateBusEntry = {
      ...bus,
      id: `state-bus-${Date.now()}`,
    };
    this.stateBuses = [newBus, ...this.stateBuses];
    writeStorage(STORAGE_KEYS.STATE_BUSES, this.stateBuses);
    this.addNotification({
      title: 'State Express Bus Added',
      message: `New state bus route ${newBus.routeName} is now live in the directory.`,
      type: 'timetable_update',
      category: 'state',
    });
    this.notify();
  }

  public updateStateBus(id: string, updates: Partial<StateBusEntry>): void {
    this.stateBuses = this.stateBuses.map((b) => (b.id === id ? { ...b, ...updates } : b));
    writeStorage(STORAGE_KEYS.STATE_BUSES, this.stateBuses);
    this.notify();
  }

  public deleteStateBus(id: string): void {
    this.stateBuses = this.stateBuses.filter((b) => b.id !== id);
    writeStorage(STORAGE_KEYS.STATE_BUSES, this.stateBuses);
    this.notify();
  }

  // Transport Data Source Management (Section 27)
  public getDataSources(): TransportSource[] {
    return this.dataSources;
  }

  public updateDataSource(id: string, updates: Partial<TransportSource>): void {
    this.dataSources = this.dataSources.map((s) => (s.id === id ? { ...s, ...updates, last_checked: 'Just now' } : s));
    writeStorage(STORAGE_KEYS.DATA_SOURCES, this.dataSources);
    this.notify();
  }

  public addDataSource(source: Omit<TransportSource, 'id' | 'last_checked'> & { last_checked?: string }): void {
    const newSource: TransportSource = {
      ...source,
      id: `src-${Date.now()}`,
      last_checked: source.last_checked || 'Just now',
    };
    this.dataSources = [newSource, ...this.dataSources];
    writeStorage(STORAGE_KEYS.DATA_SOURCES, this.dataSources);
    this.notify();
  }

  // Journey Plans
  public getJourneyPlans(): JourneyPlanOption[] {
    return this.journeyPlans;
  }

  // Bus Management
  public getBuses(): BusTimetableEntry[] {
    return this.buses;
  }

  public addBus(bus: Omit<BusTimetableEntry, 'id'>): void {
    const newBus: BusTimetableEntry = {
      ...bus,
      id: `bus-${Date.now()}`,
      status: 'TIMETABLE DATA',
      lastUpdated: new Date().toLocaleDateString(),
    };
    this.buses = [newBus, ...this.buses];
    writeStorage(STORAGE_KEYS.BUSES, this.buses);
    this.addNotification({
      title: 'Timetable Updated',
      message: `New bus route ${newBus.busNumber} to ${newBus.destination} has been added.`,
      type: 'timetable_update',
    });
    this.notify();
  }

  public updateBus(id: string, updates: Partial<BusTimetableEntry>): void {
    this.buses = this.buses.map((b) => (b.id === id ? { ...b, ...updates, lastUpdated: new Date().toLocaleDateString() } : b));
    writeStorage(STORAGE_KEYS.BUSES, this.buses);
    this.notify();
  }

  public deleteBus(id: string): void {
    this.buses = this.buses.filter((b) => b.id !== id);
    writeStorage(STORAGE_KEYS.BUSES, this.buses);
    this.notify();
  }

  // Train Management
  public getTrains(): TrainTimetableEntry[] {
    return this.trains;
  }

  public getTrainsByStation(stationCode: 'CAPE' | 'NCJ'): TrainTimetableEntry[] {
    return this.trains.filter((t) => t.stationCode === stationCode);
  }

  public addTrain(train: Omit<TrainTimetableEntry, 'id'>): void {
    const newTrain: TrainTimetableEntry = {
      ...train,
      id: `train-${Date.now()}`,
      status: 'TIMETABLE DATA',
    };
    this.trains = [newTrain, ...this.trains];
    writeStorage(STORAGE_KEYS.TRAINS, this.trains);
    this.notify();
  }

  public updateTrain(id: string, updates: Partial<TrainTimetableEntry>): void {
    this.trains = this.trains.map((t) => (t.id === id ? { ...t, ...updates } : t));
    writeStorage(STORAGE_KEYS.TRAINS, this.trains);
    this.notify();
  }

  public deleteTrain(id: string): void {
    this.trains = this.trains.filter((t) => t.id !== id);
    writeStorage(STORAGE_KEYS.TRAINS, this.trains);
    this.notify();
  }

  // Vehicles for Map
  public getVehicles(): VehicleLocation[] {
    return this.vehicles;
  }

  public updateVehicleLocation(id: string, updates: Partial<VehicleLocation>): void {
    this.vehicles = this.vehicles.map((v) =>
      v.id === id ? { ...v, ...updates, lastUpdated: 'Manually updated by Admin' } : v
    );
    writeStorage(STORAGE_KEYS.VEHICLES, this.vehicles);
    this.notify();
  }

  // Reports
  public getReports(): StudentReport[] {
    return this.reports;
  }

  public addReport(issue: {
    issueType: ReportIssueType;
    busOrTrainNumber?: string;
    destination?: string;
    description: string;
  }): void {
    const newReport: StudentReport = {
      id: `rep-${Date.now()}`,
      studentId: this.user.studentId,
      studentName: this.user.fullName,
      issueType: issue.issueType,
      busOrTrainNumber: issue.busOrTrainNumber,
      destination: issue.destination,
      description: issue.description,
      status: 'Pending',
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
    };
    this.reports = [newReport, ...this.reports];
    writeStorage(STORAGE_KEYS.REPORTS, this.reports);
    this.addNotification({
      title: 'Report Submitted',
      message: `Your transport report #${newReport.id} is queued for operational review.`,
      type: 'report_update',
    });
    this.notify();
  }

  public updateReportStatus(id: string, status: ReportStatus, adminNote?: string): void {
    this.reports = this.reports.map((r) =>
      r.id === id
        ? {
            ...r,
            status,
            adminNote: adminNote !== undefined ? adminNote : r.adminNote,
            updatedAt: new Date().toLocaleString(),
          }
        : r
    );
    writeStorage(STORAGE_KEYS.REPORTS, this.reports);
    this.addNotification({
      title: 'Report Status Updated',
      message: `Report #${id} status changed to ${status}.`,
      type: 'report_update',
    });
    this.notify();
  }

  // Notifications
  public getNotifications(): AppNotification[] {
    return this.notifications;
  }

  public addNotification(notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>): void {
    const newNotif: AppNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false,
    };
    this.notifications = [newNotif, ...this.notifications];
    writeStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  public markNotificationRead(id: string): void {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    writeStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  public markAllNotificationsRead(): void {
    this.notifications = this.notifications.map((n) => ({ ...n, isRead: true }));
    writeStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  // Favorites
  public getFavorites(): FavoriteItem[] {
    return this.favorites;
  }

  public isFavorite(referenceId: string): boolean {
    return this.favorites.some((f) => f.referenceId === referenceId);
  }

  public addFavorite(item: Omit<FavoriteItem, 'id' | 'addedAt'>): void {
    if (!this.isFavorite(item.referenceId)) {
      this.toggleFavorite(item);
    }
  }

  public toggleFavorite(item: Omit<FavoriteItem, 'id' | 'addedAt'>): void {
    const existing = this.favorites.find((f) => f.referenceId === item.referenceId);
    if (existing) {
      this.favorites = this.favorites.filter((f) => f.referenceId !== item.referenceId);
    } else {
      const newFav: FavoriteItem = {
        ...item,
        id: `fav-${Date.now()}`,
        addedAt: new Date().toISOString(),
      };
      this.favorites = [newFav, ...this.favorites];
    }
    writeStorage(STORAGE_KEYS.FAVORITES, this.favorites);
    this.notify();
  }

  // Recent Searched Journeys Management
  public getRecentJourneys(): RecentJourney[] {
    return this.recentJourneys;
  }

  public addRecentJourney(
    journey: Omit<RecentJourney, 'id' | 'searchedAt' | 'timestamp'> & { 
      timestamp?: string; 
      id?: string;
    }
  ): RecentJourney {
    const now = Date.now();
    const formatTime = () => {
      const date = new Date();
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
      return `Today at ${formattedHours}:${minutes} ${ampm}`;
    };

    const newJourney: RecentJourney = {
      ...journey,
      id: journey.id || `rec-j-${now}`,
      searchedAt: now,
      timestamp: journey.timestamp || formatTime(),
    };

    // Filter out identical from->to to avoid repetitive duplicates at the top
    const filtered = this.recentJourneys.filter(
      (j) => !(j.from.toLowerCase() === newJourney.from.toLowerCase() && j.to.toLowerCase() === newJourney.to.toLowerCase())
    );

    // Keep up to 25 items
    this.recentJourneys = [newJourney, ...filtered].slice(0, 25);
    writeStorage(STORAGE_KEYS.RECENT_JOURNEYS, this.recentJourneys);
    this.notify();
    return newJourney;
  }

  public deleteRecentJourney(id: string): void {
    this.recentJourneys = this.recentJourneys.filter((j) => j.id !== id);
    writeStorage(STORAGE_KEYS.RECENT_JOURNEYS, this.recentJourneys);
    this.notify();
  }

  public clearRecentJourneys(): void {
    this.recentJourneys = [];
    writeStorage(STORAGE_KEYS.RECENT_JOURNEYS, this.recentJourneys);
    this.notify();
  }

  public getActiveJourneyQuery(): { from: string; to: string } | null {
    return this.activeJourneyQuery;
  }

  public setActiveJourneyQuery(query: { from: string; to: string } | null): void {
    this.activeJourneyQuery = query;
    this.notify();
  }

  // Reset to initial seed dataset
  public resetToFactorySeed(): void {
    this.buses = [...INITIAL_BUSES];
    this.trains = [...INITIAL_KANYAKUMARI_TRAINS, ...INITIAL_NAGERCOIL_TRAINS];
    this.vehicles = [...INITIAL_VEHICLES];
    this.notifications = [...INITIAL_NOTIFICATIONS];
    writeStorage(STORAGE_KEYS.BUSES, this.buses);
    writeStorage(STORAGE_KEYS.TRAINS, this.trains);
    writeStorage(STORAGE_KEYS.VEHICLES, this.vehicles);
    writeStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  // Section 27: Clean PostgreSQL / Supabase Schema Definition
  public static getSupabaseSchemaSQL(): string {
    return `-- ==============================================================
-- STUDENT TRANSIT AI - SUPABASE / POSTGRESQL PRODUCTION SCHEMA
-- Institutional Seed: Joy University (Kanyakumari / Nagercoil)
-- ==============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users & Profiles (Linked to Supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  student_id varchar(50) unique not null,
  full_name varchar(255) not null,
  email varchar(255) unique not null,
  college varchar(255) default 'Joy University',
  department varchar(255),
  year varchar(50),
  role varchar(20) default 'student' check (role in ('student', 'admin')),
  has_completed_tutorial boolean default false,
  phone varchar(30),
  preferred_destination varchar(255),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Colleges & Campuses
create table public.colleges (
  id uuid primary key default uuid_generate_v4(),
  name varchar(255) not null,
  region varchar(255) not null,
  state varchar(100) not null,
  country varchar(100) not null,
  website varchar(255),
  contacts jsonb default '["7029 200 200", "7026 422 288"]'::jsonb,
  social_handle varchar(100),
  created_at timestamp with time zone default now() not null
);

-- 3. Bus Routes & Stops
create table public.bus_stops (
  id uuid primary key default uuid_generate_v4(),
  name varchar(255) not null,
  code varchar(50),
  latitude decimal(10, 7) not null,
  longitude decimal(10, 7) not null,
  description text,
  created_at timestamp with time zone default now() not null
);

-- 4. Bus Timetable
create table public.bus_schedules (
  id uuid primary key default uuid_generate_v4(),
  bus_number varchar(50) not null,
  destination varchar(255) not null,
  departure_time time not null,
  time_of_day varchar(20) check (time_of_day in ('morning', 'afternoon', 'evening')),
  operating_days varchar(100) default 'All Days',
  status varchar(50) default 'TIMETABLE DATA',
  crowd_level varchar(30) default 'NOT AVAILABLE' check (crowd_level in ('LOW', 'MODERATE', 'HIGH', 'VERY HIGH', 'NOT AVAILABLE')),
  is_active boolean default true,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- 5. Trains & Railway Stations
create table public.train_stations (
  id uuid primary key default uuid_generate_v4(),
  station_name varchar(255) not null,
  station_code varchar(10) unique not null,
  latitude decimal(10, 7) not null,
  longitude decimal(10, 7) not null
);

create table public.train_schedules (
  id uuid primary key default uuid_generate_v4(),
  train_number varchar(20) not null,
  train_name varchar(255) not null,
  departure_station varchar(255) not null,
  station_code varchar(10) not null,
  departure_time time not null,
  operating_days varchar(100) not null,
  destination varchar(255) not null,
  status varchar(50) default 'TIMETABLE DATA',
  created_at timestamp with time zone default now() not null
);

-- 6. Vehicle Telemetry & Locations (For GPS or Demo Tracking)
create table public.vehicle_locations (
  id uuid primary key default uuid_generate_v4(),
  vehicle_number varchar(50) not null,
  vehicle_type varchar(30) check (vehicle_type in ('bus', 'train', 'shuttle')),
  route varchar(255) not null,
  destination varchar(255) not null,
  latitude decimal(10, 7) not null,
  longitude decimal(10, 7) not null,
  current_stop varchar(255),
  next_stop varchar(255),
  speed varchar(50) default 'Not available',
  eta varchar(50) default 'Not available',
  crowd varchar(30) default 'NOT AVAILABLE',
  tracking_type varchar(50) default 'DEMO TRACKING' check (tracking_type in ('DEMO TRACKING', 'LIVE TRACKING', 'DATA NOT AVAILABLE')),
  last_updated timestamp with time zone default now() not null
);

-- 7. Student Reports
create table public.student_reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  student_id varchar(50) not null,
  student_name varchar(255) not null,
  issue_type varchar(100) not null,
  bus_or_train_number varchar(50),
  destination varchar(255),
  description text not null,
  status varchar(30) default 'Pending' check (status in ('Pending', 'Investigating', 'Resolved')),
  admin_note text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- 8. Notifications & Alerts
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  title varchar(255) not null,
  message text not null,
  type varchar(50) not null,
  is_read boolean default false,
  created_at timestamp with time zone default now() not null
);

-- 9. Favorites (User Specific)
create table public.favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  item_type varchar(50) not null,
  title varchar(255) not null,
  subtitle varchar(255),
  reference_id varchar(100) not null,
  created_at timestamp with time zone default now() not null
);

-- Row Level Security (RLS) Policies
alter table public.profiles enable row level security;
alter table public.student_reports enable row level security;
alter table public.favorites enable row level security;

-- Profiles: Users can read and update their own profiles
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Admins can view and manage all tables
create policy "Admins full access to reports" on public.student_reports
  for all using (
    exists (
      select 1 from public.profiles where id = auth.uid() and role = 'admin'
    )
  );

-- Realtime publication for vehicle locations & announcements
alter publication supabase_realtime add table public.vehicle_locations;
alter publication supabase_realtime add table public.notifications;
`;
  }
}

export const store = TransitStore.getInstance();

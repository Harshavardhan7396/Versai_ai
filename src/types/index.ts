export type Role = 'student' | 'admin';

export type CrowdLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH' | 'NOT AVAILABLE';

export type DataTrustStatus = 
  | 'LIVE'
  | 'REAL-TIME'
  | 'TIMETABLE'
  | 'RECENTLY UPDATED'
  | 'ESTIMATED'
  | 'USER REPORTED'
  | 'DEMO'
  | 'UNAVAILABLE';

export type TransportStatusType = 'TIMETABLE DATA' | 'DEMO TRACKING' | 'DATA NOT AVAILABLE' | 'LIVE TRACKING';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export type TransportCategory = 
  | 'college'
  | 'regional'
  | 'state'
  | 'railways'
  | 'more';

export interface TransportSource {
  id: string;
  source_name: string;
  source_url: string;
  source_type: 'Official Portal' | 'Campus Notice Board' | 'Government Open Data' | 'Transport Operator' | 'Station Board';
  region: string;
  last_updated: string;
  last_checked: string;
  data_status: DataTrustStatus;
  status: 'Connected' | 'Manual Verified' | 'Integration in Progress' | 'Unavailable';
  reliability_score?: string; // e.g. "99.8% Verified"
}

export interface BusTimetableEntry {
  id: string;
  time: string; // e.g. "06:15 AM"
  busNumber: string; // e.g. "17D"
  destination: string; // e.g. "Mathaganeri"
  timeOfDay: TimeOfDay;
  status: TransportStatusType;
  dataStatus?: DataTrustStatus;
  sourceInfo?: {
    name: string;
    type: string;
    lastUpdated: string;
  };
  crowdLevel: CrowdLevel;
  isActive: boolean;
  notes?: string;
  operatingDays?: string; // default "Mon - Sat"
  lastUpdated?: string;
}

export interface RegionalBusEntry {
  id: string;
  routeNumber: string; // e.g. "Route 5A" or "17"
  routeName: string; // e.g. "Nagercoil to Vallioor Junction"
  from: string;
  to: string;
  viaStops: string[];
  departureTimes: string[];
  frequency: string; // e.g. "Every 30 mins"
  operatingAgency: string; // e.g. "TNSTC (Tirunelveli Region)"
  fareEstimate?: string; // e.g. "₹15 - ₹25"
  durationMinutes: number; // e.g. 45
  distanceKm?: number;
  dataStatus: DataTrustStatus;
  source: TransportSource;
  crowdLevel: CrowdLevel;
  isActive: boolean;
  region: string;
}

export interface StateBusEntry {
  id: string;
  serviceType: 'Super Deluxe' | 'Ultra Deluxe' | 'Express' | 'Point-to-Point' | 'Air Conditioned' | 'Ordinary';
  busNumber: string; // e.g. "TN-74-N-1284"
  routeName: string; // e.g. "Nagercoil Central (Vadasery) to Chennai KCBT"
  originTerminal: string;
  destinationTerminal: string;
  viaPoints: string[];
  departureTimes: string[];
  approximateFare?: string; // e.g. "₹380 - ₹620"
  durationHours: string; // e.g. "11h 30m"
  distanceKm: number;
  frequency?: string;
  dataStatus: DataTrustStatus;
  source: TransportSource;
  crowdLevel: CrowdLevel;
  bookingPortalUrl?: string; // e.g. "https://www.tnstc.in"
  isActive: boolean;
}

export interface TrainTimetableEntry {
  id: string;
  trainNumber: string; // e.g. "02666"
  trainName: string; // e.g. "Howrah SF Express"
  departureStation: 'Kanyakumari (CAPE)' | 'Nagercoil (NCJ)';
  stationCode: 'CAPE' | 'NCJ';
  departureTime: string; // e.g. "08:00 AM" or "08:00"
  operatingDays: string; // e.g. "Saturday" or "All Days"
  destination: string; // e.g. "Howrah Jn (HWH)"
  status: TransportStatusType;
  dataStatus?: DataTrustStatus;
  platform?: string;
  notes?: string;
  sourceInfo?: {
    name: string;
    lastUpdated: string;
  };
}

export interface FutureTransportItem {
  id: string;
  category: 
    | 'INTERSTATE'
    | 'NATIONAL'
    | 'PRIVATE BUS'
    | 'AIRPORT CONNECTION'
    | 'METRO'
    | 'TAXI'
    | 'AUTO'
    | 'SHUTTLE'
    | 'CARPOOL';
  title: string;
  description: string;
  hubCoverage: string;
  statusText: 'Coming Soon' | 'In Integration' | 'Architecture Ready';
  badgeColor: string;
  iconName: string;
  connectedHubs: string[];
}

export interface VehicleLocation {
  id: string;
  vehicleNumber: string;
  type: 'bus' | 'train' | 'shuttle';
  label: string;
  route: string;
  destination: string;
  lat: number;
  lng: number;
  currentStop: string;
  nextStop: string;
  speed: string; // "Not available" or demo speed
  eta: string; // "Not available"
  crowd: CrowdLevel;
  trackingType: 'DEMO TRACKING' | 'LIVE TRACKING' | 'DATA NOT AVAILABLE';
  dataStatus?: DataTrustStatus;
  source?: string;
  lastUpdated: string;
}

export interface StationNode {
  id: string;
  name: string;
  code?: string;
  type: 'college' | 'bus_stop' | 'railway_station' | 'bus_terminal';
  lat: number;
  lng: number;
  description: string;
  tier?: 'college' | 'regional' | 'state' | 'railway';
}

export type ReportIssueType = 
  | "Bus didn't arrive"
  | 'Bus delayed'
  | 'Incorrect timetable'
  | 'Crowded bus'
  | 'Incorrect vehicle location'
  | 'Train information incorrect'
  | 'Route problem'
  | 'Other';

export type ReportStatus = 'Pending' | 'Investigating' | 'Resolved';

export interface StudentReport {
  id: string;
  studentId: string;
  studentName: string;
  issueType: ReportIssueType;
  busOrTrainNumber?: string;
  destination?: string;
  category?: TransportCategory;
  description: string;
  status: ReportStatus;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'alert' | 'timetable_update' | 'report_update' | 'regional_alert';
  timestamp: string;
  isRead: boolean;
  category?: TransportCategory;
}

export interface FavoriteItem {
  id: string;
  type: 'bus' | 'train' | 'route' | 'destination' | 'station' | 'regional' | 'state';
  title: string;
  subtitle: string;
  referenceId: string;
  category?: TransportCategory;
  addedAt: string;
}

export interface RecentJourney {
  id: string;
  from: string;
  to: string;
  timestamp: string;
  searchedAt: number;
  date?: string;
  time?: string;
  preferredMode?: string;
  primaryRoute?: string;
  category?: 'college' | 'regional' | 'state' | 'railways' | 'multi-modal';
  estimatedDuration?: string;
  estimatedCost?: string;
  matchingRoutesCount?: number;
}

export interface UserProfile {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  college: string;
  department: string;
  year: string;
  role: Role;
  hasCompletedTutorial: boolean;
  preferredDestination?: string;
  phone?: string;
}

export interface InstitutionInfo {
  name: string;
  tagline: string;
  region: string;
  state: string;
  country: string;
  website: string;
  contacts: string[];
  socialHandle: string;
}

export interface JourneyPlanOption {
  id: string;
  title: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  transfersCount: number;
  modes: ('college_bus' | 'regional_bus' | 'state_bus' | 'train' | 'walk')[];
  estimatedCost?: string;
  crowdLevel: CrowdLevel;
  dataStatus: DataTrustStatus;
  source: string;
  steps: {
    mode: 'college_bus' | 'regional_bus' | 'state_bus' | 'train' | 'walk';
    instruction: string;
    from: string;
    to: string;
    duration: string;
    vehicleDetails?: string;
  }[];
}

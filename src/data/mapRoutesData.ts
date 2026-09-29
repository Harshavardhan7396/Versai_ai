import { 
  BusTimetableEntry, 
  TrainTimetableEntry, 
  RegionalBusEntry, 
  VehicleLocation, 
  StationNode, 
  CrowdLevel 
} from '../types';

export interface MapRouteWaypoint {
  name: string;
  nodeId?: string;
  isMajorHub?: boolean;
  etaFromStart?: string;
}

export interface MapRoute {
  id: string;
  routeNumber: string;
  name: string;
  type: 'campus_bus' | 'regional_bus' | 'train';
  operator: string;
  color: string;
  accentGlow: string;
  gradientId: string;
  strokeDash?: string;
  stops: MapRouteWaypoint[];
  departureSummary: string;
  frequency: string;
  distanceKm: number;
  durationMinutes: number;
  operatingHours: string;
  fare: string;
  description: string;
  activeVehicleIds: string[];
  getPathD: (lngToX: (lng: number) => number, latToY: (lat: number) => number) => string;
}

export interface StationUpcomingDeparture {
  id: string;
  time: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  serviceNumber: string;
  serviceName: string;
  destination: string;
  type: 'campus_bus' | 'train' | 'regional_bus' | 'shuttle';
  operator: string;
  routeId?: string;
  platformOrBay?: string;
  status: string;
  crowdLevel?: CrowdLevel;
  operatingDays?: string;
  notes?: string;
}

export interface StationRealtimeUpdate {
  activeVehiclesNearby: VehicleLocation[];
  crowdStatus: CrowdLevel;
  crowdNote: string;
  serviceAlert: {
    level: 'normal' | 'advisory' | 'alert';
    title: string;
    message: string;
  };
  lastSyncTime: string;
}

export const MAP_ROUTES: MapRoute[] = [
  {
    id: 'route-15',
    routeNumber: 'Route 15',
    name: 'Joy University ↔ Nagercoil Corridor',
    type: 'campus_bus',
    operator: 'Joy University Campus Transit',
    color: '#ec4899',
    accentGlow: 'rgba(236, 72, 153, 0.5)',
    gradientId: 'routeGradient15',
    stops: [
      { name: 'Joy University Campus Hub', nodeId: 'node-joy', isMajorHub: true, etaFromStart: 'Start' },
      { name: 'Azhaganeri Stop', nodeId: 'node-azhaganeri', etaFromStart: '8 mins' },
      { name: 'Kavalkinaru Junction', nodeId: 'node-kavalkinaru', etaFromStart: '18 mins' },
      { name: 'Aralvaimozhi Wind Pass', nodeId: 'node-aralvaimozhi', etaFromStart: '28 mins' },
      { name: 'Nagercoil Junction Railway Station', nodeId: 'node-ncj-station', isMajorHub: true, etaFromStart: '45 mins' },
    ],
    departureSummary: '4 Daily Direct Runs (09:00 AM, 09:30 AM, 03:50 PM, 04:30 PM)',
    frequency: 'Scheduled Campus Service',
    distanceKm: 38,
    durationMinutes: 45,
    operatingHours: '09:00 AM - 05:30 PM',
    fare: 'Campus Bus Pass / Free for Enrolled Students',
    description: 'Direct campus link connecting Joy University students to Nagercoil Junction railway station and the district headquarters.',
    activeVehicleIds: ['veh-1'],
    getPathD: (lngToX, latToY) => {
      return `M ${lngToX(77.5641)} ${latToY(8.3582)} L ${lngToX(77.5320)} ${latToY(8.3410)} L ${lngToX(77.5400)} ${latToY(8.2800)} L ${lngToX(77.5020)} ${latToY(8.2450)} L ${lngToX(77.4328)} ${latToY(8.1834)}`;
    },
  },
  {
    id: 'route-17d',
    routeNumber: 'Route 17D',
    name: 'Joy University ↔ Vallioor & Mathaganeri',
    type: 'campus_bus',
    operator: 'Joy University Campus Transit',
    color: '#a855f7',
    accentGlow: 'rgba(168, 85, 247, 0.5)',
    gradientId: 'routeGradient17d',
    stops: [
      { name: 'Joy University Campus Hub', nodeId: 'node-joy', isMajorHub: true, etaFromStart: 'Start' },
      { name: 'Vallioor Central Bus Stand', nodeId: 'node-vallioor', isMajorHub: true, etaFromStart: '15 mins' },
      { name: 'Mathaganeri Bus Stop', nodeId: 'node-mathaganeri', etaFromStart: '32 mins' },
    ],
    departureSummary: '10 Daily Departures across Morning, Afternoon & Evening',
    frequency: 'Every 45 - 60 mins peak',
    distanceKm: 28,
    durationMinutes: 35,
    operatingHours: '06:15 AM - 07:15 PM',
    fare: 'Campus Bus Pass / Free for Enrolled Students',
    description: 'High-frequency campus commuter lifeline carrying day-scholars and staff between Mathaganeri, Vallioor Central, and Joy University.',
    activeVehicleIds: ['veh-2'],
    getPathD: (lngToX, latToY) => {
      return `M ${lngToX(77.5641)} ${latToY(8.3582)} L ${lngToX(77.6147)} ${latToY(8.3789)} L ${lngToX(77.6120)} ${latToY(8.3245)}`;
    },
  },
  {
    id: 'route-17f',
    routeNumber: 'Route 17F',
    name: 'Joy University ↔ Panagudi & Kannangulam',
    type: 'campus_bus',
    operator: 'Joy University Campus Transit',
    color: '#06b6d4',
    accentGlow: 'rgba(6, 182, 212, 0.5)',
    gradientId: 'routeGradient17f',
    strokeDash: '5 3',
    stops: [
      { name: 'Joy University Campus Hub', nodeId: 'node-joy', isMajorHub: true, etaFromStart: 'Start' },
      { name: 'Panagudi Bus Stop', nodeId: 'node-panagudi', isMajorHub: true, etaFromStart: '14 mins' },
      { name: 'Kannangulam Stop', nodeId: 'node-kannangulam', etaFromStart: '28 mins' },
    ],
    departureSummary: '6 Daily Departures (06:50 AM, 08:40 AM, 01:15 PM, 03:00 PM, 04:45 PM, 05:40 PM)',
    frequency: 'Key shift departure sync',
    distanceKm: 24,
    durationMinutes: 30,
    operatingHours: '06:50 AM - 06:15 PM',
    fare: 'Campus Bus Pass / Free for Enrolled Students',
    description: 'Dedicated south-eastern transit link ensuring swift connectivity to Panagudi junction and the Kannangulam residential belt.',
    activeVehicleIds: ['veh-3'],
    getPathD: (lngToX, latToY) => {
      return `M ${lngToX(77.5641)} ${latToY(8.3582)} L ${lngToX(77.5810)} ${latToY(8.3180)} L ${lngToX(77.6410)} ${latToY(8.2890)}`;
    },
  },
  {
    id: 'route-111',
    routeNumber: 'Route 111 Fast',
    name: 'Nagercoil Vadasery ↔ Vallioor & Tirunelveli',
    type: 'regional_bus',
    operator: 'TNSTC Tirunelveli Region',
    color: '#f59e0b',
    accentGlow: 'rgba(245, 158, 11, 0.5)',
    gradientId: 'routeGradient111',
    stops: [
      { name: 'Nagercoil Central (Vadasery)', nodeId: 'node-ncj-station', isMajorHub: true, etaFromStart: 'Start' },
      { name: 'Aralvaimozhi Pass Stop', nodeId: 'node-aralvaimozhi', etaFromStart: '16 mins' },
      { name: 'Kavalkinaru Junction', nodeId: 'node-kavalkinaru', etaFromStart: '26 mins' },
      { name: 'Joy Univ. Crossing (Vadakkankulam)', nodeId: 'node-joy', isMajorHub: true, etaFromStart: '34 mins' },
      { name: 'Vallioor Central Bus Stand', nodeId: 'node-vallioor', isMajorHub: true, etaFromStart: '45 mins' },
    ],
    departureSummary: 'Departures every 20-30 mins throughout the day',
    frequency: 'Every 20 - 30 mins',
    distanceKm: 46,
    durationMinutes: 50,
    operatingHours: '05:30 AM - 10:00 PM',
    fare: '₹45 - ₹65 (State Express / Fast Passenger)',
    description: 'Major regional backbone linking Kanyakumari district to Tirunelveli, dropping passengers right at the Joy University highway crossing.',
    activeVehicleIds: [],
    getPathD: (lngToX, latToY) => {
      return `M ${lngToX(77.4328)} ${latToY(8.1834)} L ${lngToX(77.5020)} ${latToY(8.2450)} L ${lngToX(77.5400)} ${latToY(8.2800)} L ${lngToX(77.5641)} ${latToY(8.3582)} L ${lngToX(77.6147)} ${latToY(8.3789)}`;
    },
  },
  {
    id: 'route-5a',
    routeNumber: 'Route 5A Regional',
    name: 'Nagercoil Christopher ↔ Vallioor Main Stand',
    type: 'regional_bus',
    operator: 'TNSTC Kanyakumari Division',
    color: '#10b981',
    accentGlow: 'rgba(16, 185, 129, 0.5)',
    gradientId: 'routeGradient5a',
    stops: [
      { name: 'Nagercoil Christopher Stand', nodeId: 'node-ncj-station', isMajorHub: true, etaFromStart: 'Start' },
      { name: 'Aralvaimozhi Pass Stop', nodeId: 'node-aralvaimozhi', etaFromStart: '18 mins' },
      { name: 'Kavalkinaru Junction', nodeId: 'node-kavalkinaru', etaFromStart: '28 mins' },
      { name: 'Joy University Campus Hub', nodeId: 'node-joy', isMajorHub: true, etaFromStart: '38 mins' },
      { name: 'Panagudi Bus Stop', nodeId: 'node-panagudi', etaFromStart: '48 mins' },
      { name: 'Vallioor Central Bus Stand', nodeId: 'node-vallioor', isMajorHub: true, etaFromStart: '58 mins' },
    ],
    departureSummary: '10 Scheduled Runs (06:00 AM, 07:30 AM, 10:15 AM, 02:00 PM, 05:50 PM, etc.)',
    frequency: 'Every 45 mins',
    distanceKm: 42,
    durationMinutes: 55,
    operatingHours: '06:00 AM - 09:00 PM',
    fare: '₹22 - ₹35',
    description: 'Suburban bus connecting regional villages, windmill farms, and college corridors between Nagercoil and Vallioor.',
    activeVehicleIds: [],
    getPathD: (lngToX, latToY) => {
      return `M ${lngToX(77.4328)} ${latToY(8.1834)} L ${lngToX(77.5020)} ${latToY(8.2450)} L ${lngToX(77.5400)} ${latToY(8.2800)} L ${lngToX(77.5641)} ${latToY(8.3582)} L ${lngToX(77.5810)} ${latToY(8.3180)} L ${lngToX(77.6147)} ${latToY(8.3789)}`;
    },
  },
  {
    id: 'route-rail',
    routeNumber: 'Southern Railway Mainline',
    name: 'Kanyakumari (CAPE) ↔ Nagercoil (NCJ) Rail Line',
    type: 'train',
    operator: 'Southern Railway / Indian Railways',
    color: '#38bdf8',
    accentGlow: 'rgba(56, 189, 248, 0.5)',
    gradientId: 'railwayGradient',
    strokeDash: '8 5',
    stops: [
      { name: 'Kanyakumari Railway Station (CAPE)', nodeId: 'node-cape-station', isMajorHub: true, etaFromStart: 'Start' },
      { name: 'Suchindram Junction', nodeId: 'node-suchindram', etaFromStart: '12 mins' },
      { name: 'Nagercoil Junction Railway Station (NCJ)', nodeId: 'node-ncj-station', isMajorHub: true, etaFromStart: '22 mins' },
    ],
    departureSummary: '16 Express & Superfast Services Daily',
    frequency: 'Scheduled Indian Railways Corridor',
    distanceKm: 16,
    durationMinutes: 22,
    operatingHours: '24/7 Continuous Rail Traffic',
    fare: '₹15 (Unreserved) / ₹140 (Reserved Second Sitting)',
    description: 'Electrified broad-gauge rail corridor feeding national express trains into Kanyakumari terminal.',
    activeVehicleIds: ['veh-4'],
    getPathD: (lngToX, latToY) => {
      return `M ${lngToX(77.5385)} ${latToY(8.0883)} Q ${lngToX(77.49)} ${latToY(8.12)} ${lngToX(77.4650)} ${latToY(8.1550)} L ${lngToX(77.4328)} ${latToY(8.1834)}`;
    },
  },
];

/**
 * Returns upcoming departures for any clicked stop or railway station.
 */
export function getUpcomingDeparturesForNode(
  node: StationNode,
  buses: BusTimetableEntry[],
  trains: TrainTimetableEntry[],
  regionalBuses: RegionalBusEntry[]
): StationUpcomingDeparture[] {
  const departures: StationUpcomingDeparture[] = [];

  // 1. JOY UNIVERSITY CAMPUS HUB
  if (node.id === 'node-joy' || node.type === 'college') {
    // Add all official campus timetable buses
    buses.forEach((b) => {
      departures.push({
        id: `dep-${b.id}`,
        time: b.time,
        timeOfDay: b.timeOfDay,
        serviceNumber: `Bus ${b.busNumber}`,
        serviceName: `Campus Bus to ${b.destination}`,
        destination: b.destination,
        type: 'campus_bus',
        operator: 'Joy University Transit Board',
        routeId: b.busNumber === '15' ? 'route-15' : b.busNumber === '17D' ? 'route-17d' : b.busNumber === '17F' ? 'route-17f' : undefined,
        platformOrBay: 'Campus Main Gate Bay',
        status: b.status,
        crowdLevel: b.crowdLevel,
        operatingDays: b.operatingDays || 'All Days',
        notes: `Notice board record. Driver coordination via transport office.`,
      });
    });

    // Add Regional buses passing Joy Univ
    regionalBuses.forEach((rb) => {
      if (rb.viaStops.some((s) => s.toLowerCase().includes('joy') || s.toLowerCase().includes('vadakkankulam'))) {
        rb.departureTimes.slice(0, 3).forEach((time, idx) => {
          departures.push({
            id: `dep-rb-${rb.id}-${idx}`,
            time,
            timeOfDay: time.includes('AM') ? 'morning' : 'afternoon',
            serviceNumber: rb.routeNumber,
            serviceName: rb.routeName,
            destination: rb.to,
            type: 'regional_bus',
            operator: rb.operatingAgency,
            routeId: rb.id === 'reg-bus-1' ? 'route-111' : rb.id === 'reg-bus-2' ? 'route-5a' : undefined,
            platformOrBay: 'Joy Univ. Highway Shelter',
            status: 'TIMETABLE DATA',
            crowdLevel: rb.crowdLevel,
            operatingDays: 'All Days',
            notes: `TNSTC Regional service. Fare: ${rb.fareEstimate || '₹25'}.`,
          });
        });
      }
    });

    // Add Campus shuttle
    departures.unshift({
      id: 'dep-shuttle-1',
      time: 'Every 15m',
      timeOfDay: 'morning',
      serviceNumber: 'Campus Shuttle #1',
      serviceName: 'Internal Hostel & Academic Loop',
      destination: 'Main Gate & Student Quad',
      type: 'shuttle',
      operator: 'Joy University Campus Fleet',
      platformOrBay: 'Academic Quad Circular',
      status: 'DEMO TRACKING',
      crowdLevel: 'LOW',
      operatingDays: 'All Days',
      notes: 'Hop-on electric mini-shuttle connecting hostel blocks with central engineering hall.',
    });
  }

  // 2. NAGERCOIL JUNCTION (NCJ)
  else if (node.id === 'node-ncj-station' || node.code === 'NCJ') {
    // Railway departures from NCJ
    trains
      .filter((t) => t.stationCode === 'NCJ' || t.departureStation.includes('NCJ'))
      .forEach((t) => {
        departures.push({
          id: `dep-train-${t.id}`,
          time: t.departureTime,
          timeOfDay: t.departureTime.includes('AM') || parseInt(t.departureTime) < 12 ? 'morning' : 'afternoon',
          serviceNumber: `Train ${t.trainNumber}`,
          serviceName: t.trainName,
          destination: t.destination,
          type: 'train',
          operator: 'Southern Railway',
          routeId: 'route-rail',
          platformOrBay: t.platform || 'Platform 1 / 2',
          status: t.status,
          operatingDays: t.operatingDays,
          notes: `NTES Railway record. Connects with Joy University Route 15.`,
        });
      });

    // Buses connecting at Nagercoil
    buses
      .filter((b) => b.destination.toLowerCase().includes('nagercoil'))
      .forEach((b) => {
        departures.push({
          id: `dep-b-ncj-${b.id}`,
          time: b.time,
          timeOfDay: b.timeOfDay,
          serviceNumber: `Bus ${b.busNumber}`,
          serviceName: `Campus Bus from Joy University`,
          destination: 'Joy University Campus',
          type: 'campus_bus',
          operator: 'Joy University Transit Board',
          routeId: 'route-15',
          platformOrBay: 'Station Bus Bay',
          status: b.status,
          crowdLevel: b.crowdLevel,
          operatingDays: b.operatingDays,
        });
      });

    // Regional buses from Nagercoil
    regionalBuses
      .filter((rb) => rb.from.toLowerCase().includes('nagercoil'))
      .forEach((rb) => {
        rb.departureTimes.slice(0, 3).forEach((time, idx) => {
          departures.push({
            id: `dep-rb-ncj-${rb.id}-${idx}`,
            time,
            timeOfDay: time.includes('AM') ? 'morning' : 'afternoon',
            serviceNumber: rb.routeNumber,
            serviceName: rb.routeName,
            destination: rb.to,
            type: 'regional_bus',
            operator: rb.operatingAgency,
            routeId: rb.id === 'reg-bus-1' ? 'route-111' : rb.id === 'reg-bus-2' ? 'route-5a' : undefined,
            platformOrBay: 'Vadasery Bus Bay 3',
            status: 'TIMETABLE DATA',
            crowdLevel: rb.crowdLevel,
            operatingDays: 'All Days',
          });
        });
      });
  }

  // 3. KANYAKUMARI RAILWAY STATION (CAPE)
  else if (node.id === 'node-cape-station' || node.code === 'CAPE') {
    trains
      .filter((t) => t.stationCode === 'CAPE' || t.departureStation.includes('CAPE'))
      .forEach((t) => {
        departures.push({
          id: `dep-cape-${t.id}`,
          time: t.departureTime,
          timeOfDay: t.departureTime.includes('AM') || parseInt(t.departureTime) < 12 ? 'morning' : 'afternoon',
          serviceNumber: `Train ${t.trainNumber}`,
          serviceName: t.trainName,
          destination: t.destination,
          type: 'train',
          operator: 'Southern Railway',
          routeId: 'route-rail',
          platformOrBay: t.platform || 'Platform 1',
          status: t.status,
          operatingDays: t.operatingDays,
          notes: `Southernmost rail terminal. Express departure.`,
        });
      });

    // Coastal bus to Nagercoil
    regionalBuses
      .filter((rb) => rb.from.toLowerCase().includes('kanyakumari'))
      .forEach((rb) => {
        rb.departureTimes.slice(0, 3).forEach((time, idx) => {
          departures.push({
            id: `dep-cape-rb-${rb.id}-${idx}`,
            time,
            timeOfDay: time.includes('AM') ? 'morning' : 'afternoon',
            serviceNumber: rb.routeNumber,
            serviceName: rb.routeName,
            destination: rb.to,
            type: 'regional_bus',
            operator: rb.operatingAgency,
            platformOrBay: 'Cape Bus Stand',
            status: 'TIMETABLE DATA',
            crowdLevel: rb.crowdLevel,
            operatingDays: 'All Days',
          });
        });
      });
  }

  // 4. MATHAGANERI BUS STOP
  else if (node.id === 'node-mathaganeri' || node.name.toLowerCase().includes('mathaganeri')) {
    buses
      .filter((b) => b.destination.toLowerCase().includes('mathaganeri'))
      .forEach((b) => {
        departures.push({
          id: `dep-math-${b.id}`,
          time: b.time,
          timeOfDay: b.timeOfDay,
          serviceNumber: `Bus ${b.busNumber}`,
          serviceName: `Campus Bus (${b.busNumber}) from Joy University`,
          destination: 'Mathaganeri Terminal',
          type: 'campus_bus',
          operator: 'Joy University Transit Board',
          routeId: b.busNumber === '17D' ? 'route-17d' : b.busNumber === '15' ? 'route-15' : undefined,
          platformOrBay: 'Mathaganeri Village Stop',
          status: b.status,
          crowdLevel: b.crowdLevel,
          operatingDays: b.operatingDays || 'All Days',
        });
      });
  }

  // 5. VALLIOOR CENTRAL BUS STAND
  else if (node.id === 'node-vallioor' || node.name.toLowerCase().includes('vallioor')) {
    // Joy university buses
    buses
      .filter((b) => b.destination.toLowerCase().includes('vallioor'))
      .forEach((b) => {
        departures.push({
          id: `dep-val-${b.id}`,
          time: b.time,
          timeOfDay: b.timeOfDay,
          serviceNumber: `Bus ${b.busNumber}`,
          serviceName: `Campus Bus to Joy University`,
          destination: 'Joy University Campus',
          type: 'campus_bus',
          operator: 'Joy University Transit Board',
          routeId: 'route-17d',
          platformOrBay: 'Vallioor Stand Platform 2',
          status: b.status,
          crowdLevel: b.crowdLevel,
          operatingDays: b.operatingDays || 'All Days',
        });
      });

    // Regional buses connecting Vallioor
    regionalBuses
      .filter((rb) => rb.from.toLowerCase().includes('vallioor') || rb.to.toLowerCase().includes('vallioor'))
      .forEach((rb) => {
        rb.departureTimes.slice(0, 3).forEach((time, idx) => {
          departures.push({
            id: `dep-val-rb-${rb.id}-${idx}`,
            time,
            timeOfDay: time.includes('AM') ? 'morning' : 'afternoon',
            serviceNumber: rb.routeNumber,
            serviceName: rb.routeName,
            destination: rb.to,
            type: 'regional_bus',
            operator: rb.operatingAgency,
            routeId: rb.id === 'reg-bus-1' ? 'route-111' : rb.id === 'reg-bus-2' ? 'route-5a' : undefined,
            platformOrBay: 'Main Highway Bay',
            status: 'TIMETABLE DATA',
            crowdLevel: rb.crowdLevel,
            operatingDays: 'All Days',
          });
        });
      });
  }

  // 6. PANAGUDI BUS STOP
  else if (node.id === 'node-panagudi' || node.name.toLowerCase().includes('panagudi')) {
    buses
      .filter((b) => b.destination.toLowerCase().includes('panagudi'))
      .forEach((b) => {
        departures.push({
          id: `dep-pan-${b.id}`,
          time: b.time,
          timeOfDay: b.timeOfDay,
          serviceNumber: `Bus ${b.busNumber}`,
          serviceName: `Campus Bus to Panagudi`,
          destination: 'Panagudi Junction',
          type: 'campus_bus',
          operator: 'Joy University Transit Board',
          routeId: 'route-17f',
          platformOrBay: 'Panagudi Market Stop',
          status: b.status,
          crowdLevel: b.crowdLevel,
          operatingDays: b.operatingDays || 'All Days',
        });
      });

    regionalBuses
      .filter((rb) => rb.viaStops.some((s) => s.toLowerCase().includes('panagudi')))
      .forEach((rb) => {
        rb.departureTimes.slice(0, 2).forEach((time, idx) => {
          departures.push({
            id: `dep-pan-rb-${rb.id}-${idx}`,
            time,
            timeOfDay: time.includes('AM') ? 'morning' : 'afternoon',
            serviceNumber: rb.routeNumber,
            serviceName: rb.routeName,
            destination: rb.to,
            type: 'regional_bus',
            operator: rb.operatingAgency,
            routeId: 'route-5a',
            platformOrBay: 'Highway Shelter',
            status: 'TIMETABLE DATA',
            crowdLevel: rb.crowdLevel,
            operatingDays: 'All Days',
          });
        });
      });
  }

  // 7. KANNANGULAM STOP
  else if (node.id === 'node-kannangulam' || node.name.toLowerCase().includes('kannangulam')) {
    buses
      .filter((b) => b.destination.toLowerCase().includes('kannangulam'))
      .forEach((b) => {
        departures.push({
          id: `dep-kan-${b.id}`,
          time: b.time,
          timeOfDay: b.timeOfDay,
          serviceNumber: `Bus ${b.busNumber}`,
          serviceName: `Campus Bus to Kannangulam`,
          destination: 'Kannangulam Terminal',
          type: 'campus_bus',
          operator: 'Joy University Transit Board',
          routeId: 'route-17f',
          platformOrBay: 'Kannangulam Bus Shelter',
          status: b.status,
          crowdLevel: b.crowdLevel,
          operatingDays: b.operatingDays || 'All Days',
        });
      });
  }

  // 8. AZHAGANERI STOP
  else if (node.id === 'node-azhaganeri' || node.name.toLowerCase().includes('azhaganeri')) {
    buses
      .filter((b) => b.destination.toLowerCase().includes('azhaganeri') || b.destination.toLowerCase().includes('mathaganeri'))
      .slice(0, 4)
      .forEach((b) => {
        departures.push({
          id: `dep-azh-${b.id}`,
          time: b.time,
          timeOfDay: b.timeOfDay,
          serviceNumber: `Bus ${b.busNumber}`,
          serviceName: `Campus Transit to ${b.destination}`,
          destination: b.destination,
          type: 'campus_bus',
          operator: 'Joy University Transit Board',
          routeId: 'route-15',
          platformOrBay: 'Village Board',
          status: b.status,
          crowdLevel: b.crowdLevel,
          operatingDays: b.operatingDays || 'All Days',
        });
      });
  }

  // 9. KAVALKINARU JUNCTION
  else if (node.id === 'node-kavalkinaru') {
    regionalBuses
      .filter((rb) => rb.viaStops.some((s) => s.toLowerCase().includes('kavalkinaru')))
      .forEach((rb) => {
        rb.departureTimes.slice(0, 3).forEach((time, idx) => {
          departures.push({
            id: `dep-kav-rb-${rb.id}-${idx}`,
            time,
            timeOfDay: time.includes('AM') ? 'morning' : 'afternoon',
            serviceNumber: rb.routeNumber,
            serviceName: rb.routeName,
            destination: rb.to,
            type: 'regional_bus',
            operator: rb.operatingAgency,
            routeId: rb.id === 'reg-bus-1' ? 'route-111' : 'route-5a',
            platformOrBay: 'NH44 Junction Shelter',
            status: 'TIMETABLE DATA',
            crowdLevel: rb.crowdLevel,
            operatingDays: 'All Days',
          });
        });
      });

    // Campus bus Route 15 passing Kavalkinaru
    buses
      .filter((b) => b.busNumber === '15')
      .forEach((b) => {
        departures.push({
          id: `dep-kav-b15-${b.id}`,
          time: b.time,
          timeOfDay: b.timeOfDay,
          serviceNumber: `Bus ${b.busNumber}`,
          serviceName: `Campus Route 15 to ${b.destination}`,
          destination: b.destination,
          type: 'campus_bus',
          operator: 'Joy University Transit Board',
          routeId: 'route-15',
          platformOrBay: 'Kavalkinaru Bypass',
          status: b.status,
          crowdLevel: b.crowdLevel,
          operatingDays: b.operatingDays || 'All Days',
        });
      });
  }

  // 10. ARALVAIMOZHI PASS STOP
  else if (node.id === 'node-aralvaimozhi') {
    regionalBuses
      .filter((rb) => rb.viaStops.some((s) => s.toLowerCase().includes('aralvaimozhi')))
      .forEach((rb) => {
        rb.departureTimes.slice(0, 3).forEach((time, idx) => {
          departures.push({
            id: `dep-aral-rb-${rb.id}-${idx}`,
            time,
            timeOfDay: time.includes('AM') ? 'morning' : 'afternoon',
            serviceNumber: rb.routeNumber,
            serviceName: rb.routeName,
            destination: rb.to,
            type: 'regional_bus',
            operator: rb.operatingAgency,
            routeId: rb.id === 'reg-bus-1' ? 'route-111' : 'route-5a',
            platformOrBay: 'Wind Pass Stand',
            status: 'TIMETABLE DATA',
            crowdLevel: rb.crowdLevel,
            operatingDays: 'All Days',
          });
        });
      });
  }

  // 11. SUCHINDRAM JUNCTION
  else if (node.id === 'node-suchindram') {
    regionalBuses
      .filter((rb) => rb.viaStops.some((s) => s.toLowerCase().includes('suchindram')))
      .forEach((rb) => {
        rb.departureTimes.slice(0, 3).forEach((time, idx) => {
          departures.push({
            id: `dep-suc-rb-${rb.id}-${idx}`,
            time,
            timeOfDay: time.includes('AM') ? 'morning' : 'afternoon',
            serviceNumber: rb.routeNumber,
            serviceName: rb.routeName,
            destination: rb.to,
            type: 'regional_bus',
            operator: rb.operatingAgency,
            platformOrBay: 'Temple Arch Stop',
            status: 'TIMETABLE DATA',
            crowdLevel: rb.crowdLevel,
            operatingDays: 'All Days',
          });
        });
      });
  }

  // Fallback for custom or unmapped nodes
  if (departures.length === 0) {
    buses.slice(0, 4).forEach((b) => {
      departures.push({
        id: `dep-fallback-${b.id}`,
        time: b.time,
        timeOfDay: b.timeOfDay,
        serviceNumber: `Bus ${b.busNumber}`,
        serviceName: `Campus Route to ${b.destination}`,
        destination: b.destination,
        type: 'campus_bus',
        operator: 'Joy University Transit Board',
        routeId: b.busNumber === '15' ? 'route-15' : 'route-17d',
        platformOrBay: 'Main Corridor Shelter',
        status: b.status,
        crowdLevel: b.crowdLevel,
        operatingDays: b.operatingDays || 'All Days',
      });
    });
  }

  return departures;
}

/**
 * Returns real-time telemetry, active nearby vehicles, and service alerts for any node.
 */
export function getRealtimeUpdateForNode(
  node: StationNode,
  vehicles: VehicleLocation[],
  reportsCount: number = 0
): StationRealtimeUpdate {
  const nodeNameLower = node.name.toLowerCase();
  const nodeCodeLower = node.code?.toLowerCase() || '';

  // Find active vehicles on or near this node
  const activeVehiclesNearby = vehicles.filter((v) => {
    const nextStop = v.nextStop.toLowerCase();
    const currentStop = v.currentStop.toLowerCase();
    const route = v.route.toLowerCase();
    const destination = v.destination.toLowerCase();

    return (
      nextStop.includes(nodeNameLower) ||
      currentStop.includes(nodeNameLower) ||
      route.includes(nodeNameLower) ||
      destination.includes(nodeNameLower) ||
      (nodeCodeLower && (nextStop.includes(nodeCodeLower) || currentStop.includes(nodeCodeLower)))
    );
  });

  // Calculate crowd level
  let crowdStatus: CrowdLevel = 'MODERATE';
  let crowdNote = 'Normal passenger flow observed based on scheduled peak timetable.';

  if (node.type === 'college') {
    crowdStatus = 'MODERATE';
    crowdNote = 'Active campus transit hub. Regular student boarding at academic shift bells.';
  } else if (node.type === 'railway_station') {
    crowdStatus = 'HIGH';
    crowdNote = 'Major railway terminal. Peak footfall expected around scheduled express train departures.';
  } else if (node.type === 'bus_stop') {
    crowdStatus = 'LOW';
    crowdNote = 'Regular passenger boarding. No platform congestion reported.';
  }

  // Service alert
  let alertLevel: 'normal' | 'advisory' | 'alert' = 'normal';
  let alertTitle = 'Regular Timetable Operations';
  let alertMessage = 'Services running as published on campus timetable notice boards.';

  if (activeVehiclesNearby.length > 0) {
    const firstVeh = activeVehiclesNearby[0];
    alertLevel = 'normal';
    alertTitle = `Active Corridor: ${firstVeh.vehicleNumber} Nearby`;
    alertMessage = `${firstVeh.label} is currently navigating towards ${firstVeh.nextStop}. Demo GPS telemetry active.`;
  } else if (reportsCount > 0) {
    alertLevel = 'advisory';
    alertTitle = 'Student Field Advisory';
    alertMessage = `${reportsCount} recent report(s) noted by student transit committee. Operations investigating.`;
  }

  return {
    activeVehiclesNearby,
    crowdStatus,
    crowdNote,
    serviceAlert: {
      level: alertLevel,
      title: alertTitle,
      message: alertMessage,
    },
    lastSyncTime: 'Just now (Synced via Campus Gateway)',
  };
}

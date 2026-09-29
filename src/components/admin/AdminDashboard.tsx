import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Bus, 
  Train, 
  MapPin, 
  Users, 
  Bell, 
  AlertTriangle, 
  Database, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Radio, 
  Settings, 
  Phone,
  RefreshCw,
  Copy,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { 
  BusTimetableEntry, 
  TrainTimetableEntry, 
  VehicleLocation, 
  StudentReport, 
  ReportStatus, 
  CrowdLevel, 
  TimeOfDay,
  TransportSource
} from '../../types';
import { store, TransitStore } from '../../services/store';
import { INSTITUTION_INFO } from '../../data/seedData';
import { DataTrustBadge } from '../common/DataTrustBadge';

interface AdminDashboardProps {
  buses: BusTimetableEntry[];
  trains: TrainTimetableEntry[];
  vehicles: VehicleLocation[];
  reports: StudentReport[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  buses,
  trains,
  vehicles,
  reports,
}) => {
  const [activeTab, setActiveTab] = useState<'buses' | 'trains' | 'telemetry' | 'datasources' | 'reports' | 'announcements' | 'schema'>('buses');
  const [dataSources, setDataSources] = useState<TransportSource[]>(() => store.getDataSources());
  
  // Bus Management State
  const [isAddBusModalOpen, setIsAddBusModalOpen] = useState(false);
  const [editingBusId, setEditingBusId] = useState<string | null>(null);
  const [busNumber, setBusNumber] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('08:00 AM');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [crowdLevel, setCrowdLevel] = useState<CrowdLevel>('NOT AVAILABLE');

  // Train Management State
  const [isAddTrainModalOpen, setIsAddTrainModalOpen] = useState(false);
  const [trainNumber, setTrainNumber] = useState('');
  const [trainName, setTrainName] = useState('');
  const [trainStation, setTrainStation] = useState<'CAPE' | 'NCJ'>('CAPE');
  const [trainTime, setTrainTime] = useState('08:00');
  const [trainDays, setTrainDays] = useState('All Days');
  const [trainDestination, setTrainDestination] = useState('');

  // Announcement State
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Copy Schema SQL state
  const [copiedSQL, setCopiedSQL] = useState(false);

  // Handlers for Bus CRUD
  const handleSaveBus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!busNumber || !destination) return;

    if (editingBusId) {
      store.updateBus(editingBusId, {
        busNumber,
        destination,
        time: departureTime,
        timeOfDay,
        crowdLevel,
      });
      setEditingBusId(null);
    } else {
      store.addBus({
        busNumber,
        destination,
        time: departureTime,
        timeOfDay,
        status: 'TIMETABLE DATA',
        crowdLevel,
        isActive: true,
        operatingDays: 'All Days',
      });
    }

    setIsAddBusModalOpen(false);
    setBusNumber('');
    setDestination('');
  };

  const startEditBus = (bus: BusTimetableEntry) => {
    setEditingBusId(bus.id);
    setBusNumber(bus.busNumber);
    setDestination(bus.destination);
    setDepartureTime(bus.time);
    setTimeOfDay(bus.timeOfDay);
    setCrowdLevel(bus.crowdLevel);
    setIsAddBusModalOpen(true);
  };

  // Handlers for Train CRUD
  const handleSaveTrain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainNumber || !trainName || !trainDestination) return;

    store.addTrain({
      trainNumber,
      trainName,
      departureStation: trainStation === 'CAPE' ? 'Kanyakumari (CAPE)' : 'Nagercoil (NCJ)',
      stationCode: trainStation,
      departureTime: trainTime,
      operatingDays: trainDays,
      destination: trainDestination,
      status: 'TIMETABLE DATA',
    });

    setIsAddTrainModalOpen(false);
    setTrainNumber('');
    setTrainName('');
    setTrainDestination('');
  };

  // Broadcast announcement
  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle || !announcementMsg) return;

    store.addNotification({
      title: announcementTitle,
      message: announcementMsg,
      type: 'announcement',
    });

    setAnnouncementTitle('');
    setAnnouncementMsg('');
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 2500);
  };

  // Copy SQL
  const handleCopySQL = () => {
    navigator.clipboard.writeText(TransitStore.getSupabaseSchemaSQL());
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="vesper-card p-6 sm:p-8 rounded-3xl border border-white/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-normal bg-white/[0.06] text-gray-200 border border-white/15 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                Administrator Console
              </span>
              <span className="text-xs text-gray-400">Campus Transport Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white leading-tight">
              Transit <span className="font-display italic text-[#e6e6e6]">Command Center</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1 font-light">
              Configure timetables, update vehicle telemetry & crowd status, and manage student reports.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => store.resetToFactorySeed()}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-white/[0.06] hover:bg-white/[0.12] text-gray-300 hover:text-white border border-white/15 transition-colors"
              title="Reset data back to Joy University transport board baseline"
            >
              <RefreshCw className="w-3.5 h-3.5 text-white" />
              <span>Reset to Seed Board Data</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pt-2 border-t border-white/10 scrollbar-none">
          {[
            { id: 'buses', label: `Bus Timetable (${buses.length})`, icon: <Bus className="w-4 h-4" /> },
            { id: 'trains', label: `Train Timetable (${trains.length})`, icon: <Train className="w-4 h-4" /> },
            { id: 'telemetry', label: `Telemetry & Crowd (${vehicles.length})`, icon: <Radio className="w-4 h-4" /> },
            { id: 'datasources', label: `Data Sources (${dataSources.length})`, icon: <ShieldCheck className="w-4 h-4" /> },
            { id: 'reports', label: `Student Reports (${reports.length})`, icon: <AlertTriangle className="w-4 h-4" /> },
            { id: 'announcements', label: 'Announcements', icon: <Bell className="w-4 h-4" /> },
            { id: 'schema', label: 'Supabase Schema', icon: <Database className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap border ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#1c1c1c] via-[#333333] to-[#4f4f4f] text-white border-white/40 shadow-sm font-semibold'
                  : 'bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] border-white/10 font-medium'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: BUS MANAGEMENT */}
      {activeTab === 'buses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-heading text-white">
              Campus Bus Operations Management
            </h2>

            <button
              onClick={() => {
                setEditingBusId(null);
                setBusNumber('');
                setDestination('');
                setDepartureTime('08:00 AM');
                setIsAddBusModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>ADD BUS</span>
            </button>
          </div>

          <div className="glass-panel rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-white/5 text-gray-400 uppercase tracking-wider text-[11px] border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Bus No.</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Departure Time</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Crowd Status</th>
                  <th className="py-3 px-4">Schedule Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {buses.map((bus) => (
                  <tr key={bus.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{bus.busNumber}</td>
                    <td className="py-3 px-4 text-gray-200">{bus.destination}</td>
                    <td className="py-3 px-4 text-cyan-300 font-mono font-semibold">{bus.time}</td>
                    <td className="py-3 px-4 capitalize text-gray-400">{bus.timeOfDay}</td>
                    <td className="py-3 px-4">
                      <select
                        value={bus.crowdLevel}
                        onChange={(e) => store.updateBus(bus.id, { crowdLevel: e.target.value as CrowdLevel })}
                        className="bg-black/50 border border-white/15 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                      >
                        <option value="NOT AVAILABLE">NOT AVAILABLE</option>
                        <option value="LOW">LOW</option>
                        <option value="MODERATE">MODERATE</option>
                        <option value="HIGH">HIGH</option>
                        <option value="VERY HIGH">VERY HIGH</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300">
                        {bus.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => startEditBus(bus)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                          title="Edit Bus"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => store.deleteBus(bus.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10"
                          title="Delete Bus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TRAIN MANAGEMENT */}
      {activeTab === 'trains' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-heading text-white">
              Regional Railway Schedules Management
            </h2>

            <button
              onClick={() => setIsAddTrainModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-md shadow-cyan-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>ADD TRAIN</span>
            </button>
          </div>

          <div className="glass-panel rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-white/5 text-gray-400 uppercase tracking-wider text-[11px] border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Train No.</th>
                  <th className="py-3 px-4">Train Name</th>
                  <th className="py-3 px-4">Station</th>
                  <th className="py-3 px-4">Departure</th>
                  <th className="py-3 px-4">Operating Days</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {trains.map((train) => (
                  <tr key={train.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-300">{train.trainNumber}</td>
                    <td className="py-3 px-4 text-white font-medium">{train.trainName}</td>
                    <td className="py-3 px-4 text-gray-300">{train.stationCode}</td>
                    <td className="py-3 px-4 text-white font-mono">{train.departureTime}</td>
                    <td className="py-3 px-4 text-gray-300">{train.operatingDays}</td>
                    <td className="py-3 px-4 text-white font-semibold">{train.destination}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => store.deleteTrain(train.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10"
                        title="Delete Train"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TELEMETRY & CROWD STATUS */}
      {activeTab === 'telemetry' && (
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold font-heading text-white">
                Vehicle Telemetry & GPS Tracking Controller
              </h2>
            </div>
            <p className="text-xs text-gray-300">
              Update GPS coordinates, current stop, speed, and crowd status for connected demonstration vehicles. When physical IoT GPS hardware is mounted, this will feed live coordinates automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.map((veh) => (
              <div
                key={veh.id}
                className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {veh.type === 'bus' ? '🚌' : veh.type === 'train' ? '🚆' : '🚐'}
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-base">{veh.vehicleNumber}</h3>
                      <span className="text-[11px] text-gray-400">{veh.route}</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {veh.trackingType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-gray-400 block mb-1">Latitude (°N)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={veh.lat}
                      onChange={(e) => store.updateVehicleLocation(veh.id, { lat: parseFloat(e.target.value) || veh.lat })}
                      className="w-full px-2.5 py-1.5 bg-black/40 border border-white/10 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Longitude (°E)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={veh.lng}
                      onChange={(e) => store.updateVehicleLocation(veh.id, { lng: parseFloat(e.target.value) || veh.lng })}
                      className="w-full px-2.5 py-1.5 bg-black/40 border border-white/10 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-gray-400 block mb-1">Current Stop</label>
                    <input
                      type="text"
                      value={veh.currentStop}
                      onChange={(e) => store.updateVehicleLocation(veh.id, { currentStop: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-black/40 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Crowd Status</label>
                    <select
                      value={veh.crowd}
                      onChange={(e) => store.updateVehicleLocation(veh.id, { crowd: e.target.value as CrowdLevel })}
                      className="w-full px-2.5 py-1.5 bg-black/40 border border-white/10 rounded-lg text-white"
                    >
                      <option value="NOT AVAILABLE">NOT AVAILABLE</option>
                      <option value="LOW">LOW</option>
                      <option value="MODERATE">MODERATE</option>
                      <option value="HIGH">HIGH</option>
                      <option value="VERY HIGH">VERY HIGH</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: DATA SOURCES MANAGEMENT (Section 27) */}
      {activeTab === 'datasources' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-heading text-white">
                Transport Data Sources & Trust Integrity (Section 27)
              </h2>
              <p className="text-xs text-gray-400">
                Manage registered official portals, notice boards, API connectors and their live reliability status.
              </p>
            </div>

            <button
              onClick={() => {
                store.addDataSource({
                  source_name: 'New Regional Transport Operator',
                  source_url: 'https://transport.tn.gov.in',
                  source_type: 'Transport Operator',
                  region: 'Tamil Nadu',
                  last_updated: 'Just now',
                  data_status: 'TIMETABLE',
                  status: 'Manual Verified',
                  reliability_score: '99.0% Verified',
                });
                setDataSources(store.getDataSources());
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 shadow-md shadow-cyan-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>REGISTER SOURCE</span>
            </button>
          </div>

          <div className="glass-panel rounded-2xl border border-white/10 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-white/5 text-gray-400 uppercase tracking-wider text-[11px] border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Source Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Region</th>
                  <th className="py-3 px-4">Data Trust Status</th>
                  <th className="py-3 px-4">Connection State</th>
                  <th className="py-3 px-4">Last Checked</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dataSources.map((src) => (
                  <tr key={src.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{src.source_name}</div>
                      <div className="text-[11px] text-gray-400 font-mono truncate max-w-[200px]">{src.source_url}</div>
                    </td>
                    <td className="py-3 px-4 text-purple-300 font-medium">{src.source_type}</td>
                    <td className="py-3 px-4 text-gray-300">{src.region}</td>
                    <td className="py-3 px-4">
                      <DataTrustBadge status={src.data_status} />
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={src.status}
                        onChange={(e) => {
                          store.updateDataSource(src.id, { status: e.target.value as any });
                          setDataSources(store.getDataSources());
                        }}
                        className="bg-black/50 border border-white/15 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                      >
                        <option value="Connected">🟢 Connected</option>
                        <option value="Manual Verified">🔵 Manual Verified</option>
                        <option value="Integration in Progress">🟡 In Progress</option>
                        <option value="Unavailable">⚪ Unavailable</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">{src.last_checked}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          store.updateDataSource(src.id, { last_checked: 'Just now' });
                          setDataSources(store.getDataSources());
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white"
                        title="Ping and refresh source"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: STUDENT REPORTS REVIEW */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-heading text-white">
              Student Transport Incident Reports
            </h2>
            <span className="text-xs text-gray-400">
              Total Reports: {reports.length}
            </span>
          </div>

          {reports.length === 0 ? (
            <div className="glass-panel p-8 text-center rounded-2xl border border-white/10">
              <p className="text-xs text-gray-400">No incident reports submitted yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{report.issueType}</span>
                        {report.busOrTrainNumber && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/20 text-purple-300">
                            Vehicle: {report.busOrTrainNumber}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        Submitted by: <strong className="text-gray-200">{report.studentName}</strong> ({report.studentId}) on {report.createdAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Status:</span>
                      <select
                        value={report.status}
                        onChange={(e) => store.updateReportStatus(report.id, e.target.value as ReportStatus)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold border focus:outline-none ${
                          report.status === 'Resolved'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : report.status === 'Investigating'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-gray-800 text-gray-300 border-gray-700'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Investigating">Investigating</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 bg-black/40 p-3 rounded-xl border border-white/5">
                    {report.description}
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <span className="text-gray-400">Admin Resolution Note:</span>
                    <input
                      type="text"
                      defaultValue={report.adminNote || ''}
                      onBlur={(e) => store.updateReportStatus(report.id, report.status, e.target.value)}
                      placeholder="Add response note for student..."
                      className="flex-1 px-3 py-1 bg-black/40 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h2 className="text-lg font-bold font-heading text-white">
              Broadcast Transport Announcement
            </h2>
            <p className="text-xs text-gray-300">
              Send an instant advisory banner to all student dashboards regarding timetable adjustments or weather warnings.
            </p>

            <form onSubmit={handleBroadcastAnnouncement} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Alert Title
                </label>
                <input
                  type="text"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  placeholder="e.g. Schedule Notice for Semester Examinations"
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Message Content
                </label>
                <textarea
                  value={announcementMsg}
                  onChange={(e) => setAnnouncementMsg(e.target.value)}
                  rows={4}
                  placeholder="Details for students..."
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-md shadow-purple-600/30"
              >
                BROADCAST ANNOUNCEMENT
              </button>

              {broadcastSuccess && (
                <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Announcement dispatched to student notification feed!</span>
                </div>
              )}
            </form>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h2 className="text-lg font-bold font-heading text-white">
              Campus Logistics Hotline Settings
            </h2>
            <div className="space-y-3 text-xs text-gray-300 bg-black/30 p-4 rounded-2xl border border-white/5">
              <div className="flex justify-between">
                <span className="text-gray-400">Institution:</span>
                <span className="font-semibold text-white">{INSTITUTION_INFO.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Region:</span>
                <span>{INSTITUTION_INFO.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Official Website:</span>
                <span className="text-cyan-300">{INSTITUTION_INFO.website}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Board Contacts:</span>
                <span className="text-white font-mono">{INSTITUTION_INFO.contacts.join(' / ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Social Handle:</span>
                <span className="text-purple-300">{INSTITUTION_INFO.socialHandle}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SUPABASE SCHEMA (Section 27) */}
      {activeTab === 'schema' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-400" />
                <span>Supabase / PostgreSQL Production Architecture (Phase 2)</span>
              </h2>
              <p className="text-xs text-gray-400">
                Complete relational SQL schema with RLS policies, tables, and foreign keys per Section 27.
              </p>
            </div>

            <button
              onClick={handleCopySQL}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-md"
            >
              {copiedSQL ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSQL ? 'COPIED TO CLIPBOARD' : 'COPY SQL SCHEMA'}</span>
            </button>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-white/10 bg-black/60 font-mono text-xs text-gray-300 max-h-[480px] overflow-y-auto">
            <pre className="whitespace-pre">{TransitStore.getSupabaseSchemaSQL()}</pre>
          </div>
        </div>
      )}

      {/* Add / Edit Bus Modal */}
      {isAddBusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel-glow rounded-3xl p-6 border border-purple-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading text-white">
                {editingBusId ? 'Edit Bus Schedule' : 'Add New Bus Schedule'}
              </h3>
              <button
                onClick={() => setIsAddBusModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBus} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">Bus Number (e.g. 15, 17D, 38K)</label>
                <input
                  type="text"
                  value={busNumber}
                  onChange={(e) => setBusNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Destination (e.g. Nagercoil, Mathaganeri)</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">Departure Time</label>
                  <input
                    type="text"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    placeholder="06:15 AM"
                    className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Time Period</label>
                  <select
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-sm"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Crowd Level</label>
                <select
                  value={crowdLevel}
                  onChange={(e) => setCrowdLevel(e.target.value as CrowdLevel)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-sm"
                >
                  <option value="NOT AVAILABLE">NOT AVAILABLE</option>
                  <option value="LOW">LOW</option>
                  <option value="MODERATE">MODERATE</option>
                  <option value="HIGH">HIGH</option>
                  <option value="VERY HIGH">VERY HIGH</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddBusModalOpen(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md"
                >
                  Save Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Train Modal */}
      {isAddTrainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel-glow rounded-3xl p-6 border border-cyan-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading text-white">
                Add Regional Train Schedule
              </h3>
              <button
                onClick={() => setIsAddTrainModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTrain} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">Train Number (e.g. 02666)</label>
                  <input
                    type="text"
                    value={trainNumber}
                    onChange={(e) => setTrainNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Station</label>
                  <select
                    value={trainStation}
                    onChange={(e) => setTrainStation(e.target.value as any)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-sm"
                  >
                    <option value="CAPE">Kanyakumari (CAPE)</option>
                    <option value="NCJ">Nagercoil (NCJ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Train Name</label>
                <input
                  type="text"
                  value={trainName}
                  onChange={(e) => setTrainName(e.target.value)}
                  placeholder="e.g. Howrah SF Express"
                  className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Destination Station</label>
                <input
                  type="text"
                  value={trainDestination}
                  onChange={(e) => setTrainDestination(e.target.value)}
                  placeholder="e.g. Howrah Jn (HWH)"
                  className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">Departure Time</label>
                  <input
                    type="text"
                    value={trainTime}
                    onChange={(e) => setTrainTime(e.target.value)}
                    placeholder="08:00"
                    className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Operating Days</label>
                  <input
                    type="text"
                    value={trainDays}
                    onChange={(e) => setTrainDays(e.target.value)}
                    placeholder="All Days / Saturday"
                    className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-white text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTrainModalOpen(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-md"
                >
                  Save Train
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  BookOpen, 
  CalendarDays, 
  Home, 
  GraduationCap, 
  HardDrive, 
  Plus, 
  Search, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  RefreshCw,
  ArrowRight,
  Phone,
  Mail,
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAuthStore } from '../../store';

export default function InstituteAdminDashboard() {
  const { user } = useAuthStore();
  const [institutes, setInstitutes] = useState([]);
  const [selectedInstituteId, setSelectedInstituteId] = useState('INST001'); // Default VAMNICOM Pune
  const [loading, setLoading] = useState(true);

  // Dynamic Data
  const [trainees, setTrainees] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [allocations, setAllocations] = useState([]);

  // Modals
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showTrainerModal, setShowTrainerModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [newBatch, setNewBatch] = useState({
    id: `PRG-2026-${Math.floor(100 + Math.random() * 900)}`,
    title: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    capacity: 40,
    enrolled: 0,
    mode: 'Classroom & Lab',
    language: 'Hindi / English',
    status: 'active'
  });

  const [newTrainer, setNewTrainer] = useState({
    id: `TRN-${Math.floor(100 + Math.random() * 900)}`,
    name: '',
    designation: 'Associate Professor of Cooperative Management',
    department: 'Cooperative Banking & Management',
    email: '',
    phone: '',
    specialization: 'PACS Computerization, Digital Accounting',
    experience_years: 8,
    status: 'active'
  });

  const [newSession, setNewSession] = useState({
    date: new Date().toISOString().split('T')[0],
    start_time: '10:00',
    end_time: '11:30',
    subject: '',
    programme_title: '',
    trainer: '',
    room: 'Hall A (Smart Classroom)',
    venue_type: 'Lecture Hall'
  });

  const [newAlloc, setNewAlloc] = useState({
    trainee: '',
    room: '',
    checkin_date: new Date().toISOString().split('T')[0],
    meal_pref: 'Veg'
  });

  const fetchInstituteData = async (instId) => {
    setLoading(true);
    try {
      const [instRes, trnRes, prgRes, trainerRes, timeRes, blkRes, allocRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/institutes/`),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/trainees/?institute=${instId}`),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/programmes/?institute=${instId}`),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/trainers/?institute=${instId}`),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/timetables/`),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/hostel-blocks/`),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/room-allocations/`)
      ]);

      const instData = await instRes.json();
      const trnData = await trnRes.json();
      const prgData = await prgRes.json();
      const trainerData = await trainerRes.json();
      const timeData = await timeRes.json();
      const blkData = await blkRes.json();
      const allocData = await allocRes.json();

      setInstitutes(instData);
      setTrainees(trnData);
      setProgrammes(prgData);
      setTrainers(trainerData);
      setTimetable(timeData);
      setBlocks(blkData);
      setAllocations(allocData);

      if (prgData.length > 0 && !newSession.programme_title) {
        setNewSession(prev => ({ ...prev, programme_title: prgData[0].title }));
      }
      if (trainerData.length > 0 && !newSession.trainer) {
        setNewSession(prev => ({ ...prev, trainer: trainerData[0].name }));
      }
      if (trnData.length > 0 && !newAlloc.trainee) {
        setNewAlloc(prev => ({ ...prev, trainee: trnData[0].id }));
      }
    } catch (err) {
      console.error('Error fetching institute admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstituteData(selectedInstituteId);
  }, [selectedInstituteId]);

  const currentInstitute = institutes.find(i => i.id === selectedInstituteId) || {
    id: 'INST001',
    name: 'VAMNICOM, Pune',
    type: 'National Apex Institute',
    state: 'Maharashtra'
  };

  // KPI Calculations
  const enrolledTraineesCount = trainees.length;
  const activeBatchesCount = programmes.filter(p => p.status === 'active').length;
  const facultyCount = trainers.length;
  const totalHostelCapacity = blocks.reduce((acc, b) => acc + (b.capacity || 0), 0) || 120;
  const allocatedHostelBeds = allocations.length || 18;
  const hostelOccupancyPct = Math.round((allocatedHostelBeds / totalHostelCapacity) * 100);

  // Handlers for Quick Operations
  const handleCreateBatch = async (e) => {
    e.preventDefault();
    if (!newBatch.title) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/programmes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newBatch,
          institute: selectedInstituteId
        })
      });
      if (!res.ok) throw new Error('Failed to create batch');
      setShowBatchModal(false);
      setNewBatch({
        id: `PRG-2026-${Math.floor(100 + Math.random() * 900)}`,
        title: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
        capacity: 40,
        enrolled: 0,
        mode: 'Classroom & Lab',
        language: 'Hindi / English',
        status: 'active'
      });
      await fetchInstituteData(selectedInstituteId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTrainer = async (e) => {
    e.preventDefault();
    if (!newTrainer.name || !newTrainer.email) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/trainers/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTrainer,
          institute: selectedInstituteId
        })
      });
      if (!res.ok) throw new Error('Failed to add trainer');
      setShowTrainerModal(false);
      setNewTrainer({
        id: `TRN-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        designation: 'Associate Professor of Cooperative Management',
        department: 'Cooperative Banking & Management',
        email: '',
        phone: '',
        specialization: 'PACS Computerization, Digital Accounting',
        experience_years: 8,
        status: 'active'
      });
      await fetchInstituteData(selectedInstituteId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleScheduleSession = async (e) => {
    e.preventDefault();
    if (!newSession.subject) return;
    setIsSaving(true);
    try {
      const formattedTime = `${newSession.start_time} - ${newSession.end_time}`;
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/timetables/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSession,
          time: formattedTime
        })
      });
      if (!res.ok) throw new Error('Failed to schedule session');
      setShowScheduleModal(false);
      setNewSession({
        date: new Date().toISOString().split('T')[0],
        start_time: '10:00',
        end_time: '11:30',
        subject: '',
        programme_title: programmes.length > 0 ? programmes[0].title : '',
        trainer: trainers.length > 0 ? trainers[0].name : '',
        room: 'Hall A (Smart Classroom)',
        venue_type: 'Lecture Hall'
      });
      await fetchInstituteData(selectedInstituteId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 mt-2 pb-14">
      {/* Top Banner & Institute Selector */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#152a45] rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/5 pointer-events-none blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              <Building2 size={16} /> Institute Operations & ERP Command Center
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight flex items-center gap-3">
              {currentInstitute.name}
            </h1>
            <p className="text-blue-200 mt-2 text-sm lg:text-base font-medium max-w-2xl">
              {currentInstitute.type} • {currentInstitute.state} • Operational management for batches, academic schedules, campus faculty, and residential facilities.
            </p>
          </div>

          {/* Institute Switcher Pill */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex flex-col gap-2 min-w-[260px]">
            <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin size={12} /> Campus Selection
            </label>
            <select
              value={selectedInstituteId}
              onChange={(e) => setSelectedInstituteId(e.target.value)}
              className="bg-white text-gray-900 font-bold text-sm rounded-xl px-3 py-2.5 outline-none shadow-sm focus:ring-2 focus:ring-amber-400"
            >
              {institutes.map(inst => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.state})
                </option>
              ))}
            </select>
            <span className="text-[11px] text-green-300 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Edge Box Campus Node Online
            </span>
          </div>
        </div>
      </div>

      {/* Quick Operations Action Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <Layers size={14} className="text-[#1e3a5f]" /> Instant Campus Operations:
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button 
            onClick={() => setShowBatchModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] hover:bg-[#152a45] text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow"
          >
            <Plus size={14} /> New Programme Batch
          </button>
          <button 
            onClick={() => setShowTrainerModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow"
          >
            <Plus size={14} /> Add Faculty / Trainer
          </button>
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow"
          >
            <CalendarDays size={14} /> Schedule Timetable Class
          </button>
          <button 
            onClick={() => window.location.href = '/hostel'}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow"
          >
            <Home size={14} /> Manage Hostel Beds
          </button>
        </div>
      </div>

      {/* 5 Real-Time KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Enrolled Trainees</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-[#1e3a5f]">{enrolledTraineesCount}</h3>
            <p className="text-xs text-green-600 font-semibold mt-1">✓ Active on campus</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Batches</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <BookOpen size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-[#1e3a5f]">{activeBatchesCount}</h3>
            <p className="text-xs text-amber-600 font-semibold mt-1">In progress & scheduled</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Campus Faculty</span>
            <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <GraduationCap size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-[#1e3a5f]">{facultyCount}</h3>
            <p className="text-xs text-purple-600 font-semibold mt-1">Teaching & evaluating</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hostel Occupancy</span>
            <div className="p-2 bg-rose-50 text-rose-700 rounded-xl">
              <Home size={18} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-[#1e3a5f]">{hostelOccupancyPct}%</h3>
              <span className="text-xs text-gray-400 font-medium">({allocatedHostelBeds}/{totalHostelCapacity})</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.min(hostelOccupancyPct, 100)}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Edge Box Node</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <HardDrive size={18} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-lg font-extrabold text-emerald-700">ONLINE</h3>
            </div>
            <p className="text-xs text-gray-500 font-semibold mt-1">98.4% Sync Rate • Pi 5</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Today's Schedule & Active Batches */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule Table */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-lg font-black text-[#1e3a5f] flex items-center gap-2">
                  <CalendarDays className="text-[#c17f24]" size={20} /> Today's Campus Academic Schedule
                </h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Live timetable classes running in lecture halls and computer labs</p>
              </div>
              <button 
                onClick={() => setShowScheduleModal(true)}
                className="text-xs font-bold text-[#1e3a5f] hover:underline flex items-center gap-1"
              >
                + Add Slot
              </button>
            </div>

            {timetable.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                No classes scheduled for today. Click "+ Schedule Timetable Class" above.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Time & Venue</th>
                      <th className="py-2.5 px-3">Subject / Module</th>
                      <th className="py-2.5 px-3">Programme Batch</th>
                      <th className="py-2.5 px-3">Faculty In-Charge</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {timetable.slice(0, 5).map((sess, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-semibold text-gray-800 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                            <Clock size={12} className="text-amber-600" />
                            {sess.time || `${sess.start_time} - ${sess.end_time}`}
                          </div>
                          <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5 font-normal">
                            <MapPin size={11} /> {sess.room || 'Main Hall'}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-bold text-[#1e3a5f]">
                          {sess.subject}
                        </td>
                        <td className="py-3 px-3 text-gray-600 font-medium">
                          {sess.programme_title}
                        </td>
                        <td className="py-3 px-3 font-semibold text-gray-700 whitespace-nowrap">
                          {sess.trainer}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold">
                            Live / On Time
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Active Programme Batches */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-lg font-black text-[#1e3a5f] flex items-center gap-2">
                  <BookOpen className="text-[#c17f24]" size={20} /> Campus Programme Batches
                </h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Capacity, enrollment and progress for programmes at {currentInstitute.name}</p>
              </div>
              <button 
                onClick={() => setShowBatchModal(true)}
                className="text-xs font-bold text-[#1e3a5f] hover:underline flex items-center gap-1"
              >
                + Create Batch
              </button>
            </div>

            <div className="space-y-4">
              {programmes.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  No programmes currently assigned to this campus. Create one with the "+ New Programme Batch" button above!
                </div>
              ) : (
                programmes.map((prg) => {
                  const enrollPct = Math.min(100, Math.round(((prg.enrolled || 1) / (prg.capacity || 40)) * 100));
                  return (
                    <div key={prg.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-sm text-[#1e3a5f]">{prg.title}</h3>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">
                              {prg.mode || 'Classroom'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">
                            Duration: {prg.start_date} to {prg.end_date} • Language: {prg.language || 'English/Hindi'}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-gray-700 bg-white px-3 py-1 rounded-lg border border-gray-200">
                          {prg.enrolled || 0} / {prg.capacity} Enrolled
                        </span>
                      </div>

                      {/* Capacity Bar */}
                      <div className="space-y-1 mt-3">
                        <div className="flex justify-between text-[11px] font-semibold text-gray-500">
                          <span>Batch Capacity Fill</span>
                          <span>{enrollPct}% Filled</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${enrollPct >= 90 ? 'bg-amber-500' : 'bg-[#1e3a5f]'}`}
                            style={{ width: `${enrollPct}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Campus Faculty & Hostel Allocation */}
        <div className="space-y-6">
          {/* Campus Faculty Roster */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-base font-black text-[#1e3a5f] flex items-center gap-2">
                  <GraduationCap className="text-[#c17f24]" size={18} /> Campus Faculty Roster
                </h2>
                <p className="text-[11px] text-gray-400 font-medium">Trainers stationed at this campus</p>
              </div>
              <button 
                onClick={() => setShowTrainerModal(true)}
                className="text-xs font-bold text-[#1e3a5f] hover:underline"
              >
                + Add
              </button>
            </div>

            <div className="space-y-3">
              {trainers.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-xs">
                  No faculty assigned yet.
                </div>
              ) : (
                trainers.map((trn) => (
                  <div key={trn.id} className="p-3.5 rounded-xl border border-gray-100 bg-slate-50 hover:bg-blue-50/50 transition-colors flex items-start gap-3">
                    <img 
                      src={trn.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                      alt={trn.name} 
                      className="w-10 h-10 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-[#1e3a5f] truncate">{trn.name}</h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          {trn.status || 'Active'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">{trn.designation}</p>
                      <p className="text-[10px] text-blue-700 font-semibold mt-1 truncate">
                        ★ {trn.specialization}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <a 
              href="/trainers" 
              className="mt-4 block text-center text-xs font-bold text-[#1e3a5f] py-2 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              View Full Faculty Directory →
            </a>
          </div>

          {/* Hostel Blocks & Residential Facilities */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-base font-black text-[#1e3a5f] flex items-center gap-2">
                  <Home className="text-[#c17f24]" size={18} /> Hostel & Accommodation
                </h2>
                <p className="text-[11px] text-gray-400 font-medium">Beds occupied by outstation trainees</p>
              </div>
              <a href="/hostel" className="text-xs font-bold text-[#1e3a5f] hover:underline">
                Manage
              </a>
            </div>

            <div className="space-y-3">
              {blocks.slice(0, 3).map((blk) => (
                <div key={blk.id} className="p-3.5 rounded-xl border border-gray-100 bg-slate-50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-gray-800">{blk.name}</span>
                    <span className="text-[11px] font-bold text-amber-700">
                      {blk.occupied || 12} / {blk.capacity || 40} Beds
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full" 
                      style={{ width: `${Math.min(100, Math.round(((blk.occupied || 12) / (blk.capacity || 40)) * 100))}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200/60 flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-900">Total Allocations Active:</span>
              <span className="font-extrabold text-amber-800">{allocations.length || 18} Trainees Checked In</span>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Create Programme Batch */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-1">Create New Programme Batch</h3>
            <p className="text-xs text-gray-500 mb-5">Assign a new training programme batch to {currentInstitute.name}</p>

            <form onSubmit={handleCreateBatch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Batch Programme Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. PACS Computerization & Ledger Entry Batch #4"
                  value={newBatch.title}
                  onChange={e => setNewBatch({ ...newBatch, title: e.target.value })}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Start Date</label>
                  <input 
                    type="date" 
                    required
                    value={newBatch.start_date}
                    onChange={e => setNewBatch({ ...newBatch, start_date: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">End Date</label>
                  <input 
                    type="date" 
                    required
                    value={newBatch.end_date}
                    onChange={e => setNewBatch({ ...newBatch, end_date: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Batch Capacity</label>
                  <input 
                    type="number" 
                    required
                    value={newBatch.capacity}
                    onChange={e => setNewBatch({ ...newBatch, capacity: parseInt(e.target.value, 10) })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mode</label>
                  <select 
                    value={newBatch.mode}
                    onChange={e => setNewBatch({ ...newBatch, mode: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  >
                    <option value="Classroom & Lab">Classroom & Lab</option>
                    <option value="Online / Hybrid">Online / Hybrid</option>
                    <option value="Residential Workshop">Residential Workshop</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1e3a5f] hover:bg-[#152a45] shadow flex items-center gap-2"
                >
                  {isSaving && <RefreshCw size={14} className="animate-spin" />}
                  {isSaving ? 'Creating Batch...' : 'Publish Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Faculty / Trainer */}
      {showTrainerModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-1">Add Faculty Member</h3>
            <p className="text-xs text-gray-500 mb-5">Station a new faculty/trainer at {currentInstitute.name}</p>

            <form onSubmit={handleAddTrainer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Dr. Ramesh Chander"
                  value={newTrainer.name}
                  onChange={e => setNewTrainer({ ...newTrainer, name: e.target.value })}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Designation</label>
                  <input 
                    type="text" 
                    required
                    value={newTrainer.designation}
                    onChange={e => setNewTrainer({ ...newTrainer, designation: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Department</label>
                  <input 
                    type="text" 
                    required
                    value={newTrainer.department}
                    onChange={e => setNewTrainer({ ...newTrainer, department: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Official Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="name@vamnicom.gov.in"
                    value={newTrainer.email}
                    onChange={e => setNewTrainer({ ...newTrainer, email: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Phone</label>
                  <input 
                    type="text" 
                    required
                    placeholder="+91 98765 43210"
                    value={newTrainer.phone}
                    onChange={e => setNewTrainer({ ...newTrainer, phone: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Domain Specialization</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. PACS Digitization, Cooperative Audit & Taxation"
                  value={newTrainer.specialization}
                  onChange={e => setNewTrainer({ ...newTrainer, specialization: e.target.value })}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowTrainerModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow flex items-center gap-2"
                >
                  {isSaving && <RefreshCw size={14} className="animate-spin" />}
                  {isSaving ? 'Registering...' : 'Register Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Schedule Timetable Session */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-1">Schedule Campus Lecture / Lab</h3>
            <p className="text-xs text-gray-500 mb-5">Add a slot to the daily timetable at {currentInstitute.name}</p>

            <form onSubmit={handleScheduleSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subject / Session Topic</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. PACS Day-End Ledger Balancing & Vouching"
                  value={newSession.subject}
                  onChange={e => setNewSession({ ...newSession, subject: e.target.value })}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Programme Batch</label>
                  <select 
                    value={newSession.programme_title}
                    onChange={e => setNewSession({ ...newSession, programme_title: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  >
                    {programmes.map(p => (
                      <option key={p.id} value={p.title}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Trainer / Faculty</label>
                  <select 
                    value={newSession.trainer}
                    onChange={e => setNewSession({ ...newSession, trainer: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  >
                    {trainers.map(t => (
                      <option key={t.id} value={t.name}>{t.name} ({t.designation.split(' ')[0]})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Start Time</label>
                  <input 
                    type="time" 
                    required
                    value={newSession.start_time}
                    onChange={e => setNewSession({ ...newSession, start_time: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">End Time</label>
                  <input 
                    type="time" 
                    required
                    value={newSession.end_time}
                    onChange={e => setNewSession({ ...newSession, end_time: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Room / Venue</label>
                  <input 
                    type="text" 
                    required
                    value={newSession.room}
                    onChange={e => setNewSession({ ...newSession, room: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Venue Type</label>
                  <select 
                    value={newSession.venue_type}
                    onChange={e => setNewSession({ ...newSession, venue_type: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  >
                    <option value="Lecture Hall">Lecture Hall</option>
                    <option value="Computer Lab">Computer Lab</option>
                    <option value="Auditorium">Auditorium</option>
                    <option value="Seminar Room">Seminar Room</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 shadow flex items-center gap-2"
                >
                  {isSaving && <RefreshCw size={14} className="animate-spin" />}
                  {isSaving ? 'Scheduling...' : 'Confirm Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  User, 
  BookOpen, 
  CheckCircle2, 
  Layers,
  Calendar as CalendarIcon,
  ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../../store';

export default function TimetablePage() {
  const { user } = useAuthStore();
  const canSchedule = user?.role === 'ncct_admin' || user?.role === 'institute_admin' || user?.role === 'trainer';
  const isTrainee = user?.role === 'trainee';

  const [sessions, setSessions] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [venueFilter, setVenueFilter] = useState('ALL');
  const [traineeFilter, setTraineeFilter] = useState('ALL'); // 'ALL' or 'MY_BATCH'

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    start_time: '09:30',
    end_time: '11:00',
    subject: '',
    programme_title: '',
    trainer: '',
    room: 'Lecture Hall 101',
    venue_type: 'Lecture Hall'
  });

  const fetchData = async () => {
    try {
      const [sessRes, progRes, trnRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/timetables/`),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/programmes/`),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/trainers/`)
      ]);
      const sessData = await sessRes.json();
      const progData = await progRes.json();
      const trnData = await trnRes.json();
      setSessions(sessData);
      setProgrammes(progData);
      setTrainers(trnData);
      if (progData.length > 0 && !form.programme_title) {
        setForm(prev => ({ ...prev, programme_title: progData[0].title }));
      }
      if (trnData.length > 0 && !form.trainer) {
        setForm(prev => ({ ...prev, trainer: trnData[0].name }));
      }
    } catch (err) {
      console.error('Error fetching timetable data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatTimeRange = (start, end) => {
    if (!start) return '';
    const convert = (t) => {
      const [h, m] = t.split(':');
      const hour = parseInt(h, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${m} ${ampm}`;
    };
    return `${convert(start)} - ${convert(end || start)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formattedTime = formatTimeRange(form.start_time, form.end_time);
      const payload = {
        ...form,
        time: formattedTime
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/timetables/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to create session');
      
      setShowModal(false);
      setForm({
        date: new Date().toISOString().split('T')[0],
        start_time: '09:30',
        end_time: '11:00',
        subject: '',
        programme_title: programmes.length > 0 ? programmes[0].title : '',
        trainer: '',
        room: 'Lecture Hall 101',
        venue_type: 'Lecture Hall'
      });
      await fetchData();
    } catch (err) {
      console.error('Error saving session:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredSessions = sessions.filter(s => {
    const matchSearch = (s.subject || '').toLowerCase().includes(search.toLowerCase()) ||
                        (s.trainer || '').toLowerCase().includes(search.toLowerCase()) ||
                        (s.programme_title || '').toLowerCase().includes(search.toLowerCase()) ||
                        (s.room || '').toLowerCase().includes(search.toLowerCase());
    const matchDate = !selectedDate || s.date === selectedDate;
    const matchVenue = venueFilter === 'ALL' || s.venue_type === venueFilter;
    const matchTraineeBatch = !isTrainee || traineeFilter === 'ALL' || 
      (s.programme_title || '').toLowerCase().includes('pacs') || 
      (s.programme_title || '').toLowerCase().includes('cooperative');
    return matchSearch && matchDate && matchVenue && matchTraineeBatch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 mt-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c17f24] uppercase tracking-wider mb-1">
            <Layers size={14} /> {isTrainee ? 'My Academic Schedule' : 'ERP Academic Operations'}
          </div>
          <h1 className="text-3xl font-extrabold text-[#1e3a5f] flex items-center gap-3">
            <CalendarDays className="text-[#c17f24]" /> 
            {isTrainee ? 'Academic Timetable & Class Schedule' : 'Academic Timetable & Scheduling'}
          </h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">
            {isTrainee 
              ? 'View daily lectures, practical lab sessions, faculty allocations, and venue halls for your enrolled batch'
              : 'Manage training batches, faculty allocations, lecture halls, and practical lab slots'}
          </p>
        </div>

        {canSchedule ? (
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#1e3a5f] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#152a45] transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} /> Schedule New Session
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-xl">
            <User className="text-blue-700" size={18} />
            <div>
              <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Trainee Roster</p>
              <p className="text-sm font-semibold text-blue-950">{user?.name || 'Arjun Kumar Verma'} (Batch A)</p>
            </div>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by topic, faculty, programme, room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-100 rounded-lg focus:border-[#1e3a5f] focus:ring-0 transition-colors text-sm"
          />
        </div>

        <div className="flex items-center gap-2 min-w-[200px]">
          <CalendarIcon size={18} className="text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border-2 border-gray-100 rounded-lg text-sm text-gray-700 focus:border-[#1e3a5f] outline-none"
          />
          {selectedDate && (
            <button 
              onClick={() => setSelectedDate('')} 
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={venueFilter}
            onChange={(e) => setVenueFilter(e.target.value)}
            className="px-3 py-2 border-2 border-gray-100 rounded-lg text-sm font-medium text-gray-700 focus:border-[#1e3a5f] outline-none"
          >
            <option value="ALL">All Venues</option>
            <option value="Lecture Hall">Lecture Halls</option>
            <option value="Computer Lab">Computer Labs</option>
            <option value="Seminar Hall">Seminar Halls</option>
            <option value="Virtual / Online">Virtual / Online</option>
          </select>
        </div>

        {isTrainee && (
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setTraineeFilter('MY_BATCH')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${traineeFilter === 'MY_BATCH' ? 'bg-[#1e3a5f] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              My Batch Schedule
            </button>
            <button
              onClick={() => setTraineeFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${traineeFilter === 'ALL' ? 'bg-white text-[#1e3a5f] shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              All Campus Sessions
            </button>
          </div>
        )}
      </div>

      {/* Session List */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl text-center text-gray-400 font-medium">
          Loading timetable sessions from database...
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl text-center border border-gray-200">
          <CalendarDays size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-bold text-gray-700">No sessions match your filter</h3>
          <p className="text-sm text-gray-500 mt-1">
            {isTrainee 
              ? 'No classes found for the selected date or venue. Check back later or view all campus sessions.'
              : 'Try clearing date or venue filters, or schedule a new training session.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSessions.map((sess) => {
            const isMyBatch = (sess.programme_title || '').toLowerCase().includes('pacs') || 
                              (sess.programme_title || '').toLowerCase().includes('cooperative');
            return (
              <div 
                key={sess.id} 
                className={`bg-white rounded-2xl shadow-sm border ${isTrainee && isMyBatch ? 'border-[#c17f24]/50 ring-1 ring-[#c17f24]/20' : 'border-gray-200'} p-5 hover:shadow-md transition-all flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-50 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-blue-100">
                        <Clock size={13} /> {sess.time || `${sess.start_time} - ${sess.end_time}`}
                      </span>
                      <span className="bg-amber-50 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-100">
                        {sess.date || 'Scheduled'}
                      </span>
                      {isTrainee && isMyBatch && (
                        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={12} /> Enrolled Batch
                        </span>
                      )}
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      sess.venue_type === 'Computer Lab' ? 'bg-purple-100 text-purple-700' :
                      sess.venue_type === 'Seminar Hall' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {sess.venue_type || 'Lecture Hall'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-snug">{sess.subject}</h3>
                    <p className="text-xs font-semibold text-[#1e3a5f] mt-1 flex items-center gap-1.5">
                      <BookOpen size={14} className="text-[#c17f24]" /> {sess.programme_title || 'General Cooperative Module'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                      <User size={12} />
                    </div>
                    <span className="font-semibold text-gray-800">{sess.trainer}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-gray-500">
                    <MapPin size={13} className="text-gray-400" />
                    <span>{sess.room}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Schedule Session with explicit Date & Time Pickers */}
      {canSchedule && showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
                <CalendarDays className="text-[#c17f24]" size={24} /> Schedule Training Session
              </h2>
              <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                ERP Academic
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Date Picker */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  1. Session Date
                </label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] outline-none text-sm font-medium"
                />
              </div>

              {/* Time Pickers (Start & End Time) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    2. Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={form.start_time}
                    onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] outline-none text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    3. End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={form.end_time}
                    onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] outline-none text-sm font-medium"
                  />
                </div>
              </div>

              {/* Programme Select */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  4. Associated Programme
                </label>
                <select
                  value={form.programme_title}
                  onChange={(e) => setForm({ ...form, programme_title: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl outline-none text-sm font-medium bg-white"
                  required
                >
                  <option value="">-- Choose Programme --</option>
                  {programmes.map((p) => (
                    <option key={p.id} value={p.title}>
                      {p.title} ({p.mode})
                    </option>
                  ))}
                  {programmes.length === 0 && (
                    <option value="Diploma in Cooperative Management">Diploma in Cooperative Management</option>
                  )}
                </select>
              </div>

              {/* Subject / Topic */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  5. Topic / Subject Module
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PACS Digital Accounting & Balance Sheet"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] outline-none text-sm"
                />
              </div>

              {/* Trainer */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  6. Trainer / Faculty In-Charge
                </label>
                {trainers.length > 0 ? (
                  <select
                    value={form.trainer}
                    onChange={(e) => setForm({ ...form, trainer: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] outline-none text-sm font-medium bg-white"
                  >
                    {trainers.map(t => (
                      <option key={t.id} value={t.name}>{t.name} ({t.designation})</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Sneha Patil (Professor)"
                    value={form.trainer}
                    onChange={(e) => setForm({ ...form, trainer: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] outline-none text-sm"
                  />
                )}
              </div>

              {/* Venue & Venue Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    7. Room / Hall No.
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hall 204"
                    value={form.room}
                    onChange={(e) => setForm({ ...form, room: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    8. Venue Type
                  </label>
                  <select
                    value={form.venue_type}
                    onChange={(e) => setForm({ ...form, venue_type: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none text-sm font-medium bg-white"
                  >
                    <option value="Lecture Hall">Lecture Hall</option>
                    <option value="Computer Lab">Computer Lab</option>
                    <option value="Seminar Hall">Seminar Hall</option>
                    <option value="Virtual / Online">Virtual / Online</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-[#1e3a5f] text-white font-bold rounded-xl hover:bg-[#152a45] transition-colors text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Confirm & Schedule'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



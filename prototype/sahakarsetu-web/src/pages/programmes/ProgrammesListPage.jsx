import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  GraduationCap, 
  ArrowRight, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';

export default function ProgrammesListPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'ncct_admin' || user?.role === 'institute_admin';
  const isTrainee = user?.role === 'trainee';

  const [programmes, setProgrammes] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' or 'ENROLLED'
  const [enrollSuccessMsg, setEnrollSuccessMsg] = useState(null);

  const [enrolledProgIds, setEnrolledProgIds] = useState(() => {
    const saved = localStorage.getItem('trainee_enrolled_progs');
    return saved ? JSON.parse(saved) : ['PROG001'];
  });

  const [showModal, setShowModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedProg, setSelectedProg] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newProg, setNewProg] = useState({
    id: `PROG-${Math.floor(Math.random()*1000)}`,
    title: '', institute: '', start_date: '2026-10-10', end_date: '2026-12-10',
    capacity: 50, enrolled: 0, status: 'active', mode: 'Online', language: 'English'
  });

  const fetchData = async () => {
    try {
      const [progRes, instRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/programmes/`),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/institutes/`)
      ]);
      const progs = await progRes.json();
      const insts = await instRes.json();
      setProgrammes(progs);
      setInstitutes(insts);
      if (insts.length > 0) {
        setNewProg(prev => ({ ...prev, institute: insts[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    setIsSaving(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/programmes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProg)
      });
      setShowModal(false);
      setNewProg({
        id: `PROG-${Math.floor(Math.random()*1000)}`,
        title: '', institute: institutes.length > 0 ? institutes[0].id : '', start_date: '2026-10-10', end_date: '2026-12-10',
        capacity: 50, enrolled: 0, status: 'active', mode: 'Online', language: 'English'
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEnroll = (prog) => {
    if (enrolledProgIds.includes(prog.id)) return;
    const updated = [...enrolledProgIds, prog.id];
    setEnrolledProgIds(updated);
    localStorage.setItem('trainee_enrolled_progs', JSON.stringify(updated));
    setProgrammes(prev => prev.map(p => p.id === prog.id ? { ...p, enrolled: p.enrolled + 1 } : p));
    setEnrollSuccessMsg(`Successfully enrolled in "${prog.title}"! Batch allocated under Sahakar ID ${user?.sahakarId || 'SAH-2026-000001'}.`);
    setTimeout(() => setEnrollSuccessMsg(null), 5000);
  };

  const filtered = programmes.filter(prog => {
    const matchSearch = prog.title.toLowerCase().includes(search.toLowerCase()) || 
                         prog.mode.toLowerCase().includes(search.toLowerCase());
    const matchTab = !isTrainee || activeTab === 'ALL' || enrolledProgIds.includes(prog.id);
    return matchSearch && matchTab;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 mt-4 pb-12">
      {/* Toast Confirmation */}
      {enrollSuccessMsg && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={24} className="text-emerald-200" />
            <p className="font-semibold text-sm">{enrollSuccessMsg}</p>
          </div>
          <button 
            onClick={() => navigate('/learning')}
            className="bg-white text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Go to LMS →
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c17f24] uppercase tracking-wider mb-1">
            <GraduationCap size={14} /> {isTrainee ? 'Course Catalog & Enrollment' : 'Academic Course Management'}
          </div>
          <h1 className="text-3xl font-extrabold text-[#1e3a5f] flex items-center gap-3">
            <BookOpen className="text-[#c17f24]" /> 
            {isTrainee ? 'Training Programmes & Courses' : 'Training Programmes'}
          </h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">
            {isTrainee 
              ? 'Browse accredited cooperative training courses, review syllabus, and enroll in upcoming batches'
              : 'Manage cooperative training courses, batches, and academic offerings'}
          </p>
        </div>

        {isAdmin ? (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#1e3a5f] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#152a45] transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} /> Create Programme
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-xl">
            <ShieldCheck className="text-blue-700" size={20} />
            <div>
              <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Trainee Status</p>
              <p className="text-sm font-semibold text-blue-950">
                {enrolledProgIds.length} Programme{enrolledProgIds.length > 1 ? 's' : ''} Enrolled
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Tab Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by programme title or mode..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-100 rounded-lg focus:border-[#1e3a5f] focus:ring-0 transition-colors text-sm"
          />
        </div>

        {isTrainee && (
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${activeTab === 'ALL' ? 'bg-white text-[#1e3a5f] shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              All Catalog Programmes ({programmes.length})
            </button>
            <button
              onClick={() => setActiveTab('ENROLLED')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${activeTab === 'ENROLLED' ? 'bg-[#1e3a5f] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              My Enrolled Programmes ({enrolledProgIds.length})
            </button>
          </div>
        )}
      </div>

      {/* Programmes Grid */}
      {loading ? (
        <div className="p-12 text-center text-gray-400 font-medium">Loading programmes...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl text-center border border-gray-200">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-bold text-gray-700">No programmes found</h3>
          <p className="text-sm text-gray-500 mt-1">
            {activeTab === 'ENROLLED' 
              ? 'You have not enrolled in this category yet. Switch to "All Catalog Programmes" to browse and enroll.' 
              : 'Try modifying your search term.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map(prog => {
            const isEnrolled = enrolledProgIds.includes(prog.id);
            const isFull = prog.enrolled >= prog.capacity;

            return (
              <div 
                key={prog.id} 
                className={`bg-white rounded-2xl shadow-sm border ${
                  isEnrolled ? 'border-emerald-300 ring-2 ring-emerald-200/50' : 'border-gray-200'
                } overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group`}
              >
                {/* Card Main Body */}
                <div className="p-6 space-y-4">
                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md uppercase tracking-wider ${
                        prog.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {prog.status}
                      </span>
                      <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md uppercase tracking-wider ${
                        prog.mode === 'Hybrid' || prog.mode === 'Blended' ? 'bg-purple-100 text-purple-700' : prog.mode === 'Online' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {prog.mode}
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                        Cutoff: {prog.cutoff_score || 75}%
                      </span>
                    </div>

                    {isEnrolled && (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                        <CheckCircle2 size={13} /> Enrolled ✓
                      </span>
                    )}
                  </div>
                  
                  {/* Title & Identifier */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-[#1e3a5f] transition-colors">
                      {prog.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500 mt-2">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-semibold">{prog.language || 'English'}</span>
                      <span className="text-gray-400">• Programme Code: <strong className="font-mono text-gray-700">{prog.id}</strong></span>
                    </div>
                  </div>

                  {/* Dates & Institute Details */}
                  <div className="space-y-2 pt-1 text-xs text-gray-600">
                    <div className="flex items-center gap-2 font-medium">
                      <Calendar size={15} className="text-gray-400 shrink-0" /> 
                      <span>{new Date(prog.start_date).toLocaleDateString()} – {new Date(prog.end_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <Building2 size={15} className="text-gray-400 shrink-0" /> 
                      <span className="text-gray-800 font-semibold">{prog.institute_name}</span>
                    </div>
                  </div>

                  {/* Enrollment Capacity & Progress */}
                  <div className="pt-2 bg-slate-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-bold text-gray-500 uppercase tracking-wider text-[11px]">Enrollment Capacity</span>
                      <span className="font-bold text-gray-800">
                        <strong className="text-[#1e3a5f] text-sm">{prog.enrolled}</strong> / {prog.capacity} seats ({Math.round((prog.enrolled / prog.capacity) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all ${isFull ? 'bg-red-500' : 'bg-[#c17f24]'}`} 
                        style={{ width: `${Math.min(100, (prog.enrolled / prog.capacity) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 mt-auto">
                  {isAdmin ? (
                    <button 
                      onClick={() => { setSelectedProg(prog); setShowBatchModal(true); }}
                      className="w-full py-2.5 bg-white border-2 border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-sm"
                    >
                      Manage Batch
                    </button>
                  ) : isEnrolled ? (
                    <button 
                      onClick={() => {
                        localStorage.setItem('active_lms_prog_id', prog.id);
                        navigate('/learning', { state: { programmeId: prog.id } });
                      }}
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
                    >
                      <BookOpen size={16} /> Resume Learning <ArrowRight size={15} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleEnroll(prog)}
                      disabled={isFull}
                      className="w-full py-3 px-4 bg-[#1e3a5f] hover:bg-[#152a45] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
                    >
                      <Sparkles size={16} className="text-[#c17f24]" /> 
                      {isFull ? 'Batch Full' : 'Enroll in Programme'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Modal: Create Programme */}
      {isAdmin && showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">Create Programme</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                <input required type="text" value={newProg.title} onChange={e => setNewProg({...newProg, title: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] outline-none" placeholder="e.g. Diploma in Cooperative Management" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Host Institute</label>
                <select value={newProg.institute} onChange={e => setNewProg({...newProg, institute: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" required>
                  <option value="">-- Select Institute --</option>
                  {institutes.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Mode</label>
                  <select value={newProg.mode} onChange={e => setNewProg({...newProg, mode: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none">
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="In-Person">In-Person</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Capacity</label>
                  <input type="number" required value={newProg.capacity} onChange={e => setNewProg({...newProg, capacity: Number(e.target.value)})} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} disabled={isSaving} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex-1 py-2.5 bg-[#1e3a5f] text-white font-bold rounded-xl hover:bg-[#152a45] disabled:opacity-50 flex justify-center items-center gap-2">
                  {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Modal: Manage Batch */}
      {isAdmin && showBatchModal && selectedProg && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">Manage Batch: {selectedProg.title}</h2>
            <p className="text-sm text-gray-500 mb-6">Enrolled: {selectedProg.enrolled} / {selectedProg.capacity}</p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <Users size={32} className="mx-auto text-gray-400 mb-2" />
              <h3 className="font-bold text-gray-700">Trainee Roster</h3>
              <p className="text-sm text-gray-500">Trainees can be assigned by Institute Admins during registration.</p>
              <button onClick={() => setShowBatchModal(false)} className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">Close Batch Manager</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



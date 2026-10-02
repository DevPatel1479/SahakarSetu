import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Plus, 
  Building2, 
  Mail, 
  Phone, 
  Award, 
  Briefcase, 
  Calendar, 
  Layers, 
  RefreshCw, 
  CheckCircle2, 
  UserCheck, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useAuthStore } from '../../store';

export default function TrainersListPage() {
  const { user } = useAuthStore();
  const canManage = user?.role === 'ncct_admin' || user?.role === 'institute_admin';

  const [trainers, setTrainers] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedInstitute, setSelectedInstitute] = useState('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTrainerForAssign, setSelectedTrainerForAssign] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [form, setForm] = useState({
    id: `TRN-${Math.floor(100 + Math.random() * 900)}`,
    name: '',
    institute: 'INST001',
    designation: 'Assistant Professor of Cooperative Governance',
    department: 'Cooperative Banking & Management',
    email: '',
    phone: '',
    specialization: 'PACS Accounting, Cooperative Law & Governance',
    experience_years: 6,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });

  const [assignForm, setAssignForm] = useState({
    programmeId: '',
    role: 'Lead Instructor'
  });

  const fetchData = async () => {
    try {
      const [tRes, iRes, pRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/trainers/`),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/institutes/`),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/programmes/`)
      ]);
      const tData = await tRes.json();
      const iData = await iRes.json();
      const pData = await pRes.json();

      setTrainers(tData);
      setInstitutes(iData);
      setProgrammes(pData);

      if (pData.length > 0) {
        setAssignForm(prev => ({ ...prev, programmeId: pData[0].id }));
      }
    } catch (err) {
      console.error('Error fetching trainers data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTrainer = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/trainers/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to create trainer');
      setShowAddModal(false);
      setForm({
        id: `TRN-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        institute: institutes.length > 0 ? institutes[0].id : 'INST001',
        designation: 'Assistant Professor of Cooperative Governance',
        department: 'Cooperative Banking & Management',
        email: '',
        phone: '',
        specialization: 'PACS Accounting, Cooperative Law & Governance',
        experience_years: 6,
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      });
      await fetchData();
    } catch (err) {
      console.error('Error saving trainer:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAssignToBatch = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate batch allocation assignment
    setTimeout(() => {
      setIsSaving(false);
      setShowAssignModal(false);
      alert(`Successfully assigned ${selectedTrainerForAssign?.name} as ${assignForm.role} to programme batch.`);
    }, 600);
  };

  const filteredTrainers = trainers.filter(t => {
    const matchSearch = (t.name || '').toLowerCase().includes(search.toLowerCase()) ||
                        (t.specialization || '').toLowerCase().includes(search.toLowerCase()) ||
                        (t.designation || '').toLowerCase().includes(search.toLowerCase()) ||
                        (t.institute_name || '').toLowerCase().includes(search.toLowerCase());
    const matchInst = selectedInstitute === 'ALL' || t.institute === selectedInstitute;
    const matchDept = selectedDepartment === 'ALL' || t.department === selectedDepartment;
    return matchSearch && matchInst && matchDept;
  });

  const avgExperience = trainers.length > 0 
    ? Math.round(trainers.reduce((acc, t) => acc + (t.experience_years || 0), 0) / trainers.length) 
    : 10;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 mt-4 pb-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c17f24] uppercase tracking-wider mb-1">
            <Layers size={14} /> National Cooperative Training Faculty
          </div>
          <h1 className="text-3xl font-extrabold text-[#1e3a5f] flex items-center gap-3">
            <GraduationCap className="text-[#c17f24]" /> Faculty & Trainers Directory
          </h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">
            Stationed academic instructors, subject matter experts, and lab mentors across VAMNICOM, RICMs, and ICMs
          </p>
        </div>

        {canManage && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#1e3a5f] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#152a45] transition-colors flex items-center gap-2 shadow-sm text-sm"
          >
            <Plus size={16} /> Add Faculty Member
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Faculty</span>
          <h3 className="text-3xl font-extrabold text-[#1e3a5f] mt-2">{trainers.length}</h3>
          <p className="text-xs text-green-600 font-semibold mt-1">✓ Across all NCCT centres</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active On Duty</span>
          <h3 className="text-3xl font-extrabold text-emerald-700 mt-2">
            {trainers.filter(t => t.status === 'active').length}
          </h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Conducting active sessions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Experience</span>
          <h3 className="text-3xl font-extrabold text-[#1e3a5f] mt-2">{avgExperience} Years</h3>
          <p className="text-xs text-gray-500 font-semibold mt-1">Cooperative domain expertise</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Apex Institutes</span>
          <h3 className="text-3xl font-extrabold text-purple-700 mt-2">{institutes.length || 4}</h3>
          <p className="text-xs text-purple-600 font-semibold mt-1">VAMNICOM, RICMs & ICMs</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search faculty by name, designation, specialization or campus..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:border-[#1e3a5f] outline-none"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select 
            value={selectedInstitute}
            onChange={(e) => setSelectedInstitute(e.target.value)}
            className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-[#1e3a5f]"
          >
            <option value="ALL">All Institutes</option>
            {institutes.map(inst => (
              <option key={inst.id} value={inst.id}>{inst.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      {loading ? (
        <div className="p-16 text-center text-gray-400 flex flex-col items-center justify-center">
          <RefreshCw size={32} className="animate-spin text-[#1e3a5f] mb-3" />
          <p className="font-semibold text-sm">Loading NCCT Faculty records...</p>
        </div>
      ) : filteredTrainers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 text-gray-500">
          <GraduationCap size={44} className="mx-auto text-gray-300 mb-3" />
          <p className="text-base font-bold text-gray-700">No faculty members found</p>
          <p className="text-xs text-gray-400 mt-1">Try adjusting your search criteria or add a new faculty member.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainers.map((trn) => (
            <div key={trn.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src={trn.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                    alt={trn.name} 
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-gray-100 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1e3a5f] border border-blue-200">
                        {trn.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {trn.status || 'Active'}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base text-[#1e3a5f] truncate mt-1">{trn.name}</h3>
                    <p className="text-xs text-gray-500 font-medium truncate">{trn.designation}</p>
                  </div>
                </div>

                {/* Institute & Department */}
                <div className="space-y-1.5 py-3 border-y border-gray-50 text-xs">
                  <div className="flex items-center gap-2 text-gray-600 font-semibold">
                    <Building2 size={13} className="text-[#c17f24]" />
                    <span>{trn.institute_name || 'VAMNICOM, Pune'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Briefcase size={13} className="text-gray-400" />
                    <span>{trn.department || 'Cooperative Management'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Award size={13} className="text-purple-600" />
                    <span>{trn.experience_years || 8} Years Experience</span>
                  </div>
                </div>

                {/* Specialization Chips */}
                <div className="mt-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Domain Specialization
                  </span>
                  <div className="p-2.5 bg-slate-50 rounded-xl text-xs font-semibold text-blue-900 border border-slate-100 leading-relaxed">
                    {trn.specialization}
                  </div>
                </div>
              </div>

              {/* Contact & Actions */}
              <div className="mt-5 pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                  <div className="flex items-center gap-1 truncate max-w-[160px]">
                    <Mail size={12} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">{trn.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone size={12} className="text-gray-400 flex-shrink-0" />
                    <span>{trn.phone}</span>
                  </div>
                </div>

                {canManage && (
                  <button 
                    onClick={() => {
                      setSelectedTrainerForAssign(trn);
                      setShowAssignModal(true);
                    }}
                    className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-[#1e3a5f] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <BookOpen size={14} /> Assign to Programme Batch
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Add Faculty */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-1">Add Faculty Member</h3>
            <p className="text-xs text-gray-500 mb-5">Register and station a new trainer at an NCCT training institute</p>

            <form onSubmit={handleAddTrainer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name with Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Dr. Sneha Patil / Prof. Arun Kumar"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Station Institute</label>
                  <select 
                    value={form.institute}
                    onChange={e => setForm({ ...form, institute: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  >
                    {institutes.map(i => (
                      <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Designation</label>
                  <input 
                    type="text" 
                    required
                    value={form.designation}
                    onChange={e => setForm({ ...form, designation: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Department</label>
                  <input 
                    type="text" 
                    required
                    value={form.department}
                    onChange={e => setForm({ ...form, department: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Experience (Years)</label>
                  <input 
                    type="number" 
                    required
                    value={form.experience_years}
                    onChange={e => setForm({ ...form, experience_years: parseInt(e.target.value, 10) })}
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
                    placeholder="faculty@ncct.gov.in"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    required
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
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
                  value={form.specialization}
                  onChange={e => setForm({ ...form, specialization: e.target.value })}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
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
                  {isSaving ? 'Registering...' : 'Register Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Assign to Batch */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-1">Assign to Programme Batch</h3>
            <p className="text-xs text-gray-500 mb-5">
              Assign <span className="font-bold text-gray-800">{selectedTrainerForAssign?.name}</span> to a scheduled batch.
            </p>

            <form onSubmit={handleAssignToBatch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Programme Batch</label>
                <select 
                  value={assignForm.programmeId}
                  onChange={e => setAssignForm({ ...assignForm, programmeId: e.target.value })}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                >
                  {programmes.map(p => (
                    <option key={p.id} value={p.id}>{p.title} ({p.institute_name})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Instructor Role</label>
                <select 
                  value={assignForm.role}
                  onChange={e => setAssignForm({ ...assignForm, role: e.target.value })}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                >
                  <option value="Lead Instructor">Lead Instructor / Course Director</option>
                  <option value="Co-Instructor">Co-Instructor / Module Specialist</option>
                  <option value="Lab & Practical Mentor">Lab & Practical Mentor</option>
                  <option value="External Evaluator">External Project Evaluator</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAssignModal(false)}
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
                  {isSaving ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



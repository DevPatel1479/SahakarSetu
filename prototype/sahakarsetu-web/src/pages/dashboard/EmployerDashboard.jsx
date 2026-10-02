import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Users, 
  CheckCircle, 
  Plus, 
  QrCode, 
  X, 
  Search, 
  Filter, 
  Building2, 
  MapPin, 
  IndianRupee, 
  Award, 
  ArrowRight, 
  ChevronRight, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  TrendingUp,
  UserCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';

export default function EmployerDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const employerName = user?.name || 'Gujarat Ambuja Co-op Society';
  const employerId = user?.employerId || 'EMP-GUJ-01';

  const [activeTab, setActiveTab] = useState('POSTINGS'); // 'POSTINGS', 'PIPELINE', 'TALENT'
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);

  // Modals
  const [showPostModal, setShowPostModal] = useState(false);
  const [submittingJob, setSubmittingJob] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    location: 'Ahmedabad, Gujarat',
    salary: '₹28,000 - ₹38,000 / month',
    vacancies: 2,
    skills_required: ['SK001', 'SK002']
  });

  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  const [viewingCandidate, setViewingCandidate] = useState(null);
  const [updatingAppId, setUpdatingAppId] = useState(null);

  // QR / ID Verification
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [manualVerifyId, setManualVerifyId] = useState('');

  // Filters & Search
  const [jobSearch, setJobSearch] = useState('');
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('ALL');
  const [talentSearch, setTalentSearch] = useState('');
  const [talentSkillFilter, setTalentSkillFilter] = useState('ALL');

  // Fetch all live data from Django Backend
  const loadData = async () => {
    try {
      setLoading(true);
      const [jobsRes, appsRes, traineesRes, skillsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/jobs/`),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/applications/`),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/trainees/`),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/skills/`)
      ]);

      if (jobsRes.ok) setJobs(await jobsRes.json());
      if (appsRes.ok) setApplications(await appsRes.json());
      if (traineesRes.ok) setTrainees(await traineesRes.json());
      if (skillsRes.ok) setAvailableSkills(await skillsRes.json());
    } catch (err) {
      console.error('Error fetching employer dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // KPIs
  const activePostings = jobs.filter(j => j.status === 'open').length;
  const totalApplicants = applications.length;
  const inPipeline = applications.filter(a => a.status === 'shortlisted' || a.status === 'interview').length;
  const hiredCount = applications.filter(a => a.status === 'selected' || a.status === 'joined').length;

  // Handle Post New Job
  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!newJob.title) return;
    setSubmittingJob(true);
    try {
      const jobId = `JOB-${Date.now().toString().slice(-4)}`;
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/jobs/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: jobId,
          title: newJob.title,
          employer_id: employerId,
          employer_name: employerName,
          location: newJob.location,
          salary: newJob.salary,
          applicants: 0,
          status: 'open',
          skills_required: newJob.skills_required
        })
      });

      if (res.ok) {
        setShowPostModal(false);
        setNewJob({
          title: '',
          location: 'Ahmedabad, Gujarat',
          salary: '₹28,000 - ₹38,000 / month',
          vacancies: 2,
          skills_required: ['SK001', 'SK002']
        });
        loadData();
      }
    } catch (err) {
      console.error('Error creating job:', err);
    } finally {
      setSubmittingJob(false);
    }
  };

  // Handle Update Application Status
  const handleUpdateStatus = async (appId, newStatus) => {
    setUpdatingAppId(appId);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/applications/${appId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
      }
    } catch (err) {
      console.error('Error updating application status:', err);
    } finally {
      setUpdatingAppId(null);
    }
  };

  // Toggle Job Status (Open/Closed)
  const handleToggleJobStatus = async (job) => {
    const updatedStatus = job.status === 'open' ? 'closed' : 'open';
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/jobs/${job.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: updatedStatus })
      });
      if (res.ok) {
        setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: updatedStatus } : j));
      }
    } catch (err) {
      console.error('Error toggling job status:', err);
    }
  };

  // Filtered Lists
  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(jobSearch.toLowerCase()) || 
    j.location.toLowerCase().includes(jobSearch.toLowerCase())
  );

  const filteredApps = applications.filter(a => {
    const matchesSearch = (a.trainee_name || '').toLowerCase().includes(appSearch.toLowerCase()) ||
                          (a.trainee_sahakar_id || '').toLowerCase().includes(appSearch.toLowerCase()) ||
                          (a.job_title || '').toLowerCase().includes(appSearch.toLowerCase());
    const matchesStatus = appStatusFilter === 'ALL' || a.status === appStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTrainees = trainees.filter(t => {
    const matchesSearch = (t.name || '').toLowerCase().includes(talentSearch.toLowerCase()) ||
                          (t.id || '').toLowerCase().includes(talentSearch.toLowerCase()) ||
                          (t.state || '').toLowerCase().includes(talentSearch.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 mt-4 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c17f24] uppercase tracking-wider mb-1">
            <Building2 size={14} /> Cooperative Recruiter & Employer Ecosystem
          </div>
          <h1 className="text-3xl font-extrabold text-[#1e3a5f] flex items-center gap-3">
            <Briefcase className="text-[#c17f24]" /> Employer Portal
          </h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">
            Recruit certified rural cooperative talent, verify Sahakar ID credentials, and manage candidate pipeline
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center gap-2 bg-blue-50 text-[#1e3a5f] border-2 border-blue-200 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-100 transition-colors shadow-xs"
          >
            <QrCode size={16} /> Verify Credential
          </button>
          <button 
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#152a45] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-sm"
          >
            <Plus size={16} /> Post New Vacancy
          </button>
        </div>
      </div>

      {/* Recruiter Organization Info Banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] via-[#1a3456] to-[#254673] text-white p-6 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black">{employerName}</h2>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30 font-bold">
              ✓ Verified Cooperative Recruiter
            </span>
          </div>
          <p className="text-xs text-blue-200 font-mono mt-1">
            Employer ID: <strong className="text-white">{employerId}</strong> • State Cooperative Federation Partner
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/15 text-xs">
          <ShieldCheck className="text-emerald-400" size={18} />
          <div>
            <p className="font-bold text-white">Direct Sahakar ID Linkage</p>
            <p className="text-[11px] text-blue-200">Candidates verified against NCCT Central Training Ledger</p>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Vacancies</p>
            <h3 className="text-3xl font-black text-[#1e3a5f] mt-1">{activePostings}</h3>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">● Live in Catalog</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Briefcase size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Applications</p>
            <h3 className="text-3xl font-black text-[#1e3a5f] mt-1">{totalApplicants}</h3>
            <p className="text-[11px] text-blue-600 font-bold mt-1">Across all postings</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">In Review / Interview</p>
            <h3 className="text-3xl font-black text-[#1e3a5f] mt-1">{inPipeline}</h3>
            <p className="text-[11px] text-amber-600 font-bold mt-1">Active Pipeline</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Placed / Hired</p>
            <h3 className="text-3xl font-black text-emerald-700 mt-1">{hiredCount}</h3>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">Selected candidates</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('POSTINGS')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'POSTINGS' ? 'bg-[#1e3a5f] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Briefcase size={16} /> Job Postings & Openings ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('PIPELINE')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'PIPELINE' ? 'bg-[#1e3a5f] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <UserCheck size={16} /> Candidate Pipeline & Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('TALENT')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'TALENT' ? 'bg-[#1e3a5f] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Sparkles size={16} /> Talent Discovery & Trainee Directory
        </button>
      </div>

      {/* TAB 1: JOB POSTINGS & MANAGEMENT */}
      {activeTab === 'POSTINGS' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center justify-between">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search vacancies by title or location..." 
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-100 rounded-lg focus:border-[#1e3a5f] text-sm outline-none"
              />
            </div>
            <span className="text-xs font-bold text-gray-500">
              Showing {filteredJobs.length} Vacancies
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map(job => {
              const jobApps = applications.filter(a => a.job === job.id);
              const isOpen = job.status === 'open';

              return (
                <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="font-mono text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                        {job.id}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${
                          isOpen ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {isOpen ? '● ACTIVE RECRUITMENT' : 'CLOSED'}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 leading-snug">{job.title}</h3>
                    <p className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-1">
                      <Building2 size={13} /> {job.employer_name}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-gray-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold text-gray-800">
                        <IndianRupee size={14} className="text-emerald-600" />
                        <span>{job.salary}</span>
                      </div>
                    </div>

                    {/* Required Skills Chips */}
                    <div className="mt-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Required Competencies</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(job.skills_list || ['Accounting', 'Day Book']).map((sk, idx) => (
                          <span key={idx} className="bg-blue-50 text-blue-800 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-blue-100">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3 text-xs">
                    <span className="font-bold text-gray-700 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                      <strong>{jobApps.length}</strong> Applicants
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleJobStatus(job)}
                        className="py-2 px-3 border border-gray-300 hover:bg-gray-50 rounded-xl font-bold text-gray-700 transition-colors"
                      >
                        {isOpen ? 'Close' : 'Reopen'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedJobForApplicants(job);
                          setActiveTab('PIPELINE');
                          setAppSearch(job.title);
                        }}
                        className="py-2 px-4 bg-[#1e3a5f] hover:bg-[#152a45] text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        View Applicants <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CANDIDATE PIPELINE & APPLICATIONS */}
      {activeTab === 'PIPELINE' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <UserCheck size={20} className="text-[#1e3a5f]" /> Candidate Selection Pipeline
              </h2>
              <p className="text-xs text-gray-500">Track and advance candidate status from initial application to final cooperative placement</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter candidate or role..." 
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <select 
                value={appStatusFilter} 
                onChange={(e) => setAppStatusFilter(e.target.value)}
                className="py-1.5 px-3 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="applied">Applied</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview</option>
                <option value="selected">Selected</option>
                <option value="joined">Joined</option>
              </select>
            </div>
          </div>

          {/* Applications Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Candidate & Sahakar ID</th>
                  <th className="py-3 px-4">Applied Role / Job</th>
                  <th className="py-3 px-4">AI Skill Match</th>
                  <th className="py-3 px-4">Certified Skills</th>
                  <th className="py-3 px-4">Application Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-gray-900 text-sm">{app.trainee_name}</p>
                      <p className="font-mono text-gray-500 text-[11px] mt-0.5">{app.trainee_sahakar_id}</p>
                      <p className="text-[11px] text-gray-400">{app.trainee_institute || 'NCCT Institute'}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-800">
                      {app.job_title}
                      <p className="text-[11px] text-gray-400 font-normal mt-0.5">Applied: {app.applied_date}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[#1e3a5f] text-sm">{app.match_score || 92}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full ${app.match_score >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                            style={{ width: `${app.match_score || 92}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {(app.trainee_skills || ['Accounting', 'Day Book']).slice(0, 3).map((sk, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[10px] font-medium">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {/* Interactive Status Transition Dropdown */}
                      <div className="relative inline-block">
                        <select
                          disabled={updatingAppId === app.id}
                          value={app.status}
                          onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                          className={`py-1 px-2.5 rounded-lg text-xs font-bold border cursor-pointer outline-none transition-colors ${
                            app.status === 'selected' || app.status === 'joined'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : app.status === 'interview'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : app.status === 'shortlisted'
                              ? 'bg-purple-50 text-purple-800 border-purple-300'
                              : 'bg-blue-50 text-blue-800 border-blue-300'
                          }`}
                        >
                          <option value="applied">Applied</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="interview">Interview</option>
                          <option value="selected">Selected</option>
                          <option value="joined">Joined</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setViewingCandidate(app)}
                        className="py-1.5 px-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold rounded-lg transition-colors text-xs inline-flex items-center gap-1 shadow-2xs"
                      >
                        <Award size={13} className="text-[#c17f24]" /> Skill Passport
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TALENT DISCOVERY & TRAINEE DIRECTORY */}
      {activeTab === 'TALENT' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center justify-between">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search candidates by name, Sahakar ID, state..." 
                value={talentSearch}
                onChange={(e) => setTalentSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-100 rounded-lg focus:border-[#1e3a5f] text-sm outline-none"
              />
            </div>
            <span className="text-xs font-bold text-gray-500">
              {filteredTrainees.length} Certified Candidates Registered
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredTrainees.map(trainee => (
              <div key={trainee.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="font-mono text-[10px] font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                      {trainee.id}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                      Score: {trainee.assessment_score}%
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base">{trainee.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{trainee.state} • {trainee.cooperative || 'PACS'}</p>

                  <div className="mt-3 pt-3 border-t border-gray-100 text-xs space-y-1 text-gray-600">
                    <p><span className="font-semibold text-gray-700">Attendance:</span> {trainee.attendance_pct}%</p>
                    <p><span className="font-semibold text-gray-700">Phone:</span> {trainee.phone}</p>
                    <p><span className="font-semibold text-gray-700">Email:</span> {trainee.email}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setViewingCandidate({
                        trainee_name: trainee.name,
                        trainee_sahakar_id: trainee.id,
                        trainee_institute: 'VAMNICOM / RICM Network',
                        trainee_skills: ['Cooperative Accounting', 'Day Book & Ledger', 'Tally ERP']
                      });
                    }}
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition-colors"
                  >
                    View Passport
                  </button>
                  <button
                    onClick={() => {
                      alert(`Direct recruitment invite sent to ${trainee.name} (${trainee.id})!`);
                    }}
                    className="flex-1 py-2 bg-[#1e3a5f] hover:bg-[#152a45] text-white font-bold rounded-xl text-xs transition-colors shadow-2xs"
                  >
                    Invite to Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: POST NEW JOB */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-xl font-extrabold text-[#1e3a5f] flex items-center gap-2">
                  <Briefcase size={20} className="text-[#c17f24]" /> Post New Cooperative Vacancy
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Recruit accredited trainees directly from NCCT institutes</p>
              </div>
              <button 
                onClick={() => setShowPostModal(false)}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePostJob} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Job Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. PACS Accounts Assistant / Society Auditor"
                  value={newJob.title}
                  onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1e3a5f] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Location / District *</label>
                  <input 
                    type="text" 
                    required
                    value={newJob.location}
                    onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Salary Range *</label>
                  <input 
                    type="text" 
                    required
                    value={newJob.salary}
                    onChange={e => setNewJob({ ...newJob, salary: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Required Skills (Select from Taxonomy) *</label>
                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200 max-h-36 overflow-y-auto">
                  {[
                    { id: 'SK001', name: 'PACS Accounting & Ledger' },
                    { id: 'SK002', name: 'Tally ERP & Day Book' },
                    { id: 'SK003', name: 'PACS Governance & Operations' },
                    { id: 'SK005', name: 'Statutory Audit & NPA' },
                    { id: 'SK006', name: 'GST & Statutory Compliance' },
                    { id: 'SK007', name: 'Cold Storage & Inventory' },
                    { id: 'SK008', name: 'Core Banking Software (CBS)' }
                  ].map(sk => {
                    const selected = newJob.skills_required.includes(sk.id);
                    return (
                      <label key={sk.id} className="flex items-center gap-2 cursor-pointer text-[11px] font-medium text-gray-700">
                        <input 
                          type="checkbox" 
                          checked={selected}
                          onChange={() => {
                            const updated = selected 
                              ? newJob.skills_required.filter(id => id !== sk.id)
                              : [...newJob.skills_required, sk.id];
                            setNewJob({ ...newJob, skills_required: updated });
                          }}
                          className="rounded text-[#1e3a5f]"
                        />
                        {sk.name}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingJob}
                  className="flex-1 py-2.5 bg-[#1e3a5f] hover:bg-[#152a45] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  {submittingJob ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Publish Vacancy'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CANDIDATE SKILL PASSPORT INSPECTOR */}
      {viewingCandidate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-6 bg-gradient-to-r from-[#1e3a5f] to-[#254673] text-white flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-400 text-[#1e3a5f] flex items-center justify-center font-black text-xl shadow-md border-2 border-white/20">
                  {viewingCandidate.trainee_name ? viewingCandidate.trainee_name.split(' ').map(n => n[0]).join('') : 'TR'}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{viewingCandidate.trainee_name}</h3>
                  <p className="text-xs text-blue-200 font-mono mt-0.5">
                    Sahakar ID: <strong className="text-white">{viewingCandidate.trainee_sahakar_id}</strong>
                  </p>
                  <p className="text-xs text-emerald-300 font-bold mt-1">✓ Digital Credentials Verified</p>
                </div>
              </div>
              <button 
                onClick={() => setViewingCandidate(null)}
                className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-500 uppercase text-[10px]">Verified Credentials on File</p>
                  <p className="font-mono font-bold text-[#1e3a5f] text-sm mt-0.5">CERT-2026-001847</p>
                  <p className="text-[11px] text-gray-600">Management Development for PACS (Grade A+)</p>
                </div>
                <div className="bg-white p-1.5 rounded-xl border border-gray-200 shadow-2xs">
                  <QRCodeSVG value={`${window.location.origin}/verify/CERT-2026-001847`} size={52} />
                </div>
              </div>

              <div>
                <p className="font-bold text-gray-700 uppercase tracking-wider text-[11px] mb-2">Certified Competencies</p>
                <div className="flex flex-wrap gap-1.5">
                  {(viewingCandidate.trainee_skills || [
                    'PACS Accounting & Ledger', 
                    'Digital Record Keeping', 
                    'MS Excel for Cooperatives', 
                    'GST Compliance'
                  ]).map((sk, idx) => (
                    <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1">
                      <CheckCircle size={12} className="text-emerald-600" /> {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <a
                  href={`${window.location.origin}/verify/${viewingCandidate.trainee_sahakar_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck size={16} /> Public QR Verification
                </a>
                <button
                  onClick={() => setViewingCandidate(null)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: QR / CREDENTIAL VERIFICATION SCANNER */}
      {isScannerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-extrabold text-[#1e3a5f] flex items-center gap-2">
                <QrCode size={20} className="text-[#c17f24]" /> Verify Candidate Credential
              </h3>
              <button 
                onClick={() => setIsScannerOpen(false)}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <p className="text-gray-600 text-center">
                Enter any Certificate ID or Sahakar ID to verify credential authenticity on the public registry:
              </p>
              
              <div className="space-y-2">
                <input 
                  type="text"
                  placeholder="e.g. CERT-2026-001847 or SAH-2026-000001"
                  value={manualVerifyId}
                  onChange={e => setManualVerifyId(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm font-mono font-bold focus:border-[#1e3a5f] outline-none"
                />
                <button
                  onClick={() => {
                    if (manualVerifyId.trim()) {
                      window.open(`${window.location.origin}/verify/${manualVerifyId.trim()}`, '_blank');
                    }
                  }}
                  className="w-full py-3 bg-[#1e3a5f] hover:bg-[#152a45] text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Search size={16} /> Look Up Credential
                </button>
              </div>

              <div className="pt-2 text-center text-[11px] text-gray-400">
                Supports all credentials issued by VAMNICOM, RICM & ICM network
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



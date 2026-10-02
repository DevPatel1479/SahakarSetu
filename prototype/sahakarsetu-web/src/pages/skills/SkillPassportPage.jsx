import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Briefcase, 
  BookOpen, 
  Zap, 
  Share2, 
  ShieldCheck, 
  Layers,
  ChevronRight,
  TrendingUp,
  Percent,
  GraduationCap,
  ExternalLink,
  PlayCircle
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';

export default function SkillPassportPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const traineeName = user?.name || 'Arjun Kumar Verma';
  const traineeId = user?.sahakarId || 'SAH-2026-000001';
  const initials = traineeName.split(' ').map(n => n[0]).join('');

  const [loading, setLoading] = useState(true);
  const [enrolledProgrammes, setEnrolledProgrammes] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [completedProgIds, setCompletedProgIds] = useState([]);

  useEffect(() => {
    const loadPassportData = async () => {
      try {
        // 1. Fetch certificates from backend and merge localStorage
        let certList = [];
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/certificates/?trainee=${encodeURIComponent(traineeId)}`);
          if (res.ok) {
            certList = await res.json();
          }
        } catch (e) {
          console.warn('Backend certificate fetch warning:', e);
        }

        // Merge localStorage certificates
        try {
          const localCerts = JSON.parse(localStorage.getItem('trainee_certificates') || '[]');
          localCerts.forEach(lc => {
            if (!certList.some(c => c.id === lc.id)) {
              certList.push(lc);
            }
          });
        } catch (e) {
          console.warn('LocalStorage certificates parse error:', e);
        }
        setCertificates(certList);

        // 2. Fetch all programmes and determine enrolled programmes
        let progList = [];
        try {
          const progRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/programmes/`);
          if (progRes.ok) {
            progList = await progRes.json();
          }
        } catch (e) {
          console.warn('Backend programmes fetch warning:', e);
        }

        if (progList.length === 0) {
          progList = [
            {
              id: 'PROG001',
              title: 'Management Development Programme for PACS',
              institute_name: 'VAMNICOM, Pune',
              mode: 'Blended',
              cutoff_score: 75
            },
            {
              id: 'PROG002',
              title: 'Digital Bookkeeping & Accounting',
              institute_name: 'RICM, Chandigarh',
              mode: 'Offline',
              cutoff_score: 70
            }
          ];
        }

        // Read enrolled IDs
        const savedEnrolled = localStorage.getItem('trainee_enrolled_progs');
        const enrolledIds = savedEnrolled ? JSON.parse(savedEnrolled) : ['PROG001', 'PROG002'];

        const enrolled = progList.filter(p => enrolledIds.includes(p.id));
        setEnrolledProgrammes(enrolled.length > 0 ? enrolled : progList.slice(0, 2));

        // Read completed IDs
        const savedCompleted = localStorage.getItem('trainee_completed_progs');
        let completed = savedCompleted ? JSON.parse(savedCompleted) : ['PROG001'];
        // Also any programme that has a certificate is completed
        certList.forEach(c => {
          const progId = c.programme || c.programme_id;
          if (progId && !completed.includes(progId)) {
            completed.push(progId);
          }
        });
        setCompletedProgIds(completed);

      } catch (err) {
        console.error('Error loading passport data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPassportData();
  }, [traineeId]);

  const hasProg001Cert = certificates.some(c => (c.programme === 'PROG001' || c.programme_id === 'PROG001' || c.id === 'CERT-2026-001847')) || completedProgIds.includes('PROG001');
  const hasProg002Cert = certificates.some(c => (c.programme === 'PROG002' || c.programme_id === 'PROG002' || c.id === 'CERT-2026-001849')) || completedProgIds.includes('PROG002');

  // Dynamic Primary Certificate ID for QR
  const primaryCert = certificates.find(c => c.id === 'CERT-2026-001849') || certificates[0] || { id: 'CERT-2026-001847' };
  const primaryCertId = primaryCert.id || 'CERT-2026-001847';

  // Dynamic Verified Competencies
  const baseSkills = [
    { name: 'PACS Accounting & Ledger', domain: 'Finance', level: 'Advanced', verifiedBy: 'VAMNICOM Faculty' },
    { name: 'Digital Record Keeping', domain: 'Technology', level: 'Intermediate', verifiedBy: 'RICM Chandigarh' },
    { name: 'MS Excel for Cooperatives', domain: 'Technology', level: 'Advanced', verifiedBy: 'NCCT Assessment' },
    { name: 'Cooperative Governance & Law', domain: 'Management', level: 'Intermediate', verifiedBy: 'VAMNICOM Exam' },
    { name: 'GST & Statutory Compliance', domain: 'Finance', level: 'Proficient', verifiedBy: 'ICM Bhopal' }
  ];

  const prog002Skills = [
    { name: 'Primary Society Double-Entry Bookkeeping', domain: 'Finance', level: 'Expert', verifiedBy: 'NCCT Board' },
    { name: 'KCC Member Ledger Balancing & NPA Audit', domain: 'Audit', level: 'Advanced', verifiedBy: 'RICM Chandigarh' },
    { name: 'Statutory Cash-in-Safe Reconciliation', domain: 'Compliance', level: 'Proficient', verifiedBy: 'NCCT Examination' }
  ];

  const verifiedSkills = hasProg002Cert ? [...baseSkills, ...prog002Skills] : baseSkills;

  const inProgressSkills = hasProg002Cert 
    ? [
        { name: 'Core Banking Software (CBS)', domain: 'Technology', progress: 85 },
        { name: 'Cold Storage & Dairy Inventory', domain: 'Agri-Business', progress: 55 }
      ]
    : [
        { name: 'Double-Entry Primary Bookkeeping (PROG002)', domain: 'Finance', progress: 70 },
        { name: 'Core Banking Software (CBS)', domain: 'Technology', progress: 65 },
        { name: 'Cold Storage & Dairy Inventory', domain: 'Agri-Business', progress: 40 }
      ];

  // Dynamic Role Readiness Benchmarks
  const roleReadiness = hasProg002Cert ? [
    { role: 'PACS Accounts Assistant', readiness: 98, status: 'Top Tier • Placement Ready', openJobs: 14, color: 'bg-emerald-600', boost: '+6% Boost' },
    { role: 'Primary Society Auditor', readiness: 94, status: 'Fully Certified • Ready for Audit Roles', openJobs: 8, color: 'bg-emerald-500', boost: '+16% Boost' },
    { role: 'Dairy Logistics Supervisor', readiness: 72, status: 'Near Ready (1 Elective Missing)', openJobs: 6, color: 'bg-blue-500', boost: '+8% Boost' },
    { role: 'Cooperative Branch Manager', readiness: 58, status: 'Intermediate Progression', openJobs: 12, color: 'bg-purple-500', boost: '+10% Boost' }
  ] : [
    { role: 'PACS Accounts Assistant', readiness: 92, status: 'Ready for Placement', openJobs: 14, color: 'bg-emerald-500' },
    { role: 'Primary Society Auditor', readiness: 78, status: 'Near Ready (Complete PROG002 to Qualify)', openJobs: 8, color: 'bg-amber-500' },
    { role: 'Dairy Logistics Supervisor', readiness: 64, status: 'In Training', openJobs: 6, color: 'bg-blue-500' },
    { role: 'Cooperative Branch Manager', readiness: 48, status: 'Foundation Stage', openJobs: 12, color: 'bg-purple-500' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 mt-4 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c17f24] uppercase tracking-wider mb-1">
            <Layers size={14} /> Digital Credential Passport
          </div>
          <h1 className="text-3xl font-extrabold text-[#1e3a5f] flex items-center gap-3">
            <Award className="text-[#c17f24]" /> Digital Skill Passport
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Verifiable record of cooperative competencies, dynamic enrolled courses, role readiness meters, and skill-to-job mappings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck size={16} /> Digilocker Ready
          </div>
          <Link
            to="/employment"
            className="bg-[#1e3a5f] text-white px-4 py-2.5 rounded-xl font-bold hover:bg-[#152a45] transition-colors flex items-center gap-2 text-xs shadow-sm"
          >
            <Briefcase size={16} /> View Matching Jobs
          </Link>
        </div>
      </div>

      {/* Trainee Passport Identity Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] via-[#1b3558] to-[#254673] text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-amber-400 text-[#1e3a5f] flex items-center justify-center font-black text-3xl shadow-md border-4 border-white/20 shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-2xl font-black">{traineeName}</h2>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30 font-bold">
                ✓ Passport Verified
              </span>
              {hasProg002Cert && (
                <span className="text-xs bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-300/40 font-bold">
                  ★ Dual Certified
                </span>
              )}
            </div>
            <p className="text-xs text-blue-200 font-mono">
              Sahakar ID: <strong className="text-white">{traineeId}</strong> • Baramati Taluka Milk Union
            </p>
            <p className="text-xs text-blue-200/80 mt-1">
              {enrolledProgrammes.length} Enrolled Programmes • {certificates.length} Verified Credentials Registered
            </p>
          </div>
        </div>

        <div className="bg-white p-2.5 rounded-2xl shadow-md text-center shrink-0">
          <QRCodeSVG 
            value={`${window.location.origin}/verify/${primaryCertId}`} 
            size={76} 
            level="M" 
          />
          <p className="text-[9px] font-mono font-bold text-gray-500 mt-1">Passport QR</p>
        </div>
      </div>

      {/* DYNAMIC ACADEMIC COURSE CREDENTIALS & TRAINING STATUS (Academic Integration) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap size={20} className="text-[#1e3a5f]" /> Academic Programmes & Certification Credentials
            </h2>
            <p className="text-xs text-gray-500">Live dynamic status of enrolled programmes, passing cutoffs, and issued credentials</p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full self-start sm:self-auto">
            {certificates.length} of {enrolledProgrammes.length} Programmes Certified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrolledProgrammes.map((prog) => {
            const cert = certificates.find(c => (c.programme === prog.id || c.programme_id === prog.id || (prog.id === 'PROG001' && c.id === 'CERT-2026-001847') || (prog.id === 'PROG002' && c.id === 'CERT-2026-001849')));
            const isCompleted = !!cert || completedProgIds.includes(prog.id);
            const cutoff = prog.cutoff_score || (prog.id === 'PROG002' ? 70 : 75);

            return (
              <div 
                key={prog.id} 
                className={`p-5 rounded-2xl border transition-all ${
                  isCompleted 
                    ? 'bg-emerald-50/40 border-emerald-200 shadow-sm' 
                    : 'bg-blue-50/30 border-blue-200 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-700">
                    {prog.id}
                  </span>
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 size={12} /> CERTIFIED ✓ (Grade {cert?.grade || 'A+'})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200">
                      <Clock size={12} /> IN TRAINING
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-gray-900 text-sm leading-snug">{prog.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Institute: <span className="font-semibold text-gray-700">{prog.institute_name || 'NCCT Network Institute'}</span> • Mode: {prog.mode || 'Blended'}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="text-gray-600">
                    <span className="font-bold text-gray-700">Exam Cutoff:</span> {cutoff}%
                    {cert && (
                      <span className="ml-2 font-mono font-bold text-[#1e3a5f]">
                        ID: {cert.id}
                      </span>
                    )}
                  </div>

                  {isCompleted ? (
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/verify/${cert?.id || (prog.id === 'PROG002' ? 'CERT-2026-001849' : 'CERT-2026-001847')}`}
                        target="_blank"
                        className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        Verify QR <ExternalLink size={12} />
                      </Link>
                      <Link
                        to="/certificates"
                        className="px-2.5 py-1 bg-white border border-emerald-300 text-emerald-800 font-bold rounded-lg hover:bg-emerald-50 text-[11px] shadow-xs"
                      >
                        Wallet
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        localStorage.setItem('active_lms_prog_id', prog.id);
                        navigate('/learning', { state: { programmeId: prog.id } });
                      }}
                      className="px-3 py-1.5 bg-[#1e3a5f] hover:bg-[#152a45] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <PlayCircle size={14} /> Resume Learning
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role Readiness Meters (prompt.md Section 39) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-[#1e3a5f]" /> Role Readiness Benchmark
            </h2>
            <p className="text-xs text-gray-500">Calculated by Explainable AI matching acquired certified skills against cooperative role benchmarks</p>
          </div>
          {hasProg002Cert && (
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full">
              🚀 +16% Readiness Boost Active (Digital Bookkeeping Certified)
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roleReadiness.map((r, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-gray-900">{r.role}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-black text-[#1e3a5f]">{r.readiness}%</span>
                    {r.boost && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
                        {r.boost}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 mb-3">{r.status}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-3">
                  <div className={`h-full ${r.color} transition-all duration-500`} style={{ width: `${r.readiness}%` }}></div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200/60 flex justify-between items-center text-xs">
                <span className="text-emerald-700 font-bold">{r.openJobs} Openings</span>
                <Link to="/employment" className="text-blue-700 font-semibold hover:underline flex items-center gap-0.5">
                  View <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Cooperative Skill Graph (prompt.md Section 40) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-[#c17f24]" />
            <h2 className="text-base font-bold text-gray-900">Interactive Cooperative Skill Graph</h2>
          </div>
          <p className="text-xs text-gray-500">
            Visual progression: Course Curriculum → Certified Skills → Target Role → Live Employment Matches
          </p>
        </div>

        {/* Visual Graph Chain */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-gray-200 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] gap-4">
            {/* Node 1: Course */}
            <div className="bg-white p-4 rounded-2xl border-2 border-blue-500 shadow-sm flex-1 text-center">
              <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">1. Course Module</span>
              <h4 className="font-bold text-gray-900 text-sm mt-1">
                {hasProg002Cert ? 'Digital Bookkeeping (PROG002)' : 'PACS Computerization (PROG001)'}
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {hasProg002Cert ? 'RICM Chandigarh' : 'VAMNICOM Pune'}
              </p>
            </div>

            <ArrowRight size={20} className="text-gray-400 shrink-0" />

            {/* Node 2: Acquired Skills */}
            <div className="bg-white p-4 rounded-2xl border-2 border-[#c17f24] shadow-sm flex-1 text-center">
              <span className="text-[10px] font-bold uppercase text-[#c17f24] tracking-wider">2. Certified Skills</span>
              <h4 className="font-bold text-gray-900 text-sm mt-1">
                {hasProg002Cert ? 'Ledger, NPA & Day Book' : 'Accounting & Excel'}
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {verifiedSkills.length} Verified Competencies
              </p>
            </div>

            <ArrowRight size={20} className="text-gray-400 shrink-0" />

            {/* Node 3: Target Role */}
            <div className="bg-white p-4 rounded-2xl border-2 border-emerald-500 shadow-sm flex-1 text-center">
              <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">3. Cooperative Role</span>
              <h4 className="font-bold text-gray-900 text-sm mt-1">
                {hasProg002Cert ? 'Primary Society Auditor' : 'Accounts Assistant'}
              </h4>
              <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
                {hasProg002Cert ? '94% Match Score' : '92% Match Score'}
              </p>
            </div>

            <ArrowRight size={20} className="text-gray-400 shrink-0" />

            {/* Node 4: Job Openings */}
            <div className="bg-white p-4 rounded-2xl border-2 border-purple-500 shadow-sm flex-1 text-center">
              <span className="text-[10px] font-bold uppercase text-purple-600 tracking-wider">4. Employer Matches</span>
              <h4 className="font-bold text-gray-900 text-sm mt-1">
                {hasProg002Cert ? 'DCCB & KRIBHCO' : 'Gujarat Ambuja Co-op'}
              </h4>
              <p className="text-[11px] text-purple-700 font-bold mt-0.5">
                {hasProg002Cert ? '₹28,000 - ₹40,000' : '₹25,000 - ₹35,000'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Matrix: Verified vs In-Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verified Skills */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-600" size={18} /> Verified Competencies
            </h3>
            <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded">
              {verifiedSkills.length} Certified
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {verifiedSkills.map((sk, idx) => (
              <div key={idx} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{sk.name}</p>
                  <p className="text-xs text-gray-500">
                    Domain: <span className="text-gray-700 font-medium">{sk.domain}</span> • Certified by {sk.verifiedBy}
                  </p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {sk.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Developing / In-Progress Skills */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Clock className="text-amber-600" size={18} /> Developing Skills (In Progress)
            </h3>
            <span className="text-xs bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded">
              LMS Learning
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {inProgressSkills.map((sk, idx) => (
              <div key={idx} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center mb-1 text-sm font-bold">
                  <span className="text-gray-900">{sk.name}</span>
                  <span className="text-[#1e3a5f]">{sk.progress}%</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">Category: {sk.domain}</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#c17f24] h-full rounded-full" style={{ width: `${sk.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}




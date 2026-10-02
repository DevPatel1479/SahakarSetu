import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, 
  CheckCircle, 
  Clock, 
  Book, 
  AlertTriangle, 
  WifiOff, 
  Eye, 
  CheckCircle2, 
  Download, 
  FileQuestion, 
  Award,
  Zap,
  Layers,
  ChevronRight,
  ExternalLink,
  Briefcase,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  BookOpen,
  GraduationCap,
  RotateCcw,
  Globe,
  Video,
  FileText
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEdgeStore, useAuthStore } from '../../store';
import { useLmsStore } from '../../store/lmsStore';
import TrainerLMSStudio from './TrainerLMSStudio';

// Distinct curriculum & assessment per programme
const PROGRAMME_CURRICULA = {
  PROG001: {
    cutoff_score: 75,
    modules: [
      { id: 1, title: 'Introduction to Cooperatives & 7 ICA Principles', duration: '45 min', status: 'completed', description: 'Foundational framework of cooperative societies in India and international cooperative principles.' },
      { id: 2, title: 'Cooperative Governance & Multi-State Cooperative Societies Act', duration: '60 min', status: 'completed', description: 'Legal obligations, board of directors responsibilities, and bye-law amendments.' },
      { id: 3, title: 'Financial Management & PACS Accounting Standards', duration: '90 min', status: 'completed', description: 'Double-entry bookkeeping, ledger reconciliation, balance sheet analysis for rural societies.' },
      { id: 4, title: 'Digital Record Keeping & ERP Implementation', duration: '40 min', status: 'in-progress', description: 'Hands-on training for computerized day-to-day transaction records in PACS.' }
    ],
    examQuestions: [
      {
        id: 'q1',
        prompt: '1. Under the Ministry of Cooperation model bye-laws, what is mandatory for PACS financial operations?',
        options: [
          { value: 'manual', label: 'Maintenance of physical manual registers without computerized backup' },
          { value: 'nabard', label: 'Standardized ERP computerization and direct integration with NABARD/DCCBs', correct: true },
          { value: 'closure', label: 'Exclusive reliance on unregulated third-party private accounting software' }
        ]
      },
      {
        id: 'q2',
        prompt: '2. In cooperative double-entry bookkeeping, what daily reconciliation must be performed by the PACS accountant?',
        options: [
          { value: 'cashbook', label: 'Cash Book balance matching with General Day Book and physical cash in safe', correct: true },
          { value: 'yearly', label: 'Annual balance sheet review once every financial year only' },
          { value: 'stock', label: 'Quarterly review of foreign stock market fluctuations' }
        ]
      },
      {
        id: 'q3',
        prompt: '3. How does the Sahakar Edge Box ensure educational and assessment continuity in remote PACS with no internet?',
        options: [
          { value: 'edge', label: 'Local Raspberry Pi server runs local LMS, queues offline attendance & quizzes, and auto-syncs when online', correct: true },
          { value: 'stop', label: 'Suspends all learning until commercial satellite connection is restored' },
          { value: 'paper', label: 'Reverts permanently to paper-only physical log sheets' }
        ]
      },
      {
        id: 'q4',
        prompt: '4. What is the statutory quorum requirement for holding an Annual General Meeting in a cooperative society?',
        options: [
          { value: 'five', label: '5% of total members' },
          { value: 'quorum', label: '20% or 1/5th of total eligible voting members', correct: true },
          { value: 'half', label: '50% mandatory attendance' }
        ]
      }
    ]
  },
  PROG002: {
    cutoff_score: 70,
    modules: [
      { id: 1, title: 'Fundamentals of Primary Society Cash Book & Day Book Entries', duration: '50 min', status: 'completed', description: 'Core principles of primary society cash handling, voucher management, and day book entries.' },
      { id: 2, title: 'Member Ledger Balancing & Kisan Credit Card (KCC) Passbooks', duration: '60 min', status: 'completed', description: 'Accounting for short-term agricultural credit, interest subvention calculation, and member ledger audit.' },
      { id: 3, title: 'Preparation of Trial Balance & Annual Trading Accounts', duration: '75 min', status: 'in-progress', description: 'Balancing debit and credit columns, adjusting closing stocks, and final account preparation.' },
      { id: 4, title: 'Statutory Audit Guidelines & Cooperative Banking Portal', duration: '45 min', status: 'locked', description: 'Auditor checklist, classification of NPAs, and compliance filing with Registrar of Cooperative Societies.' }
    ],
    examQuestions: [
      {
        id: 'q1',
        prompt: '1. What is the fundamental golden rule for recording asset transactions in PACS double-entry bookkeeping?',
        options: [
          { value: 'rule1', label: 'Debit what comes in, Credit what goes out', correct: true },
          { value: 'rule2', label: 'Debit all incomes, Credit all expenses' },
          { value: 'rule3', label: 'Record transactions only at the end of each fiscal month' }
        ]
      },
      {
        id: 'q2',
        prompt: '2. How must the closing cash-in-safe balance be verified at the end of every business day?',
        options: [
          { value: 'audit', label: 'Joint physical count verified by Secretary and Cashier and cross-signed on Day Book', correct: true },
          { value: 'estimate', label: 'Rough estimate based on weekly withdrawal averages' },
          { value: 'none', label: 'Verification is only required during annual statutory audit' }
        ]
      },
      {
        id: 'q3',
        prompt: '3. Under cooperative auditing standards, how are overdue agricultural loans classified?',
        options: [
          { value: 'npa', label: 'Non-Performing Assets (NPA) requiring statutory provisioning per RBI/NABARD norms', correct: true },
          { value: 'asset', label: 'Standard assets without any provision requirement' },
          { value: 'equity', label: 'Member share capital addition' }
        ]
      },
      {
        id: 'q4',
        prompt: '4. How often must the PACS borrowing ledger be reconciled with the District Central Cooperative Bank (DCCB)?',
        options: [
          { value: 'weekly', label: 'Every 5 years during election cycles' },
          { value: 'monthly', label: 'Monthly reconciliation with official bank statement reconciliation certificates', correct: true },
          { value: 'random', label: 'Only when discrepancies exceed ₹10 Lakhs' }
        ]
      }
    ]
  },
  DEFAULT: {
    cutoff_score: 75,
    modules: [
      { id: 1, title: 'Orientation to Cooperative Ecosystem & Legal Norms', duration: '40 min', status: 'completed', description: 'Overview of national cooperative policy, governance framework, and institutional support.' },
      { id: 2, title: 'Operational Management & Capacity Enhancement', duration: '60 min', status: 'completed', description: 'Process optimization, supply chain linkages, and member-centric cooperative services.' },
      { id: 3, title: 'Digital Tools, ERP & MIS for Rural Cooperatives', duration: '75 min', status: 'completed', description: 'Practical deployment of cloud and edge technologies for real-time reporting.' },
      { id: 4, title: 'Quality Standards, Audit & Statutory Reporting', duration: '45 min', status: 'in-progress', description: 'Compliance checklists, internal audit mechanisms, and governance reporting.' }
    ],
    examQuestions: [
      {
        id: 'q1',
        prompt: '1. What is the core objective of computerizing primary cooperative societies in India?',
        options: [
          { value: 'transparency', label: 'Enhancing transparency, auditability, and efficiency of financial delivery to rural members', correct: true },
          { value: 'cost', label: 'Increasing bureaucratic paperwork' },
          { value: 'privatize', label: 'Converting cooperatives into privately traded corporate entities' }
        ]
      },
      {
        id: 'q2',
        prompt: '2. Under the Multi-State Cooperative Societies Act, who constitutes the supreme authority of the society?',
        options: [
          { value: 'gbm', label: 'The General Body of democratic voting members', correct: true },
          { value: 'ceo', label: 'The Chief Executive Officer exclusively' },
          { value: 'bank', label: 'The financing commercial bank' }
        ]
      },
      {
        id: 'q3',
        prompt: '3. What is the role of the Sahakar Edge Box in grassroots training programs?',
        options: [
          { value: 'resilience', label: 'Providing offline local network streaming of LMS and queueing biometric records', correct: true },
          { value: 'satellite', label: 'Operating a telecommunications relay tower' },
          { value: 'substitute', label: 'Replacing human instructors entirely' }
        ]
      },
      {
        id: 'q4',
        prompt: '4. To maintain active accredited status, what minimum passing benchmark must trainees meet in NCCT exams?',
        options: [
          { value: 'benchmark', label: 'The specific course cutoff benchmark established by the academic council', correct: true },
          { value: 'zero', label: 'Mere physical attendance without evaluation' },
          { value: 'lottery', label: 'Random lottery assignment' }
        ]
      }
    ]
  }
};

export default function LMSPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isOnline = useEdgeStore((state) => state.isOnline);
  const triggerOfflineEvent = useEdgeStore((state) => state.triggerOfflineEvent);
  const user = useAuthStore((state) => state.user);

  const traineeSahakarId = user?.sahakarId || 'SAH-2026-000001';
  const traineeName = user?.name || 'Arjun Kumar Verma';
  const isTrainer = user?.role === 'trainer';
  const isAdmin = user?.role === 'ncct_admin' || user?.role === 'institute_admin';

  const { curricula } = useLmsStore();

  // State for all programmes and trainee enrolled list
  const [allProgrammes, setAllProgrammes] = useState([]);
  const [enrolledProgrammes, setEnrolledProgrammes] = useState([]);
  const [selectedProgId, setSelectedProgId] = useState(() => {
    return localStorage.getItem('active_lms_prog_id') || 'PROG001';
  });
  const [loading, setLoading] = useState(true);
  const [traineeLang, setTraineeLang] = useState('en');

  // Curriculum State for Active Course
  const [modules, setModules] = useState([]);
  const [activeModuleId, setActiveModuleId] = useState(1);

  // Module Quiz Modal State
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Final Certification Exam State
  const [showFinalExamModal, setShowFinalExamModal] = useState(false);
  const [finalExamAnswers, setFinalExamAnswers] = useState({});
  const [finalExamSubmitted, setFinalExamSubmitted] = useState(false);
  const [finalExamScore, setFinalExamScore] = useState(0);
  const [certIssued, setCertIssued] = useState(false);
  const [generatedCertId, setGeneratedCertId] = useState('CERT-2026-001847');

  // Fetch Programmes from Backend & Enforce Enrollment Filter
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/programmes/`);
        const data = await res.json();
        setAllProgrammes(data);

        // Read enrolled IDs from local storage or default to Arjun's programmes
        const saved = localStorage.getItem('trainee_enrolled_progs');
        const enrolledIds = saved ? JSON.parse(saved) : ['PROG001', 'PROG002'];

        let enrolledList = data.filter(p => enrolledIds.includes(p.id));
        if (enrolledList.length === 0 && data.length > 0) {
          enrolledList = [data[0]];
        }
        setEnrolledProgrammes(enrolledList);

        const targetId = location.state?.programmeId || localStorage.getItem('active_lms_prog_id');
        if (targetId && enrolledList.some(p => p.id === targetId)) {
          setSelectedProgId(targetId);
        } else if (enrolledList.length > 0) {
          setSelectedProgId(enrolledList[0].id);
        }
      } catch (err) {
        console.error('Error fetching programmes:', err);
        const fallback = [
          {
            id: 'PROG001',
            title: 'Management Development Programme for PACS',
            institute_name: 'VAMNICOM, Pune',
            cutoff_score: 75,
            mode: 'Blended'
          },
          {
            id: 'PROG002',
            title: 'Digital Bookkeeping & Accounting',
            institute_name: 'RICM, Chandigarh',
            cutoff_score: 70,
            mode: 'Offline'
          }
        ];
        setAllProgrammes(fallback);
        setEnrolledProgrammes(fallback);
        const targetId = location.state?.programmeId || localStorage.getItem('active_lms_prog_id') || 'PROG001';
        setSelectedProgId(targetId);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [location.state]);

  // Update curriculum when active course changes or curricula in store changes
  useEffect(() => {
    const curriculumData = curricula[selectedProgId] || curricula['PROG001'];
    setModules(curriculumData.modules || []);
    setActiveModuleId(curriculumData.modules?.[0]?.id || 1);
    // Reset assessment state on course switch
    setFinalExamSubmitted(false);
    setFinalExamAnswers({});
    setCertIssued(false);
  }, [selectedProgId, curricula]);

  const currentProg = enrolledProgrammes.find(p => p.id === selectedProgId) || {
    id: selectedProgId,
    title: 'Management Development Programme for PACS',
    institute_name: 'VAMNICOM, Pune',
    cutoff_score: 75,
    mode: 'Blended'
  };

  const currentCurriculum = curricula[selectedProgId] || curricula['PROG001'];
  const cutoffScore = currentProg.cutoff_score || currentCurriculum.cutoff_score || 75;

  // IF TRAINER: Render the Instructor LMS Studio!
  if (isTrainer) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16 animate-in fade-in duration-300">
        <TrainerLMSStudio 
          currentProgId={selectedProgId} 
          onSelectProg={setSelectedProgId} 
          programmes={allProgrammes} 
        />
      </div>
    );
  }

  const completedCount = modules.filter(m => m.status === 'completed').length;
  const progressPct = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;
  const activeModule = modules.find(m => m.id === activeModuleId) || modules[0] || {};

  const handleMarkComplete = (id) => {
    setModules(prev => prev.map(m => {
      if (m.id === id) return { ...m, status: 'completed' };
      if (m.id === id + 1 && m.status === 'locked') return { ...m, status: 'in-progress' };
      return m;
    }));

    if (!isOnline) {
      triggerOfflineEvent('COURSE_PROGRESS_UPDATE', {
        programmeId: selectedProgId,
        moduleId: id,
        traineeId: traineeSahakarId,
        status: 'completed',
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    const questions = activeModule.quiz || [];
    if (questions.length === 0) {
      setQuizScore(100);
      setQuizSubmitted(true);
      handleMarkComplete(activeModuleId);
      return;
    }
    let correctCount = 0;
    questions.forEach((q) => {
      const correctOpt = q.options.find(opt => opt.correct);
      if (correctOpt && quizAnswers[q.id] === correctOpt.value) {
        correctCount += 1;
      }
    });
    const calculated = Math.round((correctCount / questions.length) * 100);
    setQuizScore(calculated);
    setQuizSubmitted(true);

    if (calculated >= 50) {
      handleMarkComplete(activeModuleId);
    }
  };

  // STRICT CUTOFF EVALUATION & DYNAMIC CERTIFICATE GENERATION
  const handleFinalExamSubmit = async (e) => {
    e.preventDefault();
    const questions = currentCurriculum.examQuestions;
    let earnedPoints = 0;
    const pointsPerQuestion = 100 / questions.length;

    questions.forEach((q) => {
      const correctOpt = q.options.find(opt => opt.correct);
      if (correctOpt && finalExamAnswers[q.id] === correctOpt.value) {
        earnedPoints += pointsPerQuestion;
      }
    });

    const calculatedScore = Math.round(earnedPoints);
    setFinalExamScore(calculatedScore);
    setFinalExamSubmitted(true);

    // STRICT CUTOFF VALIDATION: Must score at or above cutoff
    const passed = calculatedScore >= cutoffScore;

    if (passed) {
      setCertIssued(true);
      // Mark all modules in this course completed
      setModules(prev => prev.map(m => ({ ...m, status: 'completed' })));

      // Compute dynamic Certificate ID specific to this programme
      const certMap = {
        'PROG001': 'CERT-2026-001847',
        'PROG002': 'CERT-2026-001849',
        'PROG003': 'CERT-2026-001850'
      };
      const autoCertId = certMap[selectedProgId] || `CERT-2026-${selectedProgId}`;
      setGeneratedCertId(autoCertId);

      // Associated course competencies
      const courseSkillsMap = {
        'PROG001': ['PACS Governance', 'Cooperative Law & Multi-State Rules', 'Digital Banking Integration', 'Financial MIS & Day Book'],
        'PROG002': ['PACS Double-Entry Bookkeeping', 'Day Book & Cash Book Management', 'KCC Member Ledger Balancing', 'Statutory Audit & NPA Provisioning'],
        'PROG003': ['Dairy Cooperative Logistics', 'Cold Chain Inventory Management', 'Quality Standard Auditing', 'Milk Collection Center MIS']
      };
      const awardedSkills = courseSkillsMap[selectedProgId] || ['Cooperative Management', 'Digital Accounting', 'Statutory Compliance'];

      // Persist to LocalStorage for immediate instant reactive access
      const newCertRecord = {
        id: autoCertId,
        certificate_id: autoCertId,
        trainee: traineeSahakarId,
        trainee_id: traineeSahakarId,
        trainee_name: traineeName,
        programme: selectedProgId,
        programme_id: selectedProgId,
        programme_name: currentProg.title,
        programme_title: currentProg.title,
        institute: currentProg.institute_name || 'NCCT Network Institute',
        institute_name: currentProg.institute_name || 'NCCT Network Institute',
        issued_date: new Date().toISOString().split('T')[0],
        issue_date: new Date().toISOString().split('T')[0],
        grade: calculatedScore >= 90 ? 'A+' : 'A',
        score: calculatedScore,
        cutoff_score: cutoffScore,
        status: 'Active',
        qr_code: `https://sahakarsetu.gov.in/verify/${autoCertId}`,
        skills: awardedSkills
      };

      try {
        const localCerts = JSON.parse(localStorage.getItem('trainee_certificates') || '[]');
        const updatedCerts = [newCertRecord, ...localCerts.filter(c => (c.id || c.certificate_id) !== autoCertId)];
        localStorage.setItem('trainee_certificates', JSON.stringify(updatedCerts));

        const completedProgs = JSON.parse(localStorage.getItem('trainee_completed_progs') || '[]');
        if (!completedProgs.includes(selectedProgId)) {
          completedProgs.push(selectedProgId);
          localStorage.setItem('trainee_completed_progs', JSON.stringify(completedProgs));
        }
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }

      // If offline, queue in Edge Box; if online, post to Django backend
      if (!isOnline) {
        triggerOfflineEvent('CERTIFICATE_ISSUED_LOCAL', {
          certId: autoCertId,
          traineeId: traineeSahakarId,
          traineeName,
          programme: currentProg.title,
          score: calculatedScore,
          cutoff: cutoffScore,
          grade: calculatedScore >= 90 ? 'A+' : 'A',
          timestamp: new Date().toISOString()
        });
      } else {
        try {
          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/certificates/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: autoCertId,
              trainee: traineeSahakarId,
              programme: selectedProgId,
              issued_date: new Date().toISOString().split('T')[0],
              grade: calculatedScore >= 90 ? 'A+' : 'A',
              document_url: `${window.location.origin}/verify/${autoCertId}`
            })
          });
        } catch (apiErr) {
          console.warn('Backend certificate creation notice:', apiErr);
        }

        try {
          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/sync-events/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: `SYNC-${Date.now()}`,
              edge_device_id: 'EDGE-VAMNICOM-01',
              event_type: 'CERTIFICATE_ISSUED',
              payload: {
                certId: autoCertId,
                traineeId: traineeSahakarId,
                traineeName,
                programme: currentProg.title,
                score: calculatedScore,
                cutoff: cutoffScore,
                grade: calculatedScore >= 90 ? 'A+' : 'A'
              },
              status: 'synced'
            })
          });
        } catch (err) {
          console.warn('Sync notice:', err);
        }
      }
    } else {
      // FAILED: Do NOT issue certificate
      setCertIssued(false);
    }
  };

  const handleDownloadPDF = () => {
    const element = document.createElement("a");
    const file = new Blob([`NCCT Handout: ${activeModule.title}\n\nProgramme: ${currentProg.title}\nHost Institute: ${currentProg.institute_name || 'NCCT'}\nPassing Cutoff Required: ${cutoffScore}%\n\nKey Learning Objectives:\n1. Core concepts & statutory guidelines\n2. Practical Application for Primary Societies\n\nVerified by VAMNICOM Pune`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${activeModule.title ? activeModule.title.replace(/[^a-zA-Z0-9]/g, '_') : 'Module'}_Handout.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-12 text-center text-gray-500 flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f] mb-4"></div>
        Loading your enrolled programmes from database...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-4 animate-in fade-in duration-300 pb-16 space-y-6">
      {/* Offline Alert */}
      {!isOnline && (
        <div className="bg-[#b45309]/10 border-l-4 border-[#b45309] p-4 rounded-r-2xl flex items-center justify-between">
          <div className="flex items-center">
            <WifiOff className="h-5 w-5 text-[#b45309] mr-3" />
            <div>
              <p className="text-sm font-bold text-[#b45309]">Sahakar Edge Box Local Cache Active</p>
              <p className="text-xs text-[#b45309]/80">Content is streaming locally via Raspberry Pi 5. Quizzes, final assessments, and certificates will queue and sync automatically.</p>
            </div>
          </div>
          <span className="text-xs font-bold bg-[#b45309] text-white px-2.5 py-1 rounded-full">
            Edge Mode
          </span>
        </div>
      )}

      {/* Admin Monitoring View */}
      {isAdmin && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center gap-3 text-blue-900 text-xs">
          <Eye size={20} className="text-blue-700 shrink-0" />
          <div>
            <p className="font-bold">Admin Read-Only Monitoring View</p>
            <p>You are previewing the LMS curriculum as experienced by enrolled trainees across registered batches.</p>
          </div>
        </div>
      )}

      {/* DYNAMIC ENROLLED PROGRAMMES SELECTOR (Requirement 2) */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
          <div>
            <span className="text-xs font-bold text-[#c17f24] uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap size={15} /> My Enrolled Programmes
            </span>
            <p className="text-xs text-gray-500">Switch between courses you are actively enrolled in</p>
          </div>
          <Link
            to="/programmes"
            className="text-xs font-bold text-[#1e3a5f] hover:underline flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200"
          >
            + Browse & Enroll in More Courses
          </Link>
        </div>

        {enrolledProgrammes.length === 0 ? (
          <div className="p-6 bg-gray-50 rounded-xl text-center">
            <BookOpen className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="font-bold text-gray-700">No active course enrollments</p>
            <p className="text-xs text-gray-500 mb-3">Browse accredited training programmes and enroll to start learning.</p>
            <Link to="/programmes" className="px-4 py-2 bg-[#1e3a5f] text-white text-xs font-bold rounded-lg inline-block">
              Go to Course Catalog
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {enrolledProgrammes.map((p) => {
              const isSelected = p.id === selectedProgId;
              const progCutoff = p.cutoff_score || PROGRAMME_CURRICULA[p.id]?.cutoff_score || 75;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProgId(p.id)}
                  className={`flex-1 min-w-[260px] p-3.5 rounded-xl border text-left transition-all ${
                    isSelected 
                      ? 'border-[#1e3a5f] bg-blue-50/70 shadow-sm ring-1 ring-[#1e3a5f]/20' 
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-gray-500 uppercase">{p.id}</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                      Cutoff: {progCutoff}%
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{p.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{p.institute_name || 'NCCT Institute'}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Completion & Certification Alert Banner */}
      {progressPct === 100 && (
        <div className="bg-gradient-to-r from-emerald-600 to-[#1e3a5f] text-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-center gap-4 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles size={24} className="text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-lg">Curriculum Completed (100%)! Ready for Certification Exam</h3>
              <p className="text-xs text-blue-100">
                Mandatory Passout Cutoff: <strong className="text-amber-300 font-bold">{cutoffScore}%</strong>. Score at or above {cutoffScore}% to earn your verified credential.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowFinalExamModal(true);
              setFinalExamSubmitted(false);
            }}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#1e3a5f] font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            <Award size={16} /> Take Final Certification Exam
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c17f24] uppercase tracking-wider mb-1">
            <Book size={14} /> National Cooperative Learning Platform
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f]">{currentProg.title}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {currentProg.institute_name || 'NCCT'} • Enrolled Trainee: <strong className="text-gray-800">{traineeName}</strong> ({traineeSahakarId})
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl text-center">
            <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Required Cutoff</p>
            <p className="text-lg font-black text-amber-900">{cutoffScore}%</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl flex items-center gap-3">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Progress</p>
              <p className="text-lg font-black text-[#1e3a5f]">{progressPct}%</p>
            </div>
            <div className="w-16 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Lesson View (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black aspect-video rounded-3xl flex items-center justify-center relative overflow-hidden group shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1542621334-a254cf47733d?auto=format&fit=crop&q=80&w=1000" 
              alt="Training Video Placeholder" 
              className="absolute inset-0 w-full h-full object-cover opacity-50" 
            />
            <button className="z-10 bg-[#1e3a5f] bg-opacity-90 hover:bg-opacity-100 p-5 rounded-full text-white transition-all transform group-hover:scale-110 shadow-xl">
              <PlayCircle size={48} />
            </button>
            <div className="absolute bottom-5 left-5 right-5 z-10 flex justify-between items-end">
              <div>
                <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  {isOnline ? 'HD Streaming' : 'Edge Box Offline Stream'}
                </span>
                <h2 className="text-white text-lg font-bold mt-1 shadow-sm drop-shadow">{activeModule.title}</h2>
              </div>
              <span className="text-white text-xs font-mono bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
                {activeModule.duration}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            {/* Bhashini AI Multilingual Selector */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Globe size={14} className="text-[#c17f24]" /> Bhashini Multilingual Learning:
              </span>
              <div className="flex gap-1.5">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'हिंदी (Hindi)' },
                  { code: 'mr', label: 'मराठी (Marathi)' },
                  { code: 'gu', label: 'ગુજરાતી (Gujarati)' }
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setTraineeLang(l.code)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                      traineeLang === l.code
                        ? 'bg-[#1e3a5f] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {traineeLang !== 'en' && activeModule.multilingual?.[traineeLang]?.title 
                    ? activeModule.multilingual[traineeLang].title 
                    : activeModule.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Module {activeModule.id} of {modules.length} • Practical Cooperative Curriculum</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                activeModule.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {activeModule.status ? activeModule.status.toUpperCase() : 'LOCKED'}
              </span>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              {traineeLang !== 'en' && activeModule.multilingual?.[traineeLang]?.description 
                ? activeModule.multilingual[traineeLang].description 
                : activeModule.description}
            </p>

            {/* Video Lectures uploaded by Trainer */}
            {(activeModule.videos || []).length > 0 && (
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <span className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wider flex items-center gap-1.5">
                  <Video size={14} className="text-[#c17f24]" /> Module Video Lectures (Uploaded by Trainer)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeModule.videos.map((vid) => (
                    <div key={vid.id} className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate mr-2">
                        <PlayCircle size={16} className="text-[#1e3a5f] shrink-0" />
                        <span className="font-bold text-gray-800 truncate">{vid.title}</span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-blue-900 bg-white px-2 py-0.5 rounded shadow-2xs shrink-0">
                        {vid.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Study Materials & Handouts uploaded by Trainer */}
            {(activeModule.materials || []).length > 0 && (
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <span className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={14} className="text-[#c17f24]" /> Downloadable Study Materials & Handouts
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeModule.materials.map((mat) => (
                    <div key={mat.id} className="p-3 bg-slate-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                      <div className="truncate mr-2">
                        <p className="font-bold text-gray-800 truncate">{mat.title}</p>
                        <p className="text-[10px] text-gray-400">{mat.type || 'PDF'} • {mat.size}</p>
                      </div>
                      <button 
                        onClick={handleDownloadPDF}
                        className="p-1.5 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#152a45] transition-colors shrink-0"
                        title="Download Handout"
                      >
                        <Download size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-100 gap-3">
              <div className="flex gap-2">
                <button 
                  onClick={handleDownloadPDF}
                  className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Download size={14} /> Download Notes
                </button>
                <button 
                  onClick={() => {
                    setShowQuizModal(true);
                    setQuizSubmitted(false);
                  }}
                  className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 border border-purple-100"
                >
                  <FileQuestion size={14} /> Module Quiz
                </button>
              </div>

              {!isAdmin && (
                <button 
                  onClick={() => handleMarkComplete(activeModule.id)}
                  disabled={activeModule.status === 'completed'}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all ${
                    activeModule.status === 'completed' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <CheckCircle2 size={16} /> 
                  {activeModule.status === 'completed' ? 'Module Completed ✓' : 'Mark Module Complete'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modules Sidebar (1 col) */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Curriculum Modules</h3>
            <p className="text-xs text-gray-400 mb-4">Complete all {modules.length} modules to unlock certification exam</p>
            
            <ul className="space-y-3">
              {modules.map((mod) => (
                <li 
                  key={mod.id} 
                  className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                    mod.id === activeModuleId 
                      ? 'border-[#1e3a5f] bg-blue-50/70 shadow-sm' 
                      : 'border-transparent hover:bg-gray-50'
                  }`} 
                  onClick={() => setActiveModuleId(mod.id)}
                >
                  {mod.status === 'completed' ? (
                    <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={18} />
                  ) : mod.status === 'locked' ? (
                    <Clock className="text-gray-300 shrink-0 mt-0.5" size={18} />
                  ) : (
                    <PlayCircle className="text-[#c17f24] shrink-0 mt-0.5" size={18} />
                  )}
                  
                  <div className="flex-1">
                    <p className={`text-xs font-bold ${mod.status === 'locked' ? 'text-gray-400' : 'text-gray-900'}`}>
                      {mod.title}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{mod.duration}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
            <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
              progressPct === 100 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-amber-50 border-amber-200'
            }`}>
              <div className="flex justify-between items-center">
                <p className="font-bold text-gray-900 flex items-center gap-1.5">
                  <Award size={16} className={progressPct === 100 ? 'text-emerald-700' : 'text-[#c17f24]'} /> 
                  Certification Benchmark
                </p>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  progressPct === 100 ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
                }`}>
                  Cutoff: {cutoffScore}%
                </span>
              </div>
              <p className={progressPct === 100 ? 'text-emerald-800' : 'text-amber-800'}>
                {progressPct === 100 
                  ? `Curriculum complete! Score at or above ${cutoffScore}% on the final exam to earn your certificate.` 
                  : `${modules.length - completedCount} module(s) remaining for automated exam eligibility.`}
              </p>

              {progressPct === 100 && (
                <button
                  onClick={() => {
                    setShowFinalExamModal(true);
                    setFinalExamSubmitted(false);
                  }}
                  className="w-full mt-2 py-2.5 bg-[#1e3a5f] hover:bg-[#152a45] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Award size={14} className="text-[#c17f24]" /> Take Final Certification Exam
                </button>
              )}
            </div>

            <div className="flex justify-between items-center text-xs px-2 pt-1 text-gray-500">
              <Link to="/certificates" className="hover:text-[#1e3a5f] font-semibold underline">
                My Certificates →
              </Link>
              <Link to="/skill-passport" className="hover:text-[#1e3a5f] font-semibold underline">
                Skill Passport →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Module Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#1e3a5f] flex items-center gap-2">
                <FileQuestion className="text-[#c17f24]" size={22} /> Module Quiz: {activeModule.title}
              </h2>
              <button onClick={() => setShowQuizModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">
                ✕
              </button>
            </div>

            {quizSubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white ${
                  quizScore >= 50 ? 'bg-emerald-600' : 'bg-red-500'
                }`}>
                  {quizScore >= 50 ? <CheckCircle2 size={36} /> : <AlertTriangle size={36} />}
                </div>
                <h3 className="text-2xl font-black text-gray-900">
                  Your Score: {quizScore}%
                </h3>
                <p className="text-xs text-gray-600">
                  {quizScore >= 50 
                    ? 'Congratulations! You passed this module quiz. Progress updated.' 
                    : 'Passing score is 50%. Review the module notes and re-attempt.'}
                </p>
                <button
                  onClick={() => setShowQuizModal(false)}
                  className="px-6 py-2.5 bg-[#1e3a5f] text-white font-bold rounded-xl text-xs"
                >
                  Close & Continue Learning
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuizSubmit} className="space-y-4 text-xs">
                {(activeModule.quiz && activeModule.quiz.length > 0 ? activeModule.quiz : [
                  {
                    id: 'q1',
                    prompt: '1. How many international cooperative principles are recognized by ICA?',
                    options: [
                      { value: '5', label: '5 Principles' },
                      { value: '7', label: '7 Principles (Voluntary, Democratic, Education, etc.)', correct: true },
                      { value: '10', label: '10 Principles' }
                    ]
                  },
                  {
                    id: 'q2',
                    prompt: '2. Cooperative decision making is based on which governance model?',
                    options: [
                      { value: 'shares', label: 'One Share, One Vote (Capital based)' },
                      { value: 'democratic', label: 'One Member, One Vote (Democratic member control)', correct: true }
                    ]
                  }
                ]).map((q, idx) => (
                  <div key={q.id || idx} className="space-y-1.5 p-3.5 bg-slate-50 rounded-2xl border border-gray-100">
                    <p className="font-bold text-gray-900 mb-2">{idx + 1}. {q.prompt}</p>
                    <div className="space-y-1.5 pl-2">
                      {q.options.map((opt, oIdx) => (
                        <label key={oIdx} className="flex items-center gap-2 cursor-pointer hover:text-[#1e3a5f]">
                          <input
                            type="radio"
                            name={q.id}
                            value={opt.value}
                            onChange={(e) => setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })}
                            required
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowQuizModal(false)}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#1e3a5f] text-white font-bold rounded-xl shadow"
                  >
                    Submit Answers
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* COMPREHENSIVE FINAL CERTIFICATION EXAM MODAL (With Strict Cutoff Enforcement) */}
      {showFinalExamModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c17f24] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  National Certification Assessment • {currentProg.institute_name || 'NCCT'}
                </span>
                <h2 className="text-2xl font-black text-[#1e3a5f] mt-1 flex items-center gap-2">
                  <Award className="text-[#c17f24]" size={26} /> {currentProg.title} Final Exam
                </h2>
              </div>
              <button onClick={() => setShowFinalExamModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">
                ✕
              </button>
            </div>

            {finalExamSubmitted ? (
              <div className="text-center py-4 space-y-6">
                {/* CASE 1: PASSED (SCORE >= CUTOFF) -> CERTIFICATE GENERATED */}
                {certIssued ? (
                  <>
                    <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border-4 border-emerald-200 shadow-md">
                      <CheckCircle2 size={44} />
                    </div>
                    
                    <div>
                      <h3 className="text-3xl font-black text-gray-900">
                        EXAM PASSED! Score: {finalExamScore}%
                      </h3>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-black rounded-full border border-emerald-200 uppercase tracking-widest">
                          Cutoff Met ({cutoffScore}%) • Verified Credential Issued ✓
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 max-w-md mx-auto mt-2">
                        Congratulations <strong>{traineeName}</strong>! You scored <strong>{finalExamScore}%</strong> (Cutoff: {cutoffScore}%). Your accredited digital certificate has been issued and registered under Sahakar ID <strong>{traineeSahakarId}</strong>.
                      </p>
                    </div>

                    {/* Issued Credential Card Summary */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 text-left max-w-lg mx-auto space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-500 uppercase">Certificate Credential ID:</span>
                        <span className="font-mono font-bold text-[#1e3a5f]">{generatedCertId}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-500 uppercase">Programme:</span>
                        <span className="font-semibold text-gray-800">{currentProg.title}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-500 uppercase">Awarded Grade:</span>
                        <span className="font-bold text-emerald-700">{finalExamScore >= 90 ? 'A+ (Distinction)' : 'A (First Class)'}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-500 uppercase">Blockchain Ledger Hash:</span>
                        <span className="font-mono text-[10px] text-gray-400">e3b0c44298fc1c149afbf4c8996fb9242...</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto pt-2">
                      <button
                        onClick={() => {
                          setShowFinalExamModal(false);
                          navigate('/certificates');
                        }}
                        className="py-3 px-4 bg-[#1e3a5f] hover:bg-[#152a45] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Award size={16} /> View Certificate in Wallet
                      </button>

                      <a
                        href={`${window.location.origin}/verify/${generatedCertId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        <ShieldCheck size={16} /> Public QR Verification
                      </a>

                      <button
                        onClick={() => {
                          setShowFinalExamModal(false);
                          navigate('/skill-passport');
                        }}
                        className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <Layers size={16} /> Digital Skill Passport
                      </button>

                      <button
                        onClick={() => {
                          setShowFinalExamModal(false);
                          navigate('/employment');
                        }}
                        className="py-3 px-4 bg-amber-400 hover:bg-amber-300 text-[#1e3a5f] font-black rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Briefcase size={16} /> View Matching Jobs (92%)
                      </button>
                    </div>
                  </>
                ) : (
                  /* CASE 2: FAILED (SCORE < CUTOFF) -> NO CERTIFICATE GENERATED */
                  <>
                    <div className="w-20 h-20 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center border-4 border-red-200 shadow-md">
                      <XCircle size={44} />
                    </div>

                    <div>
                      <h3 className="text-3xl font-black text-gray-900">
                        ASSESSMENT FAILED: {finalExamScore}%
                      </h3>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-black rounded-full border border-red-200 uppercase tracking-widest">
                          Cutoff Not Met (Required: {cutoffScore}%)
                        </span>
                      </div>
                    </div>

                    {/* Certificate Blocked Alert */}
                    <div className="bg-red-50 border-2 border-red-200 p-5 rounded-2xl text-left max-w-lg mx-auto space-y-2.5">
                      <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                        <AlertTriangle size={18} className="text-red-600" /> Certificate Generation Denied
                      </div>
                      <p className="text-xs text-red-700 leading-relaxed">
                        You scored <strong>{finalExamScore}%</strong>, which is strictly below the mandatory cutoff benchmark of <strong>{cutoffScore}%</strong> required by <strong>{currentProg.title}</strong>.
                      </p>
                      <p className="text-[11px] text-gray-600 bg-white p-3 rounded-xl border border-red-100">
                        <strong>NCCT Examination Rule:</strong> Digital certificates cannot be generated or registered unless the candidate scores at or above the designated programme cutoff.
                      </p>
                    </div>

                    <div className="flex gap-3 max-w-lg mx-auto pt-2">
                      <button
                        onClick={() => setShowFinalExamModal(false)}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs"
                      >
                        Close & Review Notes
                      </button>
                      <button
                        onClick={() => {
                          setFinalExamSubmitted(false);
                          setFinalExamAnswers({});
                        }}
                        className="flex-1 py-3 bg-[#1e3a5f] hover:bg-[#152a45] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <RotateCcw size={15} /> Retake Assessment
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <form onSubmit={handleFinalExamSubmit} className="space-y-5 text-xs">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 flex justify-between items-center">
                  <div>
                    <p className="font-bold">Examination Instructions & Passing Benchmark:</p>
                    <p className="text-[11px] mt-0.5">Answer all questions. Digital certificate will ONLY be generated if your score meets or exceeds the mandatory cutoff.</p>
                  </div>
                  <span className="bg-[#1e3a5f] text-white font-mono text-xs font-black px-2.5 py-1 rounded-lg shrink-0">
                    Cutoff: {cutoffScore}%
                  </span>
                </div>

                {/* Dynamic Questions for the Active Programme */}
                {currentCurriculum.examQuestions.map((q, idx) => (
                  <div key={q.id} className="space-y-2">
                    <p className="font-bold text-gray-900 text-sm">
                      {q.prompt}
                    </p>
                    <div className="space-y-1.5 pl-2">
                      {q.options.map((opt, optIdx) => (
                        <label key={optIdx} className="flex items-center gap-2.5 p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name={`exam_${q.id}`}
                            value={opt.value}
                            onChange={(e) => setFinalExamAnswers({ ...finalExamAnswers, [q.id]: e.target.value })}
                            required
                          />
                          <span className="font-medium text-gray-800">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowFinalExamModal(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#1e3a5f] hover:bg-[#152a45] text-white font-bold rounded-xl shadow-md transition-colors"
                  >
                    Submit Assessment for Evaluation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



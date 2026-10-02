import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Clock, 
  CalendarCheck, 
  Award, 
  CheckCircle2, 
  Upload, 
  FileText, 
  QrCode, 
  ArrowRight, 
  ChevronRight, 
  Search, 
  Plus, 
  X,
  GraduationCap,
  Calendar,
  Building2,
  Sparkles,
  Video,
  Globe,
  HelpCircle,
  Eye,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { useLmsStore } from '../../store/lmsStore';

export default function TrainerDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const trainerName = user?.name || 'Dr. Sneha Patil (Senior Faculty)';

  const { 
    curricula, 
    uploadVideo, 
    uploadMaterial, 
    addMultilingualContent, 
    createQuizQuestion, 
    updateCutoffScore 
  } = useLmsStore();

  const [loading, setLoading] = useState(true);
  const [programmes, setProgrammes] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [sessions, setSessions] = useState([]);

  // Active view states
  const [activeCourseId, setActiveCourseId] = useState('PROG001');
  const [activeTab, setActiveTab] = useState('content'); // 'content', 'progress', 'quizzes', 'sessions'
  const [selectedModuleId, setSelectedModuleId] = useState(1);

  // Modals
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradingTrainee, setGradingTrainee] = useState(null);
  const [awardedScore, setAwardedScore] = useState(85);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [courseForm, setCourseForm] = useState({
    id: `PROG${Math.floor(100 + Math.random() * 900)}`,
    title: '',
    institute: 'INST001',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    capacity: 40,
    cutoff_score: 75,
    mode: 'Blended',
    language: 'English / Hindi'
  });

  const [videoForm, setVideoForm] = useState({
    title: '',
    duration: '25 min',
    url: '',
    language: 'en'
  });

  const [materialForm, setMaterialForm] = useState({
    title: '',
    type: 'PDF',
    size: '2.5 MB',
    description: ''
  });

  const [quizForm, setQuizForm] = useState({
    prompt: '',
    opt1: '',
    opt2: '',
    opt3: '',
    correctIndex: 1
  });

  const loadTrainerData = async () => {
    try {
      setLoading(true);
      const [progRes, traineesRes, sessionsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/programmes/`),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/trainees/`),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/timetables/`)
      ]);

      if (progRes.ok) {
        const pData = await progRes.json();
        setProgrammes(pData);
        if (pData.length > 0 && !activeCourseId) {
          setActiveCourseId(pData[0].id);
        }
      }
      if (traineesRes.ok) setTrainees(await traineesRes.json());
      if (sessionsRes.ok) setSessions(await sessionsRes.json());
    } catch (err) {
      console.error('Error fetching trainer dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainerData();
  }, []);

  // Active Curriculum from LMS Store
  const currentCourse = curricula[activeCourseId] || curricula['PROG001'];
  const modules = currentCourse.modules || [];
  const currentModule = modules.find(m => m.id === selectedModuleId) || modules[0] || {};

  // Dynamic KPI Calculations
  const totalCourses = programmes.length || 2;
  const totalTrainees = trainees.length;
  
  // Count total videos and materials across all courses in store
  let totalVideosCount = 0;
  let totalMaterialsCount = 0;
  let totalQuizQuestionsCount = 0;

  Object.values(curricula).forEach(c => {
    (c.modules || []).forEach(m => {
      totalVideosCount += (m.videos || []).length;
      totalMaterialsCount += (m.materials || []).length;
      totalQuizQuestionsCount += (m.quiz || []).length;
    });
    totalQuizQuestionsCount += (c.examQuestions || []).length;
  });

  const avgAttendance = trainees.length > 0 
    ? Math.round(trainees.reduce((acc, t) => acc + (t.attendance_pct || 0), 0) / trainees.length) 
    : 89;

  // Handlers for Content Management Actions
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.title) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/programmes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseForm)
      });
      if (res.ok) {
        setShowCourseModal(false);
        setCourseForm({
          id: `PROG${Math.floor(100 + Math.random() * 900)}`,
          title: '',
          institute: 'INST001',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
          capacity: 40,
          cutoff_score: 75,
          mode: 'Blended',
          language: 'English / Hindi'
        });
        await loadTrainerData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadVideo = (e) => {
    e.preventDefault();
    if (!videoForm.title) return;
    setIsSaving(true);
    setTimeout(() => {
      uploadVideo(activeCourseId, selectedModuleId, videoForm);
      setIsSaving(false);
      setShowVideoModal(false);
      setVideoForm({ title: '', duration: '25 min', url: '', language: 'en' });
    }, 400);
  };

  const handleUploadMaterial = (e) => {
    e.preventDefault();
    if (!materialForm.title) return;
    setIsSaving(true);
    setTimeout(() => {
      uploadMaterial(activeCourseId, selectedModuleId, materialForm);
      setIsSaving(false);
      setShowMaterialModal(false);
      setMaterialForm({ title: '', type: 'PDF', size: '2.5 MB', description: '' });
    }, 400);
  };

  const handleCreateQuiz = (e) => {
    e.preventDefault();
    if (!quizForm.prompt || !quizForm.opt1 || !quizForm.opt2) return;
    setIsSaving(true);
    setTimeout(() => {
      createQuizQuestion(activeCourseId, selectedModuleId, {
        prompt: quizForm.prompt,
        options: [
          { value: 'opt1', label: quizForm.opt1, correct: quizForm.correctIndex === 1 },
          { value: 'opt2', label: quizForm.opt2, correct: quizForm.correctIndex === 2 },
          { value: 'opt3', label: quizForm.opt3 || 'None of the above', correct: quizForm.correctIndex === 3 }
        ]
      });
      setIsSaving(false);
      setShowQuizModal(false);
      setQuizForm({ prompt: '', opt1: '', opt2: '', opt3: '', correctIndex: 1 });
    }, 400);
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!gradingTrainee) return;
    setIsSaving(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/trainees/${gradingTrainee.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessment_score: parseInt(awardedScore, 10) })
      });
      setTrainees(prev => prev.map(t => t.id === gradingTrainee.id ? { ...t, assessment_score: parseInt(awardedScore, 10) } : t));
      setShowGradeModal(false);
    } catch (err) {
      console.error('Error saving grade:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 mt-4 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#152a45] p-6 lg:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              <GraduationCap size={16} /> NCCT Faculty & Instructor Studio
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
              Trainer Dashboard
            </h1>
            <p className="text-blue-200 mt-2 text-sm lg:text-base font-medium max-w-2xl">
              Welcome, <strong className="text-white">{trainerName}</strong>. Manage your curriculum, upload videos and study materials, create trainee quizzes, and monitor learning outcomes.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setShowCourseModal(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-gray-950 font-black text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <Plus size={16} /> Create Course
            </button>
            <Link
              to="/learning"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 shadow transition-all flex items-center gap-1.5"
            >
              <BookOpen size={16} /> Open LMS Studio <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Course Switcher Pills */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-xs text-blue-200 font-bold uppercase tracking-wider mr-2">Active Course:</span>
          {programmes.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveCourseId(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCourseId === p.id 
                  ? 'bg-white text-[#1e3a5f] shadow' 
                  : 'bg-white/10 text-blue-100 hover:bg-white/20'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* 5 Dynamic Real-Time KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Courses Managed</span>
          <h3 className="text-3xl font-black text-[#1e3a5f] mt-3">{totalCourses}</h3>
          <p className="text-xs text-blue-600 font-bold mt-1">Accredited Batches</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Enrolled Trainees</span>
          <h3 className="text-3xl font-black text-emerald-700 mt-3">{totalTrainees}</h3>
          <p className="text-xs text-emerald-600 font-bold mt-1">Live in Cohort</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Videos Uploaded</span>
          <h3 className="text-3xl font-black text-purple-700 mt-3">{totalVideosCount}</h3>
          <p className="text-xs text-purple-600 font-bold mt-1">Offline Cached</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Study Handouts</span>
          <h3 className="text-3xl font-black text-amber-700 mt-3">{totalMaterialsCount}</h3>
          <p className="text-xs text-amber-600 font-bold mt-1">PDFs & Manuals</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between col-span-2 md:col-span-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quiz Questions</span>
          <h3 className="text-3xl font-black text-indigo-700 mt-3">{totalQuizQuestionsCount}</h3>
          <p className="text-xs text-indigo-600 font-bold mt-1">Cutoff: {currentCourse.cutoff_score || 75}%</p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-gray-200 overflow-x-auto gap-2 bg-white px-4 pt-3 rounded-2xl shadow-sm">
        <button
          onClick={() => setActiveTab('content')}
          className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'content' ? 'border-[#1e3a5f] text-[#1e3a5f]' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <BookOpen size={16} /> Learning Content & Uploads (Videos & PDFs)
        </button>

        <button
          onClick={() => setActiveTab('progress')}
          className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'progress' ? 'border-[#1e3a5f] text-[#1e3a5f]' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Users size={16} /> Monitor Trainee Learning & Certification ({trainees.length})
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'quizzes' ? 'border-[#1e3a5f] text-[#1e3a5f]' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <HelpCircle size={16} /> Create Quizzes & Assessments
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'sessions' ? 'border-[#1e3a5f] text-[#1e3a5f]' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Clock size={16} /> Today's Scheduled Lectures ({sessions.length})
        </button>
      </div>

      {/* TAB 1: LEARNING CONTENT & UPLOADS */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* Module Selector Pill Bar */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-gray-200/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">
                Active Module:
              </span>
              {modules.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModuleId(m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedModuleId === m.id
                      ? 'bg-[#1e3a5f] text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  Module {m.id}: {m.title.slice(0, 25)}...
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowVideoModal(true)}
                className="px-3.5 py-1.5 bg-[#1e3a5f] hover:bg-[#152a45] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Video size={14} /> + Upload Video
              </button>
              <button
                onClick={() => setShowMaterialModal(true)}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <FileText size={14} /> + Upload Material
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Uploaded Videos Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <h3 className="font-extrabold text-sm text-[#1e3a5f] flex items-center gap-2">
                  <Video size={16} className="text-[#c17f24]" /> Published Video Lessons (Module {currentModule.id})
                </h3>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                  {(currentModule.videos || []).length} Lessons
                </span>
              </div>

              {(currentModule.videos || []).length === 0 ? (
                <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-xs">
                  No video lectures uploaded yet for Module {currentModule.id}.
                </div>
              ) : (
                (currentModule.videos || []).map((vid) => (
                  <div key={vid.id} className="p-3.5 rounded-xl border border-gray-100 bg-slate-50 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-gray-900">{vid.title}</h4>
                      <p className="text-[11px] text-gray-500">Duration: {vid.duration} • Language: {vid.language || 'English'}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                      Live for Trainees ✓
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Uploaded Study Handouts Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <h3 className="font-extrabold text-sm text-[#1e3a5f] flex items-center gap-2">
                  <FileText size={16} className="text-[#c17f24]" /> Study Handouts & Guides (Module {currentModule.id})
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {(currentModule.materials || []).length} Files
                </span>
              </div>

              {(currentModule.materials || []).length === 0 ? (
                <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-xs">
                  No study handouts uploaded yet for Module {currentModule.id}.
                </div>
              ) : (
                (currentModule.materials || []).map((mat) => (
                  <div key={mat.id} className="p-3.5 rounded-xl border border-gray-100 bg-slate-50 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-gray-900">{mat.title}</h4>
                      <p className="text-[11px] text-gray-500">{mat.type || 'PDF'} • {mat.size}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 shrink-0">
                      Downloadable ✓
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MONITOR TRAINEE PROGRESS */}
      {activeTab === 'progress' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-base font-black text-[#1e3a5f]">
                Enrolled Trainee Progress & Evaluation
              </h2>
              <p className="text-xs text-gray-400">
                Evaluation status against course cutoff: <strong className="text-gray-700">{currentCourse.cutoff_score || 75}%</strong>
              </p>
            </div>
            <Link
              to="/attendance"
              className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
            >
              <QrCode size={14} /> Biometric Attendance Capture →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                  <th className="py-3 px-4">Trainee Name</th>
                  <th className="py-3 px-4">Sahakar ID</th>
                  <th className="py-3 px-4">Attendance</th>
                  <th className="py-3 px-4">Assessment Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Faculty Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trainees.map((t) => {
                  const score = t.assessment_score || 85;
                  const cutoff = currentCourse.cutoff_score || 75;
                  const hasPassed = score >= cutoff;

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-gray-900">{t.name}</td>
                      <td className="py-3 px-4 font-mono text-gray-500">{t.id}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-700">{t.attendance_pct || 92}%</td>
                      <td className="py-3 px-4 font-extrabold text-[#1e3a5f]">{score}%</td>
                      <td className="py-3 px-4">
                        {hasPassed ? (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold text-[10px]">
                            Cleared Cutoff ✓
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-full font-bold text-[10px]">
                            Under Cutoff
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setGradingTrainee(t);
                            setAwardedScore(score);
                            setShowGradeModal(true);
                          }}
                          className="px-3 py-1 bg-[#1e3a5f] hover:bg-[#152a45] text-white rounded-lg font-bold text-[11px] transition-colors"
                        >
                          Grade / Edit Marks
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: QUIZZES & ASSESSMENTS */}
      {activeTab === 'quizzes' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-base font-black text-[#1e3a5f] flex items-center gap-2">
                <HelpCircle className="text-[#c17f24]" /> Active Assessment Questions
              </h2>
              <p className="text-xs text-gray-400">Questions attempted by trainees in Module {currentModule.id}</p>
            </div>
            <button
              onClick={() => setShowQuizModal(true)}
              className="px-4 py-2 bg-[#1e3a5f] hover:bg-[#152a45] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={14} /> Create Quiz Question
            </button>
          </div>

          <div className="space-y-3">
            {(currentModule.quiz || []).map((q, qIdx) => (
              <div key={q.id || qIdx} className="p-4 rounded-xl border border-gray-200 bg-slate-50 space-y-2">
                <h4 className="font-bold text-xs text-gray-900">{qIdx + 1}. {q.prompt}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {q.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                        opt.correct ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900' : 'bg-white border-gray-200 text-gray-600'
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                      {opt.correct && <span className="text-[10px] text-emerald-700">✓ Correct</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SCHEDULED SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-base font-black text-[#1e3a5f]">Today's Academic Timetable Sessions</h2>
              <p className="text-xs text-gray-400">Classes and lab sessions assigned to your faculty profile</p>
            </div>
            <Link to="/timetable" className="text-xs font-bold text-blue-700 hover:underline">
              Full Timetable →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.slice(0, 4).map((sess, sIdx) => (
              <div key={sIdx} className="p-4 rounded-xl border border-gray-100 bg-slate-50 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {sess.time || `${sess.start_time} - ${sess.end_time}`}
                  </span>
                  <span className="text-gray-400 font-mono">{sess.room || 'Room 101'}</span>
                </div>
                <h4 className="font-bold text-sm text-[#1e3a5f]">{sess.subject}</h4>
                <p className="text-xs text-gray-500 font-medium">{sess.programme_title}</p>
                <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                  <span className="text-gray-400">{sess.venue_type || 'Lecture Hall'}</span>
                  <Link to="/attendance" className="font-bold text-emerald-700 hover:underline">
                    Take Attendance →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE COURSE */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-1">Create New Training Course</h3>
            <p className="text-xs text-gray-500 mb-5">Publish a new cooperative training curriculum</p>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PACS Digital Accounting & Compliance Workshop"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mode</label>
                  <select
                    value={courseForm.mode}
                    onChange={(e) => setCourseForm({ ...courseForm, mode: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  >
                    <option value="Blended">Blended</option>
                    <option value="Classroom">Classroom</option>
                    <option value="Offline / Edge">Offline / Edge Box</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cutoff Benchmark (%)</label>
                  <input
                    type="number"
                    required
                    value={courseForm.cutoff_score}
                    onChange={(e) => setCourseForm({ ...courseForm, cutoff_score: parseInt(e.target.value, 10) })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-gray-950 bg-amber-500 hover:bg-amber-600 shadow flex items-center gap-2"
                >
                  {isSaving && <RefreshCw size={14} className="animate-spin" />}
                  {isSaving ? 'Publishing...' : 'Publish Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD VIDEO */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-1">Upload Video Lecture</h3>
            <p className="text-xs text-gray-500 mb-5">Publish video lesson to Module {currentModule.id}</p>

            <form onSubmit={handleUploadVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Video Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PACS Day-End Ledger Balancing Masterclass"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Language</label>
                  <select
                    value={videoForm.language}
                    onChange={(e) => setVideoForm({ ...videoForm, language: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi (हिंदी)</option>
                    <option value="mr">Marathi (मराठी)</option>
                    <option value="gu">Gujarati (ગુજરાતી)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
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
                  {isSaving ? 'Uploading...' : 'Upload Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD MATERIAL */}
      {showMaterialModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-1">Upload Study Material</h3>
            <p className="text-xs text-gray-500 mb-5">Publish PDF/Handout to Module {currentModule.id}</p>

            <form onSubmit={handleUploadMaterial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PACS Statutory Model Bye-laws Manual"
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Type</label>
                  <select
                    value={materialForm.type}
                    onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  >
                    <option value="PDF">PDF</option>
                    <option value="Excel">Excel</option>
                    <option value="Word">Word</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Size</label>
                  <input
                    type="text"
                    value={materialForm.size}
                    onChange={(e) => setMaterialForm({ ...materialForm, size: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowMaterialModal(false)}
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
                  {isSaving ? 'Uploading...' : 'Publish Handout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE QUIZ */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-1">Create Assessment Question</h3>
            <p className="text-xs text-gray-500 mb-5">Publish a practice question to Module {currentModule.id}</p>

            <form onSubmit={handleCreateQuiz} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Question Prompt</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Under cooperative auditing guidelines, what is the mandatory loan provisioning rate for substandard assets?"
                  value={quizForm.prompt}
                  onChange={(e) => setQuizForm({ ...quizForm, prompt: e.target.value })}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase">Options (Select Correct Option)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct"
                    checked={quizForm.correctIndex === 1}
                    onChange={() => setQuizForm({ ...quizForm, correctIndex: 1 })}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Option A (e.g. 15% statutory provision)"
                    value={quizForm.opt1}
                    onChange={(e) => setQuizForm({ ...quizForm, opt1: e.target.value })}
                    className="flex-1 text-sm p-2 border border-gray-200 rounded-xl"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct"
                    checked={quizForm.correctIndex === 2}
                    onChange={() => setQuizForm({ ...quizForm, correctIndex: 2 })}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Option B (e.g. 0% provision)"
                    value={quizForm.opt2}
                    onChange={(e) => setQuizForm({ ...quizForm, opt2: e.target.value })}
                    className="flex-1 text-sm p-2 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowQuizModal(false)}
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
                  {isSaving ? 'Publishing...' : 'Publish Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GRADE TRAINEE */}
      {showGradeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-1">Evaluate Trainee</h3>
            <p className="text-xs text-gray-500 mb-4">
              Updating marks for <span className="font-bold text-gray-900">{gradingTrainee?.name}</span> ({gradingTrainee?.id})
            </p>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Awarded Score (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={awardedScore}
                  onChange={(e) => setAwardedScore(e.target.value)}
                  className="w-full text-2xl font-black text-center p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowGradeModal(false)}
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
                  {isSaving ? 'Saving...' : 'Update Grade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Video, 
  FileText, 
  HelpCircle, 
  Users, 
  Globe, 
  Plus, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  Edit3, 
  Award, 
  Clock, 
  Trash2, 
  ExternalLink, 
  Save, 
  RefreshCw,
  Eye,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useLmsStore } from '../../store/lmsStore';

export default function TrainerLMSStudio({ currentProgId, onSelectProg, programmes }) {
  const { 
    curricula, 
    uploadVideo, 
    uploadMaterial, 
    addMultilingualContent, 
    createQuizQuestion, 
    createExamQuestion, 
    updateCutoffScore 
  } = useLmsStore();

  const [activeTab, setActiveTab] = useState('videos'); // 'videos', 'materials', 'multilingual', 'quizzes', 'progress'
  const [selectedModuleId, setSelectedModuleId] = useState(1);
  const [trainees, setTrainees] = useState([]);
  const [loadingTrainees, setLoadingTrainees] = useState(false);

  // Modals
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showMultilingualModal, setShowMultilingualModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedTraineeForGrade, setSelectedTraineeForGrade] = useState(null);
  const [newGradeScore, setNewGradeScore] = useState(85);
  const [isSaving, setIsSaving] = useState(false);

  // Forms
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

  const [multiForm, setMultiForm] = useState({
    language: 'hi',
    title: '',
    description: ''
  });

  const [quizForm, setQuizForm] = useState({
    targetType: 'module', // 'module' or 'final'
    prompt: '',
    opt1: '',
    opt2: '',
    opt3: '',
    correctIndex: 1
  });

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

  // Current Course Curriculum
  const activeCourse = curricula[currentProgId] || curricula['PROG001'];
  const modules = activeCourse.modules || [];
  const currentModule = modules.find(m => m.id === selectedModuleId) || modules[0] || {};
  const currentProgMeta = (programmes || []).find(p => p.id === currentProgId) || {
    id: currentProgId,
    title: 'Management Development Programme for PACS',
    institute_name: 'VAMNICOM, Pune'
  };

  // Fetch Trainees for this course / institute
  const fetchTrainees = async () => {
    setLoadingTrainees(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/trainees/`);
      if (res.ok) {
        const data = await res.json();
        setTrainees(data);
      }
    } catch (err) {
      console.error('Error fetching trainees:', err);
    } finally {
      setLoadingTrainees(false);
    }
  };

  useEffect(() => {
    fetchTrainees();
  }, [currentProgId]);

  // Handle Video Upload
  const handleUploadVideo = (e) => {
    e.preventDefault();
    if (!videoForm.title) return;
    setIsSaving(true);
    setTimeout(() => {
      uploadVideo(currentProgId, selectedModuleId, videoForm);
      setIsSaving(false);
      setShowVideoModal(false);
      setVideoForm({ title: '', duration: '25 min', url: '', language: 'en' });
    }, 400);
  };

  // Handle Material Upload
  const handleUploadMaterial = (e) => {
    e.preventDefault();
    if (!materialForm.title) return;
    setIsSaving(true);
    setTimeout(() => {
      uploadMaterial(currentProgId, selectedModuleId, materialForm);
      setIsSaving(false);
      setShowMaterialModal(false);
      setMaterialForm({ title: '', type: 'PDF', size: '2.5 MB', description: '' });
    }, 400);
  };

  // Handle Multilingual Content
  const handleAddMultilingual = (e) => {
    e.preventDefault();
    if (!multiForm.title) return;
    setIsSaving(true);
    setTimeout(() => {
      addMultilingualContent(currentProgId, selectedModuleId, multiForm.language, {
        title: multiForm.title,
        description: multiForm.description
      });
      setIsSaving(false);
      setShowMultilingualModal(false);
      setMultiForm({ language: 'hi', title: '', description: '' });
    }, 400);
  };

  // Auto-translate placeholder with Bhashini AI
  const handleBhashiniAutoTranslate = () => {
    if (multiForm.language === 'hi') {
      setMultiForm({
        ...multiForm,
        title: currentModule.title ? `[अनुवादित] ${currentModule.title}` : 'सहकारी लेखा एवं प्रबंधन मॉड्यूल',
        description: currentModule.description ? `[भाषिणी एआई अनुवाद] ${currentModule.description}` : 'प्राथमिक कृषि साख समितियों के लिए व्यापक प्रशिक्षण सामग्री।'
      });
    } else if (multiForm.language === 'mr') {
      setMultiForm({
        ...multiForm,
        title: currentModule.title ? `[मराठी अनुवाद] ${currentModule.title}` : 'सहकारी व्यवस्थापन आणि हिशोब',
        description: currentModule.description ? `[भाषिणी अनुवाद] ${currentModule.description}` : 'पॅक्स कर्मचाऱ्यांसाठी सर्वसमावेशक अभ्यासक्रम.'
      });
    } else if (multiForm.language === 'gu') {
      setMultiForm({
        ...multiForm,
        title: currentModule.title ? `[ગુજરાતી અનુવાદ] ${currentModule.title}` : 'સહકારી હિસાબ અને વ્યવસ્થાપન',
        description: currentModule.description ? `[ભાષિણી એઆઈ] ${currentModule.description}` : 'પ્રાથમિક સહકારી મંડળીઓ માટે તાલીમ સામગ્રી.'
      });
    }
  };

  // Handle Quiz Creation
  const handleCreateQuiz = (e) => {
    e.preventDefault();
    if (!quizForm.prompt || !quizForm.opt1 || !quizForm.opt2) return;
    setIsSaving(true);
    setTimeout(() => {
      const options = [
        { value: 'opt1', label: quizForm.opt1, correct: quizForm.correctIndex === 1 },
        { value: 'opt2', label: quizForm.opt2, correct: quizForm.correctIndex === 2 },
        { value: 'opt3', label: quizForm.opt3 || 'None of the above', correct: quizForm.correctIndex === 3 }
      ];

      if (quizForm.targetType === 'module') {
        createQuizQuestion(currentProgId, selectedModuleId, {
          prompt: quizForm.prompt,
          options
        });
      } else {
        createExamQuestion(currentProgId, {
          prompt: quizForm.prompt,
          options
        });
      }

      setIsSaving(false);
      setShowQuizModal(false);
      setQuizForm({
        targetType: 'module',
        prompt: '',
        opt1: '',
        opt2: '',
        opt3: '',
        correctIndex: 1
      });
    }, 400);
  };

  // Handle Create Course
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
        alert(`Course "${courseForm.title}" published successfully! Trainees can now enroll.`);
        window.location.reload();
      }
    } catch (err) {
      console.error('Error creating course:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Grade Save
  const handleSaveTraineeGrade = async (e) => {
    e.preventDefault();
    if (!selectedTraineeForGrade) return;
    setIsSaving(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/trainees/${selectedTraineeForGrade.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessment_score: parseInt(newGradeScore, 10) })
      });
      setTrainees(prev => prev.map(t => t.id === selectedTraineeForGrade.id ? { ...t, assessment_score: parseInt(newGradeScore, 10) } : t));
      setShowGradeModal(false);
    } catch (err) {
      console.error('Error grading trainee:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructor Notice Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-[#1e3a5f] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30 mb-2">
              <ShieldCheck size={14} /> Faculty LMS Studio • Instructor Content Management
            </div>
            <h1 className="text-2xl lg:text-3xl font-black">
              {currentProgMeta.title}
            </h1>
            <p className="text-blue-200 text-xs lg:text-sm mt-1 max-w-2xl font-medium">
              As a Trainer, you author the curriculum, upload video lectures & study handouts, generate multilingual content via Bhashini, publish assessments, and monitor trainee learning progression.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setShowCourseModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-gray-950 px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow flex items-center gap-1.5"
            >
              <Plus size={16} /> Create New Course
            </button>
          </div>
        </div>

        {/* Course Switcher Pills */}
        <div className="mt-5 pt-4 border-t border-blue-800/60 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-blue-200 font-bold uppercase tracking-wider mr-2">Manage Course:</span>
          {(programmes || []).map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectProg(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentProgId === p.id 
                  ? 'bg-white text-[#1e3a5f] shadow' 
                  : 'bg-white/10 text-blue-100 hover:bg-white/20'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* 5 Core Feature Tabs as required by Prompt */}
      <div className="flex border-b border-gray-200 overflow-x-auto gap-2 bg-white px-4 pt-3 rounded-2xl shadow-sm">
        <button
          onClick={() => setActiveTab('videos')}
          className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'videos' ? 'border-[#1e3a5f] text-[#1e3a5f]' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Video size={16} /> 1. Video Lectures & Modules
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'materials' ? 'border-[#1e3a5f] text-[#1e3a5f]' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <FileText size={16} /> 2. Upload Study Materials & PDFs
        </button>

        <button
          onClick={() => setActiveTab('multilingual')}
          className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'multilingual' ? 'border-[#1e3a5f] text-[#1e3a5f]' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Globe size={16} /> 3. Multilingual Content (Bhashini)
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'quizzes' ? 'border-[#1e3a5f] text-[#1e3a5f]' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <HelpCircle size={16} /> 4. Create Quizzes & Cutoff Score
        </button>

        <button
          onClick={() => setActiveTab('progress')}
          className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'progress' ? 'border-[#1e3a5f] text-[#1e3a5f]' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Users size={16} /> 5. Monitor Trainee Progress ({trainees.length})
        </button>
      </div>

      {/* Module Selector Pill Bar */}
      {activeTab !== 'progress' && (
        <div className="bg-slate-50 p-3 rounded-2xl border border-gray-200/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2 flex items-center gap-1.5">
            <Layers size={14} className="text-[#1e3a5f]" /> Active Module:
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
              Module {m.id}: {m.title.slice(0, 30)}...
            </button>
          ))}
        </div>
      )}

      {/* ===================== TAB 1: VIDEOS ===================== */}
      {activeTab === 'videos' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-black text-[#1e3a5f] flex items-center gap-2">
                <Video className="text-[#c17f24]" /> Video Lessons for Module {currentModule.id}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">{currentModule.title}</p>
            </div>
            <button
              onClick={() => setShowVideoModal(true)}
              className="px-4 py-2 bg-[#1e3a5f] hover:bg-[#152a45] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Upload size={14} /> Upload Video to Module {currentModule.id}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(currentModule.videos || []).length === 0 ? (
              <div className="col-span-2 p-10 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <Video size={36} className="mx-auto text-gray-300 mb-2" />
                <p className="font-bold text-sm text-gray-600">No video lessons uploaded for this module yet.</p>
                <p className="text-xs text-gray-400 mt-1">Click "Upload Video" above to publish a lecture for enrolled trainees.</p>
              </div>
            ) : (
              (currentModule.videos || []).map((vid) => (
                <div key={vid.id} className="p-4 rounded-2xl border border-gray-200 bg-slate-50/60 hover:bg-white hover:shadow-sm transition-all space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full uppercase">
                      Language: {vid.language || 'en'}
                    </span>
                    <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                      <Clock size={12} /> {vid.duration}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#1e3a5f]">{vid.title}</h4>
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={13} /> Active in Trainee LMS
                    </span>
                    <span className="text-[11px] font-mono text-gray-400">{vid.id}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ===================== TAB 2: STUDY MATERIALS ===================== */}
      {activeTab === 'materials' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-black text-[#1e3a5f] flex items-center gap-2">
                <FileText className="text-[#c17f24]" /> Study Materials & Handouts for Module {currentModule.id}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">{currentModule.title}</p>
            </div>
            <button
              onClick={() => setShowMaterialModal(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Upload size={14} /> Upload Study Material
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(currentModule.materials || []).length === 0 ? (
              <div className="col-span-2 p-10 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <FileText size={36} className="mx-auto text-gray-300 mb-2" />
                <p className="font-bold text-sm text-gray-600">No study materials uploaded for this module yet.</p>
                <p className="text-xs text-gray-400 mt-1">Upload PDF guides, Excel worksheets, or statutory acts for trainees.</p>
              </div>
            ) : (
              (currentModule.materials || []).map((mat) => (
                <div key={mat.id} className="p-4 rounded-2xl border border-gray-200 bg-slate-50/60 hover:bg-white hover:shadow-sm transition-all space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full">
                      {mat.type || 'PDF'} • {mat.size}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">{mat.id}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#1e3a5f]">{mat.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2">{mat.description}</p>
                  <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                    <span className="text-green-700 font-bold flex items-center gap-1">
                      <CheckCircle2 size={13} /> Available for Trainees
                    </span>
                    <span className="text-blue-700 font-semibold cursor-pointer hover:underline">
                      Download Preview
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: MULTILINGUAL BHASHINI ===================== */}
      {activeTab === 'multilingual' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-black text-[#1e3a5f] flex items-center gap-2">
                <Globe className="text-[#c17f24]" /> Multilingual Translations for Module {currentModule.id}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Bhashini AI Language Model integration for regional cooperative trainees</p>
            </div>
            <button
              onClick={() => setShowMultilingualModal(true)}
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Plus size={14} /> Add Translated Content
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['hi', 'mr', 'gu'].map((langCode) => {
              const langNames = { hi: 'Hindi (हिंदी)', mr: 'Marathi (मराठी)', gu: 'Gujarati (ગુજરાતી)' };
              const translation = currentModule.multilingual?.[langCode];
              return (
                <div key={langCode} className="p-4 rounded-2xl border border-gray-200 bg-slate-50 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs text-[#1e3a5f]">{langNames[langCode]}</span>
                    {translation ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                        Active ✓
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] font-bold rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
                  {translation ? (
                    <>
                      <h4 className="font-bold text-xs text-gray-900 mt-2">{translation.title}</h4>
                      <p className="text-[11px] text-gray-600 line-clamp-3">{translation.description}</p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400 py-3 text-center">
                      No translation added yet. Click "Add Translated Content".
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== TAB 4: QUIZZES & ASSESSMENTS ===================== */}
      {activeTab === 'quizzes' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-black text-[#1e3a5f] flex items-center gap-2">
                <HelpCircle className="text-[#c17f24]" /> Quizzes & Assessment Questions
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage evaluation criteria, multiple-choice questions, and passing cutoff scores.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                <span className="text-xs font-bold text-amber-900">Passing Cutoff:</span>
                <input
                  type="number"
                  value={activeCourse.cutoff_score || 75}
                  onChange={(e) => updateCutoffScore(currentProgId, e.target.value)}
                  className="w-12 bg-white text-xs font-black text-center border border-amber-300 rounded p-1"
                />
                <span className="text-xs font-bold text-amber-900">%</span>
              </div>
              <button
                onClick={() => setShowQuizModal(true)}
                className="px-4 py-2 bg-[#1e3a5f] hover:bg-[#152a45] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Plus size={14} /> Create Assessment Question
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Module {currentModule.id} Practice Quiz Questions (Attempted by Trainees)
            </h3>
            {(currentModule.quiz || []).length === 0 ? (
              <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-sm font-semibold">No quiz questions added for Module {currentModule.id}.</p>
                <button
                  onClick={() => {
                    setQuizForm({ ...quizForm, targetType: 'module' });
                    setShowQuizModal(true);
                  }}
                  className="mt-2 text-xs font-bold text-blue-700 hover:underline"
                >
                  + Add first question
                </button>
              </div>
            ) : (
              (currentModule.quiz || []).map((q, idx) => (
                <div key={q.id || idx} className="p-4 rounded-2xl border border-gray-200 bg-slate-50/60 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-extrabold text-sm text-gray-900">{idx + 1}. {q.prompt}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      Module Quiz
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                          opt.correct
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                            : 'bg-white border-gray-200 text-gray-700'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                          opt.correct ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="truncate">{opt.label}</span>
                        {opt.correct && <span className="ml-auto text-[10px] text-emerald-700 font-bold">✓ Correct</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}

            {/* Course Final Certification Exam Questions */}
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-4">
              Course Final Certification Exam Questions ({activeCourse.examQuestions?.length || 4} Total)
            </h3>
            {(activeCourse.examQuestions || []).map((eq, eIdx) => (
              <div key={eq.id || eIdx} className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-extrabold text-sm text-gray-900">{eIdx + 1}. {eq.prompt}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                    Final Exam (Cutoff: {activeCourse.cutoff_score || 75}%)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                  {eq.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                        opt.correct
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                          : 'bg-white border-gray-200 text-gray-700'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        opt.correct ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="truncate">{opt.label}</span>
                      {opt.correct && <span className="ml-auto text-[10px] text-emerald-700 font-bold">✓ Correct</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 5: MONITOR TRAINEE PROGRESS ===================== */}
      {activeTab === 'progress' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-black text-[#1e3a5f] flex items-center gap-2">
                <Users className="text-[#c17f24]" /> Trainee Learning & Certification Progress
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Real-time monitoring of enrolled candidate scores against the {activeCourse.cutoff_score || 75}% passing cutoff
              </p>
            </div>
            <button
              onClick={fetchTrainees}
              className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <RefreshCw size={13} className={loadingTrainees ? 'animate-spin' : ''} /> Refresh List
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                  <th className="py-3 px-4">Trainee Name & Sahakar ID</th>
                  <th className="py-3 px-4">Cooperative Society</th>
                  <th className="py-3 px-4">Attendance</th>
                  <th className="py-3 px-4">Assessment Score</th>
                  <th className="py-3 px-4">Cutoff Status</th>
                  <th className="py-3 px-4 text-right">Faculty Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {trainees.map((t) => {
                  const score = t.assessment_score || 85;
                  const cutoff = activeCourse.cutoff_score || 75;
                  const hasPassed = score >= cutoff;

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        <div>{t.name}</div>
                        <div className="font-mono text-[11px] text-gray-400 font-normal">{t.id}</div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 font-medium">{t.cooperative || 'PACS Pune'}</td>
                      <td className="py-3.5 px-4 font-semibold text-emerald-700">
                        {t.attendance_pct || 92}%
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-[#1e3a5f]">
                        {score}%
                      </td>
                      <td className="py-3.5 px-4">
                        {hasPassed ? (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                            <CheckCircle2 size={12} /> Cleared Cutoff (Certified)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                            <AlertCircle size={12} /> Under Cutoff ({score}/{cutoff}%)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedTraineeForGrade(t);
                            setNewGradeScore(score);
                            setShowGradeModal(true);
                          }}
                          className="px-3 py-1.5 bg-[#1e3a5f] hover:bg-[#152a45] text-white rounded-xl font-bold text-[11px] transition-colors"
                        >
                          Grade / Evaluate
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

      {/* ===================== MODAL: UPLOAD VIDEO ===================== */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-1">Upload Video Lecture</h3>
            <p className="text-xs text-gray-500 mb-5">
              Add a lecture video to <span className="font-bold text-gray-800">Module {currentModule.id}</span>
            </p>

            <form onSubmit={handleUploadVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Video Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PACS Day-End Ledger Balancing & Vouching Walkthrough"
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
                    placeholder="e.g. 25 min"
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Audio Language</label>
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

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Video Stream URL / Edge Box Cache</label>
                <input
                  type="text"
                  placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ (or local edge path)"
                  value={videoForm.url}
                  onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                />
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
                  {isSaving ? 'Publishing...' : 'Publish Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: UPLOAD STUDY MATERIAL ===================== */}
      {showMaterialModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-1">Upload Study Material / Handout</h3>
            <p className="text-xs text-gray-500 mb-5">
              Publish learning document to <span className="font-bold text-gray-800">Module {currentModule.id}</span>
            </p>

            <form onSubmit={handleUploadMaterial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PACS Statutory Model Bye-laws 2026 Manual"
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Format Type</label>
                  <select
                    value={materialForm.type}
                    onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="Excel">Excel / Spreadsheet</option>
                    <option value="Word">Word Document</option>
                    <option value="Presentation">PowerPoint Presentation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Estimated Size</label>
                  <input
                    type="text"
                    required
                    value={materialForm.size}
                    onChange={(e) => setMaterialForm({ ...materialForm, size: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Brief Description</label>
                <textarea
                  rows={3}
                  placeholder="Summary of statutory provisions or step-by-step guidance covered in this material..."
                  value={materialForm.description}
                  onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                />
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
                  {isSaving ? 'Uploading...' : 'Upload Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: MULTILINGUAL BHASHINI ===================== */}
      {showMultilingualModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-[#1e3a5f]">Add Multilingual Content</h3>
              <button
                type="button"
                onClick={handleBhashiniAutoTranslate}
                className="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 flex items-center gap-1"
              >
                <Sparkles size={13} /> Bhashini AI Translate
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-5">
              Add regional translation for <span className="font-bold text-gray-800">Module {currentModule.id}</span>
            </p>

            <form onSubmit={handleAddMultilingual} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Target Language</label>
                <select
                  value={multiForm.language}
                  onChange={(e) => setMultiForm({ ...multiForm, language: e.target.value })}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                >
                  <option value="hi">Hindi (हिंदी)</option>
                  <option value="mr">Marathi (मराठी)</option>
                  <option value="gu">Gujarati (ગુજરાતી)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Translated Module Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. सहकारिता का परिचय एवं 7 सिद्धांत"
                  value={multiForm.title}
                  onChange={(e) => setMultiForm({ ...multiForm, title: e.target.value })}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Translated Description</label>
                <textarea
                  rows={3}
                  placeholder="क्षेत्रीय भाषा में पाठ्यक्रम का संक्षिप्त विवरण..."
                  value={multiForm.description}
                  onChange={(e) => setMultiForm({ ...multiForm, description: e.target.value })}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowMultilingualModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 shadow flex items-center gap-2"
                >
                  {isSaving && <RefreshCw size={14} className="animate-spin" />}
                  {isSaving ? 'Saving...' : 'Save Translation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: CREATE QUIZ QUESTION ===================== */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-1">Create Assessment Question</h3>
            <p className="text-xs text-gray-500 mb-5">
              Add an evaluation question for trainees to attempt in this course.
            </p>

            <form onSubmit={handleCreateQuiz} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Assessment Target</label>
                <select
                  value={quizForm.targetType}
                  onChange={(e) => setQuizForm({ ...quizForm, targetType: e.target.value })}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                >
                  <option value="module">Module {currentModule.id} Practice Quiz</option>
                  <option value="final">Course Final Certification Exam</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Question Prompt</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Under cooperative auditing guidelines, how are overdue crop loans exceeding 90 days categorized?"
                  value={quizForm.prompt}
                  onChange={(e) => setQuizForm({ ...quizForm, prompt: e.target.value })}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase">Answer Options (Select the Correct One)</label>
                
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctOpt"
                    checked={quizForm.correctIndex === 1}
                    onChange={() => setQuizForm({ ...quizForm, correctIndex: 1 })}
                    className="w-4 h-4 text-emerald-600"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Option A (e.g. Non-Performing Asset with statutory provisioning)"
                    value={quizForm.opt1}
                    onChange={(e) => setQuizForm({ ...quizForm, opt1: e.target.value })}
                    className="flex-1 text-sm p-2.5 border border-gray-200 rounded-xl outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctOpt"
                    checked={quizForm.correctIndex === 2}
                    onChange={() => setQuizForm({ ...quizForm, correctIndex: 2 })}
                    className="w-4 h-4 text-emerald-600"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Option B (e.g. Standard performing credit asset)"
                    value={quizForm.opt2}
                    onChange={(e) => setQuizForm({ ...quizForm, opt2: e.target.value })}
                    className="flex-1 text-sm p-2.5 border border-gray-200 rounded-xl outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctOpt"
                    checked={quizForm.correctIndex === 3}
                    onChange={() => setQuizForm({ ...quizForm, correctIndex: 3 })}
                    className="w-4 h-4 text-emerald-600"
                  />
                  <input
                    type="text"
                    placeholder="Option C (Optional third distractor)"
                    value={quizForm.opt3}
                    onChange={(e) => setQuizForm({ ...quizForm, opt3: e.target.value })}
                    className="flex-1 text-sm p-2.5 border border-gray-200 rounded-xl outline-none"
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

      {/* ===================== MODAL: CREATE NEW COURSE ===================== */}
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
                  placeholder="e.g. Cooperative Dairy Cold Chain Logistics & Quality Audit"
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
                    <option value="Blended">Blended (Online + Lab)</option>
                    <option value="Classroom">Classroom</option>
                    <option value="Offline / Edge">Offline / Edge Box</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cutoff Pass Mark (%)</label>
                  <input
                    type="number"
                    required
                    value={courseForm.cutoff_score}
                    onChange={(e) => setCourseForm({ ...courseForm, cutoff_score: parseInt(e.target.value, 10) })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={courseForm.start_date}
                    onChange={(e) => setCourseForm({ ...courseForm, start_date: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={courseForm.end_date}
                    onChange={(e) => setCourseForm({ ...courseForm, end_date: e.target.value })}
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
                  {isSaving ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: GRADE TRAINEE ===================== */}
      {showGradeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-1">Evaluate Trainee</h3>
            <p className="text-xs text-gray-500 mb-4">
              Updating final assessment score for <span className="font-bold text-gray-900">{selectedTraineeForGrade?.name}</span> ({selectedTraineeForGrade?.id})
            </p>

            <form onSubmit={handleSaveTraineeGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Awarded Score (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={newGradeScore}
                  onChange={(e) => setNewGradeScore(e.target.value)}
                  className="w-full text-2xl font-black text-center p-3 border border-gray-200 rounded-xl outline-none focus:border-[#1e3a5f]"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-gray-200 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Passing Cutoff Benchmark:</span>
                  <span className="font-extrabold text-[#1e3a5f]">{activeCourse.cutoff_score || 75}%</span>
                </div>
                <div className="mt-1 font-semibold">
                  {parseInt(newGradeScore, 10) >= (activeCourse.cutoff_score || 75) ? (
                    <span className="text-emerald-700 font-bold">✓ Score clears cutoff: Trainee will be certified</span>
                  ) : (
                    <span className="text-rose-600 font-bold">⚠ Score is below cutoff: Trainee requires remedial</span>
                  )}
                </div>
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



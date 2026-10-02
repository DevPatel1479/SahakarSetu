import React, { useEffect, useState } from 'react';
import { BookOpen, Award, TrendingUp, Calendar, MapPin, Briefcase, CreditCard, ChevronRight } from 'lucide-react';
import { api } from '../../data/mockApi';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store';

export default function TraineeDashboard() {
  const { user } = useAuthStore();
  const [trainee, setTrainee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = user?.sahakarId || 'SAH-2026-000001';
    api.getTrainee(id).then(data => {
      setTrainee(data || {
        id,
        name: user?.name || 'Arjun Kumar Verma',
        cooperative: 'Baramati Taluka Cooperative Milk Union',
        state: 'Maharashtra',
        attendancePct: 94,
        assessmentScore: 92,
        certificates: 1,
        programme: 'Management Development Programme for PACS',
        institute: 'VAMNICOM, Pune'
      });
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-40 bg-gray-200 rounded-2xl dark:bg-gray-800"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl dark:bg-gray-800"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* 1. IMPRESSIVE HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-800">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2000&auto=format&fit=crop')` }}
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/95 via-teal-900/80 to-teal-800/40 dark:from-gray-900/95 dark:via-gray-900/80"></div>
        
        <div className="relative z-10 p-8 md:p-12 max-w-3xl text-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white text-teal-700 flex items-center justify-center text-2xl font-bold border-4 border-teal-500/30">
              {trainee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {trainee.name.split(' ')[0]}</h1>
              <p className="text-teal-100 flex items-center gap-2 mt-1 text-sm font-medium">
                <MapPin size={16} className="text-teal-400" /> {trainee.cooperative}, {trainee.state}
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 inline-block">
            <div className="text-xs text-teal-200 font-semibold uppercase tracking-wider mb-1">Your Sahakar ID</div>
            <div className="text-3xl md:text-4xl font-mono font-bold tracking-widest text-white drop-shadow-md">
              {trainee.id}
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROGRESS GRID */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp size={24} style={{ color: 'var(--color-primary)' }} />
          Your Training Journey
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border shadow-sm bg-white dark:bg-gray-900 flex flex-col transition-all hover:shadow-md" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                <Calendar size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{trainee.attendancePct}%</span>
            </div>
            <div className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Overall Attendance</div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${trainee.attendancePct}%` }}></div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border shadow-sm bg-white dark:bg-gray-900 flex flex-col transition-all hover:shadow-md" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <BookOpen size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{trainee.assessmentScore}%</span>
            </div>
            <div className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Average Assessment Score</div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${trainee.assessmentScore}%` }}></div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border shadow-sm bg-white dark:bg-gray-900 flex flex-col transition-all hover:shadow-md" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl">
                <Award size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{trainee.certificates}</span>
            </div>
            <div className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Verified Certificates</div>
            <p className="text-xs text-gray-500 mt-1">Ready for Skill Passport</p>
          </div>
        </div>
      </div>

      {/* 3. CURRENT ENROLLMENT & ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-6 rounded-2xl border shadow-sm" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h3 className="text-lg font-bold mb-4">Current Programme</h3>
          <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-lg mb-1">{trainee.programme}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{trainee.institute}</p>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <Link to="/learning" className="flex items-center gap-2 px-5 py-2.5 bg-[#1e3a5f] hover:bg-[#152e4d] text-white rounded-lg text-sm font-medium transition-colors">
                <BookOpen size={18} /> Resume Learning
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl border shadow-sm flex flex-col" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h3 className="text-lg font-bold mb-4">Next Steps</h3>
          
          <div className="space-y-3 flex-1">
            <Link to="/skill-passport" className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Award size={18} /></div>
                <div>
                  <div className="font-bold text-sm">Digital Skill Passport</div>
                  <div className="text-[11px] text-gray-500">4 Role Readiness Benchmarks</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
            
            <Link to="/employment" className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Briefcase size={18} /></div>
                <div>
                  <div className="font-bold text-sm">AI Job Matching</div>
                  <div className="text-[11px] text-gray-500">92% Match with Cooperative Vacancies</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>

            <Link to="/sahakar-id" className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-lg"><CreditCard size={18} /></div>
                <div>
                  <div className="font-bold text-sm">My Sahakar ID Card</div>
                  <div className="text-[11px] text-gray-500">Verifiable Digital Identity & QR</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, Building2, Briefcase, TrendingUp, AlertCircle, FileText, CheckCircle, Smartphone } from 'lucide-react';
import { api } from '../../data/mockApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function NCCTDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/analytics/`);
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        setStats(data.kpis);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const chartData = [
    { name: 'Jan', trainees: 120, placed: 40 },
    { name: 'Feb', trainees: 210, placed: 80 },
    { name: 'Mar', trainees: 380, placed: 120 },
    { name: 'Apr', trainees: 590, placed: 180 },
    { name: 'May', trainees: 850, placed: 240 },
    { name: 'Jun', trainees: 1141, placed: 320 },
  ];

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-48 bg-gray-200 rounded-2xl dark:bg-gray-800"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl dark:bg-gray-800"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* 1. IMPRESSIVE HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-800">
        {/* Background Image showing Cooperative / Agricultural Training context */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2000&auto=format&fit=crop')` }}
        ></div>
        
        {/* Gradient Overlay for text readability (Navy Blue to transparent) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/95 via-[#1e3a5f]/80 to-transparent dark:from-[#0d1117]/95 dark:via-[#0d1117]/80"></div>
        
        {/* Content */}
        <div className="relative z-10 p-8 md:p-12 max-w-3xl text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-semibold tracking-wide uppercase mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            National Overview
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Empowering Cooperatives<br/>
            <span className="text-amber-400">Through Digital Capacity Building</span>
          </h1>
          
          <p className="text-sm md:text-lg text-blue-100 mb-8 max-w-2xl leading-relaxed">
            Central command center for NCCT's training ecosystem. Bridging the gap between 
            rural agricultural societies and modern ERP tools via Edge Box offline learning, 
            Skill Passports, and integrated employment outcomes.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
              <Smartphone size={18} className="text-amber-400" />
              <span>Edge-Box Sync Active</span>
            </div>
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
              <CheckCircle size={18} className="text-green-400" />
              <span>Offline Capabilities Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp size={24} style={{ color: 'var(--color-primary)' }} />
            National Training Impact
          </h2>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
            Synthetic Demo Data
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={<Users size={28} className="text-blue-600 dark:text-blue-400" />} 
            title="Total Trainees" 
            value={stats?.trainees?.toLocaleString()} 
            subtitle="+12% this month" 
            color="bg-blue-50 dark:bg-blue-900/20"
            border="border-blue-100 dark:border-blue-800"
          />
          <StatCard 
            icon={<GraduationCap size={28} className="text-emerald-600 dark:text-emerald-400" />} 
            title="Certificates Issued" 
            value={stats?.certificates?.toLocaleString()} 
            subtitle="Verified via Blockchain/QR" 
            color="bg-emerald-50 dark:bg-emerald-900/20"
            border="border-emerald-100 dark:border-emerald-800"
          />
          <StatCard 
            icon={<Building2 size={28} className="text-amber-600 dark:text-amber-400" />} 
            title="Active Programmes" 
            value={stats?.programmes?.toLocaleString()} 
            subtitle={`Across ${stats?.institutes} Institutes`}
            color="bg-amber-50 dark:bg-amber-900/20"
            border="border-amber-100 dark:border-amber-800"
          />
          <StatCard 
            icon={<Briefcase size={28} className="text-purple-600 dark:text-purple-400" />} 
            title="Employment Matches" 
            value={stats?.jobs?.toLocaleString()} 
            subtitle={`${stats?.placed} successfully placed`}
            color="bg-purple-50 dark:bg-purple-900/20"
            border="border-purple-100 dark:border-purple-800"
          />
        </div>
      </div>

      {/* 3. CHARTS AND DATA VISUALIZATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-6 rounded-2xl border shadow-sm" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h3 className="text-lg font-bold mb-6">Enrollment vs Employment Trends</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)' }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '8px', color: 'var(--color-text)' }}
                />
                <Line type="monotone" dataKey="trainees" name="Enrolled Trainees" stroke="#1e3a5f" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="placed" name="Placed in Jobs" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl border shadow-sm flex flex-col" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Edge Box Sync Status</h3>
            <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div> Live
            </span>
          </div>
          
          <div className="flex-1 space-y-4">
            {[
              { id: 'SYNC-992', source: 'ICM Bhopal (Offline)', items: 42, time: '2 mins ago', status: 'success' },
              { id: 'SYNC-991', source: 'VAMNICOM Pune', items: 15, time: '18 mins ago', status: 'success' },
              { id: 'SYNC-990', source: 'RICM Chandigarh (Offline)', items: 8, time: '1 hour ago', status: 'success' },
              { id: 'SYNC-989', source: 'ICM Dehradun', items: 112, time: '3 hours ago', status: 'warning' },
            ].map(sync => (
              <div key={sync.id} className="p-4 rounded-xl border transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex justify-between items-start mb-1">
                  <div className="font-semibold text-sm">{sync.source}</div>
                  <div className="text-xs text-gray-500">{sync.time}</div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <FileText size={14} />
                  <span>{sync.items} local records synced</span>
                  {sync.status === 'success' ? (
                    <CheckCircle size={14} className="text-green-500 ml-auto" />
                  ) : (
                    <AlertCircle size={14} className="text-amber-500 ml-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2.5 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            View Complete Sync Logs
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, color, border }) {
  return (
    <div className={`p-6 rounded-2xl border ${border} ${color} flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 hover:shadow-md`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{value}</div>
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{title}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{subtitle}</div>
      </div>
    </div>
  );
}




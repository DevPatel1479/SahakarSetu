import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { Building2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [role, setRole] = useState('ncct_admin');
  const [password, setPassword] = useState('Demo@2026');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'Demo@2026') {
      const extra = role === 'trainee' ? { sahakarId: 'SAH-2026-000001', name: 'Arjun Kumar Verma' } : {};
      login(role, role === 'trainee' ? 'Arjun Kumar Verma' : role.replace('_', ' ').toUpperCase(), extra);
      navigate('/dashboard');
    }
  };

  const handleQuickLogin = (r) => {
    const extra = r === 'trainee' ? { sahakarId: 'SAH-2026-000001', name: 'Arjun Kumar Verma' } : {};
    login(r, r === 'trainee' ? 'Arjun Kumar Verma' : r.replace('_', ' ').toUpperCase(), extra);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1e3a5f] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2000&auto=format&fit=crop')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1d2f] via-[#1e3a5f]/80 to-[#1e3a5f]/30"></div>
        
        <div className="relative z-10 p-12 text-white max-w-xl">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl inline-block mb-8 shadow-lg">
            <Building2 size={48} className="text-amber-400" />
          </div>
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">SahakarSetu</h1>
          <p className="text-xl text-blue-100 mb-8 font-medium leading-relaxed">
            AI & LMS-Enabled Cooperative Capacity Building, ERP & Employment Ecosystem
          </p>
          <div className="flex items-center gap-2 text-sm font-semibold bg-emerald-500/20 text-emerald-300 px-4 py-2.5 rounded-full border border-emerald-500/30 w-fit backdrop-blur-sm shadow-sm">
            <ShieldCheck size={18} />
            SahakarSetu Digital Ecosystem
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sign In</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Demo Environment — Synthetic Data</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Demo Role</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1e3a5f] font-medium"
              >
                <option value="ncct_admin">NCCT Super Admin</option>
                <option value="institute_admin">Institute Admin (VAMNICOM)</option>
                <option value="trainer">Trainer / Faculty</option>
                <option value="trainee">Trainee / Student</option>
                <option value="employer">Employer / Cooperative Society</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                readOnly
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 px-4 py-3.5 text-gray-500 cursor-not-allowed font-medium"
              />
            </div>

            <button type="submit" className="w-full bg-[#1e3a5f] hover:bg-[#152e4d] text-white py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-2">
              Sign In to Platform <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 mb-3 font-bold uppercase tracking-wider">Quick Role Switch</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              <button onClick={() => handleQuickLogin('ncct_admin')} className="py-2 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200 text-center">NCCT</button>
              <button onClick={() => handleQuickLogin('institute_admin')} className="py-2 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-200 text-center">Institute</button>
              <button onClick={() => handleQuickLogin('trainer')} className="py-2 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors border border-amber-200 text-center">Trainer</button>
              <button onClick={() => handleQuickLogin('trainee')} className="py-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200 text-center">Trainee</button>
              <button onClick={() => handleQuickLogin('employer')} className="py-2 text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border border-purple-200 text-center">Employer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





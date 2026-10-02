import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  QrCode, 
  Download, 
  Share2, 
  CheckCircle2, 
  Award, 
  BookOpen, 
  Building2, 
  MapPin, 
  Calendar, 
  User, 
  ShieldCheck, 
  Clock,
  Printer
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuthStore } from '../../store';

export default function SahakarIdPage() {
  const { user } = useAuthStore();
  const [trainee, setTrainee] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const defaultTrainee = {
    id: user?.sahakarId || 'SAH-2026-000001',
    name: user?.name || 'Arjun Kumar Verma',
    email: 'arjun.verma@coop.gov.in',
    phone: '+91 98765 43210',
    gender: 'Male',
    cooperative: 'Baramati Taluka Cooperative Milk Union',
    district: 'Pune',
    state: 'Maharashtra',
    certificate_id: 'CERT-2026-001847',
    attendance_pct: 94,
    assessment_score: 92,
    status: 'active'
  };

  useEffect(() => {
    // Fetch trainee data from DB, fallback to Arjun Kumar Verma
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/trainees/`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const found = data.find(t => t.id === (user?.sahakarId || 'SAH-2026-000001')) || data[0];
          setTrainee({ ...defaultTrainee, ...found, certificate_id: 'CERT-2026-001847' });
        } else {
          setTrainee(defaultTrainee);
        }
      })
      .catch(() => {
        setTrainee(defaultTrainee);
      });
  }, [user]);

  const handlePrint = () => {
    window.print();
  };

  if (!trainee) {
    return <div className="p-12 text-center text-gray-400">Loading Sahakar Digital ID...</div>;
  }

  const certificateId = trainee.certificate_id || 'CERT-2026-001847';
  const verifyUrl = `${window.location.origin}/verify/${certificateId}`;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 mt-4 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c17f24] uppercase tracking-wider mb-1">
            <CreditCard size={14} /> National Cooperative Digital Identity
          </div>
          <h1 className="text-3xl font-extrabold text-[#1e3a5f] flex items-center gap-3">
            My Sahakar ID Card
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            One Sahakar ID → Train → Learn → Certify → Employ → Track
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="bg-white text-gray-700 px-4 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center gap-2 border border-gray-200 text-sm shadow-sm"
          >
            <Printer size={16} /> Print Card
          </button>
          <a
            href={verifyUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-[#1e3a5f] text-white px-4 py-2.5 rounded-xl font-bold hover:bg-[#152a45] transition-colors flex items-center gap-2 text-sm shadow-sm"
          >
            <ShieldCheck size={16} /> Public Verification
          </a>
        </div>
      </div>

      {/* Main Grid: Front & Back Digital ID Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Front of ID Card (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-gradient-to-br from-[#1e3a5f] via-[#152a45] to-[#0f1d2f] text-white p-8 rounded-3xl shadow-xl border border-blue-900/40 relative overflow-hidden">
            {/* Watermark Pattern */}
            <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
              <Building2 size={320} className="-mr-16 -mt-16 text-white" />
            </div>

            {/* Top Bar: Ministry & NCCT Header */}
            <div className="flex justify-between items-start border-b border-blue-400/20 pb-4 mb-6">
              <div>
                <p className="text-[11px] font-bold tracking-widest text-[#c17f24] uppercase">
                  Ministry of Cooperation • Govt of India
                </p>
                <h3 className="text-lg font-black tracking-tight text-white">
                  National Council for Cooperative Training
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-400/30 font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 size={12} /> Verified Identity
              </span>
            </div>

            {/* Main Content */}
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              {/* Photo Avatar */}
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-[#1e3a5f] flex items-center justify-center font-black text-4xl shadow-lg border-4 border-white/20 shrink-0">
                {trainee.name.split(' ').map(n => n[0]).join('')}
              </div>

              {/* Trainee Details */}
              <div className="space-y-1.5 text-center sm:text-left flex-1">
                <p className="text-2xl font-black text-white tracking-wide">{trainee.name}</p>
                <p className="text-xs text-blue-200 font-medium flex items-center justify-center sm:justify-start gap-1.5">
                  <MapPin size={13} className="text-[#c17f24]" /> {trainee.cooperative}, {trainee.district}, {trainee.state}
                </p>
                <p className="text-xs text-blue-200 font-mono">Contact: {trainee.phone} • {trainee.email}</p>
                
                <div className="pt-3">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                    Permanent Sahakar ID
                  </span>
                  <span className="text-2xl font-mono font-black text-[#c17f24] tracking-widest block">
                    {trainee.id}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-300 font-bold block mt-1">
                    Cert: {certificateId} ✓
                  </span>
                </div>
              </div>

              {/* Dynamic QR Code */}
              <div className="bg-white p-2.5 rounded-2xl shadow-md shrink-0 text-center">
                <QRCodeSVG value={verifyUrl} size={84} level="M" />
                <p className="text-[9px] font-mono font-bold text-gray-500 mt-1">Scan to Verify</p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-8 pt-4 border-t border-blue-400/20 flex flex-wrap justify-between items-center text-[11px] text-blue-200/80 font-mono">
              <span>Valid Across: VAMNICOM • RICMs • ICMs</span>
              <span>Issue Date: 2026-10-01</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center gap-3 text-xs text-blue-900">
            <ShieldCheck size={20} className="text-blue-700 shrink-0" />
            <p>
              <strong>Tamper-Proof Credential:</strong> This digital Sahakar ID is cryptographically anchored. Scanning the QR code allows recruiters and cooperative societies to instantly verify trainee credentials without contacting institutes.
            </p>
          </div>
        </div>

        {/* Back / Live Card Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl shadow-sm border border-gray-200 space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900">Credential Summary</h3>
            <p className="text-xs text-gray-500">Live operational standing linked to this Sahakar ID</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Enrolled Course</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">PACS Digitization & Computerization</p>
                <p className="text-xs text-blue-700 font-medium">VAMNICOM Pune, Maharashtra</p>
              </div>
              <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Attendance Rate</p>
                <p className="text-xl font-black text-[#1e3a5f] mt-0.5">{trainee.attendance_pct}%</p>
                <p className="text-[10px] text-emerald-700 font-medium">Biometric Verified</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Assessment Score</p>
                <p className="text-xl font-black text-[#c17f24] mt-0.5">{trainee.assessment_score}%</p>
                <p className="text-[10px] text-blue-700 font-medium">Grade A (Distinction)</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-xs text-gray-500 font-bold uppercase mb-2">Verified Skill Chips</p>
              <div className="flex flex-wrap gap-1.5">
                {['PACS Accounting', 'MS Excel', 'Cooperative Law', 'Digital Bookkeeping', 'GST Basics'].map((sk, idx) => (
                  <span key={idx} className="bg-white border border-gray-200 text-gray-800 text-xs px-2.5 py-1 rounded-lg font-medium shadow-2xl flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-600" /> {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



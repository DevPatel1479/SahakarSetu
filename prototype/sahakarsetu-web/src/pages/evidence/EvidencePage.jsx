import React, { useState, useEffect } from 'react';
import { ShieldCheck, Database, Smartphone, Cloud, CheckCircle2, AlertCircle, HardDrive, Cpu, ScanFace, FileText, Globe } from 'lucide-react';

export default function EvidencePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 mt-6">
      <div className="bg-[#1e3a5f] p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10">
          <ShieldCheck size={250} className="-mt-10 -mr-10" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-green-500/20 px-4 py-1.5 rounded-full text-green-300 font-bold border border-green-500/30 mb-6">
            <CheckCircle2 size={18} /> Technical Validation
          </div>
          <h1 className="text-4xl font-black mb-3 tracking-tight">Evidence Center</h1>
          <p className="text-blue-200 text-lg max-w-3xl leading-relaxed">
            This dashboard provides you with a transparent view of the SahakarSetu architecture. It clearly delineates which components are fully functional (working), simulated for demo purposes, or proposed for future government integration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* PostgreSQL & Django */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-3 rounded-xl text-green-700">
              <Database size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Backend Infrastructure</h3>
              <p className="text-xs font-bold text-green-600 bg-green-50 inline-block px-2 py-0.5 rounded-md mt-1">WORKING LIVE</p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" /> <strong>Django REST Framework API:</strong> Fully operational at localhost:8000</li>
            <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" /> <strong>Neon Serverless PostgreSQL:</strong> Live remote database connection</li>
            <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" /> <strong>AWS S3 Object Storage:</strong> Configured for media uploads</li>
          </ul>
        </div>

        {/* Edge Box Simulator */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-700">
              <HardDrive size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Edge Box (Hardware)</h3>
              <p className="text-xs font-bold text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded-md mt-1">SIMULATED IN SOFTWARE</p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" /> <strong>Offline Sync Engine:</strong> Zustand state captures POST requests during network failure</li>
            <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" /> <strong>Sync Event API:</strong> Flushes offline queue to Django `/api/sync-events/`</li>
            <li className="flex items-start gap-2"><AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" /> <strong>Raspberry Pi 5:</strong> Software simulation replaces physical Pi for this demo</li>
          </ul>
        </div>

        {/* Bhashini & RAG */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-3 rounded-xl text-purple-700">
              <Cpu size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">AI / ML Integrations</h3>
              <p className="text-xs font-bold text-purple-600 bg-purple-50 inline-block px-2 py-0.5 rounded-md mt-1">PROPOSED / SIMULATED</p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-purple-500 shrink-0 mt-0.5" /> <strong>Explainable AI Matching:</strong> Baseline rule-based matching UI built</li>
            <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-purple-500 shrink-0 mt-0.5" /> <strong>RAG Career Assistant:</strong> Simulated LLM UI with knowledge base citations</li>
            <li className="flex items-start gap-2"><AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" /> <strong>Bhashini Language API:</strong> Simulated in UI. Requires authorized government API key.</li>
            <li className="flex items-start gap-2"><AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" /> <strong>XGBoost Model:</strong> Architecture defined, but uses dummy scores for demo.</li>
          </ul>
        </div>

        {/* Auth & External */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-100 p-3 rounded-xl text-amber-700">
              <ScanFace size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">External Integrations</h3>
              <p className="text-xs font-bold text-amber-600 bg-amber-50 inline-block px-2 py-0.5 rounded-md mt-1">PROPOSED FUTURE</p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2"><AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" /> <strong>ArcFace Biometrics:</strong> Documented in architecture but requires authorized testing environment.</li>
            <li className="flex items-start gap-2"><AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" /> <strong>DigiLocker Push:</strong> Certificate schema built, API connection proposed for production.</li>
            <li className="flex items-start gap-2"><AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" /> <strong>NCD (National Coop DB):</strong> Sahakar ID format (SAH-2026-XXX) aligns with NCD schema.</li>
          </ul>
        </div>
        
        {/* Certificate System */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-700">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Certificate Verification</h3>
              <p className="text-xs font-bold text-emerald-600 bg-emerald-50 inline-block px-2 py-0.5 rounded-md mt-1">WORKING LIVE</p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> <strong>QR Code Generation:</strong> Real-time mapping to verification URL.</li>
            <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> <strong>Employer Portal Scanner:</strong> HTML5-QRCode library reads live camera feeds.</li>
            <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> <strong>PDF Generator:</strong> jsPDF generates landscape certificates directly from DOM.</li>
          </ul>
        </div>
        
        {/* Core UI */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-100 p-3 rounded-xl text-indigo-700">
              <Smartphone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Frontend App (PWA)</h3>
              <p className="text-xs font-bold text-indigo-600 bg-indigo-50 inline-block px-2 py-0.5 rounded-md mt-1">WORKING LIVE</p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-indigo-500 shrink-0 mt-0.5" /> <strong>React Router + Tailwind:</strong> Full responsive application shell.</li>
            <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-indigo-500 shrink-0 mt-0.5" /> <strong>RBAC System:</strong> 5 distinct user roles simulated successfully via `useAuthStore`.</li>
            <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-indigo-500 shrink-0 mt-0.5" /> <strong>LMS Video Integration:</strong> Working module view with progress hooks.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}




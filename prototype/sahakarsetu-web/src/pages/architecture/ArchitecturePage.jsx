import React from 'react';
import { Layers, Database, Server, Smartphone, Cpu, Shield, Globe } from 'lucide-react';

export default function ArchitecturePage() {
  return (
    <div className="max-w-6xl mx-auto mt-6 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1e3a5f]">System Architecture</h1>
        <p className="text-gray-500 mt-2">High-level overview of the SahakarSetu technology stack and data flow.</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
          <Layers className="text-[#c17f24]" /> Conceptual Architecture
        </h2>
        
        <div className="relative p-8 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          {/* Connecting lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
            <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
            <line x1="80%" y1="30%" x2="50%" y2="50%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
            <line x1="50%" y1="50%" x2="50%" y2="80%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
          </svg>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Frontend */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#1e3a5f] text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#1e3a5f]">
                <Globe size={32} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Web Application</h3>
              <p className="text-sm text-gray-600 mb-4">React.js, Tailwind CSS, Zustand</p>
              <ul className="text-xs text-left text-gray-500 space-y-1 bg-gray-50 p-3 rounded">
                <li>• Responsive UI</li>
                <li>• Interactive Dashboards</li>
                <li>• PWA Capabilities</li>
              </ul>
            </div>

            {/* API Gateway / Backend */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#2d7a3f] text-center mt-12 md:mt-24">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#2d7a3f]">
                <Server size={32} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Cloud Backend</h3>
              <p className="text-sm text-gray-600 mb-4">Node.js, Express, Microservices</p>
              <ul className="text-xs text-left text-gray-500 space-y-1 bg-gray-50 p-3 rounded">
                <li>• REST/GraphQL APIs</li>
                <li>• Authentication (JWT/Aadhaar)</li>
                <li>• Business Logic</li>
              </ul>
            </div>

            {/* Edge Box */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#c17f24] text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#c17f24]">
                <Cpu size={32} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Edge Box (Local)</h3>
              <p className="text-sm text-gray-600 mb-4">Raspberry Pi / Local Server</p>
              <ul className="text-xs text-left text-gray-500 space-y-1 bg-gray-50 p-3 rounded">
                <li>• Offline Content Cache</li>
                <li>• Local Sync Queue</li>
                <li>• Intranet Streaming</li>
              </ul>
            </div>
          </div>

          <div className="relative z-10 mt-12 pt-8 border-t border-gray-200">
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md border-t-4 border-gray-700 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-700">
                <Database size={32} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Data Layer</h3>
              <p className="text-sm text-gray-600 mb-2">PostgreSQL & Redis</p>
              <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">Government compliant secure storage, encrypted at rest.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Shield className="text-[#1e3a5f]" size={20} /> Security & Compliance
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#c17f24] mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-600"><strong>Data Localization:</strong> All data resides within authorized government servers in India.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#c17f24] mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-600"><strong>Role-Based Access:</strong> Granular permissions for admins, trainers, and trainees.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#c17f24] mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-600"><strong>Audit Trails:</strong> Immutable logging of critical actions for transparency.</p>
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
           <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Smartphone className="text-[#1e3a5f]" size={20} /> Accessibility First
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#c17f24] mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-600"><strong>Multilingual:</strong> UI architecture supports seamless i18n for 12+ regional languages.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#c17f24] mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-600"><strong>Low Bandwidth Optimization:</strong> Lazy loading and adaptive media resolution.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#c17f24] mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-600"><strong>Device Agnostic:</strong> Fluid grid system ensures usability on mobile, tablet, and desktop.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}



import React, { useState } from 'react';
import { User, QrCode, Award, Calendar, BookOpen, Download } from 'lucide-react';

export default function TraineeDetailPage() {
  const [activeTab, setActiveTab] = useState('attendance');

  // Synthetic demo data
  const trainee = {
    id: 'SAH-2026-004512',
    name: 'Ramesh Kumar',
    cooperative: 'Anand Milk Union Limited',
    role: 'Secretary',
    joinedDate: '2025-11-15',
    status: 'Active',
    attendance: [
      { date: '2026-10-01', module: 'Cooperative Governance', status: 'Present' },
      { date: '2026-09-28', module: 'Digital Accounting', status: 'Present' },
      { date: '2026-09-25', module: 'Financial Literacy', status: 'Absent' },
    ],
    certificates: [
      { id: 'CERT-991', name: 'Basics of Cooperative Management', date: '2026-05-10' },
      { id: 'CERT-1042', name: 'Digital Record Keeping', date: '2026-08-22' }
    ]
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex gap-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
              <User size={40} className="text-[#1e3a5f]" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[#1e3a5f]">{trainee.name}</h1>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-[#2d7a3f] rounded-full">
                  {trainee.status}
                </span>
              </div>
              <p className="text-gray-500 mt-1">{trainee.cooperative} • {trainee.role}</p>
              <div className="mt-4 flex gap-4">
                <div className="bg-gray-50 px-3 py-1.5 rounded border border-gray-200">
                  <span className="text-xs text-gray-500 block">Sahakar ID</span>
                  <span className="font-semibold text-[#1e3a5f]">{trainee.id}</span>
                </div>
                <div className="bg-gray-50 px-3 py-1.5 rounded border border-gray-200">
                  <span className="text-xs text-gray-500 block">Joined</span>
                  <span className="font-semibold text-[#1e3a5f]">{trainee.joinedDate}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <QrCode size={64} className="mx-auto text-gray-800" />
            <p className="text-xs mt-2 font-medium text-gray-600">Scan to Verify</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4 text-right">Demo Environment — Synthetic Data</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'attendance' ? 'text-[#1e3a5f] border-b-2 border-[#1e3a5f] bg-blue-50/30' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Calendar size={18} /> Attendance Records
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'certificates' ? 'text-[#1e3a5f] border-b-2 border-[#1e3a5f] bg-blue-50/30' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Award size={18} /> Certificates
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'attendance' && (
            <div>
              <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-[#c17f24]" /> Recent Training Sessions
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {trainee.attendance.map((record, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.module}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainee.certificates.map(cert => (
                <div key={cert.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-[#1e3a5f] transition-colors bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#1e3a5f] p-3 rounded-full text-white">
                      <Award size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                      <p className="text-sm text-gray-500">Issued: {cert.date} • ID: {cert.id}</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-[#1e3a5f] transition-colors">
                    <Download size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



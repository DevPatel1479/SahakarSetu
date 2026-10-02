import React, { useState } from 'react';
import { 
  Calendar, 
  UserCheck, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  ScanFace, 
  QrCode, 
  Search, 
  Download, 
  Layers,
  Clock,
  HardDrive
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuthStore } from '../../store';

export default function AttendancePage() {
  const { user } = useAuthStore();
  const isTrainee = user?.role === 'trainee';
  const traineeName = user?.name || 'Arjun Kumar Verma';
  const traineeSahakarId = user?.sahakarId || 'SAH-2026-000001';

  const [activeTab, setActiveTab] = useState(isTrainee ? 'records' : 'capture');
  const [captureMethod, setCaptureMethod] = useState('face'); // 'face' or 'qr'
  const [scanning, setScanning] = useState(false);
  const [scannedTrainee, setScannedTrainee] = useState(null);
  const [reportSearch, setReportSearch] = useState('');

  const initialRecords = [
    { id: 'ATT-2026-001', trainee: 'Arjun Kumar Verma', sahakarId: 'SAH-2026-000001', session: 'PACS Computerization & Ledger Entry', time: '09:34 AM', date: '2026-10-02', method: 'ArcFace Biometric', confidence: '99.4%', status: 'Present', source: 'Edge Box (Offline)' },
    { id: 'ATT-2026-002', trainee: 'Priya Sharma', sahakarId: 'SAH-2026-001848', session: 'PACS Computerization & Ledger Entry', time: '09:36 AM', date: '2026-10-02', method: 'Dynamic QR Code', confidence: '100%', status: 'Present', source: 'Cloud Server' },
    { id: 'ATT-2026-003', trainee: 'Amit Kumar', sahakarId: 'SAH-2026-001849', session: 'Cooperative Governance & Law', time: '11:05 AM', date: '2026-10-02', method: 'ArcFace Biometric', confidence: '98.8%', status: 'Present', source: 'Edge Box (Offline)' },
    { id: 'ATT-2026-004', trainee: 'Sneha Patel', sahakarId: 'SAH-2026-001850', session: 'Cooperative Governance & Law', time: '11:08 AM', date: '2026-10-02', method: 'ArcFace Biometric', confidence: '99.1%', status: 'Present', source: 'Edge Box (Offline)' },
    { id: 'ATT-2026-005', trainee: 'Vikram Singh', sahakarId: 'SAH-2026-001851', session: 'Dairy Cold Chain Logistics', time: '02:15 PM', date: '2026-10-02', method: 'Dynamic QR Code', confidence: '100%', status: 'Present', source: 'Cloud Server' }
  ];

  const [attendanceRecords, setAttendanceRecords] = useState(
    isTrainee ? initialRecords.filter(r => r.sahakarId === traineeSahakarId) : initialRecords
  );

  const simulateArcFaceScan = () => {
    setScanning(true);
    setScannedTrainee(null);
    setTimeout(() => {
      setScanning(false);
      const newRecord = {
        id: `ATT-2026-00${attendanceRecords.length + 1}`,
        trainee: 'Arjun Kumar Verma',
        sahakarId: 'SAH-2026-000001',
        session: 'PACS Computerization & Ledger Entry',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split('T')[0],
        method: captureMethod === 'face' ? 'ArcFace Biometric' : 'Dynamic QR Code',
        confidence: captureMethod === 'face' ? '99.4%' : '100%',
        status: 'Present',
        source: 'Edge Box (Offline Queued)'
      };
      setScannedTrainee({
        name: 'Arjun Kumar Verma',
        id: 'SAH-2026-000001',
        confidence: 99.4,
        matchTime: '118ms',
        method: captureMethod === 'face' ? 'ArcFace Biometric' : 'Dynamic QR Scan'
      });
      setAttendanceRecords(prev => [newRecord, ...prev]);
    }, 1800);
  };

  const filteredRecords = attendanceRecords.filter(r => 
    r.trainee.toLowerCase().includes(reportSearch.toLowerCase()) ||
    r.sahakarId.toLowerCase().includes(reportSearch.toLowerCase()) ||
    r.session.toLowerCase().includes(reportSearch.toLowerCase()) ||
    r.method.toLowerCase().includes(reportSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 mt-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c17f24] uppercase tracking-wider mb-1">
            <Layers size={14} /> Biometric Authentication & Session Attendance
          </div>
          <h1 className="text-3xl font-extrabold text-[#1e3a5f] flex items-center gap-3">
            <UserCheck className="text-[#c17f24]" /> Attendance Capture & Reporting
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            ArcFace Facial Recognition & Rotating Dynamic QR Code (DPDP Act & Edge Box Compatible)
          </p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
            <CheckCircle2 size={14} /> ArcFace 512-D Ready
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-800 rounded-xl text-xs font-bold border border-purple-200">
            <HardDrive size={14} /> Edge Offline Sync
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {!isTrainee && (
          <button 
            onClick={() => setActiveTab('capture')}
            className={`pb-4 px-2 font-bold text-sm transition-colors border-b-2 ${
              activeTab === 'capture' ? 'border-[#1e3a5f] text-[#1e3a5f]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Attendance Capture (ArcFace & QR)
          </button>
        )}
        <button 
          onClick={() => setActiveTab('reports')}
          className={`pb-4 px-2 font-bold text-sm transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'reports' ? 'border-[#1e3a5f] text-[#1e3a5f]' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>Attendance Reports & Audit Log</span>
          <span className="bg-blue-100 text-[#1e3a5f] text-xs px-2 py-0.5 rounded-full font-bold">
            {attendanceRecords.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Capture Attendance */}
      {activeTab === 'capture' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
            {/* Capture Method Switcher */}
            <div className="flex justify-center mb-6 bg-gray-100 p-1 rounded-xl max-w-xs mx-auto">
              <button
                onClick={() => setCaptureMethod('face')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  captureMethod === 'face' ? 'bg-white text-[#1e3a5f] shadow-sm' : 'text-gray-500'
                }`}
              >
                <ScanFace size={15} /> ArcFace Camera
              </button>
              <button
                onClick={() => setCaptureMethod('qr')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  captureMethod === 'qr' ? 'bg-white text-[#1e3a5f] shadow-sm' : 'text-gray-500'
                }`}
              >
                <QrCode size={15} /> Rotating QR
              </button>
            </div>

            {captureMethod === 'face' ? (
              <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative border-4 border-gray-800 flex items-center justify-center mb-6">
                {scanning ? (
                  <div className="absolute inset-0 bg-blue-900/30 flex flex-col items-center justify-center">
                    <div className="w-36 h-36 border-2 border-dashed border-blue-400 rounded-2xl relative overflow-hidden flex items-center justify-center">
                      <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,1)] animate-[scan_1.5s_ease-in-out_infinite_alternate]"></div>
                      <ScanFace size={64} className="text-blue-300 opacity-60" />
                    </div>
                    <p className="text-blue-400 font-bold text-xs mt-3 tracking-wider uppercase animate-pulse">
                      ArcFace Embedding: 512-D Liveness Verified...
                    </p>
                  </div>
                ) : (
                  <div className="text-gray-500 flex flex-col items-center gap-3">
                    <ScanFace size={48} className="opacity-40" />
                    <p className="text-xs font-medium">Camera Feed Standby (Raspberry Pi Edge Node)</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-4 mb-6">
                <div className="bg-white p-3 rounded-xl shadow-md border border-gray-200 mb-2">
                  <QRCodeSVG 
                    value={`https://sahakarsetu.gov.in/attend?session=SESS-2026-101&ts=${Date.now()}`}
                    size={110}
                    level="H"
                  />
                </div>
                <p className="text-xs font-bold text-[#1e3a5f]">Dynamic Session QR Code</p>
                <p className="text-[11px] text-gray-500">Trainees scan via Sahakar Mobile App</p>
              </div>
            )}

            <button 
              onClick={simulateArcFaceScan}
              disabled={scanning}
              className="w-full py-3 bg-[#1e3a5f] text-white font-bold rounded-xl hover:bg-[#152a45] transition-colors disabled:opacity-50 shadow-sm text-sm flex items-center justify-center gap-2"
            >
              {scanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Matching Biometric Vector...</span>
                </>
              ) : (
                <>
                  {captureMethod === 'face' ? <ScanFace size={18} /> : <QrCode size={18} />}
                  <span>Simulate {captureMethod === 'face' ? 'ArcFace Recognition' : 'QR Attendance Check'}</span>
                </>
              )}
            </button>
          </div>

          {/* Right Pane: Scan Result & Compliance */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-xs flex justify-between items-center">
                <span>Real-Time Scan Result</span>
                <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded font-bold">Edge Verified</span>
              </h3>
              
              {scannedTrainee ? (
                <div className="bg-green-50 border border-green-200 p-6 rounded-xl animate-in fade-in slide-in-from-bottom-3">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-white shadow-md">
                      <CheckCircle2 size={28} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-green-900">{scannedTrainee.name}</h4>
                      <p className="text-green-700 font-mono text-xs">{scannedTrainee.id}</p>
                      <p className="text-[11px] text-green-600 mt-0.5 font-medium">Session: PACS Computerization</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-green-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Confidence Score</p>
                      <p className="font-black text-green-700 text-base">{scannedTrainee.confidence}%</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-green-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Inference Latency</p>
                      <p className="font-black text-gray-700 text-base">{scannedTrainee.matchTime}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-green-200 text-xs text-green-800 font-semibold flex items-center gap-1.5">
                    <ShieldCheck size={16} /> Verified via {scannedTrainee.method}. Local event logged to sync queue.
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <User size={40} className="mx-auto mb-2 opacity-20" />
                  <p className="text-xs font-medium">Waiting for biometric or QR trigger...</p>
                </div>
              )}
            </div>

            <div className="bg-[#b45309]/10 border border-[#b45309]/20 p-5 rounded-2xl">
              <h4 className="font-bold text-[#b45309] flex items-center gap-2 mb-1.5 text-sm">
                <ShieldCheck size={18} /> DPDP Act & Privacy Architecture Notice
              </h4>
              <p className="text-xs text-[#b45309]/80 leading-relaxed">
                Raw face images are never transmitted over the internet or stored centrally. The ArcFace model extracts irreversible 512-dimensional feature vectors processed locally on the Sahakar Edge Box. Offline attendance events are cryptographically hashed and synchronized when connectivity is restored.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Attendance Reports & Audit Log */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">National Attendance Audit Log</h2>
              <p className="text-xs text-gray-500">Live attendance verification across VAMNICOM, RICM, and ICM training halls</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Search trainee, ID, or session..."
                value={reportSearch}
                onChange={(e) => setReportSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#1e3a5f]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Log ID / Date</th>
                  <th className="px-6 py-3.5">Trainee</th>
                  <th className="px-6 py-3.5">Session Module</th>
                  <th className="px-6 py-3.5">Verification Method</th>
                  <th className="px-6 py-3.5">Data Origin</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3.5">
                      <p className="font-mono text-xs font-bold text-gray-500">{rec.id}</p>
                      <p className="text-xs text-gray-400">{rec.date} • {rec.time}</p>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="font-bold text-gray-900">{rec.trainee}</p>
                      <p className="text-xs font-mono text-blue-700">{rec.sahakarId}</p>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-gray-700 font-medium">
                      {rec.session}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                        rec.method.includes('ArcFace') ? 'bg-blue-50 text-blue-800' : 'bg-purple-50 text-purple-800'
                      }`}>
                        {rec.method.includes('ArcFace') ? <ScanFace size={12} /> : <QrCode size={12} />}
                        {rec.method} ({rec.confidence})
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                        <HardDrive size={12} className="text-gray-400" /> {rec.source}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                        <CheckCircle2 size={12} /> {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(140px); }
        }
      `}} />
    </div>
  );
}




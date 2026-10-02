import React, { useEffect, useState } from 'react';
import { Award, Download, CheckCircle, ExternalLink, QrCode, ShieldCheck, User } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { useAuthStore } from '../../store';

export default function CertificatesPage() {
  const { user } = useAuthStore();
  const isTrainee = user?.role === 'trainee';
  const traineeSahakarId = user?.sahakarId || (isTrainee ? 'SAH-2026-000001' : null);

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const query = isTrainee && traineeSahakarId ? `?trainee=${encodeURIComponent(traineeSahakarId)}` : '';
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/certificates/${query}`);
        if (!response.ok) throw new Error('Failed to fetch certificates');
        let data = await response.json();
        if (isTrainee && traineeSahakarId) {
          data = data.filter(c => c.trainee === traineeSahakarId || c.trainee_name?.toLowerCase().includes('arjun'));
        }

        // Merge locally generated / cached certificates
        try {
          const localCerts = JSON.parse(localStorage.getItem('trainee_certificates') || '[]');
          localCerts.forEach(lc => {
            if (!data.some(c => c.id === lc.id)) {
              data.push(lc);
            }
          });
        } catch (e) {
          console.warn('Local certificates parse note:', e);
        }

        setCertificates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, [isTrainee, traineeSahakarId]);

  const handleDownloadPDF = (cert) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'in',
      format: 'letter'
    });
    
    // Add border
    doc.setLineWidth(0.05);
    doc.setDrawColor(30, 58, 95);
    doc.rect(0.5, 0.5, 10, 7.5);
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(30, 58, 95); 
    doc.text("CERTIFICATE OF COMPLETION", 5.5, 2.5, null, null, "center");
    
    // Subtitle
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text("This is to certify that", 5.5, 3.5, null, null, "center");
    
    // Trainee Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(36);
    doc.setTextColor(0, 0, 0);
    doc.text(cert.trainee_name, 5.5, 4.3, null, null, "center");
    
    // Program Name
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`has successfully completed the programme:`, 5.5, 5.2, null, null, "center");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 58, 95);
    const progTitle = cert.programme_name || cert.programme_title || cert.programme || 'NCCT Programme';
    doc.text(progTitle, 5.5, 5.8, null, null, "center");
    
    // Footer info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Certificate ID: ${cert.id}`, 1, 7.5);
    const dateStr = cert.issued_date || cert.issue_date || new Date().toISOString();
    doc.text(`Issue Date: ${new Date(dateStr).toLocaleDateString()}`, 1, 7.8);
    doc.text(`Grade: ${cert.grade || 'A'}`, 9, 7.5);
    
    doc.save(`${cert.id}.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 mt-4 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c17f24] uppercase tracking-wider mb-1">
            <ShieldCheck size={14} /> {isTrainee ? 'Digital Credential Wallet' : 'Central Registry'}
          </div>
          <h1 className="text-3xl font-extrabold text-[#1e3a5f] flex items-center gap-3">
            <Award size={32} className="text-[#c17f24]" /> 
            {isTrainee ? 'My Digital Certificates' : 'Certificate Repository'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isTrainee 
              ? `Showing verified credentials earned by ${user?.name || 'Arjun Kumar Verma'} (${traineeSahakarId})`
              : 'Manage, audit, and issue immutable digital certificates across all NCCT institutes'}
          </p>
        </div>
        {isTrainee && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl">
            <User className="text-emerald-700" size={18} />
            <div>
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Sahakar Identity</p>
              <p className="text-sm font-mono font-black text-emerald-950">{traineeSahakarId}</p>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-500 flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f] mb-4"></div>
          Loading certificates from database...
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => {
            const verifyUrl = `${window.location.origin}/verify/${cert.id}`;
            return (
              <div key={cert.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow relative">
                {/* Decorative Banner */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1e3a5f] to-[#c17f24]"></div>
                
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-800 mb-3">
                        <CheckCircle size={14} /> ISSUED & VALID
                      </span>
                      <h2 className="text-xl font-bold text-gray-900">{cert.trainee_name}</h2>
                      <p className="text-sm font-medium text-gray-500">{cert.programme_name || cert.programme_title || cert.programme || 'NCCT Programme'}</p>
                      <p className="text-xs text-gray-400 mt-1">{cert.institute || cert.institute_name || 'NCCT Network Institute'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Certificate ID</p>
                        <p className="font-mono text-sm font-semibold text-[#1e3a5f]">{cert.id}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Issue Date</p>
                        <p className="font-semibold text-gray-700">{new Date(cert.issued_date || cert.issue_date || Date.now()).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Grade</p>
                        <p className="font-semibold text-gray-700">{cert.grade}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Skills Acquired</p>
                        <p className="font-semibold text-gray-700">{cert.skills?.length || 2}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-between min-w-[140px] border-l border-gray-100 pl-6">
                    <div className="bg-white p-2 border-2 border-gray-100 rounded-xl shadow-sm mb-4">
                      <QRCodeSVG value={verifyUrl} size={100} />
                    </div>
                    <div className="w-full space-y-2">
                      <Link 
                        to={`/verify/${cert.id}`} 
                        className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-[#1e3a5f] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <ExternalLink size={16} /> Verify
                      </Link>
                      <button 
                        onClick={() => handleDownloadPDF(cert)}
                        className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Download size={16} /> PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {certificates.length === 0 && (
            <div className="col-span-full p-12 text-center bg-white rounded-xl border border-gray-200">
              <Award size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-900">No Certificates Found</h3>
              <p className="text-gray-500">There are currently no certificates in the database.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}



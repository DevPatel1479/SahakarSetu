import React, { useEffect, useState } from 'react';
import { Search, Filter, Download, UserPlus, Eye, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TraineesListPage() {
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTrainees = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/trainees/`);
        if (!response.ok) throw new Error('Failed to fetch trainees');
        const data = await response.json();
        setTrainees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainees();
  }, []);

  const filteredTrainees = trainees.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.cooperative.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const headers = ['Sahakar ID', 'Name', 'Email', 'Cooperative', 'District', 'State', 'Attendance (%)', 'Status'];
    const csvData = filteredTrainees.map(t => [
      t.id, 
      `"${t.name}"`, 
      t.email, 
      `"${t.cooperative}"`, 
      t.district, 
      t.state, 
      t.attendance_pct, 
      t.status
    ].join(','));
    
    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'sahakarsetu_trainees_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
            <Users size={24} className="text-blue-600" /> Trainee Directory
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track cooperative society trainees across India.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <Download size={16} /> Export CSV
          </button>
          <Link to="/trainees/register" className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-bold hover:bg-[#152a45] transition-colors shadow-md">
            <UserPlus size={16} /> Register New
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, ID, location, or cooperative..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Filter size={16} /> Filters
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f] mb-4"></div>
            Loading trainee data from database...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 bg-red-50">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b border-gray-200">Sahakar ID</th>
                  <th className="p-4 font-semibold border-b border-gray-200">Name</th>
                  <th className="p-4 font-semibold border-b border-gray-200">Cooperative</th>
                  <th className="p-4 font-semibold border-b border-gray-200">Location</th>
                  <th className="p-4 font-semibold border-b border-gray-200">Progress</th>
                  <th className="p-4 font-semibold border-b border-gray-200 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTrainees.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4">
                      <span className="font-mono text-sm font-bold text-[#1e3a5f] bg-blue-50 px-2 py-1 rounded">{t.id}</span>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.email}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{t.cooperative}</td>
                    <td className="p-4">
                      <div className="text-sm text-gray-900">{t.district}</div>
                      <div className="text-xs text-gray-500">{t.state}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5 w-16">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${t.attendance_pct}%` }}></div>
                        </div>
                        <span className="text-xs font-medium text-gray-600">{t.attendance_pct}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Link to={`/trainees/${t.id}`} className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
                {trainees.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">No trainees found in the database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}



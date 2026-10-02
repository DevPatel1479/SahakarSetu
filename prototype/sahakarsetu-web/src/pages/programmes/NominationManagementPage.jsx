import React, { useState, useEffect } from 'react';
import { Check, X, Eye, FileText, Search, Loader } from 'lucide-react';

export default function NominationManagementPage() {
  const [nominations, setNominations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/nominations/`)
      .then(res => res.json())
      .then(data => {
        setNominations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/nominations/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setNominations(nominations.map(n => n.id === id ? { ...n, status } : n));
      }
    } catch (err) {
      console.error("Failed to update status");
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader className="animate-spin text-[#1e3a5f]" /></div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">Nomination Management</h1>
          <p className="text-gray-500">Review and approve candidate nominations for training programmes</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search nominations..." 
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
            <tr>
              <th className="p-4">Nominee</th>
              <th className="p-4">Programme</th>
              <th className="p-4">Nominator / Org</th>
              <th className="p-4">Submitted On</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {nominations.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">No nominations found.</td>
              </tr>
            ) : (
              nominations.map((nom) => (
                <tr key={nom.id} className="hover:bg-gray-50/50">
                  <td className="p-4">
                    <p className="font-medium text-gray-900">{nom.nominee_name}</p>
                    <p className="text-xs text-gray-500">{nom.nominee_email} • {nom.nominee_phone}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-[#1e3a5f] font-medium">{nom.programme_title || 'Programme ID: ' + nom.programme}</span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-gray-700">{nom.nominator_organization}</p>
                    <p className="text-xs text-gray-500">By: {nom.nominator_name}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(nom.submitted_on).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      nom.status === 'approved' ? 'bg-green-100 text-green-700' :
                      nom.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {nom.status.charAt(0).toUpperCase() + nom.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    {nom.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(nom.id, 'approved')}
                          className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-md transition-colors" title="Approve"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(nom.id, 'rejected')}
                          className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors" title="Reject"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                    <button className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors" title="View Details">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



import React, { useEffect, useState } from 'react';
import { Building2, MapPin, Users, BookOpen, Plus, Search } from 'lucide-react';

export default function InstitutesListPage() {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newInst, setNewInst] = useState({ id: `INST-${Math.floor(Math.random()*1000)}`, name: '', type: 'VAMNICOM', state: '' });

  const fetchInstitutes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/institutes/`);
      const data = await res.json();
      setInstitutes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const handleAddInstitute = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/institutes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInst)
      });
      setShowModal(false);
      setNewInst({ id: `INST-${Math.floor(Math.random()*1000)}`, name: '', type: 'VAMNICOM', state: '' });
      await fetchInstitutes();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = institutes.filter(inst => 
    inst.name.toLowerCase().includes(search.toLowerCase()) || 
    inst.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 mt-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e3a5f] flex items-center gap-3">
            <Building2 className="text-[#c17f24]" /> Training Institutes
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Manage VAMNICOM, RICMs, and ICMs across India</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#1e3a5f] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#152a45] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} /> Add Institute
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by institute name or state..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-100 rounded-lg focus:border-[#1e3a5f] focus:ring-0 transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-400 font-medium">Loading institutes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(inst => (
            <div key={inst.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
              <div className="h-2 bg-gradient-to-r from-[#1e3a5f] to-[#c17f24]"></div>
              <div className="p-6 space-y-4 flex-1">
                <div className="flex justify-between items-start">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${inst.type === 'VAMNICOM' ? 'bg-purple-100 text-purple-700' : inst.type === 'RICM' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {inst.type}
                  </span>
                  <span className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">{inst.id}</span>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-[#1e3a5f] transition-colors">{inst.name}</h2>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500 mt-2">
                    <MapPin size={16} className="text-[#c17f24]" /> {inst.state}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase mb-1">
                      <Users size={14} /> Trainees
                    </div>
                    <p className="text-lg font-black text-[#1e3a5f]">{inst.trainee_count || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase mb-1">
                      <BookOpen size={14} /> Active Courses
                    </div>
                    <p className="text-lg font-black text-[#1e3a5f]">{inst.active_programmes ? inst.active_programmes.length : 0}</p>
                  </div>
                </div>
              </div>
              {inst.active_programmes && inst.active_programmes.length > 0 && (
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-600 font-medium">
                  <strong>Courses: </strong> 
                  {inst.active_programmes.slice(0, 2).join(', ')}
                  {inst.active_programmes.length > 2 && ` +${inst.active_programmes.length - 2} more`}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">Add New Institute</h2>
            <form onSubmit={handleAddInstitute} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Institute ID</label>
                <input required type="text" value={newInst.id} onChange={e => setNewInst({...newInst, id: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] outline-none bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Institute Name</label>
                <input required type="text" value={newInst.name} onChange={e => setNewInst({...newInst, name: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] outline-none" placeholder="e.g. ICM Bhopal" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                <select value={newInst.type} onChange={e => setNewInst({...newInst, type: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none">
                  <option value="VAMNICOM">VAMNICOM</option>
                  <option value="RICM">RICM</option>
                  <option value="ICM">ICM</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">State</label>
                <input required type="text" value={newInst.state} onChange={e => setNewInst({...newInst, state: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] outline-none" placeholder="e.g. Madhya Pradesh" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} disabled={isSaving} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex-1 py-2.5 bg-[#1e3a5f] text-white font-bold rounded-xl hover:bg-[#152a45] disabled:opacity-50 flex justify-center items-center gap-2">
                  {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



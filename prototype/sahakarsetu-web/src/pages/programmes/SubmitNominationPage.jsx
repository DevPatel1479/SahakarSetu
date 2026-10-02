import React, { useState, useEffect } from 'react';
import { Send, Building2, User, Phone, Mail, CheckCircle, ChevronRight, AlertCircle, Plus, Trash2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SubmitNominationPage() {
  const navigate = useNavigate();
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [nominatorData, setNominatorData] = useState({
    programme: '',
    nominator_organization: '',
    nominator_name: '',
    nominator_designation: ''
  });

  const [nominees, setNominees] = useState([
    { nominee_name: '', nominee_email: '', nominee_phone: '' }
  ]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/programmes/`)
      .then(res => res.json())
      .then(data => setProgrammes(data))
      .catch(err => console.error(err));
  }, []);

  const handleNominatorChange = (e) => setNominatorData({ ...nominatorData, [e.target.name]: e.target.value });

  const handleNomineeChange = (index, field, value) => {
    const newNominees = [...nominees];
    newNominees[index][field] = value;
    setNominees(newNominees);
  };

  const addNominee = () => setNominees([...nominees, { nominee_name: '', nominee_email: '', nominee_phone: '' }]);
  const removeNominee = (index) => setNominees(nominees.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const promises = nominees.map(nominee => 
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/nominations/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...nominatorData, ...nominee })
        })
      );
      const results = await Promise.all(promises);
      if (results.some(res => !res.ok)) throw new Error('Failed to submit one or more nominations.');
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm text-center border border-green-100">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-[#1e3a5f] mb-2">Nominations Submitted!</h2>
          <p className="text-gray-500 mb-8 font-medium">Successfully nominated {nominees.length} candidate(s). The respective Institute Admin will review the applications shortly.</p>
          <button onClick={() => navigate('/')} className="bg-[#1e3a5f] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-[#152a45] transition-all">Return to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-[#1e3a5f] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Users size={120} /></div>
          <h1 className="text-3xl font-extrabold mb-2 relative z-10">Bulk Nomination Portal</h1>
          <p className="text-blue-200 font-medium relative z-10 max-w-xl">Cooperative societies, PACS, and FPOs can use this portal to officially nominate their staff or members for specialized capacity-building programmes.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 border border-red-100 font-bold"><AlertCircle size={18} /> {error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-extrabold text-[#1e3a5f] mb-2 uppercase tracking-wider">Target Programme *</label>
              <select name="programme" required onChange={handleNominatorChange} className="w-full p-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 font-medium focus:ring-0 focus:border-[#c17f24] transition-colors">
                <option value="">-- Select Active Training Programme --</option>
                {programmes.map(p => (
                  <option key={p.id} value={p.id}>{p.title} ({p.institute_name}) - {p.mode}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-black text-[#1e3a5f] mb-4 flex items-center gap-2"><Building2 className="text-[#c17f24]" /> Nominating Organization Details</h3>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Organization / Society Name *</label>
              <input type="text" name="nominator_organization" required onChange={handleNominatorChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c17f24]/20 focus:border-[#c17f24] transition-all" placeholder="e.g., Pune District Central Coop Bank" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Authorized Nominator Name *</label>
              <input type="text" name="nominator_name" required onChange={handleNominatorChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c17f24]/20 focus:border-[#c17f24] transition-all" placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nominator Designation *</label>
              <input type="text" name="nominator_designation" required onChange={handleNominatorChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#c17f24]/20 focus:border-[#c17f24] transition-all" placeholder="e.g., Secretary, Chairman" />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-[#1e3a5f] flex items-center gap-2"><Users className="text-[#c17f24]" /> Candidate Nominees</h3>
              <button type="button" onClick={addNominee} className="flex items-center gap-1.5 text-sm font-bold text-[#c17f24] bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-lg transition-colors border border-orange-200">
                <Plus size={16} /> Add Candidate
              </button>
            </div>
            
            <div className="space-y-4">
              {nominees.map((nominee, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
                  <div className="absolute -left-3 -top-3 w-6 h-6 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</div>
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Candidate Name *</label>
                    <input type="text" required value={nominee.nominee_name} onChange={(e) => handleNomineeChange(index, 'nominee_name', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" placeholder="Full Name" />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Email Address *</label>
                    <input type="email" required value={nominee.nominee_email} onChange={(e) => handleNomineeChange(index, 'nominee_email', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" placeholder="Email" />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Phone Number *</label>
                    <input type="tel" required value={nominee.nominee_phone} onChange={(e) => handleNomineeChange(index, 'nominee_phone', e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm" placeholder="Mobile No." />
                  </div>
                  {nominees.length > 1 && (
                    <button type="button" onClick={() => removeNominee(index)} className="md:mt-5 p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove Nominee">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8">
            <button type="submit" disabled={loading} className="w-full bg-[#1e3a5f] hover:bg-[#152a45] text-white py-4 rounded-xl font-black text-lg flex justify-center items-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? 'Processing Nominations...' : <><Send size={20} /> Submit {nominees.length} Nomination(s)</>}
            </button>
            <p className="text-center text-xs text-gray-400 font-medium mt-4">By submitting, you confirm that these individuals are authorized members of your cooperative organization.</p>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Package, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  AlertCircle,
  ShieldCheck,
  Calendar,
  Layers
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function LogisticsPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newDisp, setNewDisp] = useState({
    item: 'Raspberry Pi 5 Edge Boxes (Batch of 25)',
    destination: 'VAMNICOM Pune, Maharashtra',
    eta_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    carrier: 'India Post Speed Post (Govt Logistics)',
    tracking_no: `INP-2026-${Math.floor(100000 + Math.random() * 900000)}`
  });

  const instituteCoords = {
    'VAMNICOM Pune, Maharashtra': { lat: 18.5314, lng: 73.8446 },
    'RICM Chandigarh, Punjab': { lat: 30.7333, lng: 76.7794 },
    'ICM Bhopal, Madhya Pradesh': { lat: 23.2599, lng: 77.4126 },
    'ICM Gandhinagar, Gujarat': { lat: 23.2156, lng: 72.6369 },
    'ICM Patna, Bihar': { lat: 25.5941, lng: 85.1376 },
    'RICM Bengaluru, Karnataka': { lat: 12.9716, lng: 77.5946 },
    'RICM Guwahati, Assam': { lat: 26.1445, lng: 91.7362 }
  };

  const fetchData = async () => {
    try {
      const [dispRes, instRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/logistics/`),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/institutes/`)
      ]);
      const dispData = await dispRes.json();
      const instData = await instRes.json();
      setDeliveries(dispData);
      setInstitutes(instData);
    } catch (err) {
      console.error('Error fetching logistics data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDispatch = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const coords = instituteCoords[newDisp.destination] || { lat: 20.5937, lng: 78.9629 };
      const formattedEta = new Date(newDisp.eta_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/logistics/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `LOG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          item: newDisp.item,
          destination: newDisp.destination,
          eta: formattedEta,
          lat: coords.lat,
          lng: coords.lng,
          status: 'In Transit'
        })
      });

      setShowModal(false);
      setNewDisp({
        item: 'Raspberry Pi 5 Edge Boxes (Batch of 25)',
        destination: 'VAMNICOM Pune, Maharashtra',
        eta_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        carrier: 'India Post Speed Post (Govt Logistics)',
        tracking_no: `INP-2026-${Math.floor(100000 + Math.random() * 900000)}`
      });
      await fetchData();
    } catch (err) {
      console.error('Error dispatching item:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const defaultDeliveries = [
    { id: 'LOG-2026-101', item: 'Edge Box Units (x50 Raspberry Pi 5)', destination: 'ICM Bhopal, Madhya Pradesh', status: 'In Transit', eta: 'Oct 04, 2026', lat: 23.2599, lng: 77.4126 },
    { id: 'LOG-2026-102', item: 'PACS Digitization Training Manuals (x200)', destination: 'RICM Chandigarh, Punjab', status: 'Delivered', eta: 'Oct 01, 2026', lat: 30.7333, lng: 76.7794 },
    { id: 'LOG-2026-103', item: 'Biometric Attendance Scanners (x15)', destination: 'ICM Gandhinagar, Gujarat', status: 'In Transit', eta: 'Oct 05, 2026', lat: 23.2156, lng: 72.6369 },
    { id: 'LOG-2026-104', item: 'Offline LMS Tablet Consignment (x30)', destination: 'RICM Guwahati, Assam', status: 'Processing', eta: 'Oct 08, 2026', lat: 26.1445, lng: 91.7362 }
  ];

  const activeList = deliveries.length > 0 ? deliveries : defaultDeliveries;

  const filtered = activeList.filter(d => {
    const matchSearch = (d.item || '').toLowerCase().includes(search.toLowerCase()) ||
                        (d.destination || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 mt-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c17f24] uppercase tracking-wider mb-1">
            <Layers size={14} /> ERP Supply Chain & Hardware Logistics
          </div>
          <h1 className="text-3xl font-extrabold text-[#1e3a5f] flex items-center gap-3">
            <Truck className="text-[#c17f24]" /> Logistics & Material Distribution
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Monitor nationwide transit of Sahakar Edge Boxes, learning hardware, and printed study packages
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#1e3a5f] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#152a45] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} /> Schedule New Dispatch
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase">Active Dispatches</p>
          <p className="text-2xl font-black text-[#1e3a5f] mt-1">{activeList.length}</p>
          <p className="text-xs text-blue-600 mt-1">Across 14 NCCT Centers</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase">In Transit</p>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {activeList.filter(d => d.status === 'In Transit').length}
          </p>
          <p className="text-xs text-amber-700 mt-1">Live GPS tracking active</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase">Delivered Successfully</p>
          <p className="text-2xl font-black text-green-600 mt-1">
            {activeList.filter(d => d.status === 'Delivered').length}
          </p>
          <p className="text-xs text-green-700 mt-1">Confirmed by Institute Admins</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase">Hardware Ready</p>
          <p className="text-2xl font-black text-purple-600 mt-1">100%</p>
          <p className="text-xs text-purple-700 mt-1">Raspberry Pi 5 Certified</p>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Real-time Shipment List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Map (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MapPin className="text-[#1e3a5f]" size={18} />
              <h2 className="text-base font-bold text-gray-900">National Distribution Network Map</h2>
            </div>
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
              Live GIS
            </span>
          </div>

          <div className="h-96 w-full relative z-0">
            <MapContainer 
              center={[22.5937, 78.9629]} 
              zoom={4} 
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {activeList.map(del => (
                <Marker key={del.id} position={[del.lat || 20.59, del.lng || 78.96]}>
                  <Popup>
                    <div className="p-1 space-y-1">
                      <p className="font-bold text-sm text-[#1e3a5f]">{del.item}</p>
                      <p className="text-xs text-gray-600"><strong>To:</strong> {del.destination}</p>
                      <p className="text-xs text-gray-600"><strong>Status:</strong> {del.status}</p>
                      <p className="text-xs text-gray-600"><strong>ETA:</strong> {del.eta}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="p-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-100 flex items-center justify-between">
            <span>Click any marker to inspect transit consignments</span>
            <span className="font-bold text-green-700">All India Hubs Connected</span>
          </div>
        </div>

        {/* Shipment Tracker List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="text-[#c17f24]" size={18} />
              <h2 className="text-base font-bold text-gray-900">Consignment Status</h2>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs border border-gray-300 rounded-lg p-1 outline-none font-medium"
            >
              <option value="ALL">All Status</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Processing">Processing</option>
            </select>
          </div>

          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Filter by item or institute..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#1e3a5f]"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-100 overflow-y-auto max-h-96 custom-scrollbar flex-1">
            {filtered.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-mono font-bold text-gray-400">{item.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    item.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                    item.status === 'In Transit' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-900">{item.item}</h4>
                <div className="mt-2 space-y-1 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <ArrowRight size={12} className="text-gray-400 shrink-0" />
                    <span className="truncate">{item.destination}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-gray-400 shrink-0" />
                    <span>ETA: {item.eta}</span>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-8 text-center text-xs text-gray-400">
                No matching consignments found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Dispatch Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
              <Truck className="text-[#c17f24]" size={24} /> Schedule Hardware Dispatch
            </h2>
            <form onSubmit={handleDispatch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  1. Material / Hardware Description
                </label>
                <input
                  required
                  type="text"
                  value={newDisp.item}
                  onChange={(e) => setNewDisp({ ...newDisp, item: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] outline-none text-sm"
                  placeholder="e.g. 25 Raspberry Pi 5 Edge Boxes"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  2. Destination Institute
                </label>
                <select
                  value={newDisp.destination}
                  onChange={(e) => setNewDisp({ ...newDisp, destination: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl outline-none text-sm bg-white"
                >
                  <option value="VAMNICOM Pune, Maharashtra">VAMNICOM Pune, Maharashtra</option>
                  <option value="RICM Chandigarh, Punjab">RICM Chandigarh, Punjab</option>
                  <option value="ICM Bhopal, Madhya Pradesh">ICM Bhopal, Madhya Pradesh</option>
                  <option value="ICM Gandhinagar, Gujarat">ICM Gandhinagar, Gujarat</option>
                  <option value="ICM Patna, Bihar">ICM Patna, Bihar</option>
                  <option value="RICM Bengaluru, Karnataka">RICM Bengaluru, Karnataka</option>
                  <option value="RICM Guwahati, Assam">RICM Guwahati, Assam</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  3. Expected Delivery Date (ETA)
                </label>
                <input
                  required
                  type="date"
                  value={newDisp.eta_date}
                  onChange={(e) => setNewDisp({ ...newDisp, eta_date: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  4. Logistics Partner / Carrier
                </label>
                <input
                  required
                  type="text"
                  value={newDisp.carrier}
                  onChange={(e) => setNewDisp({ ...newDisp, carrier: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  5. Consignment / AWB Tracking No.
                </label>
                <input
                  required
                  type="text"
                  value={newDisp.tracking_no}
                  onChange={(e) => setNewDisp({ ...newDisp, tracking_no: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a5f] outline-none text-sm font-mono"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-[#1e3a5f] text-white font-bold rounded-xl hover:bg-[#152a45] transition-colors text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Confirm Dispatch'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



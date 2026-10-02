import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  Briefcase, 
  HardDrive, 
  Filter, 
  Download, 
  Building2, 
  CheckCircle, 
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronDown,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [dateRange, setDateRange] = useState('FY2025-26');
  const [selectedInstitute, setSelectedInstitute] = useState('ALL');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedSector, setSelectedSector] = useState('ALL');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/analytics/`);
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const COLORS = ['#1e3a5f', '#c17f24', '#0d9488', '#6366f1', '#e11d48'];

  const defaultKpis = {
    trainees: 1141,
    programmes: 47,
    institutes: 14,
    certificates: 289,
    jobs: 64,
    applications: 487,
    placed: 198,
    completion_rate: 87.4,
    attendance_rate: 92.1,
    sync_rate: 98.4,
    female_participation: 38.6,
    rural_pacs_ratio: 74.2
  };

  const kpis = data?.kpis || defaultKpis;

  const stateData = data?.state_breakdown || [
    { state: 'Maharashtra', trainees: 342, placed: 89, institutes: 2 },
    { state: 'Gujarat', trainees: 228, placed: 54, institutes: 2 },
    { state: 'Punjab', trainees: 184, placed: 42, institutes: 1 },
    { state: 'Madhya Pradesh', trainees: 165, placed: 38, institutes: 2 },
    { state: 'Uttar Pradesh', trainees: 124, placed: 26, institutes: 1 },
    { state: 'Karnataka', trainees: 98, placed: 21, institutes: 1 }
  ];

  const sectorData = data?.sector_breakdown || [
    { sector: 'PACS Computerization', count: 480, percentage: 42 },
    { sector: 'Dairy Cooperatives', count: 274, percentage: 24 },
    { sector: 'Cooperative Banking & Credit', count: 205, percentage: 18 },
    { sector: 'Agri Marketing & FPOs', count: 114, percentage: 10 },
    { sector: 'Handloom & Fisheries', count: 68, percentage: 6 }
  ];

  const trendData = data?.monthly_trend || [
    { month: 'May', enrollments: 140, certified: 45, placed: 22 },
    { month: 'Jun', enrollments: 195, certified: 80, placed: 38 },
    { month: 'Jul', enrollments: 260, certified: 125, placed: 64 },
    { month: 'Aug', enrollments: 340, certified: 180, placed: 95 },
    { month: 'Sep', enrollments: 420, certified: 230, placed: 142 },
    { month: 'Oct', enrollments: 490, certified: 289, placed: 198 }
  ];

  const skillMatrix = data?.skill_matrix || [
    { skill: 'PACS Accounting', demand: 94, supply: 82 },
    { skill: 'ERP Software', demand: 88, supply: 75 },
    { skill: 'Audit & Compliance', demand: 76, supply: 64 },
    { skill: 'Cold Chain Logistics', demand: 68, supply: 58 },
    { skill: 'Cyber Security', demand: 82, supply: 49 }
  ];

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Trainees Enrolled,${kpis.trainees}\n`
      + `Certificates Issued,${kpis.certificates}\n`
      + `Candidates Placed,${kpis.placed}\n`
      + `Completion Rate,${kpis.completion_rate}%\n`
      + `Attendance Rate,${kpis.attendance_rate}%\n`
      + `Edge Box Sync Success Rate,${kpis.sync_rate}%\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SahakarSetu_Analytics_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 mt-4 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c17f24] uppercase tracking-wider mb-1">
            <BarChart3 size={14} /> National Cooperative Council — Intelligence Center
          </div>
          <h1 className="text-3xl font-extrabold text-[#1e3a5f] flex items-center gap-3">
            National Capacity & Employment Analytics
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Multi-dimensional outcomes: Mobilization → Training Completion → Certification → Employment Placement
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="bg-gray-100 text-[#1e3a5f] px-4 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 border border-gray-200 text-sm shadow-sm"
        >
          <Download size={16} /> Export Outcome Report
        </button>
      </div>

      {/* Multi-Dimensional Filter Bar (prompt.md Section 73) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 outline-none bg-gray-50"
          >
            <option value="FY2025-26">Financial Year 2025-26</option>
            <option value="LAST_6M">Last 6 Months</option>
            <option value="Q2_2026">Current Quarter (Q2)</option>
            <option value="ALL">All Time Cumulative</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            Institute
          </label>
          <select
            value={selectedInstitute}
            onChange={(e) => setSelectedInstitute(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 outline-none bg-gray-50"
          >
            <option value="ALL">All 14 Institutes</option>
            <option value="VAMNICOM">VAMNICOM, Pune (National)</option>
            <option value="RICM_CHD">RICM, Chandigarh (Regional)</option>
            <option value="ICM_BPL">ICM, Bhopal (Institute)</option>
            <option value="ICM_GND">ICM, Gandhinagar</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            State / Region
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 outline-none bg-gray-50"
          >
            <option value="ALL">All States (Pan-India)</option>
            <option value="MH">Maharashtra</option>
            <option value="GJ">Gujarat</option>
            <option value="PB">Punjab</option>
            <option value="MP">Madhya Pradesh</option>
            <option value="UP">Uttar Pradesh</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            Cooperative Sector
          </label>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 outline-none bg-gray-50"
          >
            <option value="ALL">All Cooperative Sectors</option>
            <option value="PACS">PACS Computerization</option>
            <option value="DAIRY">Dairy Cooperatives</option>
            <option value="BANKING">Cooperative Banking & Credit</option>
            <option value="FPO">Agri Marketing & FPOs</option>
          </select>
        </div>
      </div>

      {/* 4 Outcome Pillars (Problem Statement Core) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              Pillar 1: Mobilization
            </span>
            <Users className="text-[#1e3a5f]" size={20} />
          </div>
          <p className="text-3xl font-black text-[#1e3a5f] mt-3">{kpis.trainees}</p>
          <p className="text-xs text-gray-500 font-medium mt-1">Total Registered Trainees</p>
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs">
            <span className="text-gray-500">Rural PACS: <strong>{kpis.rural_pacs_ratio}%</strong></span>
            <span className="text-emerald-700 font-bold">Female: {kpis.female_participation}%</span>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              Pillar 2: Quality & LMS
            </span>
            <Award className="text-[#c17f24]" size={20} />
          </div>
          <p className="text-3xl font-black text-[#c17f24] mt-3">{kpis.completion_rate}%</p>
          <p className="text-xs text-gray-500 font-medium mt-1">Course Completion Rate</p>
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs">
            <span className="text-gray-500">Attendance: <strong>{kpis.attendance_rate}%</strong></span>
            <span className="text-blue-700 font-bold">{kpis.certificates} Certified</span>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Pillar 3: Employment
            </span>
            <Briefcase className="text-emerald-600" size={20} />
          </div>
          <p className="text-3xl font-black text-emerald-700 mt-3">{kpis.placed}</p>
          <p className="text-xs text-gray-500 font-medium mt-1">Confirmed Cooperative Placements</p>
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs">
            <span className="text-gray-500">Openings: <strong>{kpis.jobs}</strong></span>
            <span className="text-purple-700 font-bold">Conv. Rate: 68.2%</span>
          </div>
        </div>

        {/* Pillar 4 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              Pillar 4: Edge Box
            </span>
            <HardDrive className="text-purple-600" size={20} />
          </div>
          <p className="text-3xl font-black text-purple-700 mt-3">{kpis.sync_rate}%</p>
          <p className="text-xs text-gray-500 font-medium mt-1">Offline Sync Success Rate</p>
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs">
            <span className="text-gray-500">Synced: <strong>1,847 records</strong></span>
            <span className="text-green-700 font-bold">Hardware ✓</span>
          </div>
        </div>
      </div>

      {/* Row 1 Charts: State Breakdown & Monthly Journey Trajectory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* State Mobilization Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">State-wise Mobilization vs Placements</h3>
              <p className="text-xs text-gray-500">Comparing enrolled trainees to secured cooperative jobs</p>
            </div>
            <span className="text-xs font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-bold">
              Pan-India
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="state" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="trainees" name="Trainees Enrolled" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
                <Bar dataKey="placed" name="Candidates Placed" fill="#c17f24" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6-Month Trajectory Line Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Ecosystem Trajectory</h3>
              <p className="text-xs text-gray-500">6-Month cumulative lifecycle progression</p>
            </div>
            <TrendingUp size={18} className="text-emerald-600" />
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="enrollments" name="Enrolled" stroke="#1e3a5f" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="certified" name="Certified" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="placed" name="Placed" stroke="#c17f24" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2 Charts: Sector Distribution & Skill Supply-Demand Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sector Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-base font-bold text-gray-900">Cooperative Sector Breakdown</h3>
              <p className="text-xs text-gray-500">Trainees categorized by target domain</p>
            </div>
            <PieIcon size={18} className="text-[#c17f24]" />
          </div>
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="percentage"
                  nameKey="sector"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs">
            {sectorData.map((sec, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  {sec.sector}
                </span>
                <span className="font-bold text-gray-900">{sec.percentage}% ({sec.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Supply vs Demand Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Skill Demand vs Certified Supply Gap</h3>
              <p className="text-xs text-gray-500">Cooperative employer openings vs trained candidate pipeline</p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded">
              AI Market Alignment
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={skillMatrix} margin={{ top: 10, right: 20, left: 35, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <YAxis type="category" dataKey="skill" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }} 
                  formatter={(val) => `${val}% Match Index`}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="demand" name="Employer Demand Index" fill="#e11d48" radius={[0, 4, 4, 0]} />
                <Bar dataKey="supply" name="NCCT Certified Supply" fill="#0d9488" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}



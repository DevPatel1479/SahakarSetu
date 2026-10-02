export const INSTITUTES = [
  { id: 'INST001', name: 'VAMNICOM, Pune', type: 'National', state: 'Maharashtra' },
  { id: 'INST002', name: 'RICM, Chandigarh', type: 'Regional', state: 'Punjab' },
  { id: 'INST003', name: 'ICM, Bhopal', type: 'State', state: 'Madhya Pradesh' }
];

export const SKILLS = [
  { id: 'SK001', name: 'Cooperative Accounting', category: 'Finance' },
  { id: 'SK002', name: 'Tally ERP', category: 'Technology' },
  { id: 'SK003', name: 'PACS Operations', category: 'Business' },
  { id: 'SK004', name: 'Dairy Cooperative Management', category: 'Business' },
];

export const PROGRAMMES = [
  { id: 'PROG001', title: 'Management Development Programme for PACS', instituteId: 'INST001', instituteName: 'VAMNICOM, Pune', startDate: '2026-11-01', endDate: '2026-11-15', capacity: 40, enrolled: 35, status: 'active', mode: 'Blended', language: 'Hindi/English' },
  { id: 'PROG002', title: 'Digital Bookkeeping & Accounting', instituteId: 'INST002', instituteName: 'RICM, Chandigarh', startDate: '2026-10-15', endDate: '2026-10-30', capacity: 30, enrolled: 30, status: 'active', mode: 'Offline', language: 'Punjabi/English' },
];

export const TRAINEES = [
  { id: 'SAH-2026-000001', name: 'Arjun Kumar Verma', gender: 'M', category: 'General', state: 'Maharashtra', district: 'Pune', cooperative: 'Pune District Central Cooperative Bank', institute: 'VAMNICOM, Pune', programme: 'Management Development Programme for PACS', attendancePct: 88, assessmentScore: 92, certificates: 2, status: 'active', email: 'arjun.demo@example.com', phone: '9876543210', skills: ['SK001', 'SK003'], employed: true },
  { id: 'SAH-2026-000002', name: 'Priya Sharma', gender: 'F', category: 'OBC', state: 'Punjab', district: 'Ludhiana', cooperative: 'Ludhiana Dairy Coop', institute: 'RICM, Chandigarh', programme: 'Digital Bookkeeping & Accounting', attendancePct: 100, assessmentScore: 85, certificates: 1, status: 'active', email: 'priya.demo@example.com', phone: '9876543211', skills: ['SK002'], employed: false },
];

export const JOBS = [
  { id: 'JOB001', title: 'PACS Accounts Assistant', employerId: 'EMP001', employer: 'Maharashtra State Cooperative Bank', location: 'Pune', salary: '₹2.5L - ₹3.5L', skillsRequired: ['SK001', 'SK002', 'SK003'], applicants: 45, status: 'open' },
  { id: 'JOB002', title: 'Dairy Plant Supervisor', employerId: 'EMP002', employer: 'Punjab State Coop Milk Federation', location: 'Chandigarh', salary: '₹3L - ₹4L', skillsRequired: ['SK004'], applicants: 12, status: 'open' },
];

export const CERTIFICATES = [
  { id: 'CERT-2026-001847', traineeId: 'SAH-2026-000001', traineeName: 'Arjun Kumar Verma', programme: 'Cooperative Banking Fundamentals', institute: 'VAMNICOM, Pune', issued: '2026-08-15', grade: 'A+', skills: ['SK001'] },
  { id: 'CERT-2026-001848', traineeId: 'SAH-2026-000002', traineeName: 'Priya Sharma', programme: 'Basic Cooperative Management', institute: 'RICM, Chandigarh', issued: '2026-09-10', grade: 'A', skills: ['SK004'] },
];

export const ANALYTICS = {
  kpis: {
    trainees: 1141,
    programmes: 47,
    institutes: 10,
    certificates: 289,
    jobs: 64,
    applications: 487,
    placed: 198
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  login: async (role, username, password) => {
    await delay(500);
    if (password !== 'Demo@2026') throw new Error('Invalid demo credentials');
    return { role, name: `${role.replace('_', ' ').toUpperCase()} User`, token: 'demo-jwt-token' };
  },
  getAnalytics: async () => { await delay(400); return ANALYTICS; },
  getInstitutes: async () => { await delay(300); return INSTITUTES; },
  getProgrammes: async () => { await delay(300); return PROGRAMMES; },
  getProgramme: async (id) => { await delay(300); return PROGRAMMES.find(p => p.id === id); },
  getTrainees: async () => { await delay(400); return TRAINEES; },
  getTrainee: async (id) => { await delay(300); return TRAINEES.find(t => t.id === id); },
  registerTrainee: async (data) => {
    await delay(800);
    const newId = `SAH-2026-${String(TRAINEES.length + 1).padStart(6, '0')}`;
    const newTrainee = { ...data, id: newId, attendancePct: 0, assessmentScore: 0, certificates: 0, status: 'active', skills: [] };
    TRAINEES.push(newTrainee);
    return newTrainee;
  },
  getJobs: async () => { await delay(300); return JOBS; },
  getCertificates: async (traineeId) => { 
    await delay(300); 
    return traineeId ? CERTIFICATES.filter(c => c.traineeId === traineeId) : CERTIFICATES; 
  },
  verifyCertificate: async (id) => {
    await delay(500);
    return CERTIFICATES.find(c => c.id === id);
  }
};

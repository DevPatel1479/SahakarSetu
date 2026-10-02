import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore, useThemeStore } from './store';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';

import NCCTDashboard from './pages/dashboard/NCCTDashboard';
import InstituteAdminDashboard from './pages/dashboard/InstituteAdminDashboard';
import TraineeDashboard from './pages/dashboard/TraineeDashboard';
import TrainerDashboard from './pages/dashboard/TrainerDashboard';
import EmployerDashboard from './pages/dashboard/EmployerDashboard';
import TraineesListPage from './pages/trainees/TraineesListPage';
import TrainersListPage from './pages/trainers/TrainersListPage';
import RegisterTraineePage from './pages/trainees/RegisterTraineePage';
import PublicRegistrationPage from './pages/trainees/PublicRegistrationPage';
import TraineeDetailPage from './pages/trainees/TraineeDetailPage';
import CertificatesPage from './pages/certificates/CertificatesPage';
import VerifyCertificatePage from './pages/certificates/VerifyCertificatePage';
import JobMatchingPage from './pages/employment/JobMatchingPage';
import AdminEmploymentPage from './pages/employment/AdminEmploymentPage';
import InstitutesListPage from './pages/institutes/InstitutesListPage';
import ProgrammesListPage from './pages/programmes/ProgrammesListPage';
import NominationManagementPage from './pages/programmes/NominationManagementPage';
import AttendancePage from './pages/attendance/AttendancePage';
import HostelManagementPage from './pages/erp/HostelManagementPage';
import LogisticsPage from './pages/erp/LogisticsPage';
import EdgeBoxPage from './pages/edge/EdgeBoxPage';
import LMSPage from './pages/lms/LMSPage';
import CareerAssistantPage from './pages/career/CareerAssistantPage';
import ArchitecturePage from './pages/architecture/ArchitecturePage';
import EvidencePage from './pages/evidence/EvidencePage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import TimetablePage from './pages/erp/TimetablePage';
import SahakarIdPage from './pages/trainees/SahakarIdPage';
import SkillPassportPage from './pages/skills/SkillPassportPage';

import SubmitNominationPage from './pages/programmes/SubmitNominationPage';

function DashboardRouter() {
  const { user } = useAuthStore();
  const role = user?.role;
  if (role === 'ncct_admin') return <NCCTDashboard />;
  if (role === 'institute_admin') return <InstituteAdminDashboard />;
  if (role === 'trainer') return <TrainerDashboard />;
  if (role === 'trainee') return <TraineeDashboard />;
  if (role === 'employer') return <EmployerDashboard />;
  return <NCCTDashboard />;
}

function EmploymentRouter() {
  const { user } = useAuthStore();
  if (user?.role === 'trainee') return <JobMatchingPage />;
  if (user?.role === 'employer') return <Navigate to="/dashboard" replace />;
  return <AdminEmploymentPage />;
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { initTheme } = useThemeStore();

  React.useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<PublicRegistrationPage />} />
        <Route path="/nominate" element={<SubmitNominationPage />} />
        <Route path="/verify/:id" element={<VerifyCertificatePage />} />
        <Route path="/verify" element={<VerifyCertificatePage />} />
        
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardRouter />} />
          
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="institutes" element={<InstitutesListPage />} />
          <Route path="programmes" element={<ProgrammesListPage />} />
          <Route path="nominations" element={<NominationManagementPage />} />
          <Route path="trainers" element={<TrainersListPage />} />
          <Route path="timetable" element={<TimetablePage />} />
          <Route path="attendance" element={<AttendancePage />} />
          
          <Route path="trainees" element={<TraineesListPage />} />
          <Route path="trainees/register" element={<RegisterTraineePage />} />
          <Route path="trainees/:id" element={<TraineeDetailPage />} />
          <Route path="sahakar-id" element={<SahakarIdPage />} />
          <Route path="skill-passport" element={<SkillPassportPage />} />
          
          <Route path="certificates" element={<CertificatesPage />} />
          <Route path="employment" element={<EmploymentRouter />} />
          
          <Route path="edge-box" element={<EdgeBoxPage />} />
          <Route path="hostel" element={<HostelManagementPage />} />
          <Route path="logistics" element={<LogisticsPage />} />
          <Route path="learning" element={<LMSPage />} />
          <Route path="career" element={<CareerAssistantPage />} />
          <Route path="architecture" element={<ArchitecturePage />} />
          <Route path="evidence" element={<EvidencePage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}



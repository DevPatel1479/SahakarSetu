import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { 
  LayoutDashboard, 
  Building2, 
  BookOpen, 
  CalendarDays,
  Users, 
  ClipboardCheck,
  GraduationCap, 
  Award,
  Briefcase,
  Home,
  Truck,
  HardDrive,
  BarChart3,
  ShieldCheck,
  Network,
  CreditCard,
  Sparkles,
  UserCheck,
  X
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuthStore();
  const role = user?.role || 'ncct_admin';

  const menuConfig = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ncct_admin', 'institute_admin', 'trainer', 'trainee', 'employer'] },
    { name: 'My Sahakar ID', path: '/sahakar-id', icon: CreditCard, roles: ['trainee', 'ncct_admin'] },
    { name: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['ncct_admin', 'institute_admin'] },
    { name: 'Institutes', path: '/institutes', icon: Building2, roles: ['ncct_admin'] },
    { name: 'Programmes', path: '/programmes', icon: BookOpen, roles: ['ncct_admin', 'institute_admin', 'trainee'] },
    { name: 'Nominations', path: '/nominations', icon: BookOpen, roles: ['ncct_admin', 'institute_admin'] },
    { name: 'Faculty & Trainers', path: '/trainers', icon: UserCheck, roles: ['ncct_admin', 'institute_admin'] },
    { name: 'Timetable', path: '/timetable', icon: CalendarDays, roles: ['ncct_admin', 'institute_admin', 'trainer', 'trainee'] },
    { name: 'Trainees', path: '/trainees', icon: Users, roles: ['ncct_admin', 'institute_admin', 'trainer'] },
    { name: 'Register Trainee', path: '/trainees/register', icon: Users, roles: ['ncct_admin', 'institute_admin'] },
    { name: 'Attendance', path: '/attendance', icon: ClipboardCheck, roles: ['ncct_admin', 'institute_admin', 'trainer', 'trainee'] },
    { name: 'Learning (LMS)', path: '/learning', icon: GraduationCap, roles: ['ncct_admin', 'institute_admin', 'trainer', 'trainee'] },
    { name: 'Skill Passport', path: '/skill-passport', icon: Sparkles, roles: ['trainee', 'ncct_admin'] },
    { name: 'Certificates', path: '/certificates', icon: Award, roles: ['ncct_admin', 'institute_admin', 'trainee'] },
    { name: 'Employment', path: '/employment', icon: Briefcase, roles: ['ncct_admin', 'trainee'] },
    { name: 'Career Assistant', path: '/career', icon: Briefcase, roles: ['trainee'] },
    { name: 'Hostel', path: '/hostel', icon: Home, roles: ['ncct_admin', 'institute_admin'] },
    { name: 'Logistics', path: '/logistics', icon: Truck, roles: ['ncct_admin', 'institute_admin'] },
    { name: 'Edge Box', path: '/edge-box', icon: HardDrive, roles: ['ncct_admin', 'institute_admin'] },
    { name: 'Evidence Center', path: '/evidence', icon: ShieldCheck, roles: ['ncct_admin'] },
    { name: 'Architecture', path: '/architecture', icon: Network, roles: ['ncct_admin'] },
  ];

  const filteredMenu = menuConfig.filter(item => item.roles.includes(role));

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`
          fixed top-0 left-0 h-full z-30 w-64 flex-shrink-0 bg-[#1e3a5f] text-white flex flex-col shadow-xl
          transform transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-16 flex items-center justify-between px-6 bg-[#152a45]">
          <h1 className="text-xl font-extrabold tracking-wider text-white">SahakarSetu</h1>
          {/* Close button visible only on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 bg-[#152a45]/50 border-b border-[#1e3a5f]">
          <p className="text-[10px] text-green-400 uppercase tracking-wider font-bold mb-1">
            Demo Environment
          </p>
          <p className="text-sm font-medium text-blue-100">{user?.name || 'Admin User'}</p>
          <p className="text-xs text-blue-300 capitalize">{role.replace('_', ' ')}</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-800 text-white shadow-sm'
                      : 'text-blue-100 hover:bg-blue-800/50 hover:text-white'
                  }`
                }
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0 opacity-80" aria-hidden="true" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-blue-800/50 bg-[#152a45]/30">
          <div className="text-xs text-blue-300/60 font-medium">
            SahakarSetu<br/>
            National Portal
          </div>
        </div>
      </div>
    </>
  );
}

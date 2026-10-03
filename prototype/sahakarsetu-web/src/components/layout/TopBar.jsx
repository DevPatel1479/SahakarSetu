import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import { useEdgeStore } from '../../store';
import { Moon, Sun, Bell, LogOut, User, WifiOff, Globe, Menu } from 'lucide-react';

const TopBar = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const { isOffline } = useEdgeStore();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6 shadow-sm transition-colors duration-200 z-10 flex-shrink-0">
      {/* Left: Hamburger (mobile only) */}
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors mr-2"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        {/* Brand name visible on mobile when sidebar is hidden */}
        <span className="lg:hidden text-base font-extrabold text-[#1e3a5f] dark:text-white tracking-wide">
          SahakarSetu
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {isOffline && (
          <div className="flex items-center text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-amber-200 dark:border-amber-800">
            <WifiOff className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Offline Mode</span>
          </div>
        )}

        {/* Bhashini Language Simulation */}
        <button 
          onClick={() => {
            const langs = ['Hindi', 'Marathi', 'Gujarati', 'Tamil'];
            const randomLang = langs[Math.floor(Math.random() * langs.length)];
            alert(`[SIMULATION: Bhashini API]\nTranslating platform to ${randomLang} using Bhashini AI Language Translation API...`);
          }}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 group"
          title="Translate via Bhashini AI"
        >
          <Globe className="w-5 h-5" />
          <span className="text-xs font-bold hidden md:block group-hover:text-[#1e3a5f] transition-colors">A/अ</span>
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-800" />
        </button>

        <div className="flex items-center space-x-2 ml-2 pl-2 border-l border-gray-200 dark:border-slate-700">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
              {user?.name || 'User'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
              {user?.center || 'Training Center'}
            </span>
          </div>
          
          <div className="h-8 w-8 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white flex-shrink-0">
            <User className="w-5 h-5" />
          </div>

          <button
            onClick={logout}
            className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;

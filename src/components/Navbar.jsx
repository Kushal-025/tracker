import React from 'react';
import { Search, Sun, Moon, Bell } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function Navbar() {
  const { darkMode, setDarkMode, searchQuery, setSearchQuery } = useDashboard();

  return (
    <header className="h-20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 transition-all duration-500">
     {/* Search Bar Container - 100% FIXED OVERLAP */}
<div className="relative w-80 flex items-center bg-slate-100/80 dark:bg-slate-800/80 rounded-xl px-4 py-2.5 border border-transparent focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-300 group">
  
  {/* Icon - Left Aligned inside the container wrapper */}
  <div className="shrink-0 mr-3 flex items-center justify-center pointer-events-none">
    <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300" />
  </div>

  {/* Input Field - Clean, Raw and unpadded layout */}
  <input
    type="text"
    placeholder="Search transactions, tags..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    style={{ background: 'transparent', border: 'none', outline: 'none', padding: 0, width: '100%' }}
    className="text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-0 focus:outline-none"
  />
</div>

      {/* Action Controls */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button with Rotate Animation */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 transition-all duration-300 active:scale-95"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-amber-500 animate-[spin_3s_linear_infinite]" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-600" />
          )}
        </button>

        {/* Notifications */}
        <button className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 relative transition-all duration-300 active:scale-95">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        </button>

        {/* User Badge */}
        <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-indigo-500 to-purple-600 p-0.5 shadow-md shadow-indigo-500/10 hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div className="h-full w-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center font-bold text-slate-800 dark:text-white text-xs">
            KB
          </div>
        </div>
      </div>
    </header>
  );
}
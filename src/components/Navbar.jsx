import React from 'react';
import { Search, Sun, Moon, Bell, Menu } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function Navbar({ onMenuToggle }) {
  const { darkMode, setDarkMode, searchQuery, setSearchQuery } = useDashboard();

  return (
    <header className="h-auto py-3 md:py-0 md:h-20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex flex-row items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 transition-all duration-500 relative z-20">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          type="button"
          onClick={onMenuToggle}
          className="md:hidden p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 transition-all duration-300 flex-shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative flex-1 max-w-xs sm:max-w-md min-w-0 flex items-center bg-slate-100/80 dark:bg-slate-800/80 rounded-xl px-3 sm:px-4 py-2 border border-transparent focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-300 group overflow-hidden">
          <div className="shrink-0 mr-2 sm:mr-3 flex items-center justify-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', padding: 0, width: '100%' }}
            className="text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-0 focus:outline-none min-w-0"
          />
        </div>
      </div>
      {/* Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 justify-end">
        {/* Theme Toggle Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 sm:p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 transition-all duration-300 active:scale-95"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 sm:w-5 h-5 text-amber-500 animate-[spin_3s_linear_infinite]" />
          ) : (
            <Moon className="w-4 h-4 sm:w-5 h-5 text-indigo-600" />
          )}
        </button>

        {/* Notifications */}
        <button className="hidden sm:flex p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 relative transition-all duration-300 active:scale-95">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        </button>

        {/* User Badge */}
        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-linear-to-tr from-indigo-500 to-purple-600 p-0.5 shadow-md shadow-indigo-500/10 hover:scale-105 transition-transform duration-300 cursor-pointer flex items-center justify-center">
          <div className="h-full w-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center font-bold text-slate-800 dark:text-white text-xs">
            KB
          </div>
        </div>
      </div>
    </header>
  );
}
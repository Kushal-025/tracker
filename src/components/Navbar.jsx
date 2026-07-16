import React, { useState, useRef, useEffect } from 'react';
import { Search, Sun, Moon, Bell, Menu, LogOut, User, ChevronDown } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onMenuToggle }) {
  const { darkMode, setDarkMode, searchQuery, setSearchQuery } = useDashboard();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const initials  = user?.initials || 'RK';
  const userName  = user?.name    || 'User';
  const userEmail = user?.email   || '';

  return (
    <header className="sticky top-0 z-20 h-auto py-3 md:py-0 md:h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-emerald-100 dark:border-purple-900/40 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-3 sm:px-6 lg:px-8 transition-all duration-500">

      <div className="flex items-center gap-3 w-full sm:w-auto sm:flex-1 min-w-0">
        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="md:hidden p-2.5 rounded-xl bg-emerald-50 dark:bg-purple-900/30 hover:bg-emerald-100 dark:hover:bg-purple-900/50 text-emerald-700 dark:text-purple-300 transition-all duration-300 flex-shrink-0 border border-emerald-200/60 dark:border-purple-700/40"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search bar */}
        <div className="relative flex-1 max-w-xs sm:max-w-md min-w-0 flex items-center
          bg-emerald-50/80 dark:bg-purple-950/30
          rounded-xl px-3 sm:px-4 py-2
          border border-emerald-200/60 dark:border-purple-800/40
          focus-within:bg-white dark:focus-within:bg-slate-900
          focus-within:border-emerald-400 dark:focus-within:border-purple-500
          focus-within:ring-4 focus-within:ring-emerald-400/15 dark:focus-within:ring-purple-500/20
          transition-all duration-300 group overflow-hidden"
        >
          <div className="shrink-0 mr-2 sm:mr-3 flex items-center justify-center pointer-events-none">
            <Search className="w-4 h-4 text-emerald-400 dark:text-purple-400 group-focus-within:text-emerald-600 dark:group-focus-within:text-purple-300 transition-colors duration-300" />
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', padding: 0, width: '100%' }}
            className="text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-0 focus:outline-none min-w-0"
          />
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 justify-end w-full sm:w-auto">

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 sm:p-2.5 rounded-xl border transition-all duration-300 active:scale-95
            ${darkMode
              ? 'bg-purple-900/30 hover:bg-purple-900/50 border-purple-700/40 text-purple-300 hover:text-purple-100'
              : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200/60 text-emerald-600 hover:text-emerald-800'
            }`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-[spin_4s_linear_infinite]" />
          ) : (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
          )}
        </button>

        {/* Notifications */}
        <button
          className={`hidden sm:flex p-2.5 rounded-xl border relative transition-all duration-300 active:scale-95
            ${darkMode
              ? 'bg-purple-900/30 hover:bg-purple-900/50 border-purple-700/40 text-purple-300'
              : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200/60 text-emerald-600'
            }`}
        >
          <Bell className="w-5 h-5" />
          <span className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full animate-pulse ${darkMode ? 'bg-purple-400' : 'bg-emerald-500'}`} />
        </button>

        {/* User Badge + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(v => !v)}
            className="flex items-center gap-2 group"
            aria-label="User menu"
          >
            {/* Avatar */}
            <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-xl p-0.5 shadow-md transition-all duration-300 hover:scale-105
              ${darkMode
                ? 'bg-gradient-to-tr from-purple-600 to-violet-500 shadow-purple-500/25'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-emerald-500/25'
              }`}
            >
              <div className="h-full w-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center font-bold text-slate-800 dark:text-white text-xs">
                {initials}
              </div>
            </div>
            <ChevronDown className={`hidden sm:block w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-slate-900 border border-emerald-100 dark:border-purple-900/50 rounded-2xl shadow-xl overflow-hidden z-50 animate-fade-in">
              {/* User info header */}
              <div className={`px-4 py-3 border-b
                ${darkMode ? 'bg-purple-950/30 border-purple-900/50' : 'bg-emerald-50/60 border-emerald-100'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-white text-xs flex-shrink-0
                    ${darkMode
                      ? 'bg-gradient-to-tr from-purple-600 to-violet-500'
                      : 'bg-gradient-to-tr from-emerald-500 to-teal-400'
                    }`}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{userName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userEmail}</p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-2">
                <button
                  onClick={() => { navigate('/settings'); setDropdownOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                    ${darkMode
                      ? 'text-slate-300 hover:bg-purple-900/30 hover:text-purple-200'
                      : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                    }`}
                >
                  <User className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-emerald-500'}`} />
                  Profile & Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
import React from 'react';
import { LayoutDashboard, Wallet, CreditCard, BarChart3, Settings, TrendingUp, X, Sun, Moon, Bell } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function Sidebar({ isOpen, onClose }) {
  const { darkMode, setDarkMode } = useDashboard();
  const menus = [
    { name: 'Dashboard', icon: LayoutDashboard, active: true },
    { name: 'Incomes', icon: Wallet },
    { name: 'Expenses', icon: CreditCard },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Settings', icon: Settings },
  ];

  const sidebarContent = (
    <>
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div className="p-2 bg-indigo-600/10 rounded-xl">
          <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <span className="text-xl font-bold tracking-tight bg-linear-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
          Rohit Expenses Tracker
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {menus.map((menu) => {
          const Icon = menu.icon;
          return (
            <button
              key={menu.name}
              onClick={onClose}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ease-out transform hover:translate-x-1 ${
                menu.active
                  ? 'bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/20 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 transition-transform duration-300" />
              {menu.name}
            </button>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col shrink-0 transition-all duration-500 ease-in-out">
        {sidebarContent}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <button onClick={onClose} className="absolute inset-0 bg-slate-900/60 transition-opacity" aria-label="Close sidebar overlay" />
          <aside className="relative w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex flex-col gap-3 px-4 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-end">
                <button onClick={onClose} className="p-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex-1 p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 transition-all duration-300"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                  className="p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 transition-all duration-300 relative"
                  aria-label="View notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                </button>
                <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-indigo-500 to-purple-600 p-0.5 shadow-md shadow-indigo-500/10 flex items-center justify-center">
                  <div className="h-full w-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center font-bold text-slate-800 dark:text-white text-xs">
                    KB
                  </div>
                </div>
              </div>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

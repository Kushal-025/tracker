import React from 'react';
import { LayoutDashboard, Wallet, CreditCard, BarChart3, Settings, TrendingUp } from 'lucide-react';

export default function Sidebar() {
  const menus = [
    { name: 'Dashboard', icon: LayoutDashboard, active: true },
    { name: 'Incomes', icon: Wallet },
    { name: 'Expenses', icon: CreditCard },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col shrink-0 transition-all duration-500 ease-in-out">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div className="p-2 bg-indigo-600/10 rounded-xl">
          <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <span className="text-xl font-bold tracking-tight bg-linear-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
          AuraFinance
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5">
        {menus.map((menu) => {
          const Icon = menu.icon;
          return (
            <button
              key={menu.name}
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
    </aside>
  );
}
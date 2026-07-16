import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';
import { Settings, Moon, Sun, Target, Bell, Shield, LogOut, User, Palette, Save, Check } from 'lucide-react';

export default function SettingsPage() {
  const { darkMode, setDarkMode, budgetGoal, setBudgetGoal } = useDashboard();
  const { user, logout } = useAuth();
  const [budgetInput, setBudgetInput] = useState(budgetGoal.toString());
  const [saved, setSaved] = useState(false);

  const handleSaveBudget = async () => {
    const val = parseFloat(budgetInput);
    if (isNaN(val) || val <= 0) return;
    await setBudgetGoal(val);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  // Themed class helpers
  const accent      = darkMode ? 'purple' : 'emerald';
  const accentTitle = darkMode ? 'text-purple-300' : 'text-emerald-700';
  const accentBadge = darkMode ? 'bg-purple-900/30 border-purple-700/40 text-purple-300' : 'bg-emerald-50 border-emerald-200/60 text-emerald-700';
  const cardClass   = `bg-white dark:bg-slate-900 rounded-2xl border shadow-sm transition-shadow hover:shadow-md ${
    darkMode ? 'border-purple-900/40 hover:shadow-purple-900/20' : 'border-emerald-100 hover:shadow-emerald-100'
  }`;
  const iconBg      = darkMode ? 'bg-purple-900/30' : 'bg-emerald-100/70';
  const iconColor   = darkMode ? 'text-purple-400' : 'text-emerald-600';
  const inputClass  = `w-full pl-8 pr-4 py-3 rounded-xl font-semibold outline-none transition-all text-slate-900 dark:text-white ${
    darkMode
      ? 'bg-purple-950/30 border border-purple-800/40 focus:ring-2 focus:ring-purple-500/50'
      : 'bg-emerald-50/60 border border-emerald-200/60 focus:ring-2 focus:ring-emerald-400/50'
  }`;
  const saveBtnClass = saved
    ? 'bg-emerald-500 text-white'
    : darkMode
      ? 'bg-gradient-to-r from-purple-700 to-violet-600 hover:from-purple-600 hover:to-violet-500 text-white shadow-purple-500/20'
      : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-500/20';

  const sections = [
    {
      icon: Palette,
      title: 'Appearance',
      desc: 'Customize the look and feel of your dashboard',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-800 dark:text-white">Dark Mode</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {darkMode ? 'Purple interactive theme active' : 'Emerald interactive theme active'}
            </p>
          </div>
          {/* Animated toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-400 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              darkMode
                ? 'bg-purple-600 focus:ring-purple-500'
                : 'bg-emerald-500 focus:ring-emerald-400'
            }`}
          >
            <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center ${darkMode ? 'translate-x-7' : 'translate-x-0'}`}>
              {darkMode
                ? <Moon className="w-3.5 h-3.5 text-purple-600" />
                : <Sun className="w-3.5 h-3.5 text-amber-500" />
              }
            </span>
          </button>
        </div>
      ),
    },
    {
      icon: Target,
      title: 'Budget Goal',
      desc: 'Set your monthly spending limit',
      content: (
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-white mb-0.5">Monthly Budget Limit</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Get alerted when expenses exceed this amount</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-bold ${darkMode ? 'text-purple-400' : 'text-emerald-600'}`}>₹</span>
              <input
                type="number"
                value={budgetInput}
                onChange={e => setBudgetInput(e.target.value)}
                className={inputClass}
                min="1"
                step="100"
              />
            </div>
            <button
              onClick={handleSaveBudget}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all duration-300 ${saveBtnClass}`}
            >
              {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save</>}
            </button>
          </div>
          <div className={`p-3 rounded-xl border text-sm ${
            darkMode
              ? 'bg-purple-950/30 border-purple-800/40 text-purple-300'
              : 'bg-emerald-50 border-emerald-200/60 text-emerald-700'
          }`}>
            <span className="font-semibold">Current budget:</span> ₹{budgetGoal.toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      icon: Bell,
      title: 'Notifications',
      desc: 'Manage alerts and email notifications',
      content: (
        <div className="space-y-4">
          {[
            { label: 'Budget Exceeded Alert',  desc: 'Notify when monthly budget is exceeded',   enabled: true  },
            { label: 'Weekly Summary',         desc: 'Receive weekly financial summary report',  enabled: false },
            { label: 'Unusual Spending',       desc: 'Alert on unusual or large transactions',   enabled: true  },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <div>
                <p className="font-semibold text-slate-800 dark:text-white text-sm">{item.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
              <div className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                item.enabled
                  ? (darkMode ? 'bg-purple-600' : 'bg-emerald-500')
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${item.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="page-shell animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 animate-[fadeIn_0.4s_ease-out]">
        <div className={`p-3 rounded-2xl ${iconBg}`}>
          <Settings className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Settings</h1>
          <p className={`text-sm mt-0.5 ${accentTitle}`}>
            {darkMode ? 'Purple theme — dark & interactive' : 'Emerald theme — light & interactive'}
          </p>
        </div>
      </div>

      {/* Profile card */}
      <div className={`rounded-2xl p-4 sm:p-6 text-white shadow-xl animate-[fadeIn_0.4s_ease-out_0.1s_both] ${
        darkMode
          ? 'bg-gradient-to-br from-purple-700 to-violet-600 shadow-purple-500/25'
          : 'bg-gradient-to-br from-emerald-600 to-teal-500 shadow-emerald-500/25'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-2xl shadow-inner shrink-0">
            {user?.initials || 'RK'}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold">{user?.name || 'User'}</h2>
            <p className="text-white/70 text-sm">{user?.email || ''}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <Shield className="w-3.5 h-3.5 text-white/80" />
              <span className="text-xs text-white/80 font-medium">Account Verified</span>
            </div>
          </div>
          <div className="p-2 bg-white/10 rounded-xl self-start">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Settings sections */}
      <div className="space-y-4">
        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className={`p-4 sm:p-6 animate-[fadeIn_0.4s_ease-out] ${cardClass}`}
              style={{ animationDelay: `${0.15 + i * 0.05}s`, animationFillMode: 'both' }}
            >
              <div className={`flex items-center gap-3 mb-5 pb-4 border-b ${darkMode ? 'border-purple-900/40' : 'border-emerald-100'}`}>
                <div className={`p-2 rounded-xl ${iconBg}`}>
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{section.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{section.desc}</p>
                </div>
              </div>
              {section.content}
            </div>
          );
        })}
      </div>

      {/* Logout */}
      <div className="animate-[fadeIn_0.4s_ease-out_0.35s_both]">
        <button
          onClick={logout}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 font-bold transition-all duration-300 group ${
            darkMode
              ? 'border-rose-800/60 text-rose-400 hover:bg-rose-950/30'
              : 'border-rose-200 text-rose-600 hover:bg-rose-50'
          }`}
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Sign Out of Account
        </button>
      </div>
    </div>
  );
}

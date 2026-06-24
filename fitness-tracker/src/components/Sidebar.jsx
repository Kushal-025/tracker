import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Dumbbell, Apple, Droplets,
  Moon, TrendingUp, Target, Trophy, Settings, X
} from 'lucide-react';

const navItems = [
  { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'workouts',     label: 'Workouts',     icon: Dumbbell },
  { id: 'nutrition',    label: 'Nutrition',    icon: Apple },
  { id: 'hydration',    label: 'Hydration',    icon: Droplets },
  { id: 'sleep',        label: 'Sleep',        icon: Moon },
  { id: 'progress',     label: 'Progress',     icon: TrendingUp },
  { id: 'goals',        label: 'Goals',        icon: Target },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
];

export default function Sidebar({ onClose }) {
  const { activeTab, setActiveTab } = useApp();

  const handleNav = (id) => {
    setActiveTab(id);
    onClose?.();
  };

  return (
    <aside className="h-full w-64 glass border-r border-white/5 z-50 flex flex-col lg:fixed lg:left-0 lg:top-0">
      {/* Logo */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30 flex-shrink-0">
            <span className="text-xl">⚡</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">Rohit's Fitness</h1>
            <p className="text-xs text-slate-500">Health Tracker</p>
          </div>
        </div>
        {/* Close button — only visible in mobile drawer */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600/30 to-cyan-500/10 text-white border border-violet-500/30 shadow-lg shadow-violet-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon
                size={18}
                className={`flex-shrink-0 transition-all duration-200 ${
                  isActive ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-300'
                }`}
              />
              <span className="flex-1 text-left">{label}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl glass-hover cursor-pointer transition-all">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            R
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Rohit</p>
            <p className="text-xs text-slate-500 truncate">Premium Member</p>
          </div>
          <Settings size={14} className="text-slate-500 flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}

import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';

import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Nutrition from './pages/Nutrition';
import Hydration from './pages/Hydration';
import Sleep from './pages/Sleep';
import Progress from './pages/Progress';
import Goals from './pages/Goals';
import Achievements from './pages/Achievements';

import {
  LayoutDashboard, Dumbbell, Apple, Droplets,
  Moon, TrendingUp, Target, Trophy, Menu, X
} from 'lucide-react';

const mobileNavItems = [
  { id: 'dashboard',    icon: LayoutDashboard },
  { id: 'workouts',     icon: Dumbbell },
  { id: 'nutrition',    icon: Apple },
  { id: 'hydration',    icon: Droplets },
  { id: 'sleep',        icon: Moon },
  { id: 'progress',     icon: TrendingUp },
  { id: 'goals',        icon: Target },
  { id: 'achievements', icon: Trophy },
];

function AppContent() {
  const { activeTab, setActiveTab } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pages = {
    dashboard: Dashboard,
    workouts: Workouts,
    nutrition: Nutrition,
    hydration: Hydration,
    sleep: Sleep,
    progress: Progress,
    goals: Goals,
    achievements: Achievements,
  };

  const Page = pages[activeTab] || Dashboard;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* ── Mobile overlay sidebar ──────────────────────────── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="relative z-10 w-72 max-w-[85vw]">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Main content ────────────────────────────────────── */}
      <main className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
        {/* Ambient glows */}
        <div className="fixed top-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 left-0 lg:left-64 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 glass sticky top-0 z-40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <span className="text-sm">⚡</span>
            </div>
            <h1 className="text-sm font-bold text-white">Rohit's Fitness</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl glass text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Page />
        </div>
      </main>

      {/* ── Mobile bottom navigation ─────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 glass">
        <div className="flex items-center justify-around px-1 py-2">
          {mobileNavItems.map(({ id, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-violet-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon size={20} />
                {isActive && <div className="w-1 h-1 rounded-full bg-violet-400 animate-pulse" />}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

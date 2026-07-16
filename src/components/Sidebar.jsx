import React from 'react';
import { LayoutDashboard, Wallet, CreditCard, BarChart3, Settings, TrendingUp, X, Sun, Moon, Bell, LogOut } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ isOpen, onClose }) {
  const { darkMode, setDarkMode } = useDashboard();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Incomes',   icon: Wallet,          path: '/incomes'   },
    { name: 'Expenses',  icon: CreditCard,       path: '/expenses'  },
    { name: 'Analytics', icon: BarChart3,        path: '/analytics' },
    { name: 'Settings',  icon: Settings,         path: '/settings'  },
  ];

  const handleNavigate = (path) => { navigate(path); onClose(); };
  const handleLogout   = () => { logout(); navigate('/login', { replace: true }); };

  /* active classes change by theme */
  const activeClass = darkMode
    ? 'bg-gradient-to-r from-purple-900/50 to-violet-900/30 text-purple-300 shadow-sm border-l-2 border-purple-400'
    : 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 shadow-sm border-l-2 border-emerald-500';

  const hoverClass = darkMode
    ? 'text-slate-400 hover:bg-purple-900/20 hover:text-purple-300'
    : 'text-slate-500 hover:bg-emerald-50/70 hover:text-emerald-700';

  const NavItems = ({ mobile = false }) => (
    <nav className={`flex-1 p-4 space-y-1 overflow-y-auto ${mobile ? '' : ''}`}>
      {menus.map((menu) => {
        const Icon = menu.icon;
        const isActive = location.pathname === menu.path ||
          (menu.path !== '/' && location.pathname.startsWith(menu.path));
        return (
          <button
            key={menu.name}
            onClick={() => handleNavigate(menu.path)}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ease-out transform hover:translate-x-1 ${isActive ? activeClass : hoverClass}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
            <span className="flex-1 text-left">{menu.name}</span>
            {isActive && (
              <span className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-purple-400' : 'bg-emerald-500'}`} />
            )}
          </button>
        );
      })}
    </nav>
  );

  /* Bottom user panel */
  const UserPanel = () => (
    <div className={`p-4 border-t ${darkMode ? 'border-purple-900/40' : 'border-emerald-100'}`}>
      <div className="flex items-center gap-3 px-2 py-2">
        <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-white text-xs flex-shrink-0
          ${darkMode
            ? 'bg-gradient-to-tr from-purple-600 to-violet-500 shadow-md shadow-purple-500/20'
            : 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-md shadow-emerald-500/20'
          }`}
        >
          {user?.initials || 'RK'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.name || 'User'}</p>
          <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
        </div>
        <button
          onClick={handleLogout}
          title="Sign out"
          className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'text-purple-400/60 hover:text-rose-400 hover:bg-rose-900/20' : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'}`}
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className={`w-64 hidden md:flex flex-col shrink-0 transition-all duration-500 ease-in-out
        ${darkMode
          ? 'bg-slate-900 border-r border-purple-900/40'
          : 'bg-white border-r border-emerald-100'
        }`}
      >
        {/* Brand */}
        <div className={`h-20 flex items-center px-6 gap-3 border-b
          ${darkMode ? 'border-purple-900/40' : 'border-emerald-100'}`}
        >
          <div className={`p-2 rounded-xl ${darkMode ? 'bg-purple-900/30' : 'bg-emerald-100/70'}`}>
            <TrendingUp className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-emerald-600'}`} />
          </div>
          <span className={`text-xl font-bold tracking-tight bg-clip-text text-transparent
            ${darkMode
              ? 'bg-gradient-to-r from-purple-400 to-violet-300'
              : 'bg-gradient-to-r from-emerald-600 to-teal-500'
            }`}
          >
            Expense Tracker
          </span>
        </div>

        <NavItems />
        <UserPanel />
      </aside>

      {/* ── Mobile Drawer ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <button
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            aria-label="Close sidebar overlay"
          />
          <aside className={`relative w-[85vw] max-w-[320px] flex flex-col overflow-y-auto overflow-x-hidden shadow-2xl
            ${darkMode
              ? 'bg-slate-900 border-r border-purple-900/40'
              : 'bg-white border-r border-emerald-100'
            }`}
          >
            {/* Mobile header row */}
            <div className={`flex items-center justify-between px-4 py-4 border-b
              ${darkMode ? 'border-purple-900/40' : 'border-emerald-100'}`}
            >
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-purple-900/30' : 'bg-emerald-100/70'}`}>
                  <TrendingUp className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-emerald-600'}`} />
                </div>
                <span className={`text-base font-bold bg-clip-text text-transparent
                  ${darkMode
                    ? 'bg-gradient-to-r from-purple-400 to-violet-300'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-500'
                  }`}
                >
                  Expense Tracker
                </span>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-all duration-300
                  ${darkMode
                    ? 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/50'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Theme + Notif row */}
            <div className={`flex gap-2 px-4 py-3 border-b
              ${darkMode ? 'border-purple-900/40' : 'border-emerald-100'}`}
            >
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-xl text-sm font-semibold transition-all duration-300
                  ${darkMode
                    ? 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/50'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-600" />}
                {darkMode ? 'Light' : 'Dark'}
              </button>
              <button
                className={`p-2 rounded-xl relative transition-all duration-300
                  ${darkMode
                    ? 'bg-purple-900/30 text-purple-300'
                    : 'bg-emerald-50 text-emerald-600'
                  }`}
              >
                <Bell className="w-5 h-5" />
                <span className={`absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse
                  ${darkMode ? 'bg-purple-400' : 'bg-emerald-500'}`}
                />
              </button>
            </div>

            <NavItems mobile />
            <UserPanel />
          </aside>
        </div>
      )}
    </>
  );
}

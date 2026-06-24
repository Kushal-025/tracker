import { useState, useRef, useEffect } from 'react';
import { useTravel } from '../context/TravelContext';
import { Home, Compass, Map, Package, DollarSign, Heart, Plane, Palette } from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'trips', label: 'My Trips', icon: Map },
  { id: 'packing', label: 'Packing', icon: Package },
  { id: 'budget', label: 'Budget', icon: DollarSign },
  { id: 'saved', label: 'Saved', icon: Heart },
];

const themesList = [
  { id: 'amber', label: 'Amber Sunset', colorBg: 'bg-amber-500' },
  { id: 'emerald', label: 'Emerald Oasis', colorBg: 'bg-emerald-500' },
  { id: 'indigo', label: 'Sapphire Sea', colorBg: 'bg-indigo-500' },
  { id: 'violet', label: 'Amethyst', colorBg: 'bg-violet-500' },
  { id: 'rose', label: 'Ruby Rose', colorBg: 'bg-rose-500' },
];

export default function Navbar() {
  const { page, setPage, theme, setTheme } = useTravel();
  const [showThemes, setShowThemes] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowThemes(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4">
      <nav className="max-w-6xl mx-auto glass rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-gradient-start to-gradient-end rounded-xl flex items-center justify-center shadow-lg shadow-accent/30">
            <Plane size={18} className="text-white" />
          </div>
          <span className="text-base md:text-lg font-bold serif gradient-text">WanderMap</span>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                page === id
                  ? 'bg-accent-light text-accent border border-accent-border'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          <button
            onClick={() => setShowThemes(!showThemes)}
            className={`w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer hover:border-accent-border ${showThemes ? 'animate-pulse-glow border-accent-border text-accent' : ''}`}
            title="Switch Theme"
          >
            <Palette size={16} />
          </button>

          {showThemes && (
            <div className="absolute right-0 top-12 glass rounded-2xl p-2 w-48 border border-white/10 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <p className="text-xxs font-bold text-slate-500 uppercase tracking-wider px-3 py-1.5">Accents</p>
              {themesList.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setShowThemes(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm font-medium transition-all cursor-pointer ${
                    theme === t.id
                      ? 'bg-accent-light text-accent'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full ${t.colorBg} border border-white/10`} />
                  {t.label}
                </button>
              ))}
            </div>
          )}

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center text-xs font-bold text-white shadow-md">
            R
          </div>
        </div>
      </nav>

      {/* Mobile navigation bottom bar */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 glass rounded-2xl px-2 py-2 flex items-center justify-around z-50 border border-white/8 shadow-2xl shadow-black/40">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className={`p-3 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-1 ${
              page === id ? 'bg-accent-light text-accent' : 'text-slate-500 hover:text-white'
            }`}
            title={label}
          >
            <Icon size={18} />
          </button>
        ))}
      </div>
    </header>
  );
}

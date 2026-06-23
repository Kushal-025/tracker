import { useTravel } from '../context/TravelContext';
import { Home, Compass, Map, Package, DollarSign, Heart, Plane } from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'trips', label: 'My Trips', icon: Map },
  { id: 'packing', label: 'Packing', icon: Package },
  { id: 'budget', label: 'Budget', icon: DollarSign },
  { id: 'saved', label: 'Saved', icon: Heart },
];

export default function Navbar() {
  const { page, setPage } = useTravel();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <nav className="max-w-6xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Plane size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold serif gradient-text">WanderMap</span>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                page === id
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-white">
            R
          </div>
        </div>
      </nav>

      <div className="md:hidden fixed bottom-4 left-4 right-4 glass rounded-2xl px-2 py-2 flex items-center justify-around z-50">
        {navItems.map(({ id, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className={`p-3 rounded-xl transition-all cursor-pointer ${
              page === id ? 'bg-amber-500/15 text-amber-400' : 'text-slate-500 hover:text-white'
            }`}
          >
            <Icon size={20} />
          </button>
        ))}
      </div>
    </header>
  );
}

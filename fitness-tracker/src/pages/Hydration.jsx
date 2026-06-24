import { useState } from 'react';

import { useApp } from '../context/AppContext';
import { Droplets, Plus, Minus, Coffee, GlassWater } from 'lucide-react';

const quickOptions = [
  { label: 'Espresso', amount: 0.5, icon: '☕', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { label: 'Small Cup', amount: 1, icon: '🥛', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { label: 'Water Bottle', amount: 2, icon: '💧', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  { label: 'Large Bottle', amount: 3, icon: '🍶', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
];

const tips = [
  "Drink a glass of water first thing in the morning to kickstart your metabolism.",
  "Keep a water bottle on your desk as a visual reminder to hydrate.",
  "Add lemon or cucumber to water for a refreshing flavour boost.",
  "Your urine should be pale yellow — a great hydration indicator.",
  "Drink a glass before each meal to aid digestion and reduce overeating.",
];

export default function Hydration() {
  const { todayStats, goals, updateWater } = useApp();
  const [lastAdded, setLastAdded] = useState(null);
  const [customAmount, setCustomAmount] = useState('');

  const water = todayStats.water;
  const goal = goals.water;
  const percent = Math.min(100, (water / goal) * 100);

  const handleAdd = (amount) => {
    updateWater(amount);
    setLastAdded(amount);
    setTimeout(() => setLastAdded(null), 2000);
  };

  const handleCustom = (e) => {
    e.preventDefault();
    const amt = parseFloat(customAmount);
    if (!isNaN(amt) && amt > 0) {
      handleAdd(amt);
      setCustomAmount('');
    }
  };

  const glassColor = percent >= 100 ? 'from-emerald-500 to-cyan-500' :
    percent >= 60 ? 'from-cyan-500 to-blue-500' :
    percent >= 30 ? 'from-blue-500 to-indigo-500' : 'from-indigo-500 to-violet-500';

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Hydration</h2>
        <p className="text-slate-400 mt-1 text-sm">Track your daily water intake</p>
      </div>

      {/* Main Tracker */}
      <div className="glass rounded-2xl p-5 sm:p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute bottom-0 left-0 right-0" style={{
            height: `${percent}%`,
            background: 'linear-gradient(to top, #06b6d4, transparent)',
            transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
        </div>

        {/* Big water display */}
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-36 h-36 rounded-full mb-6 relative">
            <svg width="144" height="144" viewBox="0 0 144 144">
              <circle cx="72" cy="72" r="64" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              <circle cx="72" cy="72" r="64" fill="none"
                stroke="url(#waterGrad)" strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 64}`}
                strokeDashoffset={`${2 * Math.PI * 64 * (1 - percent / 100)}`}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.8s ease' }}
              />
              <defs>
                <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Droplets size={24} className="text-cyan-400 mb-1" />
              <span className="text-2xl font-black text-white">{water}</span>
              <span className="text-xs text-slate-400">/ {goal}</span>
            </div>
          </div>

          <h3 className={`text-4xl font-black mb-1 ${percent >= 100 ? 'text-emerald-400' : 'gradient-text'}`}>
            {water} <span className="text-lg font-medium text-slate-400">glasses</span>
          </h3>
          <p className="text-slate-400 text-sm mb-1">
            {percent >= 100 ? '🎉 Goal achieved! Excellent hydration!' : `${(goal - water).toFixed(1)} more glasses to reach your goal`}
          </p>
          <p className="text-xs text-slate-500">≈ {(water * 250).toFixed(0)} ml consumed today</p>

          {lastAdded && (
            <div className="mt-3 inline-block bg-emerald-500/20 text-emerald-400 text-sm font-medium px-4 py-1.5 rounded-full border border-emerald-500/20 animate-pulse">
              +{lastAdded} glass{lastAdded !== 1 ? 'es' : ''} added!
            </div>
          )}
        </div>
      </div>

      {/* Quick Add */}
      <div className="glass rounded-2xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Quick Add</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {quickOptions.map(opt => (
            <button
              key={opt.label}
              onClick={() => handleAdd(opt.amount)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${opt.color} hover:scale-105 transition-all duration-200 cursor-pointer`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span className="text-xs font-medium">{opt.label}</span>
              <span className="text-xs opacity-70">+{opt.amount} glass{opt.amount !== 1 ? 'es' : ''}</span>
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <form onSubmit={handleCustom} className="flex gap-3">
          <input
            type="number" step="0.5" min="0.5" value={customAmount}
            onChange={e => setCustomAmount(e.target.value)}
            placeholder="Custom amount (glasses)"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
          />
          <button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-5 py-3 rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer">
            Add
          </button>
        </form>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button onClick={() => handleAdd(-1)}
          className="flex items-center gap-2 glass border border-white/5 px-5 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:border-red-500/20 transition-all cursor-pointer">
          <Minus size={16} /> Remove Glass
        </button>
        <button onClick={() => handleAdd(1)}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer">
          <Plus size={16} /> Add Glass
        </button>
      </div>

      {/* Glasses Visual */}
      <div className="glass rounded-2xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Progress Visualization</h3>
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: goal }, (_, i) => (
            <div key={i} className={`transition-all duration-500 ${i < water ? 'animate-float' : ''}`}
              style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`w-10 h-14 rounded-lg border-2 flex items-end justify-center pb-1.5 transition-all duration-500 ${
                i < water
                  ? 'border-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/20'
                  : 'border-white/10 bg-white/3'
              }`}>
                <Droplets size={14} className={i < water ? 'text-cyan-400' : 'text-slate-600'} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hydration Tip */}
      <div className="glass rounded-2xl p-5 border border-cyan-500/10">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-sm font-medium text-cyan-400 mb-1">Hydration Tip</p>
            <p className="text-sm text-slate-400">{tips[new Date().getDay() % tips.length]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

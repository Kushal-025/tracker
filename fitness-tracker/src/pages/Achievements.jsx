import { useApp } from '../context/AppContext';

import { Trophy, Lock, Star, Zap, Heart, Flame, Droplets, Dumbbell, Moon, Target } from 'lucide-react';

const achievementsList = [
  { id: 1, title: 'First Step', desc: 'Log your first workout', icon: '🏃', category: 'workouts', condition: (s, w) => w.length >= 1, rarity: 'common' },
  { id: 2, title: 'Iron Will', desc: 'Complete 10 workouts', icon: '💪', category: 'workouts', condition: (s, w) => w.length >= 10, rarity: 'uncommon' },
  { id: 3, title: 'Gym Rat', desc: 'Complete 50 workouts', icon: '🏋️', category: 'workouts', condition: (s, w) => w.length >= 50, rarity: 'rare' },
  { id: 4, title: 'Hydration Hero', desc: 'Drink 8 glasses of water', icon: '💧', category: 'hydration', condition: (s) => s.water >= 8, rarity: 'common' },
  { id: 5, title: 'Step King', desc: 'Reach 10,000 steps in a day', icon: '👑', category: 'steps', condition: (s) => s.steps >= 10000, rarity: 'uncommon' },
  { id: 6, title: 'Early Bird', desc: 'Sleep before 10 PM', icon: '🌙', category: 'sleep', condition: (s) => s.sleep >= 8, rarity: 'common' },
  { id: 7, title: 'Calorie Crusher', desc: 'Burn 2000+ calories in a day', icon: '🔥', category: 'calories', condition: (s) => s.calories >= 2000, rarity: 'uncommon' },
  { id: 8, title: 'Marathon Mind', desc: 'Log 5+ hours of workouts total', icon: '🎽', category: 'workouts', condition: (s, w) => w.reduce((a, b) => a + b.duration, 0) >= 300, rarity: 'rare' },
  { id: 9, title: 'Consistency King', desc: 'Use the app 7 days in a row', icon: '📅', category: 'streak', condition: () => true, rarity: 'epic' },
  { id: 10, title: 'Sleep Champion', desc: 'Log sleep 5 days in a row', icon: '😴', category: 'sleep', condition: (s, w, sl) => sl.length >= 5, rarity: 'uncommon' },
  { id: 11, title: 'Nutrition Nerd', desc: 'Log 5+ meals', icon: '🥗', category: 'nutrition', condition: (s, w, sl, m) => m.length >= 5, rarity: 'common' },
  { id: 12, title: 'Legend', desc: 'Earn 10 achievements', icon: '🌟', category: 'special', condition: () => false, rarity: 'legendary' },
];

const rarityConfig = {
  common: { label: 'Common', color: 'text-slate-300', bg: 'bg-slate-500/10 border-slate-500/20', glow: '' },
  uncommon: { label: 'Uncommon', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', glow: 'shadow-emerald-500/10' },
  rare: { label: 'Rare', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', glow: 'shadow-blue-500/10' },
  epic: { label: 'Epic', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20', glow: 'shadow-violet-500/20' },
  legendary: { label: 'Legendary', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', glow: 'shadow-yellow-500/20' },
};

export default function Achievements() {
  const { todayStats, workouts, sleepLogs, meals } = useApp();

  const unlockedIds = achievementsList
    .filter(a => a.condition(todayStats, workouts, sleepLogs, meals))
    .map(a => a.id);

  const unlocked = achievementsList.filter(a => unlockedIds.includes(a.id));
  const locked = achievementsList.filter(a => !unlockedIds.includes(a.id));

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Achievements</h2>
        <p className="text-slate-400 mt-1 text-sm">Milestones on your fitness journey</p>
      </div>

      {/* Summary */}
      <div className="glass rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
            <Trophy size={18} className="text-yellow-400" /> Your Progress
          </h3>
          <span className="gradient-text font-black text-xl sm:text-2xl">{unlocked.length} / {achievementsList.length}</span>
        </div>
        <div className="progress-bar mb-2">
          <div className="progress-fill bg-gradient-to-r from-yellow-500 to-orange-500"
            style={{ width: `${(unlocked.length / achievementsList.length) * 100}%` }} />
        </div>
        <div className="flex gap-2 flex-wrap mt-3 sm:mt-4">
          {Object.entries(rarityConfig).map(([rarity, cfg]) => {
            const count = unlocked.filter(a => a.rarity === rarity).length;
            return (
              <div key={rarity} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${cfg.bg} text-xs`}>
                <span className={`font-bold ${cfg.color}`}>{count}</span>
                <span className="text-slate-400">{cfg.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Star size={18} className="text-yellow-400" /> Unlocked ({unlocked.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlocked.map(a => {
              const cfg = rarityConfig[a.rarity];
              return (
                <div key={a.id} className={`glass rounded-2xl p-5 border card-hover shadow-lg ${cfg.bg} ${cfg.glow}`}>
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{a.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-white">{a.title}</p>
                        <span className={`text-xs ${cfg.color} font-medium`}>{cfg.label}</span>
                      </div>
                      <p className="text-xs text-slate-400">{a.desc}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-1.5">
                    <div className="w-full h-1 rounded-full bg-emerald-500/50" />
                    <span className="text-xs text-emerald-400 whitespace-nowrap">✓ Unlocked</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Lock size={18} className="text-slate-500" /> Locked ({locked.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locked.map(a => {
              const cfg = rarityConfig[a.rarity];
              return (
                <div key={a.id} className="glass rounded-2xl p-5 border border-white/5 opacity-60 hover:opacity-80 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl grayscale">{a.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-white">{a.title}</p>
                        <span className={`text-xs ${cfg.color} font-medium`}>{cfg.label}</span>
                      </div>
                      <p className="text-xs text-slate-400">{a.desc}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-1.5">
                    <div className="w-full h-1 rounded-full bg-white/5" />
                    <Lock size={12} className="text-slate-600 flex-shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

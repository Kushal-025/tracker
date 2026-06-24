import { useState } from 'react';

import { useApp } from '../context/AppContext';
import { Target, Footprints, Flame, Droplets, Moon, Dumbbell, Scale, Save, TrendingUp } from 'lucide-react';

const goalConfig = [
  { key: 'steps', label: 'Daily Steps', icon: Footprints, color: 'text-violet-400', gradient: 'from-violet-600 to-violet-400', min: 1000, max: 30000, step: 500, unit: 'steps' },
  { key: 'calories', label: 'Daily Calories', icon: Flame, color: 'text-orange-400', gradient: 'from-orange-500 to-orange-400', min: 1000, max: 4000, step: 50, unit: 'kcal' },
  { key: 'water', label: 'Daily Water', icon: Droplets, color: 'text-cyan-400', gradient: 'from-cyan-500 to-cyan-400', min: 2, max: 20, step: 1, unit: 'glasses' },
  { key: 'sleep', label: 'Sleep Duration', icon: Moon, color: 'text-indigo-400', gradient: 'from-indigo-500 to-indigo-400', min: 4, max: 12, step: 0.5, unit: 'hours' },
  { key: 'workouts', label: 'Weekly Workouts', icon: Dumbbell, color: 'text-pink-400', gradient: 'from-pink-500 to-pink-400', min: 1, max: 14, step: 1, unit: 'sessions' },
];

function GoalCard({ config, value, onChange }) {
  const { key, label, icon: Icon, color, gradient, min, max, step, unit } = config;
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="glass rounded-2xl p-6 card-hover">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-20 flex items-center justify-center`}>
            <Icon size={20} className={color} />
          </div>
          <div>
            <p className="font-semibold text-white">{label}</p>
            <p className="text-xs text-slate-500">Set your target</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-black ${color}`}>{value}</p>
          <p className="text-xs text-slate-500">{unit}</p>
        </div>
      </div>

      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(key, Number(e.target.value))}
        className="w-full mb-3 accent-violet-500 cursor-pointer"
        style={{ accentColor: color.replace('text-', '').replace('-400', '') }}
      />

      <div className="flex justify-between text-xs text-slate-500">
        <span>{min} {unit}</span>
        <span className={`${color} font-medium`}>{Math.round(percent)}% of max</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
}

export default function Goals() {
  const { goals, setGoals, todayStats, workouts } = useApp();
  const [draft, setDraft] = useState({ ...goals });
  const [saved, setSaved] = useState(false);

  const handleChange = (key, value) => {
    setDraft(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setGoals(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    const defaults = { steps: 10000, calories: 2200, water: 8, sleep: 8, workouts: 5 };
    setDraft(defaults);
    setSaved(false);
  };

  // Calculate completion rates
  const completionData = [
    { label: 'Steps', current: todayStats.steps, goal: goals.steps },
    { label: 'Water', current: todayStats.water, goal: goals.water },
    { label: 'Sleep', current: todayStats.sleep, goal: goals.sleep },
    { label: 'Workouts', current: workouts.filter(w => w.date === new Date().toDateString()).length, goal: goals.workouts / 7 },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Goals</h2>
          <p className="text-slate-400 mt-1 text-sm">Customize your daily fitness targets</p>
        </div>
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          <button onClick={handleReset}
            className="glass border border-white/5 text-slate-400 hover:text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer">
            Reset Defaults
          </button>
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg cursor-pointer ${
              saved
                ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                : 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-violet-500/30 hover:from-violet-500 hover:to-cyan-400'
            }`}>
            <Save size={16} />
            {saved ? 'Saved!' : 'Save Goals'}
          </button>
        </div>
      </div>

      {/* Today's Progress vs Goals */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
          <TrendingUp size={18} className="text-violet-400" /> Today's Achievement
        </h3>
        <div className="space-y-4">
          {completionData.map(({ label, current, goal }) => {
            const pct = Math.min(100, (current / goal) * 100);
            return (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-300 font-medium">{label}</span>
                  <span className="text-slate-400">{typeof current === 'number' ? current.toLocaleString() : current} / {typeof goal === 'number' ? goal.toFixed(1) : goal}</span>
                </div>
                <div className="progress-bar">
                  <div className={`progress-fill ${pct >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-violet-500 to-cyan-500'}`}
                    style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Goal Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {goalConfig.map(config => (
          <GoalCard key={config.key} config={config} value={draft[config.key]} onChange={handleChange} />
        ))}
      </div>

      {/* Goal Tips */}
      <div className="glass rounded-2xl p-5 border border-violet-500/10">
        <div className="flex items-start gap-3">
          <Target size={20} className="text-violet-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-violet-400 mb-1">Smart Goal Setting</p>
            <p className="text-sm text-slate-400">Use the SMART framework: make goals Specific, Measurable, Achievable, Relevant, and Time-bound. Start with achievable targets and gradually increase them as you build consistency.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

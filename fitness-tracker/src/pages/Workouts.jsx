import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Timer, Flame, Dumbbell, Check, X } from 'lucide-react';

const workoutTypes = [
  { value: 'cardio',      label: 'Cardio',      color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',   dot: 'bg-orange-400'  },
  { value: 'strength',    label: 'Strength',    color: 'bg-violet-500/10 text-violet-400 border-violet-500/20',   dot: 'bg-violet-400'  },
  { value: 'flexibility', label: 'Flexibility', color: 'bg-cyan-500/10   text-cyan-400   border-cyan-500/20',     dot: 'bg-cyan-400'    },
  { value: 'sports',      label: 'Sports',      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
  { value: 'hiit',        label: 'HIIT',        color: 'bg-red-500/10   text-red-400   border-red-500/20',        dot: 'bg-red-400'     },
];

const workoutTemplates = [
  { name: 'Morning Run',    type: 'cardio',      duration: 30, calories: 280, icon: '🏃' },
  { name: 'Push-Pull-Legs', type: 'strength',    duration: 60, calories: 420, icon: '💪' },
  { name: 'Yoga Flow',      type: 'flexibility', duration: 40, calories: 160, icon: '🧘' },
  { name: 'HIIT Blast',     type: 'hiit',        duration: 25, calories: 350, icon: '🔥' },
  { name: 'Swimming',       type: 'cardio',      duration: 45, calories: 380, icon: '🏊' },
  { name: 'Cycling',        type: 'cardio',      duration: 50, calories: 340, icon: '🚴' },
];

function WorkoutTypeChip({ type }) {
  const config = workoutTypes.find(t => t.value === type) || workoutTypes[0];
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full capitalize border ${config.color}`}>
      {config.label}
    </span>
  );
}

function AddWorkoutModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', type: 'cardio', duration: '', calories: '', icon: '💪', notes: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.duration || !form.calories) return;
    onAdd({ ...form, duration: Number(form.duration), calories: Number(form.calories) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="glass rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 w-full sm:max-w-md border border-white/10 shadow-2xl shadow-violet-500/20 max-h-[90vh] overflow-y-auto">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">Log Workout</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Workout Name *</label>
            <input
              type="text" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Morning Run"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-all"
              >
                {workoutTypes.map(t => <option key={t.value} value={t.value} className="bg-slate-800">{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Icon</label>
              <input
                type="text" value={form.icon}
                onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Duration (min) *</label>
              <input
                type="number" value={form.duration}
                onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
                placeholder="30" min="1"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Calories *</label>
              <input
                type="number" value={form.calories}
                onChange={e => setForm(p => ({ ...p, calories: e.target.value }))}
                placeholder="250" min="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="How did the workout feel?"
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold py-3 rounded-xl hover:from-violet-500 hover:to-cyan-400 transition-all duration-200 shadow-lg shadow-violet-500/30 cursor-pointer"
          >
            Log Workout
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Workouts() {
  const { workouts, addWorkout } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const filtered     = filter === 'all' ? workouts : workouts.filter(w => w.type === filter);
  const todayWorkouts = workouts.filter(w => w.date === new Date().toDateString());
  const totalCalories = todayWorkouts.reduce((s, w) => s + w.calories, 0);
  const totalMinutes  = todayWorkouts.reduce((s, w) => s + w.duration, 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Workouts</h2>
          <p className="text-slate-400 mt-1 text-sm">{todayWorkouts.length} sessions today</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm hover:from-violet-500 hover:to-cyan-400 transition-all shadow-lg shadow-violet-500/30 cursor-pointer flex-shrink-0"
        >
          <Plus size={16} />
          <span className="hidden xs:inline sm:inline">Log Workout</span>
        </button>
      </div>

      {/* Today Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: 'Sessions',  value: todayWorkouts.length, icon: Dumbbell, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'Minutes',   value: totalMinutes,          icon: Timer,    color: 'text-cyan-400',   bg: 'bg-cyan-500/10'   },
          { label: 'Calories',  value: totalCalories,         icon: Flame,    color: 'text-orange-400', bg: 'bg-orange-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass rounded-2xl p-3 sm:p-5 text-center card-hover">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Add Templates */}
      <div className="glass rounded-2xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Quick Add</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {workoutTemplates.map(t => (
            <button
              key={t.name}
              onClick={() => addWorkout(t)}
              className="flex items-center gap-2 sm:gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all text-left group cursor-pointer"
            >
              <span className="text-lg sm:text-xl flex-shrink-0">{t.icon}</span>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-white group-hover:text-violet-300 transition-colors truncate">{t.name}</p>
                <p className="text-[10px] sm:text-xs text-slate-500">{t.duration}m • {t.calories} kcal</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap">
        {['all', ...workoutTypes.map(t => t.value)].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium capitalize transition-all cursor-pointer ${
              filter === type
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                : 'glass text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Workout list */}
      <div className="space-y-2 sm:space-y-3">
        {filtered.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <Dumbbell size={36} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No workouts logged yet. Start moving!</p>
          </div>
        ) : (
          filtered.map(w => (
            <div key={w.id} className="glass rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 card-hover border border-white/5 hover:border-violet-500/20">
              <span className="text-2xl sm:text-3xl flex-shrink-0">{w.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="font-semibold text-white text-sm sm:text-base">{w.name}</p>
                  <WorkoutTypeChip type={w.type} />
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Timer size={11} /> {w.duration} min</span>
                  <span className="flex items-center gap-1"><Flame size={11} /> {w.calories} kcal</span>
                  <span className="hidden sm:inline">{w.date}</span>
                </div>
                {w.notes && <p className="text-xs text-slate-500 mt-1 italic">"{w.notes}"</p>}
              </div>
              <Check size={16} className="text-emerald-400 flex-shrink-0" />
            </div>
          ))
        )}
      </div>

      {showModal && <AddWorkoutModal onClose={() => setShowModal(false)} onAdd={addWorkout} />}
    </div>
  );
}

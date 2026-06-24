import { useApp } from '../context/AppContext';
import { Activity, Flame, Droplets, Moon, Footprints, Heart, Clock, Scale } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

function StatCard({ icon: Icon, label, value, unit, progress, color, gradient, suffix }) {
  return (
    <div className="glass card-hover rounded-2xl p-4 sm:p-5 relative overflow-hidden">
      <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10 blur-xl ${gradient}`} />
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-2.5 rounded-xl ${gradient} bg-opacity-20`}>
          <Icon size={18} className={color} />
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${gradient} bg-opacity-10 ${color}`}>
          {progress !== undefined ? `${Math.round((value / (suffix || 1)) * 100)}%` : 'Today'}
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-xl sm:text-2xl font-bold text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
          <span className="text-xs sm:text-sm font-normal text-slate-400 ml-1">{unit}</span>
        </p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
      {progress !== undefined && (
        <div className="mt-3 sm:mt-4 progress-bar">
          <div
            className={`progress-fill ${gradient}`}
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      )}
    </div>
  );
}

function RingChart({ value, max, color, label, sublabel }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, value / max);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-20 h-20 sm:w-24 sm:h-24">
        <svg width="100%" height="100%" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle
            cx="44" cy="44" r={radius} fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="ring-progress transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold text-white">{Math.round(progress * 100)}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-white">{label}</p>
        <p className="text-[10px] text-slate-500 leading-tight">{sublabel}</p>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl p-3 border border-violet-500/20 shadow-xl shadow-violet-500/10">
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: 'Good Morning', emoji: '☀️' };
  if (hour >= 12 && hour < 20) return { text: 'Good Evening', emoji: '🌆' };
  return { text: "It's Night, Rest Up", emoji: '🌙' };
}

export default function Dashboard() {
  const { todayStats, goals, weeklyData, workouts } = useApp();
  const greeting = getGreeting();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Hey! {greeting.text} {greeting.emoji}
          </h2>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="glass rounded-2xl px-4 sm:px-5 py-2 sm:py-3 text-center self-start sm:self-auto">
          <p className="text-xs text-slate-400">Daily Score</p>
          <p className="text-2xl sm:text-3xl font-black gradient-text">87</p>
        </div>
      </div>

      {/* Primary stats — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Footprints} label="Steps Today"    value={todayStats.steps}    unit="steps"   progress={(todayStats.steps    / goals.steps)    * 100} suffix={goals.steps}    color="text-violet-400" gradient="bg-violet-500" />
        <StatCard icon={Flame}      label="Calories"       value={todayStats.calories}  unit="kcal"    progress={(todayStats.calories / goals.calories)  * 100} suffix={goals.calories}  color="text-orange-400" gradient="bg-orange-500" />
        <StatCard icon={Droplets}   label="Water"          value={todayStats.water}     unit="glasses" progress={(todayStats.water    / goals.water)    * 100} suffix={goals.water}    color="text-cyan-400"   gradient="bg-cyan-500"   />
        <StatCard icon={Moon}       label="Sleep"          value={todayStats.sleep}     unit="hrs"     progress={(todayStats.sleep    / goals.sleep)    * 100} suffix={goals.sleep}    color="text-indigo-400" gradient="bg-indigo-500" />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Heart}    label="Heart Rate"     value={todayStats.heartRate}         unit="bpm"      color="text-red-400"     gradient="bg-red-500"     />
        <StatCard icon={Clock}    label="Active Minutes" value={todayStats.activeMinutes}     unit="min"      color="text-emerald-400" gradient="bg-emerald-500" />
        <StatCard icon={Activity} label="Workouts Done"  value={todayStats.workoutsCompleted} unit="sessions" color="text-pink-400"    gradient="bg-pink-500"    />
        <StatCard icon={Scale}    label="Weight"         value={todayStats.weight}            unit="kg"       color="text-yellow-400"  gradient="bg-yellow-500"  />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="glass rounded-2xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">Weekly Steps</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="stepsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="steps" stroke="#7c3aed" fill="url(#stepsGrad)" strokeWidth={2.5} dot={{ fill: '#7c3aed', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">Weekly Calories</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="calories" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goals + Recent Workouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="glass rounded-2xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">Today's Goals</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <RingChart value={todayStats.steps}    max={goals.steps}    color="#7c3aed" label="Steps"    sublabel={`${todayStats.steps.toLocaleString()}/${goals.steps.toLocaleString()}`} />
            <RingChart value={todayStats.calories}  max={goals.calories}  color="#f97316" label="Calories" sublabel={`${todayStats.calories}/${goals.calories}`} />
            <RingChart value={todayStats.water}     max={goals.water}     color="#06b6d4" label="Water"    sublabel={`${todayStats.water}/${goals.water} gl`} />
            <RingChart value={todayStats.sleep}     max={goals.sleep}     color="#6366f1" label="Sleep"    sublabel={`${todayStats.sleep}/${goals.sleep}h`} />
          </div>
        </div>

        <div className="glass rounded-2xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Recent Workouts</h3>
          <div className="space-y-2 sm:space-y-3">
            {workouts.slice(0, 3).map(w => (
              <div key={w.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-violet-500/20 transition-all">
                <span className="text-xl flex-shrink-0">{w.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{w.name}</p>
                  <p className="text-xs text-slate-500">{w.duration} min • {w.calories} kcal</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full capitalize flex-shrink-0 ${
                  w.type === 'cardio'    ? 'bg-orange-500/10 text-orange-400' :
                  w.type === 'strength' ? 'bg-violet-500/10 text-violet-400' :
                  'bg-cyan-500/10 text-cyan-400'
                }`}>
                  {w.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

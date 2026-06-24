import { useApp } from '../context/AppContext';

import { TrendingDown, TrendingUp, Scale, Activity } from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useState } from 'react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl p-3 border border-violet-500/20 shadow-xl">
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Progress() {
  const { weeklyData, weightLog, todayStats } = useApp();
  const [view, setView] = useState('week');

  const weightChange = weightLog.length >= 2
    ? (weightLog[weightLog.length - 1].weight - weightLog[0].weight).toFixed(1)
    : 0;

  const stats = [
    { label: 'Weight Change', value: `${weightChange > 0 ? '+' : ''}${weightChange} kg`, icon: Scale, color: weightChange <= 0 ? 'text-emerald-400' : 'text-orange-400', sub: 'This week' },
    { label: 'Active Days', value: `${weeklyData.filter(d => d.workout).length}/7`, icon: Activity, color: 'text-violet-400', sub: 'This week' },
    { label: 'Avg Steps', value: Math.round(weeklyData.reduce((s, d) => s + d.steps, 0) / 7).toLocaleString(), icon: TrendingUp, color: 'text-cyan-400', sub: 'Per day' },
    { label: 'Avg Sleep', value: `${(weeklyData.reduce((s, d) => s + parseFloat(d.sleep), 0) / 7).toFixed(1)}h`, icon: TrendingDown, color: 'text-indigo-400', sub: 'Per night' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Progress</h2>
        <p className="text-slate-400 mt-1 text-sm">Track your fitness journey over time</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="glass rounded-2xl p-3 sm:p-5 card-hover text-center">
            <Icon size={20} className={`${color} mx-auto mb-2 sm:mb-3`} />
            <p className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-white mt-0.5 sm:mt-1">{label}</p>
            <p className="text-xs text-slate-500 hidden sm:block">{sub}</p>
          </div>
        ))}
      </div>

      {/* Weight Trend */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Weight Trend</h3>
          <div className="flex items-center gap-2">
            <Scale size={14} className="text-slate-400" />
            <span className="text-sm text-slate-400">
              Current: <span className="text-white font-semibold">{todayStats.weight} kg</span>
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={weightLog}>
            <defs>
              <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={v => v.slice(5)} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="weight" name="Weight (kg)" stroke="#7c3aed" fill="url(#weightGrad)" strokeWidth={2.5} dot={{ fill: '#7c3aed', r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Steps + Calories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Steps vs Calories</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              <Line yAxisId="left" type="monotone" dataKey="steps" name="Steps" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: '#7c3aed', r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="calories" name="Calories" stroke="#f97316" strokeWidth={2.5} dot={{ fill: '#f97316', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Water & Sleep</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              <Bar dataKey="water" name="Water (glasses)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sleep" name="Sleep (hrs)" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Workout Consistency */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-5">Weekly Workout Consistency</h3>
        <div className="flex gap-3 justify-center">
          {weeklyData.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${
                d.workout
                  ? 'bg-emerald-500/20 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                  : 'bg-white/3 border border-white/5'
              }`}>
                {d.workout ? '✅' : '⬜'}
              </div>
              <p className="text-xs text-slate-400">{d.day}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <div className="glass px-4 py-2 rounded-full text-sm">
            <span className="text-emerald-400 font-semibold">{weeklyData.filter(d => d.workout).length}</span>
            <span className="text-slate-400"> / 7 days active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

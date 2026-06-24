import { useState } from 'react';

import { useApp } from '../context/AppContext';
import { Moon, Sun, Plus, X, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

function QualityStar({ rating, setRating }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button key={s} type="button" onClick={() => setRating(s)} className="cursor-pointer transition-transform hover:scale-110">
          <Star size={24} className={s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} />
        </button>
      ))}
    </div>
  );
}

function AddSleepModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ bedtime: '23:00', wakeup: '06:30', quality: 3, notes: '' });

  const calcDuration = () => {
    const [bh, bm] = form.bedtime.split(':').map(Number);
    const [wh, wm] = form.wakeup.split(':').map(Number);
    let bed = bh * 60 + bm;
    let wake = wh * 60 + wm;
    if (wake < bed) wake += 24 * 60;
    return ((wake - bed) / 60).toFixed(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...form, date: new Date().toDateString(), duration: parseFloat(calcDuration()) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="glass rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 w-full sm:max-w-md border border-white/10 shadow-2xl shadow-indigo-500/10 max-h-[90vh] overflow-y-auto">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Log Sleep</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1.5 flex items-center gap-1"><Moon size={12} /> Bedtime</label>
              <input type="time" value={form.bedtime} onChange={e => setForm(p => ({ ...p, bedtime: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5 flex items-center gap-1"><Sun size={12} /> Wake Up</label>
              <input type="time" value={form.wakeup} onChange={e => setForm(p => ({ ...p, wakeup: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all" />
            </div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-xs text-slate-400 mb-1">Calculated Duration</p>
            <p className="text-3xl font-black text-indigo-400">{calcDuration()} <span className="text-sm text-slate-400">hours</span></p>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-2">Sleep Quality</label>
            <QualityStar rating={form.quality} setRating={q => setForm(p => ({ ...p, quality: q }))} />
            <p className="text-xs text-slate-500 mt-1">{['', 'Very Poor', 'Poor', 'Average', 'Good', 'Excellent'][form.quality]}</p>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Notes (optional)</label>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="How did you sleep?" rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all resize-none" />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold py-3 rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/30 cursor-pointer">
            Log Sleep
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Sleep() {
  const { sleepLogs, addSleepLog, goals, weeklyData } = useApp();
  const [showModal, setShowModal] = useState(false);

  const latest = sleepLogs[0];
  const avgSleep = sleepLogs.length > 0
    ? (sleepLogs.slice(0, 7).reduce((s, l) => s + l.duration, 0) / Math.min(7, sleepLogs.length)).toFixed(1)
    : 0;

  const sleepChartData = weeklyData.map(d => ({ day: d.day, hours: parseFloat(d.sleep), goal: goals.sleep }));

  const qualityLabels = ['', 'Very Poor', 'Poor', 'Average', 'Good', 'Excellent'];
  const qualityColors = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-emerald-400', 'text-cyan-400'];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Sleep Tracker</h2>
          <p className="text-slate-400 mt-1 text-sm">Monitor your rest and recovery</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/30 cursor-pointer self-start">
          <Plus size={16} /> Log Sleep
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: 'Last Night',   value: latest ? `${latest.duration}h` : '--', sub: latest ? qualityLabels[latest.quality] : 'No data', color: 'text-indigo-400' },
          { label: '7-Day Avg',   value: `${avgSleep}h`,    sub: `Goal: ${goals.sleep}h`, color: 'text-violet-400' },
          { label: 'Quality',     value: latest ? (latest.quality + '/5') : '--', sub: latest ? qualityLabels[latest.quality] : '--', color: qualityColors[latest?.quality || 0] },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="glass rounded-2xl p-3 sm:p-5 text-center card-hover">
            <Moon size={20} className={`${color} mx-auto mb-2 sm:mb-3`} />
            <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">{label}</p>
            <p className={`text-xs ${color} mt-0.5 hidden sm:block`}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Sleep Chart */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Weekly Sleep Duration</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={sleepChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'rgba(15,15,25,0.9)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px' }}
              formatter={(v) => [`${v}h`, 'Sleep']}
            />
            <ReferenceLine y={goals.sleep} stroke="#7c3aed" strokeDasharray="4 4" label={{ value: `Goal: ${goals.sleep}h`, fill: '#7c3aed', fontSize: 11 }} />
            <Bar dataKey="hours" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sleep Log */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Sleep History</h3>
        <div className="space-y-3">
          {sleepLogs.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No sleep logs yet. Start tracking!</p>
          ) : sleepLogs.map(log => (
            <div key={log.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/3 border border-white/5 hover:border-indigo-500/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                <Moon size={18} className="text-indigo-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium text-white">{log.date}</p>
                  <span className={`text-xs ${qualityColors[log.quality]}`}>{qualityLabels[log.quality]}</span>
                </div>
                <p className="text-xs text-slate-400">{log.bedtime} → {log.wakeup} • {log.duration}h</p>
                {log.notes && <p className="text-xs text-slate-500 italic mt-0.5">"{log.notes}"</p>}
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={13} className={s <= log.quality ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700'} />)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sleep Tips */}
      <div className="glass rounded-2xl p-5 border border-indigo-500/10">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🌙</span>
          <div>
            <p className="text-sm font-medium text-indigo-400 mb-1">Sleep Tip</p>
            <p className="text-sm text-slate-400">Maintain a consistent sleep schedule, even on weekends. Going to bed and waking up at the same time helps regulate your body's circadian rhythm.</p>
          </div>
        </div>
      </div>

      {showModal && <AddSleepModal onClose={() => setShowModal(false)} onAdd={addSleepLog} />}
    </div>
  );
}

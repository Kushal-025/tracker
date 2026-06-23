import { useTravel } from '../context/TravelContext';
import { IndianRupee, TrendingUp, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#f59e0b', '#f97316', '#06b6d4', '#7c3aed', '#10b981', '#ec4899', '#64748b'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl p-3 border border-amber-500/20 text-sm">
        <p className="text-slate-400 mb-1">{label || payload[0].name}</p>
        <p className="font-bold text-amber-400">₹{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function Budget() {
  const { trips } = useTravel();

  const allTrips = trips.filter(t => t.budget > 0);
  const totalBudget = allTrips.reduce((s, t) => s + t.budget, 0);
  const totalSpent = allTrips.reduce((s, t) => s + t.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  const allExpenses = trips.flatMap(t => t.expenses.map(e => ({ ...e, tripName: t.name })));
  const byCategory = allExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {});

  const pieData = Object.entries(byCategory).map(([name, value]) => ({ name, value }));
  const tripBarData = allTrips.map(t => ({ name: t.name.slice(0, 12), budget: t.budget, spent: t.spent }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 pb-16 space-y-8">
      <div>
        <h2 className="text-4xl font-black serif text-white mb-2">Budget Tracker</h2>
        <p className="text-slate-400">Track spending across all your trips</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Budget', value: totalBudget, icon: IndianRupee, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Total Spent', value: totalSpent, icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Remaining', value: totalRemaining, icon: AlertTriangle, color: totalRemaining < 0 ? 'text-red-400' : 'text-emerald-400', bg: totalRemaining < 0 ? 'bg-red-500/10' : 'bg-emerald-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`glass rounded-2xl p-6 text-center border border-white/8`}>
            <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
              <Icon size={22} className={color} />
            </div>
            <p className={`text-3xl font-black ${color}`}>₹{value.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {allExpenses.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <IndianRupee size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No expenses tracked yet. Add expenses from your trip details!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-5">Spending by Category</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} innerRadius={45} dataKey="value" paddingAngle={3}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-3 justify-center">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-slate-400">{d.name} <span className="text-white font-medium">₹{d.value}</span></span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-5">Budget vs Spent by Trip</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={tripBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="budget" name="Budget" fill="rgba(245,158,11,0.3)" radius={[4,4,0,0]} />
                  <Bar dataKey="spent" name="Spent" fill="#f59e0b" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-5">Per-Trip Breakdown</h3>
            <div className="space-y-4">
              {allTrips.map(trip => {
                const pct = trip.budget > 0 ? Math.min(100, (trip.spent / trip.budget) * 100) : 0;
                return (
                  <div key={trip.id}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-white font-medium">{trip.name}</span>
                      <span className="text-slate-400">₹{trip.spent} / ₹{trip.budget}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: pct > 90 ? '#ef4444' : 'linear-gradient(to right, #f59e0b, #f97316)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-5">Recent Transactions</h3>
            <div className="space-y-2">
              {allExpenses.slice(-8).reverse().map((exp, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                  <div>
                    <p className="text-sm font-medium text-white">{exp.label}</p>
                    <p className="text-xs text-slate-500">{exp.category} · {exp.tripName}</p>
                  </div>
                  <span className="text-amber-400 font-bold text-sm">₹{exp.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

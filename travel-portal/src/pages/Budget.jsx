import { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { IndianRupee, TrendingUp, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#f59e0b', '#f97316', '#06b6d4', '#7c3aed', '#10b981', '#ec4899', '#64748b'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl p-3 border border-accent-border text-sm">
        <p className="text-slate-400 mb-1">{label || payload[0].name}</p>
        <p className="font-bold text-accent">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function Budget() {
  const { trips } = useTravel();
  const [calcAmount, setCalcAmount] = useState('1000');
  const [calcCurrency, setCalcCurrency] = useState('USD');

  const rates = { USD: 0.012, EUR: 0.011, GBP: 0.0094, JPY: 1.88, AED: 0.044 };
  const currencySymbols = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', AED: 'د.إ' };
  const converted = (Number(calcAmount || 0) * (rates[calcCurrency] || 1)).toFixed(2);

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
          { label: 'Total Budget', value: totalBudget, icon: IndianRupee, color: 'text-accent', bg: 'bg-accent-light' },
          { label: 'Total Spent', value: totalSpent, icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Remaining', value: totalRemaining, icon: AlertTriangle, color: totalRemaining < 0 ? 'text-red-400' : 'text-emerald-400', bg: totalRemaining < 0 ? 'bg-red-500/10' : 'bg-emerald-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass rounded-2xl p-6 text-center border border-white/8">
            <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
              <Icon size={22} className={color} />
            </div>
            <p className={`text-3xl font-black ${color}`}>₹{value.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {allExpenses.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center border border-white/8">
          <IndianRupee size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No expenses tracked yet. Add expenses from your trip details!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6 border border-white/8">
              <h3 className="text-lg font-bold text-white mb-5">Spending by Category</h3>
              <div className="relative w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} innerRadius={45} dataKey="value" paddingAngle={3}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 justify-center">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-slate-400">{d.name} <span className="text-white font-medium">₹{d.value.toLocaleString()}</span></span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/8">
              <h3 className="text-lg font-bold text-white mb-5">Budget vs Spent by Trip</h3>
              <div className="relative w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tripBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="budget" name="Budget" fill="rgba(var(--accent-rgb), 0.3)" radius={[4,4,0,0]} />
                    <Bar dataKey="spent" name="Spent" fill="rgb(var(--accent-rgb))" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6 border border-white/8 space-y-4">
              <h3 className="text-lg font-bold text-white mb-3">Per-Trip Breakdown</h3>
              <div className="space-y-4">
                {allTrips.map(trip => {
                  const pct = trip.budget > 0 ? Math.min(100, (trip.spent / trip.budget) * 100) : 0;
                  return (
                    <div key={trip.id} className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-white font-medium">{trip.name}</span>
                        <span className="text-slate-400">₹{trip.spent.toLocaleString()} / ₹{trip.budget.toLocaleString()}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: pct > 90 ? '#ef4444' : 'linear-gradient(to right, var(--gradient-start), var(--gradient-end))' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Currency Calculator */}
            <div className="glass rounded-2xl p-6 border border-white/8 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Global Currency Calculator</h3>
                <p className="text-xs text-slate-400 mb-5">Convert Indian Rupee (₹) to foreign currencies using static market estimates.</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1.5 font-bold uppercase tracking-wider">Amount (INR ₹)</label>
                    <input
                      type="number"
                      value={calcAmount}
                      onChange={e => setCalcAmount(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm"
                      placeholder="Enter rupees..."
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1.5 font-bold uppercase tracking-wider">Convert To</label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {Object.keys(rates).map(curr => (
                        <button
                          key={curr}
                          onClick={() => setCalcCurrency(curr)}
                          className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            calcCurrency === curr
                              ? 'bg-accent-light text-accent border-accent-border'
                              : 'glass text-slate-400 border-white/5 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {curr}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-accent-light rounded-xl border border-accent-border/30 text-center">
                <span className="text-xs text-slate-400">Est. Exchange Value</span>
                <p className="text-2xl font-black text-white mt-1">
                  {currencySymbols[calcCurrency]} {Number(converted).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-accent font-bold">{calcCurrency}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/8">
            <h3 className="text-lg font-bold text-white mb-5">Recent Transactions</h3>
            <div className="space-y-2">
              {allExpenses.slice(-8).reverse().map((exp, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                  <div>
                    <p className="text-sm font-medium text-white">{exp.label}</p>
                    <p className="text-xs text-slate-500">{exp.category} · {exp.tripName}</p>
                  </div>
                  <span className="text-accent font-bold text-sm">₹{exp.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

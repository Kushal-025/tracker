import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { useDashboard } from '../context/DashboardContext';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#eab308', '#22c55e', '#3b82f6', '#64748b'];

export default function AnalyticsCharts() {
  const { transactions } = useDashboard();

  // Aggregate Category breakdown data for Expense Pie
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) existing.value += parseFloat(t.amount);
      else acc.push({ name: t.category, value: parseFloat(t.amount) });
      return acc;
    }, []);

  // Structural mapping configuration for chronological trendline
  const sortedData = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  const timelineData = sortedData.map(t => ({
    date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Amount: parseFloat(t.amount),
    Type: t.type
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 my-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm xl:col-span-2">
        <h4 className="text-base font-semibold mb-4 dark:text-white">Cash Flow Dynamics</h4>
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="Amount" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorAmt)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
        <h4 className="text-base font-semibold mb-4 dark:text-white">Expense Distribution</h4>
        <div className="h-56 sm:h-72 flex-1 relative">
          {expenseByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseByCategory} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                  {expenseByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">No analytical data compiled</div>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 max-h-24 overflow-y-auto pr-1">
          {expenseByCategory.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="truncate text-slate-600 dark:text-slate-400">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
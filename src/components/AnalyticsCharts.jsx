import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { useDashboard } from '../context/DashboardContext';

// Light mode  → emerald palette for chart segments
const COLORS_LIGHT = ['#10b981', '#34d399', '#059669', '#6ee7b7', '#0d9488', '#14b8a6', '#a7f3d0', '#064e3b'];
// Dark mode   → purple palette for chart segments
const COLORS_DARK  = ['#a855f7', '#c084fc', '#9333ea', '#d8b4fe', '#7c3aed', '#8b5cf6', '#ede9fe', '#4c1d95'];

export default function AnalyticsCharts() {
  const { transactions, darkMode } = useDashboard();

  const COLORS = darkMode ? COLORS_DARK : COLORS_LIGHT;
  // Primary stroke/fill color per theme
  const primaryColor   = darkMode ? '#a855f7' : '#10b981';
  const gradientColor  = darkMode ? '#a855f7' : '#10b981';
  const gradientId     = darkMode ? 'colorAmtDark' : 'colorAmtLight';
  const gridColor      = darkMode ? '#1e1b4b' : '#d1fae5';
  const axisColor      = darkMode ? '#7c3aed' : '#6ee7b7';
  const tooltipBg      = darkMode ? '#1e1b4b' : '#f0fdf4';
  const tooltipBorder  = darkMode ? '#7c3aed' : '#6ee7b7';

  const expenseByCategory = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        const amount = parseFloat(t.amount) || 0;
        const existing = acc.find((item) => item.name === t.category);
        if (existing) existing.value += amount;
        else acc.push({ name: t.category, value: amount });
        return acc;
      }, []);
  }, [transactions]);

  const timelineData = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((t) => ({
        date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        Amount: parseFloat(t.amount) || 0,
        Type: t.type,
      }));
  }, [transactions]);

  const cardClass = 'bg-white dark:bg-slate-900 rounded-2xl border border-emerald-100 dark:border-purple-900/40 shadow-sm';

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 my-4 sm:my-6">
      {/* ── Area chart ── */}
      <div className={`${cardClass} p-4 sm:p-6 xl:col-span-2 transition-all duration-300 hover:shadow-md hover:shadow-emerald-100 dark:hover:shadow-purple-900/20`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-2.5 h-2.5 rounded-full ${darkMode ? 'bg-purple-400' : 'bg-emerald-500'}`} />
          <h4 className="text-base font-semibold text-slate-900 dark:text-white">Cash Flow Dynamics</h4>
        </div>
        <div className="h-64 sm:h-72 min-h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={gradientColor} stopOpacity={darkMode ? 0.25 : 0.18} />
                  <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={gridColor}
              />
              <XAxis
                dataKey="date"
                stroke={axisColor}
                fontSize={11}
                tickLine={false}
                tick={{ fill: darkMode ? '#c084fc' : '#059669' }}
              />
              <YAxis
                stroke={axisColor}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: darkMode ? '#c084fc' : '#059669' }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '14px',
                  border: `1.5px solid ${tooltipBorder}`,
                  background: tooltipBg,
                  boxShadow: `0 4px 20px ${darkMode ? 'rgba(168,85,247,0.15)' : 'rgba(16,185,129,0.12)'}`,
                  color: darkMode ? '#e9d5ff' : '#065f46',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
                cursor={{ stroke: primaryColor, strokeWidth: 1.5, strokeDasharray: '4 2' }}
              />
              <Area
                type="monotone"
                dataKey="Amount"
                stroke={primaryColor}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
                dot={{ r: 4, fill: primaryColor, strokeWidth: 2, stroke: darkMode ? '#1e1b4b' : '#fff' }}
                activeDot={{ r: 6, fill: primaryColor, stroke: darkMode ? '#ede9fe' : '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Pie chart ── */}
      <div className={`${cardClass} p-4 sm:p-6 flex flex-col transition-all duration-300 hover:shadow-md hover:shadow-emerald-100 dark:hover:shadow-purple-900/20`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-2.5 h-2.5 rounded-full ${darkMode ? 'bg-purple-400' : 'bg-emerald-500'}`} />
          <h4 className="text-base font-semibold text-slate-900 dark:text-white">Expense Distribution</h4>
        </div>
        <div className="h-56 sm:h-64 flex-1 relative min-h-[200px]">
          {expenseByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  innerRadius="38%"
                  outerRadius="62%"
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                  isAnimationActive={true}
                >
                  {expenseByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke={darkMode ? '#0f0a1e' : '#fff'}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '14px',
                    border: `1.5px solid ${tooltipBorder}`,
                    background: tooltipBg,
                    boxShadow: `0 4px 20px ${darkMode ? 'rgba(168,85,247,0.15)' : 'rgba(16,185,129,0.12)'}`,
                    color: darkMode ? '#e9d5ff' : '#065f46',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">No data available</div>
          )}
        </div>
        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-3 max-h-24 overflow-y-auto pr-1">
          {expenseByCategory.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-1.5 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="truncate text-slate-600 dark:text-purple-200 font-medium">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import AnalyticsCharts from '../components/AnalyticsCharts';
import FinancialInsights from '../components/FinancialInsights';
import { useDashboard } from '../context/DashboardContext';
import { BarChart3, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const { financials, transactions, darkMode } = useDashboard();

  const categoryTotals = transactions.reduce((acc, tx) => {
    if (!acc[tx.category]) acc[tx.category] = { income: 0, expense: 0 };
    if (tx.type === 'income') acc[tx.category].income += parseFloat(tx.amount || 0);
    else acc[tx.category].expense += parseFloat(tx.amount || 0);
    return acc;
  }, {});

  const topExpenseCategories = Object.entries(categoryTotals)
    .filter(([, v]) => v.expense > 0)
    .sort(([, a], [, b]) => b.expense - a.expense)
    .slice(0, 5);

  const maxExpense = topExpenseCategories[0]?.[1].expense || 1;

  // Themed styles
  const accentColor   = darkMode ? 'text-purple-500' : 'text-emerald-500';
  const accentBg      = darkMode ? 'bg-purple-500/10' : 'bg-emerald-500/10';
  const cardBorder    = darkMode ? 'border-purple-900/40 hover:shadow-purple-900/20' : 'border-emerald-100 hover:shadow-emerald-100';
  const cardClass     = `bg-white dark:bg-slate-900 rounded-2xl border p-4 shadow-sm transition-shadow hover:shadow-md ${cardBorder}`;
  const headerIconBg  = darkMode ? 'bg-purple-500/10' : 'bg-emerald-500/10';
  const headerIconCol = darkMode ? 'text-purple-400' : 'text-emerald-600';

  const stats = [
    { label: 'Savings Rate', value: `${financials.savingsRate?.toFixed(1) ?? 0}%`, icon: Activity, color: accentColor, bg: accentBg },
    { label: 'Total Income', value: `₹${financials.totalIncome.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { label: 'Total Expenses', value: `₹${financials.totalExpenses.toLocaleString()}`, icon: TrendingDown, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/30' },
    { label: 'Transactions', value: transactions.length, icon: BarChart3, color: darkMode ? 'text-purple-400' : 'text-emerald-600', bg: headerIconBg },
  ];

  return (
    <div className="page-shell animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className={`p-3 rounded-2xl ${headerIconBg}`}>
          <BarChart3 className={`w-6 h-6 ${headerIconCol}`} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Deep dive into your financial patterns</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={cardClass}>
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div>
        <AnalyticsCharts />
      </div>

      {/* Top Expense Categories */}
      {topExpenseCategories.length > 0 && (
        <div className={`bg-white dark:bg-slate-900 rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md ${cardBorder}`}>
          <h3 className="font-bold text-slate-900 dark:text-white mb-5 text-lg">Top Expense Categories</h3>
          <div className="space-y-4">
            {topExpenseCategories.map(([cat, vals]) => (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{cat}</span>
                  <span className="text-rose-500 font-bold">₹{vals.expense.toLocaleString()}</span>
                </div>
                <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-700"
                    style={{ width: `${(vals.expense / maxExpense) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <FinancialInsights />
      </div>
    </div>
  );
}

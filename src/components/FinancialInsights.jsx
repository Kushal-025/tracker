import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Sparkles, Calendar, AlertCircle, TrendingUp } from 'lucide-react';

export default function FinancialInsights() {
  const { financials, budgetGoal, darkMode } = useDashboard();
  const budgetUtilization = budgetGoal > 0 ? (financials.totalExpenses / budgetGoal) * 100 : 0;

  const cardBorder = darkMode ? 'border-purple-900/40 hover:shadow-purple-900/20' : 'border-emerald-100 hover:shadow-emerald-100';
  const cardClass  = `bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border shadow-sm transition-shadow hover:shadow-md ${cardBorder}`;
  const iconColor  = darkMode ? 'text-purple-400' : 'text-emerald-600';
  const calIcon    = darkMode ? 'text-purple-400' : 'text-emerald-500';
  const divider    = darkMode ? 'border-purple-900/40' : 'border-emerald-100';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-4 sm:my-6">
      {/* AI Insights */}
      <div className={cardClass}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`} />
          <h4 className="text-base font-semibold text-slate-900 dark:text-white">Financial Intelligence</h4>
        </div>

        {/* Savings rate bar */}
        <div className={`pb-4 mb-4 border-b ${divider}`}>
          <div className="flex justify-between text-xs font-semibold mb-2">
            <span className="text-slate-500 dark:text-slate-400">Savings Rate</span>
            <span className={iconColor}>{financials.savingsRate.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                darkMode
                  ? 'bg-gradient-to-r from-purple-600 to-violet-500'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{ width: `${Math.min(Math.max(financials.savingsRate, 0), 100)}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {budgetUtilization > 85 ? (
            <div className="flex items-start gap-3 p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-xs font-medium rounded-xl border border-rose-100 dark:border-rose-900/30">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>
                ⚠ Budget critical: {budgetUtilization.toFixed(1)}% utilised. Discretionary spending should be reduced immediately.
              </span>
            </div>
          ) : (
            <div className={`flex items-start gap-3 p-3 text-xs font-medium rounded-xl border ${
              darkMode
                ? 'bg-purple-950/20 text-purple-300 border-purple-900/30'
                : 'bg-emerald-50 text-emerald-700 border-emerald-100'
            }`}>
              <TrendingUp className="w-5 h-5 shrink-0 mt-0.5" />
              <span>
                ✓ Capital balanced — your net savings margin is a healthy <strong>{financials.savingsRate.toFixed(1)}%</strong>. Keep it up!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming reminders */}
      <div className={cardClass}>
        <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Upcoming Reminders</h4>
        <div className="space-y-3">
          {[
            { label: 'AWS Cloud Services Renewal', sub: 'Autopay scheduled in 4 days',   amount: '₹120.00' },
            { label: 'Internet Subscription',      sub: 'Autopay scheduled in 8 days',   amount: '₹999.00' },
            { label: 'Gym Membership',             sub: 'Autopay scheduled in 12 days',  amount: '₹599.00' },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center justify-between p-3 rounded-xl text-xs border transition-colors ${
                darkMode
                  ? 'bg-purple-950/20 border-purple-900/30 hover:bg-purple-950/40'
                  : 'bg-emerald-50/60 border-emerald-100 hover:bg-emerald-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className={`w-4 h-4 ${calIcon}`} />
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">{item.label}</p>
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-0.5">{item.sub}</p>
                </div>
              </div>
              <span className={`font-bold ${darkMode ? 'text-purple-300' : 'text-emerald-700'}`}>{item.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
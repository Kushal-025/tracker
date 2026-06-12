import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Sparkles, Calendar, AlertCircle } from 'lucide-react';

export default function FinancialInsights() {
  const { financials, budgetGoal } = useDashboard();
  const budgetUtilization = (financials.totalExpenses / budgetGoal) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h4 className="text-base font-semibold dark:text-white">Al-Driven Optimization Strategy</h4>
        </div>
        <div className="space-y-3">
          {budgetUtilization > 85 ? (
            <div className="flex items-start gap-3 p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-xs font-medium rounded-xl">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>Critical Over-utilization: Total aggregated operational budget matches {budgetUtilization.toFixed(1)}% of your active limit pool. Cool down discretionary costs immediately.</span>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-xl">
              <Sparkles className="w-5 h-5 shrink-0" />
              <span>Capital Structure Balanced: Your financial burn rate indicates stability with a robust net savings margin of {financials.savingsRate.toFixed(1)}%. Keep it up!</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h4 className="text-base font-semibold mb-4 dark:text-white">Upcoming Matrix Reminders</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <div>
                <p className="font-semibold dark:text-white">AWS Cloud Services Renewal</p>
                <p className="text-slate-400 text-[10px]">Autopay execution scheduled in 4 days</p>
              </div>
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300">₹120.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
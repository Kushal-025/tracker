import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import TransactionTable from '../components/TransactionTable';
import TransactionModal from '../components/TransactionModal';
import { CreditCard, TrendingDown, Plus, AlertTriangle } from 'lucide-react';

export default function ExpensesPage() {
  const { financials, transactions, budgetGoal, darkMode } = useDashboard();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  const expenseCount = transactions.filter(t => t.type === 'expense').length;
  const avgExpense = expenseCount > 0 ? financials.totalExpenses / expenseCount : 0;
  const budgetUsed = budgetGoal > 0 ? (financials.totalExpenses / budgetGoal) * 100 : 0;
  const isOverBudget = financials.totalExpenses > budgetGoal;

  // Themed classes
  const headerIconBg  = darkMode ? 'bg-purple-500/10' : 'bg-emerald-500/10';
  const headerIconCol = darkMode ? 'text-purple-400' : 'text-emerald-600';
  const btnClass      = darkMode
    ? 'bg-gradient-to-r from-purple-700 to-violet-600 hover:from-purple-600 hover:to-violet-500 shadow-purple-500/25'
    : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-500/20';
  const cardBorder    = darkMode ? 'border-purple-900/40 hover:shadow-purple-900/20' : 'border-emerald-100 hover:shadow-emerald-100';

  const stats = [
    {
      label: 'Total Expenses',
      value: `₹${financials.totalExpenses.toLocaleString()}`,
      sub: 'All time',
      color: 'from-rose-600 to-pink-500'
    },
    {
      label: 'Transactions',
      value: expenseCount,
      sub: 'Expense entries',
      color: darkMode ? 'from-violet-800 to-purple-700' : 'from-teal-600 to-cyan-500'
    },
    {
      label: 'Average Expense',
      value: `₹${avgExpense.toFixed(0)}`,
      sub: 'Per entry',
      color: darkMode ? 'from-purple-950 to-slate-800' : 'from-slate-700 to-slate-600'
    },
  ];

  return (
    <div className="page-shell animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${headerIconBg}`}>
            <CreditCard className={`w-6 h-6 ${headerIconCol}`} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Expenses</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Track and control your spending</p>
          </div>
        </div>
        <button
          onClick={() => { setEditingTx(null); setIsModalOpen(true); }}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 ${btnClass}`}
        >
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      {/* Budget Alert */}
      {isOverBudget && (
        <div className="flex items-center gap-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 rounded-2xl px-5 py-4 animate-[fadeIn_0.3s_ease-out]">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-bold text-sm">Budget Exceeded!</p>
            <p className="text-xs opacity-80">You've spent ₹{(financials.totalExpenses - budgetGoal).toLocaleString()} over your ₹{budgetGoal.toLocaleString()} budget.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, sub, color }) => (
          <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-lg`}>
            <p className="text-white/70 text-sm font-medium">{label}</p>
            <p className="text-3xl font-extrabold mt-1">{value}</p>
            <p className="text-white/60 text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Budget Progress */}
      <div className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md ${cardBorder}`}>
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-slate-800 dark:text-white text-sm">Budget Utilization</p>
          <span className={`text-sm font-extrabold ${isOverBudget ? 'text-rose-500' : darkMode ? 'text-purple-400' : 'text-emerald-500'}`}>
            {budgetUsed.toFixed(1)}%
          </span>
        </div>
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${isOverBudget ? 'bg-gradient-to-r from-rose-500 to-red-600' : darkMode ? 'bg-gradient-to-r from-purple-500 to-violet-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}
            style={{ width: `${Math.min(budgetUsed, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 font-semibold">
          <span>₹0</span>
          <span>Budget: ₹{budgetGoal.toLocaleString()}</span>
        </div>
      </div>

      {/* Filtered Table */}
      <div>
        <TransactionTable
          onEdit={(tx) => { setEditingTx(tx); setIsModalOpen(true); }}
          filterType="expense"
        />
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeItem={editingTx}
        defaultType="expense"
      />
    </div>
  );
}

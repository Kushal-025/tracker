import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import StatCard from '../components/StatCard';
import AnalyticsCharts from '../components/AnalyticsCharts';
import TransactionTable from '../components/TransactionTable';
import TransactionModal from '../components/TransactionModal';
import FinancialInsights from '../components/FinancialInsights';
import { ArrowUpRight, ArrowDownRight, Wallet, Percent, Plus } from 'lucide-react';

export default function DashboardPage() {
  const { financials, budgetGoal, setCategoryFilter, setTypeFilter, categoryFilter, typeFilter, darkMode } = useDashboard();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const openAddModal = () => { setEditingTransaction(null); setIsModalOpen(true); };
  const openEditModal = (tx) => { setEditingTransaction(tx); setIsModalOpen(true); };
  const budgetUtilization = budgetGoal > 0 ? (financials.totalExpenses / budgetGoal) * 100 : 0;

  const btnClass = darkMode
    ? 'bg-gradient-to-r from-purple-700 to-violet-600 hover:from-purple-600 hover:to-violet-500 shadow-purple-500/25 hover:shadow-purple-500/40'
    : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-500/25 hover:shadow-emerald-500/40';

  const selectClass = darkMode
    ? 'bg-purple-950/30 border border-purple-800/40 text-purple-200 focus:ring-2 focus:ring-purple-500'
    : 'bg-emerald-50 border border-emerald-200/60 text-emerald-800 focus:ring-2 focus:ring-emerald-400';

  const filterBarClass = darkMode
    ? 'bg-slate-900 border border-purple-900/40'
    : 'bg-white border border-emerald-100';

  return (
    <div className="page-shell">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-[fadeIn_0.4s_ease-out]">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Financial Strategy
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-purple-300/70' : 'text-emerald-700/70'}`}>
            Real-time fiscal monitoring, analytics, and budgeting insights.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 self-start sm:self-center ${btnClass}`}
        >
          <Plus className="w-4 h-4" /> Log Transaction
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Liquidity Balance"
          amount={financials.totalBalance}
          icon={Wallet}
          gradient={darkMode ? 'from-purple-950 to-violet-900' : 'from-emerald-700 to-teal-600'}
          subtitle="Aggregated liquid cash flow"
        />
        <StatCard
          title="Income Runway"
          amount={financials.totalIncome}
          icon={ArrowUpRight}
          gradient={darkMode ? 'from-violet-600 to-purple-500' : 'from-emerald-500 to-teal-400'}
          subtitle="Inflow streams mapped"
        />
        <StatCard
          title="Aggregate Outflow"
          amount={financials.totalExpenses}
          icon={ArrowDownRight}
          gradient="from-rose-600 to-pink-500"
          subtitle="Discretionary & structural expenses"
        />
        <StatCard
          title="Budget Allocation"
          amount={budgetGoal}
          icon={Percent}
          gradient={darkMode ? 'from-fuchsia-700 to-purple-600' : 'from-teal-600 to-cyan-500'}
          subtitle={`Utilization: ${budgetUtilization.toFixed(1)}%`}
        />
      </div>

      {/* Charts */}
      <div className="opacity-0 animate-[fadeIn_0.5s_ease-out_0.2s_forwards]">
        <AnalyticsCharts />
      </div>

      <FinancialInsights />

      {/* Filters */}
      <div className={`flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 p-4 rounded-2xl shadow-sm ${filterBarClass}`}>
        <div className={`text-xs font-bold uppercase tracking-wider pl-1 ${darkMode ? 'text-purple-400' : 'text-emerald-600'}`}>
          Quick Filters:
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={`text-xs font-bold rounded-xl px-4 py-2 transition-all cursor-pointer outline-none ${selectClass}`}
        >
          <option value="All">All Types</option>
          <option value="income">Incomes Only</option>
          <option value="expense">Expenses Only</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={`text-xs font-bold rounded-xl px-4 py-2 transition-all cursor-pointer outline-none ${selectClass}`}
        >
          <option value="All">All Categories</option>
          {['Salary','Freelance','Food','Travel','Shopping','Entertainment','Bills','Healthcare','Education','Others'].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Transaction Table */}
      <div className="opacity-0 animate-[fadeIn_0.5s_ease-out_0.4s_forwards]">
        <TransactionTable onEdit={openEditModal} />
      </div>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} activeItem={editingTransaction} />
    </div>
  );
}

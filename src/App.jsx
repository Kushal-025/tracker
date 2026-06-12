import React, { useState } from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import StatCard from './components/StatCard';
import AnalyticsCharts from './components/AnalyticsCharts';
import TransactionTable from './components/TransactionTable';
import TransactionModal from './components/TransactionModal';
import FinancialInsights from './components/FinancialInsights';
import { ArrowUpRight, ArrowDownRight, Wallet, Percent, Plus } from 'lucide-react';

function DashboardContent() {
  const { financials, budgetGoal, setCategoryFilter, setTypeFilter, categoryFilter, typeFilter } = useDashboard();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const openAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const openEditModal = (tx) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const budgetUtilization = (financials.totalExpenses / budgetGoal) * 100;

  return (
    <>
      {/* items-stretch se sidebar aur content area ek dusre ke relative expand honge */}
      <div className="flex items-stretch min-h-screen w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500 ease-in-out">
      
      {/* 100% Relative Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        
        <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 max-w-[1600px] w-full mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-[fadeIn_0.4s_ease-out]">
            <div className="min-w-0">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Financial Strategy
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Real-time fiscal monitoring, analytics, and budgeting insights.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 self-start sm:self-center"
            >
              <Plus className="w-4 h-4" /> Log Transaction
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Liquidity Balance" amount={financials.totalBalance} icon={Wallet} gradient="from-slate-900 to-slate-800 dark:from-slate-900 dark:to-indigo-950" subtitle="Aggregated liquid cash flow" />
            <StatCard title="Income Runway" amount={financials.totalIncome} icon={ArrowUpRight} gradient="from-emerald-600 to-teal-500" subtitle="Inflow streams mapped" />
            <StatCard title="Aggregate Outflow" amount={financials.totalExpenses} icon={ArrowDownRight} gradient="from-rose-600 to-pink-500" subtitle="Discretionary & structural expenses" />
            <StatCard title="Budget Allocation" amount={budgetGoal} icon={Percent} gradient="from-violet-600 to-indigo-500" subtitle={`Utilization index: ${budgetUtilization.toFixed(1)}%`} />
          </div>

          {/* Charts */}
          <div className="opacity-0 animate-[fadeIn_0.5s_ease-out_0.2s_forwards]">
            <AnalyticsCharts />
          </div>
          
          <FinancialInsights />

          {/* Filters */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Quick Filters:</div>
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border-none text-xs font-bold rounded-xl px-4 py-2 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="income">Incomes Only</option>
              <option value="expense">Expenses Only</option>
            </select>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border-none text-xs font-bold rounded-xl px-4 py-2 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="All">All Categories</option>
              {['Salary', 'Freelance', 'Food', 'Travel', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Others'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="opacity-0 animate-[fadeIn_0.5s_ease-out_0.4s_forwards]">
            <TransactionTable onEdit={openEditModal} />
          </div>
        </main>

        <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} activeItem={editingTransaction} />
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import TransactionTable from '../components/TransactionTable';
import TransactionModal from '../components/TransactionModal';
import { Wallet, TrendingUp, Plus } from 'lucide-react';

export default function IncomesPage() {
  const { financials, transactions, darkMode } = useDashboard();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  const incomeCount = transactions.filter(t => t.type === 'income').length;
  const avgIncome = incomeCount > 0 ? financials.totalIncome / incomeCount : 0;

  // Themed classes
  const headerIconBg  = darkMode ? 'bg-purple-500/10' : 'bg-emerald-500/10';
  const headerIconCol = darkMode ? 'text-purple-400' : 'text-emerald-600';
  const btnClass      = darkMode
    ? 'bg-gradient-to-r from-purple-700 to-violet-600 hover:from-purple-600 hover:to-violet-500 shadow-purple-500/25'
    : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-500/20';

  const stats = [
    {
      label: 'Total Income',
      value: `₹${financials.totalIncome.toLocaleString()}`,
      sub: 'All time',
      color: darkMode ? 'from-purple-700 to-violet-600' : 'from-emerald-600 to-teal-500'
    },
    {
      label: 'Income Sources',
      value: incomeCount,
      sub: 'Transactions',
      color: darkMode ? 'from-violet-800 to-purple-700' : 'from-teal-600 to-cyan-500'
    },
    {
      label: 'Average Income',
      value: `₹${avgIncome.toFixed(0)}`,
      sub: 'Per entry',
      color: darkMode ? 'from-fuchsia-700 to-purple-600' : 'from-emerald-700 to-teal-600'
    },
  ];

  return (
    <div className="page-shell animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${headerIconBg}`}>
            <Wallet className={`w-6 h-6 ${headerIconCol}`} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Incomes</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">All your income streams in one place</p>
          </div>
        </div>
        <button
          onClick={() => { setEditingTx(null); setIsModalOpen(true); }}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 ${btnClass}`}
        >
          <Plus className="w-4 h-4" /> Add Income
        </button>
      </div>

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

      {/* Filtered Table */}
      <div>
        <TransactionTable
          onEdit={(tx) => { setEditingTx(tx); setIsModalOpen(true); }}
          filterType="income"
        />
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeItem={editingTx}
        defaultType="income"
      />
    </div>
  );
}

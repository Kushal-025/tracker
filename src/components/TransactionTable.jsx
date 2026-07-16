import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { ArrowUpDown, Download, Edit3, Trash2 } from 'lucide-react';

export default function TransactionTable({ onEdit, filterType }) {
  const { transactions, deleteTransaction, searchQuery, categoryFilter, typeFilter, darkMode } = useDashboard();
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const categories = ['All', 'Salary', 'Freelance', 'Food', 'Travel', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Others'];

  // Advanced pipeline sorting and parsing filtering configurations
  const filteredTransactions = transactions
    .filter(tx => {
      const matchSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter === 'All' || tx.category === categoryFilter;
      // If a filterType prop is provided (e.g., from IncomesPage), use it; otherwise use the context filter
      const effectiveTypeFilter = filterType || typeFilter;
      const matchType = effectiveTypeFilter === 'All' || tx.type === effectiveTypeFilter;
      return matchSearch && matchCategory && matchType;
    })
    .sort((a, b) => {
      let multiplier = sortOrder === 'asc' ? 1 : -1;
      if (sortField === 'amount') return (parseFloat(a.amount) - parseFloat(b.amount)) * multiplier;
      return (new Date(a.date) - new Date(b.date)) * multiplier;
    });

  const toggleSort = (field) => {
    setSortOrder(prev => (sortField === field && prev === 'desc' ? 'asc' : 'desc'));
    setSortField(field);
  };

  // Automated extraction parser utility tracking matrix entries
  const exportToCSV = () => {
    const header = ['ID,Type,Category,Description,Amount,Date,Status\n'];
    const rows = filteredTransactions.map(t => `${t.id},${t.type},${t.category},"${t.description.replace(/"/g, '""')}",${t.amount},${t.date},${t.status}\n`);
    const blob = new Blob([header.concat(rows).join('')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `AuraFinance_Statement_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tableCard  = `bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden border ${darkMode ? 'border-purple-900/40' : 'border-emerald-100'}`;
  const headerRow   = `p-6 border-b flex flex-wrap items-center justify-between gap-4 ${darkMode ? 'border-purple-900/40' : 'border-emerald-100'}`;
  const exportBtn   = `flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-colors border ${darkMode ? 'border-purple-800/40 text-purple-300 hover:bg-purple-900/30' : 'border-emerald-200/60 text-emerald-700 hover:bg-emerald-50'}`;
  const thSort      = `flex items-center gap-1 cursor-pointer select-none hover:${darkMode ? 'text-purple-300' : 'text-emerald-600'} transition-colors`;

  return (
    <div className={`${tableCard} overflow-hidden`}>
      <div className={`${headerRow} flex-col sm:flex-row`}>
        <h4 className={`text-base font-semibold ${darkMode ? 'text-purple-100' : 'text-slate-900'}`}>Transaction History</h4>
        <div className="flex w-full sm:w-auto flex-wrap items-center gap-3">
          <button onClick={exportToCSV} className={`${exportBtn} w-full justify-center sm:w-auto`}>
            <Download className="w-3.5 h-3.5" /> Export Statement
          </button>
        </div>
      </div>

      {/* Desktop Spreadsheet Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[11px] tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4 cursor-pointer" onClick={() => toggleSort('date')}>
                <span className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></span>
              </th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 cursor-pointer" onClick={() => toggleSort('amount')}>
                <span className="flex items-center gap-1">Amount <ArrowUpDown className="w-3 h-3" /></span>
              </th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-medium whitespace-nowrap text-slate-900 dark:text-white">{tx.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${tx.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'}`}>
                    {tx.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300 max-w-50 truncate">{tx.description}</td>
                <td className={`px-6 py-4 font-semibold whitespace-nowrap text-base ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}₹{parseFloat(tx.amount).toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                    {tx.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onEdit(tx)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteTransaction(tx.id)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card-List View */}
      <div className="block md:hidden p-4 space-y-3">
        {filteredTransactions.map((tx) => (
          <div key={tx.id} className="bg-slate-50/50 dark:bg-slate-800/20 border border-slate-150 dark:border-slate-800 rounded-2xl p-4 space-y-3 transition-all hover:-translate-y-0.5 duration-350 hover:shadow-sm">
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">{tx.date}</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1 text-sm break-words">{tx.description}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                {tx.category}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-3 border-t border-slate-150 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-base font-extrabold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}₹{parseFloat(tx.amount).toFixed(2)}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {tx.status}
                </span>
              </div>
              
              <div className="flex gap-1.5">
                <button onClick={() => onEdit(tx)} className="p-2 hover:bg-slate-150 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="Edit transaction">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => deleteTransaction(tx.id)} className="p-2 hover:bg-slate-150 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors" aria-label="Delete transaction">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="p-8 text-center text-slate-400 text-sm">No transaction records match your active search filters.</div>
      )}
    </div>
  );
}
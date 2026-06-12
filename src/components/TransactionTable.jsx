import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { ArrowUpDown, Download, Edit3, Trash2 } from 'lucide-react';

export default function TransactionTable({ onEdit }) {
  const { transactions, deleteTransaction, searchQuery, categoryFilter, typeFilter } = useDashboard();
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const categories = ['All', 'Salary', 'Freelance', 'Food', 'Travel', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Others'];

  // Advanced pipeline sorting and parsing filtering configurations
  const filteredTransactions = transactions
    .filter(tx => {
      const matchSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tx.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter === 'All' || tx.category === categoryFilter;
      const matchType = typeFilter === 'All' || tx.type === typeFilter;
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

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <h4 className="text-base font-semibold dark:text-white">Transaction History</h4>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={exportToCSV} className="flex items-center gap-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export Statement
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
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
        {filteredTransactions.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-sm">No transaction execution records match your active criteria parameters.</div>
        )}
      </div>
    </div>
  );
}
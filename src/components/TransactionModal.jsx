import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { X } from 'lucide-react';

export default function TransactionModal({ isOpen, onClose, activeItem }) {
  const { addTransaction, editTransaction } = useDashboard();
  const [form, setForm] = useState({ type: 'expense', category: 'Food', description: '', amount: '', date: '', status: 'Completed' });

  const categories = {
    income: ['Salary', 'Freelance', 'Investments', 'Others'],
    expense: ['Food', 'Travel', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Others']
  };

  useEffect(() => {
    if (activeItem) setForm(activeItem);
    else setForm({ type: 'expense', category: 'Food', description: '', amount: '', date: new Date().toISOString().split('T')[0], status: 'Completed' });
  }, [activeItem, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.date) return;
    if (activeItem) editTransaction(form);
    else addTransaction(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 relative shadow-2xl transition-transform duration-300">
        <button onClick={onClose} className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold dark:text-white mb-4">{activeItem ? 'Update Ledger Entry' : 'Log New Transaction'}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Transaction Pipeline Type</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button type="button" onClick={() => setForm({ ...form, type: 'expense', category: 'Food' })} className={`py-2 text-sm font-semibold rounded-lg transition-all ${form.type === 'expense' ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-slate-500'}`}>Expense</button>
              <button type="button" onClick={() => setForm({ ...form, type: 'income', category: 'Salary' })} className={`py-2 text-sm font-semibold rounded-lg transition-all ${form.type === 'income' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500'}`}>Income</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                {categories[form.type].map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Amount (₹)</label>
              <input type="number" required step="any" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" placeholder="0.00" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Timestamp Matrix</label>
            <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Description Context</label>
            <input type="text" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" placeholder="Merchant name or ledger notes..." />
          </div>

          <button type="submit" className="w-full py-3 mt-2 font-bold text-sm text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-500/20 transition-all">
            {activeItem ? 'Commit Pipeline Execution' : 'Deploy Ledger Entry'}
          </button>
        </form>
      </div>
    </div>
  );
}
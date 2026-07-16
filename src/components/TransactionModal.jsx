import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { X } from 'lucide-react';

export default function TransactionModal({ isOpen, onClose, activeItem, defaultType }) {
  const { addTransaction, editTransaction, darkMode } = useDashboard();
  const initialType = defaultType || 'expense';
  const [form, setForm] = useState({ type: initialType, category: 'Food', description: '', amount: '', date: '', status: 'Completed' });

  const categories = {
    income:  ['Salary', 'Freelance', 'Investments', 'Others'],
    expense: ['Food', 'Travel', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Others'],
  };

  useEffect(() => {
    if (activeItem) setForm(activeItem);
    else setForm({
      type: initialType,
      category: initialType === 'income' ? 'Salary' : 'Food',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
    });
  }, [activeItem, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.date) return;
    if (activeItem) editTransaction(form);
    else addTransaction(form);
    onClose();
  };

  if (!isOpen) return null;

  // Theme-aware classes
  const modalBg       = darkMode ? 'bg-slate-900 border-purple-800/40' : 'bg-white border-emerald-100';
  const labelClass    = 'block text-xs font-semibold uppercase tracking-wider mb-1.5 ' + (darkMode ? 'text-purple-300/70' : 'text-emerald-700/70');
  const inputClass    = 'w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all ' +
    (darkMode
      ? 'bg-purple-950/30 border border-purple-800/40 text-white placeholder-purple-400/50 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500'
      : 'bg-emerald-50/60 border border-emerald-200/60 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400');
  const submitClass   = 'w-full py-3 mt-2 font-bold text-sm text-white rounded-xl shadow-lg transition-all ' +
    (darkMode
      ? 'bg-gradient-to-r from-purple-700 to-violet-600 hover:from-purple-600 hover:to-violet-500 shadow-purple-500/25'
      : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-500/20');

  // Type pill active styles
  const expenseActive = darkMode
    ? 'bg-purple-900/60 text-rose-300 shadow-sm border border-rose-800/40'
    : 'bg-white text-rose-600 shadow-sm border border-rose-200/60';
  const incomeActive = darkMode
    ? 'bg-purple-900/60 text-emerald-300 shadow-sm border border-emerald-800/40'
    : 'bg-white text-emerald-600 shadow-sm border border-emerald-200/60';
  const typeBarBg = darkMode ? 'bg-purple-950/40 border border-purple-800/30' : 'bg-emerald-50/80 border border-emerald-200/40';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl border p-6 relative shadow-2xl transition-all duration-300 ${modalBg}`}>
        {/* Close */}
        <button
          onClick={onClose}
          className={`absolute right-4 top-4 p-1.5 rounded-full transition-colors
            ${darkMode ? 'hover:bg-purple-900/40 text-purple-300 hover:text-purple-100' : 'hover:bg-emerald-50 text-slate-400 hover:text-emerald-700'}`}
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className={`text-lg font-bold mb-5 ${darkMode ? 'text-purple-100' : 'text-slate-900'}`}>
          {activeItem ? 'Update Transaction' : 'Log New Transaction'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type selector */}
          <div>
            <label className={labelClass}>Transaction Type</label>
            <div className={`grid grid-cols-2 gap-2 p-1 rounded-xl ${typeBarBg}`}>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'expense', category: 'Food' })}
                className={`py-2.5 text-sm font-bold rounded-lg transition-all ${form.type === 'expense' ? expenseActive : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'income', category: 'Salary' })}
                className={`py-2.5 text-sm font-bold rounded-lg transition-all ${form.type === 'income' ? incomeActive : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Category + Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              >
                {categories[form.type].map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Amount (₹)</label>
              <input
                type="number"
                required
                step="any"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className={inputClass}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className={labelClass}>Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <input
              type="text"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass}
              placeholder="e.g. Grocery run, salary, Netflix..."
            />
          </div>

          <button type="submit" className={submitClass}>
            {activeItem ? '✓ Update Transaction' : '+ Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}
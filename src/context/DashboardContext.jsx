import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const DashboardContext = createContext();

const initialTransactions = [
  { id: '1', type: 'income', category: 'Salary', description: 'Monthly Tech Salary', amount: 5000, date: '2026-06-01', status: 'Completed' },
  { id: '2', type: 'expense', category: 'Food', description: 'Groceries Swiggy', amount: 150, date: '2026-06-03', status: 'Completed' },
  { id: '3', type: 'expense', category: 'Bills', description: 'Electricity Bill', amount: 200, date: '2026-06-04', status: 'Completed' },
  { id: '4', type: 'expense', category: 'Entertainment', description: 'Netflix Subscription', amount: 15, date: '2026-06-05', status: 'Completed' },
  { id: '5', type: 'income', category: 'Freelance', description: 'Frontend Consulting', amount: 1200, date: '2026-06-08', status: 'Completed' },
];

export function DashboardProvider({ children }) {
  const [transactions, setTransactions] = useLocalStorage('fintech_txs', initialTransactions);
  const [darkMode, setDarkMode] = useLocalStorage('fintech_dark', false);
  const [budgetGoal, setBudgetGoal] = useLocalStorage('fintech_budget', 2000);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // CRUD Implementations
  const addTransaction = (tx) => {
    setTransactions(prev => [{ ...tx, id: Date.now().toString() }, ...prev]);
  };

  const editTransaction = (updatedTx) => {
    setTransactions(prev => prev.map(tx => tx.id === updatedTx.id ? updatedTx : tx));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  // Financial Calculators
  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

  const totalExpenses = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

  const totalBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return (
    <DashboardContext.Provider value={{
      transactions, addTransaction, editTransaction, deleteTransaction,
      darkMode, setDarkMode,
      budgetGoal, setBudgetGoal,
      searchQuery, setSearchQuery,
      categoryFilter, setCategoryFilter,
      typeFilter, setTypeFilter,
      financials: { totalBalance, totalIncome, totalExpenses, savingsRate }
    }}>
      <div className={darkMode ? 'dark text-slate-100' : 'text-slate-800'}>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          {children}
        </div>
      </div>
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => useContext(DashboardContext);
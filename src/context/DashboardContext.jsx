import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [transactions, setTransactions] = useState([]);
  const [darkMode, setDarkModeState] = useState(false);
  const [budgetGoal, setBudgetGoalState] = useState(2000);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [usingServer, setUsingServer] = useState(false);

  const API_URL = 'http://localhost:5000/api';

  // Load settings & transactions on mount
  useEffect(() => {
    async function loadData() {
      try {
        console.log('Connecting to backend Express + SQLite database...');
        const txResponse = await fetch(`${API_URL}/transactions`);
        if (!txResponse.ok) throw new Error('Failed to fetch transactions');
        const txData = await txResponse.json();

        const settingsResponse = await fetch(`${API_URL}/settings`);
        if (!settingsResponse.ok) throw new Error('Failed to fetch settings');
        const settingsData = await settingsResponse.json();

        setTransactions(txData);
        if (settingsData.dark_mode !== undefined) {
          setDarkModeState(settingsData.dark_mode === 'true');
        }
        if (settingsData.budget_goal !== undefined) {
          setBudgetGoalState(parseInt(settingsData.budget_goal) || 2000);
        }
        setUsingServer(true);
        console.log('Successfully connected to SQLite database backend.');
      } catch (err) {
        console.warn('Backend SQLite server unreachable. Falling back to LocalStorage:', err.message);
        setUsingServer(false);
        
        // Fallback to LocalStorage
        try {
          const localTxs = localStorage.getItem('fintech_txs');
          if (localTxs) {
            setTransactions(JSON.parse(localTxs));
          } else {
            setTransactions(initialTransactions);
            localStorage.setItem('fintech_txs', JSON.stringify(initialTransactions));
          }

          const localDark = localStorage.getItem('fintech_dark');
          if (localDark) {
            setDarkModeState(JSON.parse(localDark));
          }

          const localBudget = localStorage.getItem('fintech_budget');
          if (localBudget) {
            setBudgetGoalState(JSON.parse(localBudget));
          }
        } catch (storageErr) {
          console.error('LocalStorage read error:', storageErr);
          setTransactions(initialTransactions);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // CRUD API & Local Fallback Methods

  const addTransaction = async (tx) => {
    if (usingServer) {
      try {
        const response = await fetch(`${API_URL}/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tx)
        });
        if (response.ok) {
          const newTx = await response.json();
          setTransactions(prev => [newTx, ...prev]);
          return;
        }
      } catch (err) {
        console.error('Server connection lost during transaction logging. Syncing locally.', err);
      }
    }

    // Local Fallback
    const newTx = { ...tx, id: Date.now().toString() };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    localStorage.setItem('fintech_txs', JSON.stringify(updated));
  };

  const editTransaction = async (updatedTx) => {
    if (usingServer) {
      try {
        const response = await fetch(`${API_URL}/transactions/${updatedTx.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTx)
        });
        if (response.ok) {
          const resultTx = await response.json();
          setTransactions(prev => prev.map(tx => tx.id === resultTx.id ? resultTx : tx));
          return;
        }
      } catch (err) {
        console.error('Server connection lost during transaction edit. Syncing locally.', err);
      }
    }

    // Local Fallback
    const updated = transactions.map(tx => tx.id === updatedTx.id ? updatedTx : tx);
    setTransactions(updated);
    localStorage.setItem('fintech_txs', JSON.stringify(updated));
  };

  const deleteTransaction = async (id) => {
    if (usingServer) {
      try {
        const response = await fetch(`${API_URL}/transactions/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setTransactions(prev => prev.filter(tx => tx.id !== id));
          return;
        }
      } catch (err) {
        console.error('Server connection lost during transaction deletion. Syncing locally.', err);
      }
    }

    // Local Fallback
    const updated = transactions.filter(tx => tx.id !== id);
    setTransactions(updated);
    localStorage.setItem('fintech_txs', JSON.stringify(updated));
  };

  const setBudgetGoal = async (val) => {
    setBudgetGoalState(val);
    if (usingServer) {
      try {
        await fetch(`${API_URL}/settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'budget_goal', value: val })
        });
      } catch (err) {
        console.error('Server error setting budget:', err);
      }
    }
    localStorage.setItem('fintech_budget', JSON.stringify(val));
  };

  const setDarkMode = async (val) => {
    setDarkModeState(val);
    if (usingServer) {
      try {
        await fetch(`${API_URL}/settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'dark_mode', value: val })
        });
      } catch (err) {
        console.error('Server error setting theme mode:', err);
      }
    }
    localStorage.setItem('fintech_dark', JSON.stringify(val));
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

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-white gap-4 font-sans">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin"></div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-lg font-bold text-slate-100 tracking-wider">Syncing Database</h2>
          <p className="text-xs text-slate-400">Establishing secure link with local SQLite storage...</p>
        </div>
      </div>
    );
  }

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
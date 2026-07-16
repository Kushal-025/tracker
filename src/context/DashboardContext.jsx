import React, { createContext, useContext, useState, useEffect } from 'react';

const DashboardContext = createContext();

const API_URL = 'http://localhost:5001/api/v1';

function getToken() {
  return localStorage.getItem('et_token');
}

function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

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

  // Load settings & transactions on mount
  useEffect(() => {
    async function loadData() {
      try {
        const token = getToken();
        if (!token) {
          // No token – load from localStorage
          throw new Error('No auth token');
        }

        const [txResponse, settingsResponse] = await Promise.all([
          fetch(`${API_URL}/transactions`, { headers: authHeaders() }),
          fetch(`${API_URL}/settings`, { headers: authHeaders() }),
        ]);

        if (!txResponse.ok) throw new Error('Failed to fetch transactions');
        if (!settingsResponse.ok) throw new Error('Failed to fetch settings');

        const txData = await txResponse.json();
        const settingsData = await settingsResponse.json();

        setTransactions(txData);
        if (settingsData.dark_mode !== undefined) {
          setDarkModeState(settingsData.dark_mode === 'true');
        }
        if (settingsData.budget_goal !== undefined) {
          setBudgetGoalState(parseFloat(settingsData.budget_goal) || 2000);
        }
        setUsingServer(true);
      } catch (err) {
        console.warn('Backend unreachable or not authenticated. Using localStorage fallback:', err.message);
        setUsingServer(false);

        try {
          const localTxs = localStorage.getItem('fintech_txs');
          setTransactions(localTxs ? JSON.parse(localTxs) : initialTransactions);
          if (!localTxs) localStorage.setItem('fintech_txs', JSON.stringify(initialTransactions));

          const localDark = localStorage.getItem('fintech_dark');
          if (localDark) setDarkModeState(JSON.parse(localDark));

          const localBudget = localStorage.getItem('fintech_budget');
          if (localBudget) setBudgetGoalState(JSON.parse(localBudget));
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

  // Re-fetch when token changes (i.e., after login)
  useEffect(() => {
    const handler = () => {
      const token = getToken();
      if (token && !usingServer) {
        setIsLoading(true);
        fetch(`${API_URL}/transactions`, { headers: authHeaders() })
          .then(r => r.ok ? r.json() : Promise.reject('fetch failed'))
          .then(data => {
            setTransactions(data);
            setUsingServer(true);
            setIsLoading(false);
          })
          .catch(() => setIsLoading(false));
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [usingServer]);

  // CRUD Methods
  const addTransaction = async (tx) => {
    if (usingServer) {
      try {
        const response = await fetch(`${API_URL}/transactions`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(tx)
        });
        if (response.ok) {
          const newTx = await response.json();
          setTransactions(prev => [newTx, ...prev]);
          return;
        }
      } catch (err) {
        console.error('Add transaction failed:', err);
      }
    }
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
          headers: authHeaders(),
          body: JSON.stringify(updatedTx)
        });
        if (response.ok) {
          const resultTx = await response.json();
          setTransactions(prev => prev.map(tx => tx.id === resultTx.id ? resultTx : tx));
          return;
        }
      } catch (err) {
        console.error('Edit transaction failed:', err);
      }
    }
    const updated = transactions.map(tx => tx.id === updatedTx.id ? updatedTx : tx);
    setTransactions(updated);
    localStorage.setItem('fintech_txs', JSON.stringify(updated));
  };

  const deleteTransaction = async (id) => {
    if (usingServer) {
      try {
        const response = await fetch(`${API_URL}/transactions/${id}`, {
          method: 'DELETE',
          headers: authHeaders()
        });
        if (response.ok) {
          setTransactions(prev => prev.filter(tx => tx.id !== id));
          return;
        }
      } catch (err) {
        console.error('Delete transaction failed:', err);
      }
    }
    const updated = transactions.filter(tx => tx.id !== id);
    setTransactions(updated);
    localStorage.setItem('fintech_txs', JSON.stringify(updated));
  };

  const setBudgetGoal = async (val) => {
    setBudgetGoalState(val);
    localStorage.setItem('fintech_budget', JSON.stringify(val));
    if (usingServer) {
      try {
        await fetch(`${API_URL}/settings`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ key: 'budget_goal', value: val })
        });
      } catch (err) {
        console.error('Server error setting budget:', err);
      }
    }
  };

  const setDarkMode = async (val) => {
    setDarkModeState(val);
    localStorage.setItem('fintech_dark', JSON.stringify(val));
    if (usingServer) {
      try {
        await fetch(`${API_URL}/settings`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ key: 'dark_mode', value: val })
        });
      } catch (err) {
        console.error('Server error setting theme:', err);
      }
    }
  };

  // Financial calculations
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
          <h2 className="text-lg font-bold text-slate-100 tracking-wider">Loading Dashboard</h2>
          <p className="text-xs text-slate-400">Fetching your financial data...</p>
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
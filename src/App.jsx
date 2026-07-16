import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import IncomesPage from './pages/IncomesPage';
import ExpensesPage from './pages/ExpensesPage';
import SettingsPage from './pages/SettingsPage';

// Protected layout – wraps all authenticated pages
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DashboardProvider>
      <div className="flex items-stretch min-h-screen w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500 ease-in-out relative">
        <div className="aurora" />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 relative z-10 overflow-x-hidden">
          <Navbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
          <main className="page-wrapper pb-8 sm:pb-10">
            <Outlet />
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}

// Auth guard – redirect to /login if not authenticated
function RequireAuth() {
  const { token, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-white gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin" />
        </div>
        <p className="text-slate-400 text-sm">Initializing...</p>
      </div>
    );
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

// Redirect logged-in users away from /login
function GuestOnly() {
  const { token, isAuthLoading } = useAuth();
  if (isAuthLoading) return null;
  return token ? <Navigate to="/" replace /> : <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Guest-only routes */}
          <Route element={<GuestOnly />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Protected routes */}
          <Route element={<RequireAuth />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/incomes" element={<IncomesPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
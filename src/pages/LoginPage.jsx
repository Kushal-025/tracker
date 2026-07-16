import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (tab === 'login') {
        await login(form.email, form.password);
      } else {
        if (!form.name.trim()) { setError('Full name is required'); setIsLoading(false); return; }
        await register(form.name, form.email, form.password);
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 relative overflow-hidden">
      {/* Animated background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[80px]" />
      </div>

      {/* Left Panel – Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col items-center justify-center px-16 relative">
        <div className="max-w-lg">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-indigo-600/20 rounded-2xl border border-indigo-500/30">
              <TrendingUp className="w-8 h-8 text-indigo-400" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Expense Tracker
            </span>
          </div>

          <h1 className="text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-6">
            Take control of your{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              finances
            </span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed mb-12">
            Track spending, monitor budgets, and get deep insights into your financial health — all in one beautiful dashboard.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3">
            {['Real-time Analytics', 'Budget Alerts', 'Category Insights', 'Dark Mode', 'Secure & Private'].map(f => (
              <span key={f} className="px-4 py-2 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-300 text-sm font-medium">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel – Auth Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <div className="p-2.5 bg-indigo-600/20 rounded-xl border border-indigo-500/30">
              <TrendingUp className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Expense Tracker
            </span>
          </div>

          {/* Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-black/50">
            {/* Tab Switcher */}
            <div className="flex bg-slate-800/60 rounded-2xl p-1 mb-8 gap-1">
              {[{ id: 'login', label: 'Sign In' }, { id: 'register', label: 'Create Account' }].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => { setTab(id); setError(''); setForm({ name: '', email: '', password: '' }); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    tab === id
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/25'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                {tab === 'login' ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {tab === 'login'
                  ? 'Sign in to access your financial dashboard'
                  : 'Start your financial journey today'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl px-4 py-3 mb-5 text-sm animate-[fadeIn_0.3s_ease-out]">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field (register only) */}
              {tab === 'register' && (
                <div className="space-y-1.5 animate-[fadeIn_0.3s_ease-out]">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Rohit Kumar"
                      required
                      className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/60 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/60 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={tab === 'register' ? 'Min. 6 characters' : '••••••••'}
                    required
                    minLength={6}
                    className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-11 pr-12 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/60 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 mt-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {tab === 'login' ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    {tab === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Switch tab link */}
            <p className="text-center text-sm text-slate-500 mt-6">
              {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError(''); setForm({ name: '', email: '', password: '' }); }}
                className="text-emerald-600 hover:text-emerald-500 font-semibold transition-colors"
              >
                {tab === 'login' ? 'Sign up free' : 'Sign in'}
              </button>
            </p>
          </div>

          <p className="text-center text-xs text-slate-600 mt-6">
            Your data is stored locally and never shared with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';

import { useApp } from '../context/AppContext';
import { Plus, X, Apple, Coffee, Sun, Moon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const mealTypes = [
  { value: 'breakfast', label: 'Breakfast', icon: Coffee, color: 'text-yellow-400' },
  { value: 'lunch', label: 'Lunch', icon: Sun, color: 'text-orange-400' },
  { value: 'dinner', label: 'Dinner', icon: Moon, color: 'text-indigo-400' },
  { value: 'snack', label: 'Snack', icon: Apple, color: 'text-emerald-400' },
];

const MACRO_COLORS = { protein: '#7c3aed', carbs: '#f97316', fat: '#06b6d4' };

function MacroBar({ label, value, max, color }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="font-medium text-white">{value}g <span className="text-slate-500">/ {max}g</span></span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color }} />
      </div>
    </div>
  );
}

function AddMealModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', type: 'breakfast', calories: '', protein: '', carbs: '', fat: '', time: new Date().toTimeString().slice(0, 5) });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.calories) return;
    onAdd({ ...form, calories: Number(form.calories), protein: Number(form.protein || 0), carbs: Number(form.carbs || 0), fat: Number(form.fat || 0) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="glass rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 w-full sm:max-w-md border border-white/10 shadow-2xl shadow-orange-500/10 max-h-[90vh] overflow-y-auto">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Log Meal</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Food Name *</label>
            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Grilled Chicken" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-orange-500/50 transition-all" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Meal Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-all">
                {mealTypes.map(t => <option key={t.value} value={t.value} className="bg-slate-800">{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Time</label>
              <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-all" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Calories *</label>
            <input type="number" value={form.calories} onChange={e => setForm(p => ({ ...p, calories: e.target.value }))}
              placeholder="350" min="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-orange-500/50 transition-all" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['protein', 'carbs', 'fat'].map(m => (
              <div key={m}>
                <label className="text-xs text-slate-400 block mb-1.5 capitalize">{m} (g)</label>
                <input type="number" value={form[m]} onChange={e => setForm(p => ({ ...p, [m]: e.target.value }))}
                  placeholder="0" min="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-orange-500/50 transition-all" />
              </div>
            ))}
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:from-orange-400 hover:to-pink-400 transition-all shadow-lg shadow-orange-500/30 cursor-pointer">
            Log Meal
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Nutrition() {
  const { meals, addMeal } = useApp();
  const [showModal, setShowModal] = useState(false);

  const todayMeals = meals.filter(m => m.date === new Date().toDateString());
  const totalCals = todayMeals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = todayMeals.reduce((s, m) => s + m.protein, 0);
  const totalCarbs = todayMeals.reduce((s, m) => s + m.carbs, 0);
  const totalFat = todayMeals.reduce((s, m) => s + m.fat, 0);

  const macroData = [
    { name: 'Protein', value: totalProtein },
    { name: 'Carbs', value: totalCarbs },
    { name: 'Fat', value: totalFat },
  ];

  const grouped = mealTypes.map(mt => ({
    ...mt,
    items: todayMeals.filter(m => m.type === mt.value),
  }));

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Nutrition</h2>
          <p className="text-slate-400 mt-1 text-sm">{totalCals} / 2200 kcal today</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm hover:from-orange-400 hover:to-pink-400 transition-all shadow-lg shadow-orange-500/30 cursor-pointer self-start">
          <Plus size={16} /> Log Meal
        </button>
      </div>

      {/* Calorie Overview */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Calorie Summary</h3>
          <span className="text-2xl font-black gradient-text">{totalCals} kcal</span>
        </div>
        <div className="progress-bar mb-2">
          <div className="progress-fill bg-gradient-to-r from-orange-500 to-pink-500" style={{ width: `${Math.min(100, (totalCals / 2200) * 100)}%` }} />
        </div>
        <p className="text-xs text-slate-400 text-right">{Math.max(0, 2200 - totalCals)} kcal remaining</p>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-5">Macronutrients</h3>
          <div className="space-y-4">
            <MacroBar label="Protein" value={totalProtein} max={180} color={MACRO_COLORS.protein} />
            <MacroBar label="Carbohydrates" value={totalCarbs} max={280} color={MACRO_COLORS.carbs} />
            <MacroBar label="Fat" value={totalFat} max={80} color={MACRO_COLORS.fat} />
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Macro Distribution</h3>
          {totalProtein + totalCarbs + totalFat > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={macroData} cx="50%" cy="50%" outerRadius={65} innerRadius={40} dataKey="value" paddingAngle={3}>
                    <Cell fill={MACRO_COLORS.protein} />
                    <Cell fill={MACRO_COLORS.carbs} />
                    <Cell fill={MACRO_COLORS.fat} />
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v}g`, n]} contentStyle={{ background: 'rgba(15,15,25,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-around mt-2">
                {[
                  { label: 'Protein', value: totalProtein, color: MACRO_COLORS.protein },
                  { label: 'Carbs', value: totalCarbs, color: MACRO_COLORS.carbs },
                  { label: 'Fat', value: totalFat, color: MACRO_COLORS.fat },
                ].map(m => (
                  <div key={m.label} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
                    <span className="text-slate-400">{m.label} <span className="text-white font-medium">{m.value}g</span></span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <p className="text-slate-500 text-sm">Log meals to see distribution</p>
            </div>
          )}
        </div>
      </div>

      {/* Meals by Type */}
      <div className="space-y-4">
        {grouped.map(({ value, label, icon: Icon, color, items }) => (
          <div key={value} className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <Icon size={18} className={color} />
              <h3 className="font-semibold text-white">{label}</h3>
              <span className="text-xs text-slate-500 ml-auto">{items.reduce((s, m) => s + m.calories, 0)} kcal</span>
            </div>
            {items.length === 0 ? (
              <p className="text-sm text-slate-600 italic">Nothing logged for {label.toLowerCase()} yet.</p>
            ) : (
              <div className="space-y-2">
                {items.map(meal => (
                  <div key={meal.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                    <div>
                      <p className="text-sm font-medium text-white">{meal.name}</p>
                      <p className="text-xs text-slate-500">P: {meal.protein}g · C: {meal.carbs}g · F: {meal.fat}g · {meal.time}</p>
                    </div>
                    <span className="text-sm font-bold text-orange-400">{meal.calories} kcal</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && <AddMealModal onClose={() => setShowModal(false)} onAdd={addMeal} />}
    </div>
  );
}

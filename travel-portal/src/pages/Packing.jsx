import { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { Check, Plus, X } from 'lucide-react';

export default function Packing() {
  const { packingList, packingCategories, togglePacking, addPackingItem } = useTravel();
  const [newItem, setNewItem] = useState({ cat: 'clothing', label: '' });
  const [activeCategory, setActiveCategory] = useState('all');

  const allItems = Object.values(packingList).flat();
  const checkedCount = allItems.filter(i => i.checked).length;
  const totalCount = allItems.length;
  const pct = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItem.label.trim()) return;
    addPackingItem(newItem.cat, newItem.label.trim());
    setNewItem(p => ({ ...p, label: '' }));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 pb-16 space-y-8">
      <div>
        <h2 className="text-4xl font-black serif text-white mb-2">Packing List</h2>
        <p className="text-slate-400">{checkedCount} of {totalCount} items packed</p>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-300 font-medium">Overall Packing Progress</span>
          <span className={`text-2xl font-black ${pct === 100 ? 'text-emerald-400' : 'gradient-text'}`}>{pct}%</span>
        </div>
        <div className="progress-bar" style={{ height: '10px' }}>
          <div className="progress-fill" style={{ width: `${pct}%`, background: pct === 100 ? '#10b981' : 'linear-gradient(to right, #f59e0b, #f97316)' }} />
        </div>
        {pct === 100 && <p className="text-emerald-400 text-sm mt-2 text-center">🎉 You're all packed and ready to go!</p>}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setActiveCategory('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${activeCategory === 'all' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' : 'glass text-slate-400 border border-white/5 hover:text-white'}`}>
          All
        </button>
        {Object.keys(packingCategories).map(cat => {
          const cfg = packingCategories[cat];
          const items = packingList[cat] || [];
          const done = items.filter(i => i.checked).length;
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${activeCategory === cat ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' : 'glass text-slate-400 border border-white/5 hover:text-white'}`}>
              {cfg.icon} {cfg.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${done === items.length ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>{done}/{items.length}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {Object.keys(packingCategories)
          .filter(cat => activeCategory === 'all' || activeCategory === cat)
          .map(cat => {
            const cfg = packingCategories[cat];
            const items = packingList[cat] || [];
            const done = items.filter(i => i.checked).length;
            return (
              <div key={cat} className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cfg.icon}</span>
                    <h3 className="font-bold text-white">{cfg.label}</h3>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${done === items.length ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-slate-400 border border-white/5'}`}>
                    {done}/{items.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => togglePacking(cat, item.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all cursor-pointer border ${
                        item.checked
                          ? 'bg-emerald-500/8 border-emerald-500/20'
                          : 'bg-white/3 border-white/5 hover:border-amber-500/20 hover:bg-amber-500/5'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                        {item.checked && <Check size={11} className="text-white" />}
                      </div>
                      <span className={`text-sm ${item.checked ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
      </div>

      <div className="glass rounded-2xl p-5 border border-amber-500/10">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Plus size={16} className="text-amber-400" /> Add Custom Item</h3>
        <form onSubmit={handleAdd} className="flex gap-3">
          <select value={newItem.cat} onChange={e => setNewItem(p => ({ ...p, cat: e.target.value }))} className="px-3 py-2.5 text-sm rounded-xl">
            {Object.keys(packingCategories).map(cat => (
              <option key={cat} value={cat} className="bg-slate-800">{packingCategories[cat].icon} {packingCategories[cat].label}</option>
            ))}
          </select>
          <input type="text" value={newItem.label} onChange={e => setNewItem(p => ({ ...p, label: e.target.value }))} placeholder="Add item..." className="flex-1 px-4 py-2.5 text-sm" />
          <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-400 hover:to-orange-400 transition-all cursor-pointer text-sm">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

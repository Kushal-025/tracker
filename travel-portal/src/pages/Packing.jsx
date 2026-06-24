import { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { Check, Plus, X, Trash2, Search, FolderPlus } from 'lucide-react';

export default function Packing() {
  const {
    packingList,
    packingCategories,
    togglePacking,
    addPackingItem,
    deletePackingItem,
    clearCheckedPackingItems,
    checkAllPackingItems,
    addPackingCategory,
    deletePackingCategory
  } = useTravel();

  const [newItem, setNewItem] = useState({ cat: 'clothing', label: '' });
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom Category State
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCat, setNewCat] = useState({ label: '', icon: '🎒' });

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

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCat.label.trim()) return;
    addPackingCategory(newCat.label.trim(), newCat.icon);
    setNewCat({ label: '', icon: '🎒' });
    setShowAddCat(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 pb-16 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black serif text-white mb-2">Packing List</h2>
          <p className="text-slate-400">{checkedCount} of {totalCount} items packed</p>
        </div>
        <button
          onClick={() => setShowAddCat(!showAddCat)}
          className="flex items-center gap-2 px-4 py-2.5 glass text-slate-300 hover:text-white rounded-xl text-sm font-semibold border border-white/5 cursor-pointer hover:border-accent-border transition-colors self-start sm:self-center"
        >
          <FolderPlus size={16} className="text-accent" /> Custom Category
        </button>
      </div>

      {showAddCat && (
        <form onSubmit={handleAddCategory} className="glass rounded-2xl p-5 border border-accent-border/40 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <p className="text-xs font-semibold text-accent uppercase tracking-wider">New Packing Category</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newCat.icon}
              onChange={e => setNewCat(p => ({ ...p, icon: e.target.value }))}
              placeholder="Emoji (e.g. 🎒)"
              className="px-3 py-2 text-center w-full sm:w-20"
            />
            <input
              type="text"
              value={newCat.label}
              onChange={e => setNewCat(p => ({ ...p, label: e.target.value }))}
              placeholder="Category Name (e.g., Photography, Camping)"
              className="flex-1 px-4 py-2"
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 sm:flex-none px-5 py-2 bg-gradient-to-r from-gradient-start to-gradient-end text-white font-semibold rounded-xl text-sm hover:brightness-110 cursor-pointer">
                Create
              </button>
              <button type="button" onClick={() => setShowAddCat(false)} className="px-4 py-2 glass text-slate-300 rounded-xl text-sm font-semibold hover:text-white cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="glass rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-300 font-medium">Overall Packing Progress</span>
          <span className={`text-2xl font-black ${pct === 100 ? 'text-emerald-400' : 'gradient-text'}`}>{pct}%</span>
        </div>
        <div className="progress-bar" style={{ height: '10px' }}>
          <div className="progress-fill" style={{ width: `${pct}%`, background: pct === 100 ? '#10b981' : 'linear-gradient(to right, var(--gradient-start), var(--gradient-end))' }} />
        </div>
        {pct === 100 && <p className="text-emerald-400 text-sm mt-2 text-center">🎉 You're all packed and ready to go!</p>}
      </div>

      <div className="space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search packing items..."
            className="w-full pl-10 pr-4 py-3 text-sm"
          />
        </div>

        {/* Categories row */}
        <div className="flex gap-2 flex-nowrap overflow-x-auto scrollbar-none pb-1 -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button onClick={() => setActiveCategory('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${activeCategory === 'all' ? 'bg-accent-light text-accent border border-accent-border' : 'glass text-slate-400 border border-white/5 hover:text-white'}`}>
            All
          </button>
          {Object.keys(packingCategories).map(cat => {
            const cfg = packingCategories[cat];
            const items = packingList[cat] || [];
            const done = items.filter(i => i.checked).length;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${activeCategory === cat ? 'bg-accent-light text-accent border border-accent-border' : 'glass text-slate-400 border border-white/5 hover:text-white'}`}>
                {cfg.icon} {cfg.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${done === items.length ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>{done}/{items.length}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {Object.keys(packingCategories)
          .filter(cat => activeCategory === 'all' || activeCategory === cat)
          .map(cat => {
            const cfg = packingCategories[cat];
            const rawItems = packingList[cat] || [];
            const items = rawItems.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()));
            const done = rawItems.filter(i => i.checked).length;

            if (searchQuery && items.length === 0) return null;

            return (
              <div key={cat} className="glass rounded-2xl p-5 border border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cfg.icon}</span>
                    <h3 className="font-bold text-white">{cfg.label}</h3>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${done === rawItems.length ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-slate-400'}`}>
                      {done}/{rawItems.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => checkAllPackingItems(cat)}
                      className="text-xxs font-semibold px-2 py-1 glass text-slate-400 hover:text-white rounded-lg border border-white/5 cursor-pointer hover:border-accent-border transition-colors"
                    >
                      Check All
                    </button>
                    <button
                      onClick={() => clearCheckedPackingItems(cat)}
                      className="text-xxs font-semibold px-2 py-1 glass text-slate-400 hover:text-white rounded-lg border border-white/5 cursor-pointer hover:border-accent-border transition-colors"
                    >
                      Clear Packed
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete the "${cfg.label}" category and all its items?`)) {
                          deletePackingCategory(cat);
                          if (activeCategory === cat) setActiveCategory('all');
                        }
                      }}
                      className="p-1 glass text-slate-500 hover:text-red-400 rounded-lg border border-white/5 cursor-pointer hover:border-red-500/20 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {items.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-2">No items inside. Add custom items below.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {items.map(item => (
                      <div
                        key={item.id}
                        onClick={() => togglePacking(cat, item.id)}
                        className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer border group/item ${
                          item.checked
                            ? 'bg-emerald-500/8 border-emerald-500/20 animate-scale-in'
                            : 'bg-white/3 border-white/5 hover:border-accent-border hover:bg-accent-light'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                            {item.checked && <Check size={11} className="text-white" />}
                          </div>
                          <span className={`text-sm ${item.checked ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{item.label}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePackingItem(cat, item.id);
                          }}
                          className="opacity-100 md:opacity-0 md:group-hover/item:opacity-100 p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      <div className="glass rounded-2xl p-5 border border-accent-border/20">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Plus size={16} className="text-accent" /> Add Custom Item</h3>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <select value={newItem.cat} onChange={e => setNewItem(p => ({ ...p, cat: e.target.value }))} className="px-3 py-2.5 text-sm rounded-xl cursor-pointer">
            {Object.keys(packingCategories).map(cat => (
              <option key={cat} value={cat} className="bg-slate-800">{packingCategories[cat].icon} {packingCategories[cat].label}</option>
            ))}
          </select>
          <input type="text" value={newItem.label} onChange={e => setNewItem(p => ({ ...p, label: e.target.value }))} placeholder="Add item..." className="flex-1 px-4 py-2.5 text-sm" />
          <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-gradient-start to-gradient-end text-white rounded-xl font-semibold hover:brightness-110 transition-all cursor-pointer text-sm">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

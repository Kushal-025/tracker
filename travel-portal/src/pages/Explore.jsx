import { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { Search, Filter, Heart, Star, MapPin, X, Globe, IndianRupee } from 'lucide-react';

const continents = ['All', 'Europe', 'Asia', 'Africa', 'North America', 'South America'];
const types = ['All', 'beach', 'city', 'adventure', 'culture'];
const typeLabels = { beach: '🏖️ Beach', city: '🌆 City', adventure: '🏔️ Adventure', culture: '🎭 Culture' };

function DestModal({ dest, onClose }) {
  const { savedIds, toggleSave, setPage, trips } = useTravel();
  const isSaved = savedIds.includes(dest.id);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="glass rounded-3xl w-full max-w-2xl overflow-hidden border border-white/10 shadow-2xl shadow-amber-500/10" onClick={e => e.stopPropagation()}>
        <div className="relative h-64">
          <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 glass rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all">
            <X size={16} className="text-white" />
          </button>
          <button
            onClick={() => toggleSave(dest.id)}
            className="absolute top-4 left-4 w-9 h-9 glass rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
          >
            <Heart size={16} className={isSaved ? 'fill-red-400 text-red-400' : 'text-white'} />
          </button>
          <div className="absolute bottom-4 left-5">
            <p className="text-amber-400 text-xs font-medium mb-1 flex items-center gap-1"><MapPin size={11} />{dest.country}</p>
            <h2 className="text-3xl font-black serif text-white">{dest.name}</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-amber-300">{dest.rating} / 5.0</span>
            </div>
            <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full">
              <IndianRupee size={13} className="text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300">From ₹{dest.price}</span>
            </div>
            <div className="glass px-3 py-1.5 rounded-full">
              <span className="text-xs text-slate-300 capitalize">{dest.continent}</span>
            </div>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed mb-5">{dest.desc}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {dest.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setPage('trips'); onClose(); }}
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20 cursor-pointer text-sm"
            >
              Plan a Trip Here
            </button>
            <button
              onClick={() => toggleSave(dest.id)}
              className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer border ${
                isSaved ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-white/10 glass text-slate-300 hover:text-white'
              }`}
            >
              {isSaved ? '❤️ Saved' : '🤍 Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Explore() {
  const { destinations, savedIds, toggleSave, selectedDest, setSelectedDest } = useTravel();
  const [query, setQuery] = useState('');
  const [continent, setContinent] = useState('All');
  const [type, setType] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  const filtered = destinations
    .filter(d => {
      const matchQuery = d.name.toLowerCase().includes(query.toLowerCase()) || d.country.toLowerCase().includes(query.toLowerCase());
      const matchContinent = continent === 'All' || d.continent === continent;
      const matchType = type === 'All' || d.type === type;
      return matchQuery && matchContinent && matchType;
    })
    .sort((a, b) => sortBy === 'rating' ? b.rating - a.rating : a.price - b.price);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 pb-16 space-y-8">
      <div>
        <h2 className="text-4xl font-black serif text-white mb-2">Explore Destinations</h2>
        <p className="text-slate-400">{filtered.length} destinations found</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search by destination or country..."
            className="w-full pl-10 pr-4 py-3.5 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs text-slate-500 self-center">Continent:</span>
            {continents.map(c => (
              <button key={c} onClick={() => setContinent(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${continent === c ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' : 'glass text-slate-400 border border-white/5 hover:text-white'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-slate-500">Type:</span>
            {types.map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all cursor-pointer ${type === t ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' : 'glass text-slate-400 border border-white/5 hover:text-white'}`}>
                {t === 'All' ? 'All Types' : typeLabels[t]}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2 text-xs rounded-xl">
            <option value="rating" className="bg-slate-800">Sort: Top Rated</option>
            <option value="price" className="bg-slate-800">Sort: Price Low-High</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(dest => {
          const isSaved = savedIds.includes(dest.id);
          return (
            <div key={dest.id} className="dest-card card-hover glass border border-white/8 cursor-pointer" style={{ height: '280px' }} onClick={() => setSelectedDest(dest)}>
              <img src={dest.image} alt={dest.name} loading="lazy" />
              <div className="dest-overlay" />
              <button
                className="absolute top-3 right-3 w-8 h-8 glass rounded-full flex items-center justify-center z-10 cursor-pointer hover:scale-110 transition-transform"
                onClick={e => { e.stopPropagation(); toggleSave(dest.id); }}
              >
                <Heart size={14} className={isSaved ? 'fill-red-400 text-red-400' : 'text-white/70'} />
              </button>
              <span className="absolute top-3 left-3 tag z-10 capitalize">{typeLabels[dest.type] || dest.type}</span>
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <p className="text-amber-400 text-xs font-medium mb-0.5 flex items-center gap-1"><MapPin size={10} />{dest.country}</p>
                <h3 className="text-white font-bold text-xl serif">{dest.name}</h3>
                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center gap-1">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs text-amber-300 font-semibold">{dest.rating}</span>
                  </div>
                  <span className="text-xs text-white/60">from <span className="text-amber-400 font-bold">₹{dest.price}</span></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="glass rounded-2xl p-16 text-center">
          <Globe size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No destinations match your filters. Try adjusting them!</p>
        </div>
      )}

      {selectedDest && <DestModal dest={selectedDest} onClose={() => setSelectedDest(null)} />}
    </div>
  );
}

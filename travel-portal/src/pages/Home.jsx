import { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { Search, MapPin, Star, Heart, TrendingUp, Globe, Users, Award } from 'lucide-react';

function DestCard({ dest, compact }) {
  const { savedIds, toggleSave, setSelectedDest, setPage } = useTravel();
  const isSaved = savedIds.includes(dest.id);

  return (
    <div
      className="dest-card card-hover glass border border-white/8"
      style={{ height: compact ? '220px' : '300px' }}
      onClick={() => { setSelectedDest(dest); setPage('explore'); }}
    >
      <img src={dest.image} alt={dest.name} loading="lazy" />
      <div className="dest-overlay" />
      <button
        className="absolute top-3 right-3 w-8 h-8 glass rounded-full flex items-center justify-center z-10 cursor-pointer hover:scale-110 transition-transform"
        onClick={e => { e.stopPropagation(); toggleSave(dest.id); }}
      >
        <Heart size={14} className={isSaved ? 'fill-red-400 text-red-400' : 'text-white/70'} />
      </button>
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <div className="flex items-center gap-1.5 mb-1">
          <MapPin size={11} className="text-amber-400" />
          <span className="text-amber-400 text-xs font-medium">{dest.country}</span>
        </div>
        <h3 className="text-white font-bold text-lg serif leading-tight">{dest.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="text-xs text-amber-300 font-medium">{dest.rating}</span>
          </div>
          <span className="text-xs text-white/60">from <span className="text-amber-400 font-semibold">${dest.price}</span></span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { destinations, setPage, trips, savedIds } = useTravel();
  const [query, setQuery] = useState('');

  const featured = destinations.slice(0, 4);
  const trending = destinations.filter(d => d.rating >= 4.9);

  const stats = [
    { label: 'Destinations', value: '200+', icon: Globe },
    { label: 'Happy Travelers', value: '50K+', icon: Users },
    { label: 'My Trips', value: trips.length, icon: TrendingUp },
    { label: 'Places Saved', value: savedIds.length, icon: Award },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setPage('explore');
  };

  return (
    <div className="space-y-16 pb-16">
      <section className="relative min-h-[92vh] flex items-center justify-center text-center px-4 pt-24">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 glass-gold rounded-full px-4 py-2 mb-6 text-sm text-amber-400 float">
            <span>✈️</span> Your next adventure awaits
          </div>

          <h1 className="text-5xl md:text-7xl font-black serif text-white mb-6 leading-tight">
            Explore the World,<br />
            <span className="gradient-text">One Trip at a Time</span>
          </h1>

          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Plan unforgettable journeys, track budgets, build packing lists, and discover breathtaking destinations — all in one beautiful portal.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search destinations, countries..."
                className="w-full pl-10 pr-4 py-4 text-sm font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/30 whitespace-nowrap cursor-pointer"
            >
              Explore Now
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-400">
            {['🏖️ Beach', '🏔️ Adventure', '🎭 Culture', '🌆 City Breaks', '🦁 Safari'].map(t => (
              <button key={t} onClick={() => setPage('explore')} className="glass px-3 py-1.5 rounded-full hover:text-amber-400 hover:border-amber-500/20 transition-all cursor-pointer border border-white/5">
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { top: '15%', left: '5%', delay: '0s', img: destinations[0].image },
            { top: '25%', right: '4%', delay: '1.5s', img: destinations[4].image },
            { top: '65%', left: '2%', delay: '0.8s', img: destinations[7].image },
            { top: '70%', right: '3%', delay: '2s', img: destinations[3].image },
          ].map((s, i) => (
            <div key={i} className="absolute w-28 h-20 md:w-36 md:h-24 rounded-2xl overflow-hidden border border-white/10 shadow-2xl opacity-60"
              style={{ ...s, animation: `float 4s ease-in-out ${s.delay} infinite` }}>
              <img src={s.img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="glass rounded-2xl p-5 text-center card-hover">
              <Icon size={22} className="text-amber-400 mx-auto mb-3" />
              <p className="text-2xl font-black gradient-text">{value}</p>
              <p className="text-xs text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-amber-400 text-sm font-medium mb-1">Handpicked for you</p>
            <h2 className="text-3xl font-black serif text-white">Featured Destinations</h2>
          </div>
          <button onClick={() => setPage('explore')} className="text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer">
            View all →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map(d => <DestCard key={d.id} dest={d} />)}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6">
        <div className="mb-6">
          <p className="text-amber-400 text-sm font-medium mb-1">🔥 Trending right now</p>
          <h2 className="text-3xl font-black serif text-white">Top Rated Places</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {trending.map(d => (
            <div key={d.id} className="glass rounded-2xl p-4 flex gap-4 items-start card-hover cursor-pointer" onClick={() => { setSelectedDest(d); setPage('explore'); }}>
              <img src={d.image} alt={d.name} className="w-20 h-16 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm">{d.name}</p>
                <p className="text-xs text-slate-400 mb-2">{d.country}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs text-amber-300 font-semibold">{d.rating}</span>
                  </div>
                  <span className="text-amber-400 text-xs font-bold">${d.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6">
        <div className="glass-gold rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-black serif text-white mb-3">Ready to Start Planning?</h2>
            <p className="text-slate-400 mb-6">Create your first trip and bring your dream vacation to life.</p>
            <button
              onClick={() => setPage('trips')}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-xl shadow-amber-500/30 cursor-pointer"
            >
              Create a Trip ✈️
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

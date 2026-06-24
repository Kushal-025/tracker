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
          <MapPin size={11} className="text-accent" />
          <span className="text-accent text-xs font-medium">{dest.country}</span>
        </div>
        <h3 className="text-white font-bold text-lg serif leading-tight">{dest.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Star size={11} className="fill-accent text-accent" />
            <span className="text-xs text-accent/90 font-medium">{dest.rating}</span>
          </div>
          <span className="text-xs text-white/60">from <span className="text-accent font-semibold">₹{dest.price}</span></span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { destinations, setPage, trips, savedIds, setSelectedDest } = useTravel();
  const [query, setQuery] = useState('');
  
  // Vibe Matcher Quiz States
  const [quizStep, setQuizStep] = useState(0); // 0 = start, 1 = style, 2 = companion, 3 = budget, 4 = results
  const [quizAnswers, setQuizAnswers] = useState({ style: '', companion: '', budget: '' });

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

  const getMatchedDestinations = () => {
    let matches = destinations.filter(d => d.type === quizAnswers.style);
    if (quizAnswers.budget === 'budget') {
      matches = matches.filter(d => d.price < 1200);
    } else if (quizAnswers.budget === 'moderate') {
      matches = matches.filter(d => d.price >= 1200 && d.price <= 2200);
    } else {
      matches = matches.filter(d => d.price > 2200);
    }
    if (matches.length === 0) {
      matches = destinations.filter(d => d.type === quizAnswers.style).slice(0, 2);
    }
    return matches;
  };

  return (
    <div className="space-y-16 pb-16">
      <section className="relative min-h-[92vh] flex items-center justify-center text-center px-4 pt-24">
        <div className="relative z-10 max-w-4xl mx-auto px-2">
          <div className="inline-flex items-center gap-2 glass-accent rounded-full px-4 py-2 mb-6 text-sm text-accent float">
            <span>✈️</span> Your next adventure awaits
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black serif text-white mb-6 leading-tight">
            Explore the World,<br />
            <span className="gradient-text">One Trip at a Time</span>
          </h1>

          <p className="text-base md:text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
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
              className="px-8 py-4 bg-gradient-to-r from-gradient-start to-gradient-end text-white font-semibold rounded-xl hover:brightness-110 active:scale-95 transition-transform shadow-lg shadow-accent/30 whitespace-nowrap cursor-pointer"
            >
              Explore Now
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-400">
            {['🏖️ Beach', '🏔️ Adventure', '🎭 Culture', '🌆 City Breaks', '🦁 Safari'].map(t => (
              <button key={t} onClick={() => setPage('explore')} className="glass px-3 py-1.5 rounded-full hover:text-accent hover:border-accent-border active:scale-95 transition-all cursor-pointer border border-white/5">
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Floating graphics - hidden on medium-down screens to prevent overlapping */}
        <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
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
          {stats.map(({ label, value, icon: Icon }, i) => (
            <div key={label} className="glass rounded-2xl p-5 text-center card-hover animate-scale-in" style={{ animationDelay: `${i * 75}ms` }}>
              <Icon size={22} className="text-accent mx-auto mb-3" />
              <p className="text-2xl font-black gradient-text">{value}</p>
              <p className="text-xs text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vibe Matcher Quiz Section */}
      <section className="max-w-6xl mx-auto px-6">
        {quizStep === 0 && (
          <div className="glass rounded-3xl p-8 md:p-10 text-center border border-white/8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-end/5 rounded-full blur-3xl pointer-events-none" />
            <span className="text-2xl mb-2 block">🎯</span>
            <h3 className="text-2xl md:text-3xl font-black serif text-white mb-2">Find Your Travel Vibe</h3>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mb-6">Take our 30-second interactive matching quiz to discover your dream destinations based on your personality, companion, and budget!</p>
            <button onClick={() => setQuizStep(1)} className="px-6 py-3 bg-gradient-to-r from-gradient-start to-gradient-end text-white font-semibold rounded-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg shadow-accent/20">
              Start Quiz ✨
            </button>
          </div>
        )}

        {quizStep === 1 && (
          <div className="glass rounded-3xl p-6 md:p-10 border border-white/8 relative">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Step 1 of 3 · Vibe</span>
              <button onClick={() => setQuizStep(0)} className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer">Cancel</button>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">What's your ideal vacation style?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'beach', label: '🏖️ Beach & Relaxation', desc: 'Sun, sand, and calming coastal views' },
                { id: 'adventure', label: '🧗 Action & Adventure', desc: 'Hiking, glaciers, wildlife safaris, and nature' },
                { id: 'culture', label: '🎭 Culture & History', desc: 'Ancient temples, museums, geishas, and art' },
                { id: 'city', label: '🌆 City Exploration', desc: 'Vibrant streets, nightlife, shopping, and landmarks' },
              ].map(opt => (
                <button key={opt.id} onClick={() => { setQuizAnswers(p => ({ ...p, style: opt.id })); setQuizStep(2); }}
                  className="glass rounded-2xl p-4 text-left hover:border-accent-border hover:bg-accent-light active:scale-98 transition-all cursor-pointer border border-white/5 group">
                  <p className="font-semibold text-white group-hover:text-accent transition-colors">{opt.label}</p>
                  <p className="text-xs text-slate-400 mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {quizStep === 2 && (
          <div className="glass rounded-3xl p-6 md:p-10 border border-white/8 relative">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Step 2 of 3 · Companion</span>
              <button onClick={() => setQuizStep(1)} className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer">← Back</button>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">Who are you exploring the world with?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'solo', label: '🚶 Going Solo', desc: 'Freedom & flexibility' },
                { id: 'couple', label: '❤️ Romantic Getaway', desc: 'For you and your partner' },
                { id: 'group', label: '👥 Friends & Family', desc: 'Sharing memories together' },
              ].map(opt => (
                <button key={opt.id} onClick={() => { setQuizAnswers(p => ({ ...p, companion: opt.id })); setQuizStep(3); }}
                  className="glass rounded-2xl p-5 text-center hover:border-accent-border hover:bg-accent-light active:scale-98 transition-all cursor-pointer border border-white/5 group">
                  <p className="font-semibold text-white group-hover:text-accent transition-colors">{opt.label}</p>
                  <p className="text-xs text-slate-400 mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {quizStep === 3 && (
          <div className="glass rounded-3xl p-6 md:p-10 border border-white/8 relative">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Step 3 of 3 · Budget</span>
              <button onClick={() => setQuizStep(2)} className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer">← Back</button>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">Select your comfortable budget tier:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'budget', label: '💰 Value Travel', desc: 'Under ₹1,200 per night' },
                { id: 'moderate', label: '💳 Moderate Luxury', desc: '₹1,200 - ₹2,200 per night' },
                { id: 'luxury', label: '💎 Premium Luxury', desc: 'Over ₹2,200 per night' },
              ].map(opt => (
                <button key={opt.id} onClick={() => { setQuizAnswers(p => ({ ...p, budget: opt.id })); setQuizStep(4); }}
                  className="glass rounded-2xl p-5 text-center hover:border-accent-border hover:bg-accent-light active:scale-98 transition-all cursor-pointer border border-white/5 group">
                  <p className="font-semibold text-white group-hover:text-accent transition-colors">{opt.label}</p>
                  <p className="text-xs text-slate-400 mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {quizStep === 4 && (
          <div className="glass rounded-3xl p-6 md:p-10 border border-white/8 relative animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">✔ Matches Found</span>
              <button onClick={() => { setQuizStep(0); setQuizAnswers({ style: '', companion: '', budget: '' }); }}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer">Restart Quiz ↺</button>
            </div>
            <h3 className="text-2xl font-black serif text-white mb-2">Your Curated Recommendations</h3>
            <p className="text-slate-400 text-sm mb-6">Based on your answers, we think you would absolutely love these locations:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getMatchedDestinations().map(dest => (
                <DestCard key={dest.id} dest={dest} compact={true} />
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-accent text-sm font-medium mb-1">Handpicked for you</p>
            <h2 className="text-3xl font-black serif text-white">Featured Destinations</h2>
          </div>
          <button onClick={() => setPage('explore')} className="text-sm text-accent hover:brightness-110 font-medium transition-colors cursor-pointer">
            View all →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((d, i) => (
            <div key={d.id} className="animate-scale-in" style={{ animationDelay: `${i * 100}ms` }}>
              <DestCard dest={d} />
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6">
        <div className="mb-6">
          <p className="text-accent text-sm font-medium mb-1">🔥 Trending right now</p>
          <h2 className="text-3xl font-black serif text-white">Top Rated Places</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {trending.map((d, i) => (
            <div key={d.id} className="glass rounded-2xl p-4 flex gap-4 items-start card-hover cursor-pointer animate-scale-in" style={{ animationDelay: `${i * 100}ms` }} onClick={() => { setSelectedDest(d); setPage('explore'); }}>
              <img src={d.image} alt={d.name} className="w-20 h-16 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm">{d.name}</p>
                <p className="text-xs text-slate-400 mb-2">{d.country}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={11} className="fill-accent text-accent" />
                    <span className="text-xs text-accent/90 font-semibold">{d.rating}</span>
                  </div>
                  <span className="text-accent text-xs font-bold">₹{d.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6">
        <div className="glass-accent rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-black serif text-white mb-3">Ready to Start Planning?</h2>
            <p className="text-slate-400 mb-6">Create your first trip and bring your dream vacation to life.</p>
            <button
              onClick={() => setPage('trips')}
              className="px-8 py-3.5 bg-gradient-to-r from-gradient-start to-gradient-end text-white font-semibold rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-accent/30 cursor-pointer"
            >
              Create a Trip ✈️
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

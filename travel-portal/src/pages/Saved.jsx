import { useTravel } from '../context/TravelContext';
import { Heart, Star, MapPin, Globe } from 'lucide-react';

export default function Saved() {
  const { destinations, savedIds, toggleSave, setSelectedDest, setPage } = useTravel();
  const saved = destinations.filter(d => savedIds.includes(d.id));

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 pb-16 space-y-8">
      <div>
        <h2 className="text-4xl font-black serif text-white mb-2">Saved Places</h2>
        <p className="text-slate-400">{saved.length} destination{saved.length !== 1 ? 's' : ''} on your wishlist</p>
      </div>

      {saved.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center">
          <Heart size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Your wishlist is empty</h3>
          <p className="text-slate-400 mb-6">Explore destinations and tap ❤️ to save them here.</p>
          <button onClick={() => setPage('explore')} className="px-6 py-3 bg-amber-500/15 text-amber-400 border border-amber-500/25 rounded-xl font-medium hover:bg-amber-500/25 transition-all cursor-pointer">
            Browse Destinations
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {saved.map(dest => (
            <div key={dest.id} className="glass rounded-2xl overflow-hidden card-hover border border-white/8">
              <div className="dest-card" style={{ height: '220px' }} onClick={() => { setSelectedDest(dest); setPage('explore'); }}>
                <img src={dest.image} alt={dest.name} loading="lazy" />
                <div className="dest-overlay" />
                <button
                  onClick={e => { e.stopPropagation(); toggleSave(dest.id); }}
                  className="absolute top-3 right-3 w-8 h-8 glass rounded-full flex items-center justify-center z-10 cursor-pointer hover:scale-110 transition-transform"
                >
                  <Heart size={14} className="fill-red-400 text-red-400" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <p className="text-amber-400 text-xs flex items-center gap-1 mb-0.5"><MapPin size={10} />{dest.country}</p>
                  <h3 className="text-white font-bold text-lg serif">{dest.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{dest.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs text-amber-300 font-semibold">{dest.rating}</span>
                  </div>
                  <div className="flex gap-2">
                    {dest.tags.slice(0, 2).map(tag => <span key={tag} className="tag text-xs">{tag}</span>)}
                  </div>
                  <span className="text-amber-400 text-xs font-bold">₹{dest.price}</span>
                </div>
                <button
                  onClick={() => setPage('trips')}
                  className="w-full mt-3 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-semibold hover:bg-amber-500/20 transition-all cursor-pointer"
                >
                  Plan a Trip Here
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

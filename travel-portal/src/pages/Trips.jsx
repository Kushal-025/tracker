import { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { Plus, X, Calendar, MapPin, DollarSign, CheckCircle, Clock, Plane, Trash2, Edit3, Share2 } from 'lucide-react';

const statusConfig = {
  upcoming: { label: 'Upcoming', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  planning: { label: 'Planning', color: 'text-accent', bg: 'bg-accent-light border-accent-border' },
  completed: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
};

function AddTripModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', destination: '', startDate: '', endDate: '', budget: '', status: 'planning', image: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.destination) return;
    onAdd({
      ...form,
      budget: Number(form.budget) || 0,
      spent: 0,
      image: form.image || `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-3xl p-7 w-full max-w-md border border-white/10 shadow-2xl shadow-accent/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold serif text-white">New Trip</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 cursor-pointer"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Trip Name *</label>
            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Europe Summer 2026" className="w-full px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Destination *</label>
            <input type="text" value={form.destination} onChange={e => setForm(p => ({ ...p, destination: e.target.value }))} placeholder="e.g. Paris, France" className="w-full px-4 py-3 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Start Date</label>
              <input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} className="w-full px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">End Date</label>
              <input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} className="w-full px-4 py-3 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Total Budget (₹)</label>
            <input type="number" value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))} placeholder="2000" className="w-full px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full px-4 py-3 text-sm cursor-pointer">
              <option value="planning" className="bg-slate-800">Planning</option>
              <option value="upcoming" className="bg-slate-800">Upcoming</option>
              <option value="completed" className="bg-slate-800">Completed</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-gradient-start to-gradient-end text-white font-semibold py-3.5 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-accent/20 cursor-pointer">
            Create Trip ✈️
          </button>
        </form>
      </div>
    </div>
  );
}

function TripDetail({ trip, onClose, onAddDay, onDeleteDay, onAddExpense, onDeleteExpense, onEditExpense }) {
  const [itinForm, setItinForm] = useState({ day: trip.itinerary.length + 1, title: '', notes: '' });
  const [expForm, setExpForm] = useState({ category: 'Food', amount: '', label: '' });
  const [editingExpense, setEditingExpense] = useState(null);
  const [tab, setTab] = useState('itinerary');

  const categories = ['Flights', 'Hotel', 'Food', 'Transport', 'Activities', 'Shopping', 'Other'];
  const spent = trip.expenses.reduce((s, e) => s + Number(e.amount), 0);
  const pct = trip.budget > 0 ? Math.min(100, (spent / trip.budget) * 100) : 0;

  const handleExport = () => {
    let txt = `# Travel Plan: ${trip.name} to ${trip.destination}\n`;
    if (trip.startDate) txt += `Dates: ${trip.startDate} to ${trip.endDate || 'N/A'}\n`;
    txt += `Total Budget: ₹${trip.budget} | Total Spent: ₹${spent} | Remaining: ₹${Math.max(0, trip.budget - spent)}\n\n`;
    
    txt += `## Itinerary Details\n`;
    if (trip.itinerary.length === 0) {
      txt += `*No days planned yet.*\n`;
    } else {
      trip.itinerary.forEach(d => {
        txt += `### Day ${d.day}: ${d.title}\n`;
        if (d.notes) txt += `${d.notes}\n`;
        txt += `\n`;
      });
    }

    txt += `## Tracked Expenses\n`;
    if (trip.expenses.length === 0) {
      txt += `*No expenses added yet.*\n`;
    } else {
      trip.expenses.forEach(e => {
        txt += `- ₹${e.amount} [${e.category}] ${e.label}\n`;
      });
    }

    navigator.clipboard.writeText(txt);
    alert('Itinerary copied to clipboard as Markdown! 📋');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="glass rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="relative h-44 flex-shrink-0">
          <img src={trip.image} alt={trip.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 glass rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all"><X size={16} className="text-white" /></button>
          <div className="absolute bottom-4 left-5">
            <h2 className="text-2xl font-black serif text-white">{trip.name}</h2>
            <p className="text-accent text-sm flex items-center gap-1 mt-1"><MapPin size={12} />{trip.destination}</p>
          </div>
        </div>

        <div className="p-6">
          <div className="flex gap-3 mb-6 items-center flex-wrap">
            {['itinerary', 'expenses'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all cursor-pointer ${tab === t ? 'bg-accent-light text-accent border border-accent-border' : 'glass text-slate-400 border border-white/5 hover:text-white'}`}>
                {t === 'itinerary' ? '🗓️ Itinerary' : '💰 Expenses'}
              </button>
            ))}
            
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold glass text-slate-300 hover:text-white border border-white/5 cursor-pointer sm:ml-auto"
              title="Copy details as markdown"
            >
              <Share2 size={13} /> Export Itinerary
            </button>
          </div>

          {tab === 'itinerary' && (
            <div className="space-y-4">
              {trip.itinerary.map((day, i) => (
                <div key={i} className="flex gap-4 group/day">
                  <div className="w-10 h-10 bg-accent-light border border-accent-border rounded-full flex items-center justify-center text-accent font-bold text-sm flex-shrink-0">
                    {day.day}
                  </div>
                  <div className="flex-1 glass rounded-xl p-3 flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-white text-sm">{day.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{day.notes}</p>
                    </div>
                    <button
                      onClick={() => onDeleteDay(trip.id, day.id)}
                      className="opacity-100 md:opacity-0 md:group-hover/day:opacity-100 p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                      title="Delete Day"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
              <div className="glass rounded-xl p-4 mt-4 border border-white/5">
                <p className="text-xs text-slate-400 mb-3 font-medium">Add Itinerary Day</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <input type="number" value={itinForm.day} onChange={e => setItinForm(p => ({ ...p, day: e.target.value }))} placeholder="Day #" className="px-3 py-2 text-sm" />
                  <input type="text" value={itinForm.title} onChange={e => setItinForm(p => ({ ...p, title: e.target.value }))} placeholder="Day title" className="px-3 py-2 text-sm" />
                </div>
                <textarea value={itinForm.notes} onChange={e => setItinForm(p => ({ ...p, notes: e.target.value }))} placeholder="Notes for this day..." rows={2} className="w-full px-3 py-2 text-sm resize-none mb-3" />
                <button onClick={() => { if (itinForm.title) { onAddDay(trip.id, itinForm); setItinForm({ day: trip.itinerary.length + 2, title: '', notes: '' }); } }}
                  className="w-full py-2 bg-accent-light text-accent border border-accent-border rounded-xl text-sm font-medium hover:bg-accent/25 transition-all cursor-pointer">
                  + Add Day
                </button>
              </div>
            </div>
          )}

          {tab === 'expenses' && (
            <div className="space-y-4">
              <div className="glass rounded-xl p-4 border border-white/5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Budget Used</span>
                  <span className="text-white font-semibold">₹{spent} / ₹{trip.budget}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: pct > 90 ? '#ef4444' : 'linear-gradient(to right, var(--gradient-start), var(--gradient-end))' }} />
                </div>
                <p className={`text-xs mt-1.5 ${pct > 90 ? 'text-red-400' : 'text-slate-400'}`}>₹{Math.max(0, trip.budget - spent)} remaining</p>
              </div>

              {trip.expenses.map(exp => (
                <div key={exp.id} className="flex items-center justify-between glass rounded-xl p-3 group/exp border border-white/5">
                  <div>
                    <p className="text-sm font-medium text-white">{exp.label}</p>
                    <p className="text-xs text-slate-500">{exp.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-accent font-bold text-sm mr-2">₹{exp.amount}</span>
                    <button
                      onClick={() => setEditingExpense(exp)}
                      className="opacity-100 md:opacity-0 md:group-hover/exp:opacity-100 p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
                      title="Edit Expense"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => onDeleteExpense(trip.id, exp.id)}
                      className="opacity-100 md:opacity-0 md:group-hover/exp:opacity-100 p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                      title="Delete Expense"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}

              {editingExpense ? (
                <div className="glass rounded-xl p-4 border border-accent-border/40 animate-in slide-in-from-bottom-2 duration-150">
                  <p className="text-xs font-semibold mb-3 text-accent uppercase tracking-wider">Edit Transaction</p>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={editingExpense.category} onChange={e => setEditingExpense(p => ({ ...p, category: e.target.value }))} className="px-3 py-2 text-sm cursor-pointer">
                      {categories.map(c => <option key={c} value={c} className="bg-slate-800">{c}</option>)}
                    </select>
                    <input type="number" value={editingExpense.amount} onChange={e => setEditingExpense(p => ({ ...p, amount: e.target.value }))} placeholder="Amount (₹)" className="px-3 py-2 text-sm" />
                  </div>
                  <input type="text" value={editingExpense.label} onChange={e => setEditingExpense(p => ({ ...p, label: e.target.value }))} placeholder="Description" className="w-full px-3 py-2 text-sm mb-3" />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (editingExpense.amount && editingExpense.label) {
                          onEditExpense(trip.id, editingExpense.id, editingExpense);
                          setEditingExpense(null);
                        }
                      }}
                      className="flex-1 py-2 bg-gradient-to-r from-gradient-start to-gradient-end text-white font-semibold rounded-xl text-sm hover:brightness-110 transition-all cursor-pointer"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingExpense(null)}
                      className="px-4 py-2 glass text-slate-300 rounded-xl text-sm font-semibold hover:text-white transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="glass rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-slate-400 mb-3 font-medium">Add Expense</p>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={expForm.category} onChange={e => setExpForm(p => ({ ...p, category: e.target.value }))} className="px-3 py-2 text-sm cursor-pointer">
                      {categories.map(c => <option key={c} value={c} className="bg-slate-800">{c}</option>)}
                    </select>
                    <input type="number" value={expForm.amount} onChange={e => setExpForm(p => ({ ...p, amount: e.target.value }))} placeholder="Amount (₹)" className="px-3 py-2 text-sm" />
                  </div>
                  <input type="text" value={expForm.label} onChange={e => setExpForm(p => ({ ...p, label: e.target.value }))} placeholder="Description" className="w-full px-3 py-2 text-sm mb-3" />
                  <button onClick={() => { if (expForm.amount && expForm.label) { onAddExpense(trip.id, expForm); setExpForm({ category: 'Food', amount: '', label: '' }); } }}
                    className="w-full py-2 bg-accent-light text-accent border border-accent-border rounded-xl text-sm font-medium hover:bg-accent/25 transition-all cursor-pointer">
                    + Add Expense
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Trips() {
  const { trips, addTrip, deleteTrip, addItineraryDay, deleteItineraryDay, addExpense, deleteExpense, editExpense } = useTravel();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Sync selected trip dynamic data
  const activeDetailTrip = selectedTrip ? trips.find(t => t.id === selectedTrip.id) : null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 pb-16 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black serif text-white mb-1">My Trips</h2>
          <p className="text-slate-400">{trips.length} trip{trips.length !== 1 ? 's' : ''} planned</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-gradient-start to-gradient-end text-white px-5 py-2.5 rounded-xl font-semibold hover:brightness-110 transition-all shadow-lg shadow-accent/20 cursor-pointer text-sm">
          <Plus size={16} /> New Trip
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center">
          <Plane size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No trips yet</h3>
          <p className="text-slate-400 mb-6">Start planning your first adventure!</p>
          <button onClick={() => setShowAdd(true)} className="px-6 py-3 bg-accent-light text-accent border border-accent-border rounded-xl font-medium hover:bg-accent/25 transition-all cursor-pointer">
            Create Your First Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {trips.map((trip, i) => {
            const cfg = statusConfig[trip.status] || statusConfig.planning;
            const spent = trip.expenses.reduce((s, e) => s + Number(e.amount), 0);
            const pct = trip.budget > 0 ? Math.min(100, (spent / trip.budget) * 100) : 0;
            const nights = trip.startDate && trip.endDate
              ? Math.max(0, Math.round((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000))
              : null;

            return (
              <div key={trip.id} className="glass rounded-2xl overflow-hidden card-hover border border-white/8 cursor-pointer relative group animate-scale-in" style={{ animationDelay: `${i * 100}ms` }} onClick={() => setSelectedTrip(trip)}>
                <button
                  className="absolute top-3 right-3 w-8 h-8 glass rounded-full flex items-center justify-center z-20 text-slate-400 hover:text-red-400 transition-all hover:bg-white/10 cursor-pointer"
                  onClick={e => {
                    e.stopPropagation();
                    if (confirm(`Are you sure you want to delete "${trip.name}"?`)) {
                      deleteTrip(trip.id);
                    }
                  }}
                  title="Delete Trip"
                >
                  <Trash2 size={13} />
                </button>

                <div className="relative h-44">
                  <img src={trip.image} alt={trip.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                  <span className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-bold text-white serif text-lg">{trip.name}</h3>
                    <p className="text-accent text-xs flex items-center gap-1"><MapPin size={10} />{trip.destination}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-3 flex-wrap">
                    {trip.startDate && <span className="flex items-center gap-1"><Calendar size={12} />{trip.startDate}</span>}
                    {nights !== null && <span className="flex items-center gap-1"><Clock size={12} />{nights} nights</span>}
                    <span className="flex items-center gap-1"><CheckCircle size={12} />{trip.itinerary.length} days planned</span>
                  </div>
                  {trip.budget > 0 && (
                    <>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-400">Budget</span>
                        <span className="text-white">₹{spent} / ₹{trip.budget}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: 'linear-gradient(to right, var(--gradient-start), var(--gradient-end))' }} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && <AddTripModal onClose={() => setShowAdd(false)} onAdd={addTrip} />}
      {activeDetailTrip && (
        <TripDetail
          trip={activeDetailTrip}
          onClose={() => setSelectedTrip(null)}
          onAddDay={addItineraryDay}
          onDeleteDay={deleteItineraryDay}
          onAddExpense={addExpense}
          onDeleteExpense={deleteExpense}
          onEditExpense={editExpense}
        />
      )}
    </div>
  );
}

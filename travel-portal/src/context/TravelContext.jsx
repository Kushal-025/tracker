import { createContext, useContext, useState, useEffect } from 'react';

const TravelContext = createContext();

const destinations = [
  { id: 1, name: 'Santorini', country: 'Greece', continent: 'Europe', type: 'beach', rating: 4.9, price: 1800, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80', tags: ['Romantic', 'Scenic', 'Islands'], desc: 'Iconic white-washed buildings and breathtaking caldera views make Santorini a bucket-list paradise.' },
  { id: 2, name: 'Kyoto', country: 'Japan', continent: 'Asia', type: 'culture', rating: 4.8, price: 1400, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80', tags: ['Culture', 'Temples', 'Nature'], desc: 'Ancient temples, geisha districts, and stunning bamboo groves make Kyoto a cultural masterpiece.' },
  { id: 3, name: 'Bali', country: 'Indonesia', continent: 'Asia', type: 'beach', rating: 4.7, price: 900, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', tags: ['Tropical', 'Spiritual', 'Budget'], desc: 'Lush rice terraces, sacred temples, and vibrant surf beaches — Bali is a tropical soul-recharge.' },
  { id: 4, name: 'Machu Picchu', country: 'Peru', continent: 'South America', type: 'adventure', rating: 4.9, price: 1600, image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80', tags: ['History', 'Trekking', 'Wonder'], desc: 'The legendary Inca citadel perched in the Andes — one of humanity\'s greatest archaeological wonders.' },
  { id: 5, name: 'Paris', country: 'France', continent: 'Europe', type: 'city', rating: 4.8, price: 2000, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', tags: ['Art', 'Cuisine', 'Romance'], desc: 'The City of Light dazzles with the Eiffel Tower, world-class museums, and legendary cuisine.' },
  { id: 6, name: 'Serengeti', country: 'Tanzania', continent: 'Africa', type: 'adventure', rating: 4.9, price: 2800, image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80', tags: ['Safari', 'Wildlife', 'Nature'], desc: 'Witness the Great Migration — over a million wildebeest crossing the open savanna.' },
  { id: 7, name: 'New York', country: 'USA', continent: 'North America', type: 'city', rating: 4.7, price: 2200, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80', tags: ['Urban', 'Culture', 'Food'], desc: 'The city that never sleeps — Times Square, Central Park, Broadway, and world-class dining await.' },
  { id: 8, name: 'Maldives', country: 'Maldives', continent: 'Asia', type: 'beach', rating: 5.0, price: 3500, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80', tags: ['Luxury', 'Diving', 'Overwater'], desc: 'Crystal-clear lagoons, overwater bungalows, and pristine coral reefs — pure paradise.' },
  { id: 9, name: 'Amalfi Coast', country: 'Italy', continent: 'Europe', type: 'beach', rating: 4.8, price: 2100, image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=600&q=80', tags: ['Scenic', 'Cuisine', 'Coastal'], desc: 'Dramatic cliffs tumbling into the turquoise Mediterranean, dotted with colourful fishing villages.' },
  { id: 10, name: 'Patagonia', country: 'Argentina/Chile', continent: 'South America', type: 'adventure', rating: 4.9, price: 2400, image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80', tags: ['Hiking', 'Glaciers', 'Wild'], desc: 'End-of-the-world landscapes — jagged peaks, glaciers, and untouched wilderness.' },
  { id: 11, name: 'Bangkok', country: 'Thailand', continent: 'Asia', type: 'city', rating: 4.6, price: 700, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80', tags: ['Street Food', 'Temples', 'Nightlife'], desc: 'Magnificent temples, vibrant street markets, and extraordinary street food in a city of contrasts.' },
  { id: 12, name: 'Iceland', country: 'Iceland', continent: 'Europe', type: 'adventure', rating: 4.9, price: 2600, image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=600&q=80', tags: ['Aurora', 'Geothermal', 'Unique'], desc: 'Northern Lights, geysers, waterfalls, and volcanic landscapes — Iceland is like another planet.' },
];

const defaultPackingCategories = {
  documents: { label: 'Documents', icon: '📄', items: ['Passport', 'Visa', 'Travel insurance', 'Flight tickets', 'Hotel bookings', 'Emergency contacts'] },
  clothing: { label: 'Clothing', icon: '👕', items: ['T-shirts (5)', 'Pants (3)', 'Underwear (7)', 'Socks (7)', 'Jacket', 'Swimwear', 'Formal outfit', 'Comfortable shoes', 'Sandals'] },
  toiletries: { label: 'Toiletries', icon: '🧴', items: ['Toothbrush & paste', 'Shampoo', 'Deodorant', 'Sunscreen SPF50+', 'Moisturizer', 'Razor', 'Medicine kit'] },
  tech: { label: 'Tech & Gadgets', icon: '📱', items: ['Phone + charger', 'Power bank', 'Universal adapter', 'Camera', 'Headphones', 'Laptop', 'SD cards'] },
  extras: { label: 'Extras', icon: '🎒', items: ['Water bottle', 'Snacks', 'Travel pillow', 'Eye mask', 'Earplugs', 'Guidebook', 'Local currency'] },
};

export function TravelProvider({ children }) {
  const [page, setPage] = useState('home');

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('tw_theme') || 'amber';
  });

  const [savedIds, setSavedIds] = useState(() => {
    const s = localStorage.getItem('tw_saved');
    return s ? JSON.parse(s) : [1, 5, 8];
  });

  const [trips, setTrips] = useState(() => {
    const s = localStorage.getItem('tw_trips');
    return s ? JSON.parse(s) : [
      {
        id: 1, name: 'Europe Summer 2026', destination: 'Paris', startDate: '2026-07-15', endDate: '2026-07-25',
        budget: 2500, spent: 1240, status: 'upcoming', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80',
        itinerary: [
          { id: 101, day: 1, title: 'Arrival & Eiffel Tower', notes: 'Land at CDG, check in, evening at Eiffel Tower' },
          { id: 102, day: 2, title: 'Louvre & Montmartre', notes: 'Full day at Louvre, evening in Montmartre' },
        ],
        expenses: [
          { id: 201, category: 'Flights', amount: 620, label: 'Round trip flights' },
          { id: 202, category: 'Hotel', amount: 480, label: '5 nights hotel' },
          { id: 203, category: 'Food', amount: 140, label: 'Restaurants & cafés' },
        ]
      },
      {
        id: 2, name: 'Bali Retreat', destination: 'Bali', startDate: '2026-09-01', endDate: '2026-09-10',
        budget: 1200, spent: 0, status: 'planning', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80',
        itinerary: [],
        expenses: []
      },
    ];
  });

  const [packingCategories, setPackingCategories] = useState(() => {
    const s = localStorage.getItem('tw_packing_categories');
    return s ? JSON.parse(s) : defaultPackingCategories;
  });

  const [packingList, setPackingList] = useState(() => {
    const s = localStorage.getItem('tw_packing');
    if (s) return JSON.parse(s);
    const initial = {};
    Object.keys(defaultPackingCategories).forEach(cat => {
      initial[cat] = defaultPackingCategories[cat].items.map((item, i) => ({ id: `${cat}-${i}`, label: item, checked: false }));
    });
    return initial;
  });

  const [selectedDest, setSelectedDest] = useState(null);

  useEffect(() => {
    localStorage.setItem('tw_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => { localStorage.setItem('tw_saved', JSON.stringify(savedIds)); }, [savedIds]);
  useEffect(() => { localStorage.setItem('tw_trips', JSON.stringify(trips)); }, [trips]);
  useEffect(() => { localStorage.setItem('tw_packing_categories', JSON.stringify(packingCategories)); }, [packingCategories]);
  useEffect(() => { localStorage.setItem('tw_packing', JSON.stringify(packingList)); }, [packingList]);

  const toggleSave = (id) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const addTrip = (trip) => {
    setTrips(prev => [...prev, { ...trip, id: Date.now(), itinerary: [], expenses: [] }]);
  };

  const deleteTrip = (tripId) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
  };

  const addItineraryDay = (tripId, day) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, itinerary: [...t.itinerary, { ...day, id: Date.now(), day: Number(day.day) }].sort((a,b) => a.day - b.day) } : t));
  };

  const deleteItineraryDay = (tripId, dayId) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, itinerary: t.itinerary.filter(d => d.id !== dayId) } : t));
  };

  const addExpense = (tripId, expense) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      const newSpent = t.spent + Number(expense.amount);
      return { ...t, spent: newSpent, expenses: [...t.expenses, { ...expense, id: Date.now() }] };
    }));
  };

  const deleteExpense = (tripId, expenseId) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      const exp = t.expenses.find(e => e.id === expenseId);
      const amt = exp ? Number(exp.amount) : 0;
      return {
        ...t,
        spent: Math.max(0, t.spent - amt),
        expenses: t.expenses.filter(e => e.id !== expenseId)
      };
    }));
  };

  const editExpense = (tripId, expenseId, updatedExpense) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      const exp = t.expenses.find(e => e.id === expenseId);
      const diff = Number(updatedExpense.amount) - (exp ? Number(exp.amount) : 0);
      return {
        ...t,
        spent: Math.max(0, t.spent + diff),
        expenses: t.expenses.map(e => e.id === expenseId ? { ...e, ...updatedExpense } : e)
      };
    }));
  };

  const togglePacking = (cat, id) => {
    setPackingList(prev => ({
      ...prev,
      [cat]: (prev[cat] || []).map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    }));
  };

  const addPackingItem = (cat, label) => {
    setPackingList(prev => ({
      ...prev,
      [cat]: [...(prev[cat] || []), { id: `${cat}-${Date.now()}`, label, checked: false }]
    }));
  };

  const deletePackingItem = (cat, id) => {
    setPackingList(prev => ({
      ...prev,
      [cat]: (prev[cat] || []).filter(item => item.id !== id)
    }));
  };

  const clearCheckedPackingItems = (cat) => {
    setPackingList(prev => ({
      ...prev,
      [cat]: (prev[cat] || []).filter(item => !item.checked)
    }));
  };

  const checkAllPackingItems = (cat) => {
    setPackingList(prev => ({
      ...prev,
      [cat]: (prev[cat] || []).map(item => ({ ...item, checked: true }))
    }));
  };

  const addPackingCategory = (label, icon) => {
    const key = label.toLowerCase().replace(/[^a-z0-9]/g, '_');
    if (!key) return;
    setPackingCategories(prev => ({
      ...prev,
      [key]: { label, icon, items: [] }
    }));
    setPackingList(prev => ({
      ...prev,
      [key]: []
    }));
  };

  const deletePackingCategory = (key) => {
    setPackingCategories(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setPackingList(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  return (
    <TravelContext.Provider value={{
      page, setPage,
      theme, setTheme,
      destinations, savedIds, toggleSave,
      trips, addTrip, deleteTrip, addItineraryDay, deleteItineraryDay, addExpense, deleteExpense, editExpense,
      packingList, packingCategories, togglePacking, addPackingItem, deletePackingItem, clearCheckedPackingItems, checkAllPackingItems, addPackingCategory, deletePackingCategory,
      selectedDest, setSelectedDest,
    }}>
      {children}
    </TravelContext.Provider>
  );
}

export const useTravel = () => useContext(TravelContext);

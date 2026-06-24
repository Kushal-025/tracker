import sqlite3Pkg from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const sqlite3 = sqlite3Pkg.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = resolve(__dirname, 'database.sqlite');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to travel database', err);
  } else {
    console.log('Connected to travel SQLite database at:', dbPath);
  }
});

// Run a query and return a promise
export function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}

// Get all results
export function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Get a single result
export function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Initialize tables
export async function initializeDatabase() {
  // 1. Settings Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // 2. Saved IDs Table (wishlist)
  await dbRun(`
    CREATE TABLE IF NOT EXISTS saved_ids (
      destination_id INTEGER PRIMARY KEY
    )
  `);

  // 3. Trips Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      destination TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      budget REAL NOT NULL,
      spent REAL DEFAULT 0,
      status TEXT NOT NULL,
      image TEXT
    )
  `);

  // 4. Itineraries Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS itineraries (
      id TEXT PRIMARY KEY,
      trip_id TEXT NOT NULL,
      day INTEGER NOT NULL,
      title TEXT NOT NULL,
      notes TEXT,
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
    )
  `);

  // 5. Expenses Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      trip_id TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      label TEXT,
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
    )
  `);

  // 6. Packing Categories Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS packing_categories (
      key TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      icon TEXT
    )
  `);

  // 7. Packing List Table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS packing_list (
      id TEXT PRIMARY KEY,
      category_key TEXT NOT NULL,
      label TEXT NOT NULL,
      checked INTEGER DEFAULT 0,
      FOREIGN KEY (category_key) REFERENCES packing_categories(key) ON DELETE CASCADE
    )
  `);

  // Seed default settings if empty
  const theme = await dbGet("SELECT value FROM settings WHERE key = 'theme'");
  if (!theme) {
    await dbRun("INSERT INTO settings (key, value) VALUES ('theme', 'amber')");
  }

  // Seed default saved IDs if empty
  const checkSaved = await dbGet("SELECT COUNT(*) as count FROM saved_ids");
  if (checkSaved.count === 0) {
    console.log('Seeding default saved destinations...');
    await dbRun("INSERT INTO saved_ids (destination_id) VALUES (1)");
    await dbRun("INSERT INTO saved_ids (destination_id) VALUES (5)");
    await dbRun("INSERT INTO saved_ids (destination_id) VALUES (8)");
  }

  // Seed default trips if empty
  const countTrips = await dbGet("SELECT COUNT(*) as count FROM trips");
  if (countTrips.count === 0) {
    console.log('Seeding default trips...');
    const defaultTrips = [
      {
        id: '1', name: 'Europe Summer 2026', destination: 'Paris', startDate: '2026-07-15', endDate: '2026-07-25',
        budget: 2500, spent: 1240, status: 'upcoming', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80',
        itinerary: [
          { id: '101', day: 1, title: 'Arrival & Eiffel Tower', notes: 'Land at CDG, check in, evening at Eiffel Tower' },
          { id: '102', day: 2, title: 'Louvre & Montmartre', notes: 'Full day at Louvre, evening in Montmartre' }
        ],
        expenses: [
          { id: '201', category: 'Flights', amount: 620, label: 'Round trip flights' },
          { id: '202', category: 'Hotel', amount: 480, label: '5 nights hotel' },
          { id: '203', category: 'Food', amount: 140, label: 'Restaurants & cafés' }
        ]
      },
      {
        id: '2', name: 'Bali Retreat', destination: 'Bali', startDate: '2026-09-01', endDate: '2026-09-10',
        budget: 1200, spent: 0, status: 'planning', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80',
        itinerary: [],
        expenses: []
      }
    ];

    for (const t of defaultTrips) {
      await dbRun(
        "INSERT INTO trips (id, name, destination, startDate, endDate, budget, spent, status, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [t.id, t.name, t.destination, t.startDate, t.endDate, t.budget, t.spent, t.status, t.image]
      );

      for (const item of t.itinerary) {
        await dbRun(
          "INSERT INTO itineraries (id, trip_id, day, title, notes) VALUES (?, ?, ?, ?, ?)",
          [item.id, t.id, item.day, item.title, item.notes]
        );
      }

      for (const exp of t.expenses) {
        await dbRun(
          "INSERT INTO expenses (id, trip_id, category, amount, label) VALUES (?, ?, ?, ?, ?)",
          [exp.id, t.id, exp.category, exp.amount, exp.label]
        );
      }
    }
  }

  // Seed default packing categories & items if empty
  const checkPackingCats = await dbGet("SELECT COUNT(*) as count FROM packing_categories");
  if (checkPackingCats.count === 0) {
    console.log('Seeding default packing categories and checklists...');
    const defaultPackingCategories = {
      documents: { label: 'Documents', icon: '📄', items: ['Passport', 'Visa', 'Travel insurance', 'Flight tickets', 'Hotel bookings', 'Emergency contacts'] },
      clothing: { label: 'Clothing', icon: '👕', items: ['T-shirts (5)', 'Pants (3)', 'Underwear (7)', 'Socks (7)', 'Jacket', 'Swimwear', 'Formal outfit', 'Comfortable shoes', 'Sandals'] },
      toiletries: { label: 'Toiletries', icon: '🧴', items: ['Toothbrush & paste', 'Shampoo', 'Deodorant', 'Sunscreen SPF50+', 'Moisturizer', 'Razor', 'Medicine kit'] },
      tech: { label: 'Tech & Gadgets', icon: '📱', items: ['Phone + charger', 'Power bank', 'Universal adapter', 'Camera', 'Headphones', 'Laptop', 'SD cards'] },
      extras: { label: 'Extras', icon: '🎒', items: ['Water bottle', 'Snacks', 'Travel pillow', 'Eye mask', 'Earplugs', 'Guidebook', 'Local currency'] }
    };

    for (const key of Object.keys(defaultPackingCategories)) {
      const cat = defaultPackingCategories[key];
      await dbRun(
        "INSERT INTO packing_categories (key, label, icon) VALUES (?, ?, ?)",
        [key, cat.label, cat.icon]
      );

      for (let i = 0; i < cat.items.length; i++) {
        await dbRun(
          "INSERT INTO packing_list (id, category_key, label, checked) VALUES (?, ?, ?, 0)",
          [`${key}-${i}`, key, cat.items[i]]
        );
      }
    }
  }
}

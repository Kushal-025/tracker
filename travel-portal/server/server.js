import express from 'express';
import cors from 'cors';
import { initializeDatabase, dbAll, dbRun, dbGet } from './database.js';

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase()
  .then(() => console.log('Travel database initialized.'))
  .catch(err => console.error('Travel database initialization failed:', err));

// Endpoints

// 1. Get complete state for the portal
app.get('/api/state', async (req, res) => {
  try {
    // Theme
    const themeRow = await dbGet("SELECT value FROM settings WHERE key = 'theme'");
    const theme = themeRow ? themeRow.value : 'amber';

    // Saved IDs
    const savedRows = await dbAll('SELECT destination_id FROM saved_ids');
    const savedIds = savedRows.map(r => r.destination_id);

    // Trips, itineraries, expenses
    const trips = await dbAll('SELECT * FROM trips');
    for (const t of trips) {
      t.itinerary = await dbAll('SELECT * FROM itineraries WHERE trip_id = ? ORDER BY day ASC', [t.id]);
      t.expenses = await dbAll('SELECT * FROM expenses WHERE trip_id = ?', [t.id]);
    }

    // Packing categories
    const categoriesRows = await dbAll('SELECT * FROM packing_categories');
    const packingCategories = {};
    categoriesRows.forEach(r => {
      packingCategories[r.key] = { label: r.label, icon: r.icon, items: [] };
    });

    // Packing list
    const listRows = await dbAll('SELECT * FROM packing_list');
    const packingList = {};
    categoriesRows.forEach(c => { packingList[c.key] = []; });
    listRows.forEach(item => {
      if (!packingList[item.category_key]) packingList[item.category_key] = [];
      packingList[item.category_key].push({
        id: item.id,
        label: item.label,
        checked: item.checked === 1
      });
    });

    res.json({ theme, savedIds, trips, packingCategories, packingList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve state' });
  }
});

// 2. Save theme selection
app.post('/api/theme', async (req, res) => {
  const { theme } = req.body;
  if (!theme) return res.status(400).json({ error: 'Theme missing' });

  try {
    await dbRun(
      `INSERT INTO settings (key, value) VALUES ('theme', ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      [theme]
    );
    res.json({ success: true, theme });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save theme' });
  }
});

// 3. Toggle wishlist destinations
app.post('/api/saved/toggle', async (req, res) => {
  const { id } = req.body;
  if (id === undefined) return res.status(400).json({ error: 'ID missing' });

  try {
    const existing = await dbGet('SELECT * FROM saved_ids WHERE destination_id = ?', [id]);
    if (existing) {
      await dbRun('DELETE FROM saved_ids WHERE destination_id = ?', [id]);
      res.json({ saved: false, id });
    } else {
      await dbRun('INSERT INTO saved_ids (destination_id) VALUES (?)', [id]);
      res.json({ saved: true, id });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to toggle saved ID' });
  }
});

// 4. Log a new trip
app.post('/api/trips', async (req, res) => {
  const { name, destination, startDate, endDate, budget, spent, status, image } = req.body;
  if (!name || !destination || !startDate || !endDate || budget === undefined) {
    return res.status(400).json({ error: 'Missing required trip fields' });
  }

  const id = Date.now().toString();

  try {
    await dbRun(
      `INSERT INTO trips (id, name, destination, startDate, endDate, budget, spent, status, image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, destination, startDate, endDate, parseFloat(budget), parseFloat(spent || 0), status || 'upcoming', image || '']
    );
    const newTrip = await dbGet('SELECT * FROM trips WHERE id = ?', [id]);
    newTrip.itinerary = [];
    newTrip.expenses = [];
    res.status(201).json(newTrip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// 5. Delete a trip
app.delete('/api/trips/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await dbRun('DELETE FROM trips WHERE id = ?', [id]);
    await dbRun('DELETE FROM itineraries WHERE trip_id = ?', [id]);
    await dbRun('DELETE FROM expenses WHERE trip_id = ?', [id]);
    res.json({ success: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

// 6. Add Itinerary Day
app.post('/api/trips/:tripId/itinerary', async (req, res) => {
  const { tripId } = req.params;
  const { day, title, notes } = req.body;
  if (day === undefined || !title) {
    return res.status(400).json({ error: 'Missing required itinerary fields' });
  }

  const id = Date.now().toString();

  try {
    await dbRun(
      `INSERT INTO itineraries (id, trip_id, day, title, notes) VALUES (?, ?, ?, ?, ?)`,
      [id, tripId, parseInt(day), title, notes || '']
    );
    const newDay = await dbGet('SELECT * FROM itineraries WHERE id = ?', [id]);
    res.status(201).json(newDay);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add itinerary day' });
  }
});

// 7. Delete Itinerary Day
app.delete('/api/trips/:tripId/itinerary/:dayId', async (req, res) => {
  const { dayId } = req.params;

  try {
    await dbRun('DELETE FROM itineraries WHERE id = ?', [dayId]);
    res.json({ success: true, dayId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete itinerary day' });
  }
});

// 8. Add/Edit Trip Expense
app.post('/api/trips/:tripId/expenses', async (req, res) => {
  const { tripId } = req.params;
  const { id: expenseId, category, amount, label } = req.body;
  if (!category || amount === undefined) {
    return res.status(400).json({ error: 'Missing required expense fields' });
  }

  const id = expenseId || Date.now().toString();

  try {
    await dbRun(
      `INSERT INTO expenses (id, trip_id, category, amount, label) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET category = excluded.category, amount = excluded.amount, label = excluded.label`,
      [id, tripId, category, parseFloat(amount), label || '']
    );
    
    // Re-calculate spent on trip
    const spentRow = await dbGet('SELECT SUM(amount) as spent FROM expenses WHERE trip_id = ?', [tripId]);
    const spentVal = spentRow.spent || 0;
    await dbRun('UPDATE trips SET spent = ? WHERE id = ?', [spentVal, tripId]);

    const newExpense = await dbGet('SELECT * FROM expenses WHERE id = ?', [id]);
    res.json({ expense: newExpense, spent: spentVal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save expense' });
  }
});

// 9. Delete Trip Expense
app.delete('/api/trips/:tripId/expenses/:expenseId', async (req, res) => {
  const { tripId, expenseId } = req.params;

  try {
    await dbRun('DELETE FROM expenses WHERE id = ?', [expenseId]);
    const spentRow = await dbGet('SELECT SUM(amount) as spent FROM expenses WHERE trip_id = ?', [tripId]);
    const spentVal = spentRow.spent || 0;
    await dbRun('UPDATE trips SET spent = ? WHERE id = ?', [spentVal, tripId]);
    res.json({ success: true, expenseId, spent: spentVal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// 10. Toggle Packing Checked State
app.post('/api/packing/toggle', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'ID missing' });

  try {
    const item = await dbGet('SELECT checked FROM packing_list WHERE id = ?', [id]);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const newVal = item.checked === 1 ? 0 : 1;
    await dbRun('UPDATE packing_list SET checked = ? WHERE id = ?', [newVal, id]);
    res.json({ success: true, id, checked: newVal === 1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to toggle packing item' });
  }
});

// 11. Add Packing Item
app.post('/api/packing/item', async (req, res) => {
  const { category_key, label } = req.body;
  if (!category_key || !label) {
    return res.status(400).json({ error: 'Missing required packing item fields' });
  }

  const id = `${category_key}-${Date.now()}`;

  try {
    await dbRun(
      'INSERT INTO packing_list (id, category_key, label, checked) VALUES (?, ?, ?, 0)',
      [id, category_key, label]
    );
    res.status(201).json({ id, category_key, label, checked: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create packing item' });
  }
});

// 12. Delete Packing Item
app.delete('/api/packing/item/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await dbRun('DELETE FROM packing_list WHERE id = ?', [id]);
    res.json({ success: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete packing item' });
  }
});

// 13. Clear Checked Items in Category
app.post('/api/packing/clear-checked', async (req, res) => {
  const { category_key } = req.body;
  if (!category_key) return res.status(400).json({ error: 'Missing category key' });

  try {
    await dbRun('DELETE FROM packing_list WHERE category_key = ? AND checked = 1', [category_key]);
    res.json({ success: true, category_key });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to clear checked packing items' });
  }
});

// 14. Check All Items in Category
app.post('/api/packing/check-all', async (req, res) => {
  const { category_key } = req.body;
  if (!category_key) return res.status(400).json({ error: 'Missing category key' });

  try {
    await dbRun('UPDATE packing_list SET checked = 1 WHERE category_key = ?', [category_key]);
    res.json({ success: true, category_key });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to check all packing items' });
  }
});

// 15. Add Packing Category
app.post('/api/packing/category', async (req, res) => {
  const { label, icon } = req.body;
  if (!label) return res.status(400).json({ error: 'Missing label' });

  const key = label.toLowerCase().replace(/[^a-z0-9]/g, '_');

  try {
    await dbRun(
      'INSERT INTO packing_categories (key, label, icon) VALUES (?, ?, ?)',
      [key, label, icon || '🎒']
    );
    res.status(201).json({ key, label, icon: icon || '🎒' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create packing category' });
  }
});

// 16. Delete Packing Category
app.delete('/api/packing/category/:key', async (req, res) => {
  const { key } = req.params;

  try {
    await dbRun('DELETE FROM packing_categories WHERE key = ?', [key]);
    await dbRun('DELETE FROM packing_list WHERE category_key = ?', [key]);
    res.json({ success: true, key });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete packing category' });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Travel server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[ERROR] Port ${PORT} is already in use!`);
    console.error(`Please stop any other server running on port ${PORT} and try again.\n`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Unhandled Rejection]', reason);
  process.exit(1);
});

import express from 'express';
import cors from 'cors';
import { initializeDatabase, dbAll, dbRun, dbGet } from './database.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase()
  .then(() => console.log('Database initialized successfully.'))
  .catch(err => console.error('Database initialization failed:', err));

// API Routes

// 1. Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await dbAll('SELECT * FROM transactions ORDER BY date DESC, id DESC');
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve transactions' });
  }
});

// 2. Add a new transaction
app.post('/api/transactions', async (req, res) => {
  const { type, category, description, amount, date, status } = req.body;
  
  if (!type || !category || amount === undefined || !date) {
    return res.status(400).json({ error: 'Missing required transaction fields' });
  }

  const id = Date.now().toString();

  try {
    await dbRun(
      `INSERT INTO transactions (id, type, category, description, amount, date, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, type, category, description || '', parseFloat(amount), date, status || 'Completed']
    );
    
    const newTx = await dbGet('SELECT * FROM transactions WHERE id = ?', [id]);
    res.status(201).json(newTx);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// 3. Edit a transaction
app.put('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  const { type, category, description, amount, date, status } = req.body;

  if (!type || !category || amount === undefined || !date) {
    return res.status(400).json({ error: 'Missing required transaction fields' });
  }

  try {
    const existing = await dbGet('SELECT * FROM transactions WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await dbRun(
      `UPDATE transactions 
       SET type = ?, category = ?, description = ?, amount = ?, date = ?, status = ? 
       WHERE id = ?`,
      [type, category, description || '', parseFloat(amount), date, status || 'Completed', id]
    );

    const updatedTx = await dbGet('SELECT * FROM transactions WHERE id = ?', [id]);
    res.json(updatedTx);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// 4. Delete a transaction
app.delete('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await dbGet('SELECT * FROM transactions WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await dbRun('DELETE FROM transactions WHERE id = ?', [id]);
    res.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// 5. Get settings
app.get('/api/settings', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM settings');
    const settings = {};
    rows.forEach(row => {
      settings[row.key] = row.value;
    });
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve settings' });
  }
});

// 6. Update setting key
app.post('/api/settings', async (req, res) => {
  const { key, value } = req.body;

  if (!key || value === undefined) {
    return res.status(400).json({ error: 'Missing setting key or value' });
  }

  try {
    await dbRun(
      `INSERT INTO settings (key, value) 
       VALUES (?, ?) 
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      [key, value.toString()]
    );
    res.json({ success: true, key, value });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});

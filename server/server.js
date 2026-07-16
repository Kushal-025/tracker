import 'express-async-errors';
import cron from 'node-cron';
import { sendBudgetAlert } from './email.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { initializeDatabase, dbAll, dbRun, dbGet } from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'expenses_tracker_secret_key_2026';

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  initializeDatabase()
    .then(() => console.log('Database initialized successfully.'))
    .catch(err => console.error('Database initialization failed:', err));
}

// ─── Auth Middleware ─────────────────────────────────────────────────────────
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });
  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// ─── API Base ────────────────────────────────────────────────────────────────
const apiBase = '/api/v1';

// ─── Auth Routes ─────────────────────────────────────────────────────────────

// Register
app.post(`${apiBase}/auth/register`, async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const existing = await dbGet('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const id = Date.now().toString();

    // Generate initials from name (first letter of each word, max 2)
    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join('');

    await dbRun(
      `INSERT INTO users (id, name, email, password_hash, initials) VALUES (?, ?, ?, ?, ?)`,
      [id, name.trim(), email.toLowerCase(), password_hash, initials]
    );

    const token = jwt.sign(
      { id, name: name.trim(), email: email.toLowerCase(), initials },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id, name: name.trim(), email: email.toLowerCase(), initials }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post(`${apiBase}/auth/login`, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, initials: user.initials },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, initials: user.initials }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user info
app.get(`${apiBase}/auth/me`, authenticateToken, async (req, res) => {
  try {
    const user = await dbGet('SELECT id, name, email, initials, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

// ─── Transaction Routes ───────────────────────────────────────────────────────

// Get all transactions (for the logged-in user)
app.get(`${apiBase}/transactions`, authenticateToken, async (req, res) => {
  try {
    const transactions = await dbAll(
      `SELECT * FROM transactions WHERE user_id = ? OR user_id = 'default' ORDER BY date DESC, id DESC`,
      [req.user.id]
    );
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve transactions' });
  }
});

// Add a new transaction
app.post(`${apiBase}/transactions`, authenticateToken, async (req, res) => {
  const { type, category, description, amount, date, status } = req.body;
  if (!type || !category || amount === undefined || !date) {
    return res.status(400).json({ error: 'Missing required transaction fields' });
  }
  const id = Date.now().toString();
  try {
    await dbRun(
      `INSERT INTO transactions (id, user_id, type, category, description, amount, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, req.user.id, type, category, description || '', parseFloat(amount), date, status || 'Completed']
    );
    const newTx = await dbGet('SELECT * FROM transactions WHERE id = ?', [id]);
    res.status(201).json(newTx);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Edit a transaction
app.put(`${apiBase}/transactions/:id`, authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { type, category, description, amount, date, status } = req.body;
  if (!type || !category || amount === undefined || !date) {
    return res.status(400).json({ error: 'Missing required transaction fields' });
  }
  try {
    const existing = await dbGet('SELECT * FROM transactions WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'Transaction not found' });

    await dbRun(
      `UPDATE transactions SET type = ?, category = ?, description = ?, amount = ?, date = ?, status = ? WHERE id = ?`,
      [type, category, description || '', parseFloat(amount), date, status || 'Completed', id]
    );
    const updatedTx = await dbGet('SELECT * FROM transactions WHERE id = ?', [id]);
    res.json(updatedTx);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Delete a transaction
app.delete(`${apiBase}/transactions/:id`, authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await dbGet('SELECT * FROM transactions WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'Transaction not found' });

    await dbRun('DELETE FROM transactions WHERE id = ?', [id]);
    res.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// ─── Settings Routes ──────────────────────────────────────────────────────────

// Get settings
app.get(`${apiBase}/settings`, authenticateToken, async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM settings');
    const settings = {};
    rows.forEach(row => { settings[row.key] = row.value; });
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve settings' });
  }
});

// Update setting
app.post(`${apiBase}/settings`, authenticateToken, async (req, res) => {
  const { key, value } = req.body;
  if (!key || value === undefined) {
    return res.status(400).json({ error: 'Missing setting key or value' });
  }
  try {
    await dbRun(
      `INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      [key, value.toString()]
    );
    res.json({ success: true, key, value });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

// ─── Budget Alert Cron ────────────────────────────────────────────────────────
cron.schedule('0 9 * * *', async () => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const expenseRows = await dbAll(
      `SELECT amount FROM transactions WHERE type = 'expense' AND date BETWEEN ? AND ?`,
      [monthStart, monthEnd]
    );
    const totalExpense = expenseRows.reduce((sum, row) => sum + parseFloat(row.amount), 0);
    const budgetRow = await dbGet(`SELECT value FROM settings WHERE key = 'budget_goal'`);
    const budgetGoal = budgetRow ? parseFloat(budgetRow.value) : 0;

    if (budgetGoal && totalExpense > budgetGoal) {
      const to = process.env.ALERT_EMAIL_TO;
      const subject = 'Budget Alert: Monthly limit exceeded';
      const text = `Your expenses this month total $${totalExpense.toFixed(2)}, exceeding your budget of $${budgetGoal.toFixed(2)}.`;
      await sendBudgetAlert(to, subject, text);
    }
  } catch (err) {
    console.error('Budget alert cron job error:', err);
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✅ Express server running on http://localhost:${PORT}`);
  });
}

export default app;

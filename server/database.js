import pkg from 'pg';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';

dotenv.config();

let db;

// Initialize the database connection (async, called in server startup)
export async function initDb() {
  if (db) return db; // already initialized

  if (process.env.POSTGRES_URL && process.env.NODE_ENV !== 'test') {
    const { Pool } = pkg;
    const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
    try {
      // Test connection – simple query
      await pool.query('SELECT 1');
      db = {
        query: (text, params) => pool.query(text, params),
        async run(sql, params) {
          await pool.query(sql, params);
        },
        async all(sql, params) {
          const res = await pool.query(sql, params);
          return res.rows;
        },
        async get(sql, params) {
          const res = await pool.query(sql, params);
          return res.rows[0] || null;
        },
      };
      console.log('✅ Using PostgreSQL database');
    } catch (err) {
      console.warn('⚠️ PostgreSQL connection failed, falling back to SQLite:', err.message);
      // fall through to SQLite block below
    }
  }

  // If db is still undefined (no PG or fallback), use SQLite
  if (!db) {
    const sqliteDriver = sqlite3.verbose();
    const dbFile = process.env.NODE_ENV === 'test' ? ':memory:' : './database.sqlite';
    const originalDb = await open({ filename: dbFile, driver: sqliteDriver.Database });
    db = {
      async run(sql, params = []) {
        return originalDb.run(sql, params);
      },
      async all(sql, params = []) {
        return originalDb.all(sql, params);
      },
      async get(sql, params = []) {
        return originalDb.get(sql, params);
      },
      async query(sql, params = []) {
        const stmt = sql.trim().toUpperCase();
        if (stmt.startsWith('SELECT')) {
          const rows = await originalDb.all(sql, params);
          return { rows };
        }
        await originalDb.run(sql, params);
        return { rows: [] };
      },
    };
    console.log('✅ Using SQLite fallback database');
  }

  return db;
}

// Helper functions (require initDb() to have been called first)
export async function dbRun(sql, params = []) {
  const d = await initDb();
  return d.run(sql, params);
}

export async function dbAll(sql, params = []) {
  const d = await initDb();
  return d.all(sql, params);
}

export async function dbGet(sql, params = []) {
  const d = await initDb();
  return d.get(sql, params);
}

export async function initializeDatabase() {
  await initDb();

  // Users table for authentication
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      initials TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Transactions table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL DEFAULT 'default',
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      status TEXT DEFAULT 'Completed'
    )
  `);

  // Settings table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Seed default settings
  const budget = await dbGet("SELECT value FROM settings WHERE key = 'budget_goal'");
  if (!budget) {
    await dbRun("INSERT OR REPLACE INTO settings (key, value) VALUES ('budget_goal', '2000')");
  }
  const darkMode = await dbGet("SELECT value FROM settings WHERE key = 'dark_mode'");
  if (!darkMode) {
    await dbRun("INSERT OR REPLACE INTO settings (key, value) VALUES ('dark_mode', 'false')");
  }

  // Seed default transactions if empty
  const countRow = await dbGet('SELECT COUNT(*) as count FROM transactions');
  if (countRow && parseInt(countRow.count) === 0) {
    const initialTransactions = [
      { id: '1', user_id: 'default', type: 'income', category: 'Salary', description: 'Monthly Tech Salary', amount: 5000, date: '2026-06-01', status: 'Completed' },
      { id: '2', user_id: 'default', type: 'expense', category: 'Food', description: 'Groceries Swiggy', amount: 150, date: '2026-06-03', status: 'Completed' },
      { id: '3', user_id: 'default', type: 'expense', category: 'Bills', description: 'Electricity Bill', amount: 200, date: '2026-06-04', status: 'Completed' },
      { id: '4', user_id: 'default', type: 'expense', category: 'Entertainment', description: 'Netflix Subscription', amount: 15, date: '2026-06-05', status: 'Completed' },
      { id: '5', user_id: 'default', type: 'income', category: 'Freelance', description: 'Frontend Consulting', amount: 1200, date: '2026-06-08', status: 'Completed' },
    ];
    for (const tx of initialTransactions) {
      await dbRun(
        `INSERT OR REPLACE INTO transactions (id, user_id, type, category, description, amount, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [tx.id, tx.user_id, tx.type, tx.category, tx.description, tx.amount, tx.date, tx.status]
      );
    }
  }
}

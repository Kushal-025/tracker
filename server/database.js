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
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
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
  await dbRun(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      status TEXT DEFAULT 'Completed'
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Seed default settings if empty
  const budget = await dbGet("SELECT value FROM settings WHERE key = 'budget_goal'");
  if (!budget) {
    await dbRun("INSERT INTO settings (key, value) VALUES ('budget_goal', '2000')");
  }

  const darkMode = await dbGet("SELECT value FROM settings WHERE key = 'dark_mode'");
  if (!darkMode) {
    await dbRun("INSERT INTO settings (key, value) VALUES ('dark_mode', 'false')");
  }

  // Seed default transactions if table is empty
  const countRow = await dbGet("SELECT COUNT(*) as count FROM transactions");
  if (countRow.count === 0) {
    console.log('Seeding initial transactions into SQLite...');
    const initialTransactions = [
      { id: '1', type: 'income', category: 'Salary', description: 'Monthly Tech Salary', amount: 5000, date: '2026-06-01', status: 'Completed' },
      { id: '2', type: 'expense', category: 'Food', description: 'Groceries Swiggy', amount: 150, date: '2026-06-03', status: 'Completed' },
      { id: '3', type: 'expense', category: 'Bills', description: 'Electricity Bill', amount: 200, date: '2026-06-04', status: 'Completed' },
      { id: '4', type: 'expense', category: 'Entertainment', description: 'Netflix Subscription', amount: 15, date: '2026-06-05', status: 'Completed' },
      { id: '5', type: 'income', category: 'Freelance', description: 'Frontend Consulting', amount: 1200, date: '2026-06-08', status: 'Completed' },
    ];

    for (const tx of initialTransactions) {
      await dbRun(
        `INSERT INTO transactions (id, type, category, description, amount, date, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [tx.id, tx.type, tx.category, tx.description, tx.amount, tx.date, tx.status]
      );
    }
    console.log('Seeding completed.');
  }
}

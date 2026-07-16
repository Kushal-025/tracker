import request from 'supertest';
import app from '../server/server.js';
import { initializeDatabase, dbRun } from '../server/database.js';

// Helper to clear tables before each test run
async function resetDatabase() {
  // Delete all rows
  await dbRun('DELETE FROM transactions');
  await dbRun('DELETE FROM settings');
  // Re-initialize seed data
  await initializeDatabase();
}

describe('Transaction API routes', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  test('GET /api/v1/transactions returns seeded list', async () => {
    const res = await request(app).get('/api/v1/transactions');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(5);
  });

  test('POST /api/v1/transactions creates a new transaction', async () => {
    const newTx = {
      type: 'expense',
      category: 'Travel',
      description: 'Flight ticket',
      amount: 300,
      date: '2026-07-01'
    };
    const res = await request(app).post('/api/v1/transactions').send(newTx);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(newTx);
    // Verify it appears in GET list
    const listRes = await request(app).get('/api/v1/transactions');
    expect(listRes.body.find((t) => t.id === res.body.id)).toBeDefined();
  });

  test('PUT /api/v1/transactions/:id updates a transaction', async () => {
    // Create a transaction first
    const createRes = await request(app).post('/api/v1/transactions').send({
      type: 'income',
      category: 'Bonus',
      description: 'Yearly bonus',
      amount: 1000,
      date: '2026-07-02'
    });
    const txId = createRes.body.id;
    const updated = { type: 'income', category: 'Bonus', description: 'Updated bonus', amount: 1200, date: '2026-07-02' };
    const res = await request(app).put(`/api/v1/transactions/${txId}`).send(updated);
    expect(res.status).toBe(200);
    expect(res.body.description).toBe('Updated bonus');
    expect(res.body.amount).toBe(1200);
  });

  test('DELETE /api/v1/transactions/:id removes a transaction', async () => {
    const createRes = await request(app).post('/api/v1/transactions').send({
      type: 'expense',
      category: 'Food',
      description: 'Lunch',
      amount: 20,
      date: '2026-07-03'
    });
    const txId = createRes.body.id;
    const delRes = await request(app).delete(`/api/v1/transactions/${txId}`);
    expect(delRes.status).toBe(200);
    const listRes = await request(app).get('/api/v1/transactions');
    expect(listRes.body.find((t) => t.id === txId)).toBeUndefined();
  });
});

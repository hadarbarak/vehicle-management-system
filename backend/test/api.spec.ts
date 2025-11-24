// backend/test/api.spec.ts
import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { app } from '../src/app.js';

describe('vehicles API', () => {
  it('GET /vehicles returns list', async () => {
    const res = await request(app).get('/vehicles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('POST /vehicles denies duplicate plate', async () => {
    const payload = { license_plate: '12-345-67', status: 'Available' };
    const res = await request(app).post('/vehicles').send(payload);
    expect(res.status).toBe(422);
  });
});

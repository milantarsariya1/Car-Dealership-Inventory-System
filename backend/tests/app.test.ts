import 'dotenv/config';
import request from 'supertest';
import app from '../src/app';

describe('Application-level routes', () => {
  it('GET /api/health should return ok status', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, status: 'ok' });
  });

  it('should return a JSON 404 for unknown routes', async () => {
    const res = await request(app).get('/api/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/not found/i);
  });
});

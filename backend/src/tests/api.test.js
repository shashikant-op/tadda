const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tutorialsadda');
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('TutorialsAdda API Unit & Health Tests', () => {
  test('GET / should return success health check', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.message).toContain('TutorialsAdda API is running');
  });

  test('POST /api/v1/auth/register with invalid data should return 400', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'T' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toEqual(false);
  });

  test('GET /api/v1/branches should return branches data', async () => {
    const res = await request(app).get('/api/v1/branches');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.data).toBeDefined();
  });

  test('GET /api/v1/tutorials should return tutorials data', async () => {
    const res = await request(app).get('/api/v1/tutorials');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.data).toBeDefined();
  });

  test('GET /api/v1/nonexistent should return 404', async () => {
    const res = await request(app).get('/api/v1/nonexistent-route-12345');
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toEqual(false);
  });
});

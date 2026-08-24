const request = require('supertest');
const app = require('../app');

describe('authentication rate limiting', () => {
  test('session checks do not consume the failed-login allowance', async () => {
    const responses = await Promise.all(
      Array.from({ length: 25 }, () => request(app).get('/api/v1/auth/me'))
    );

    expect(responses.every((response) => response.statusCode === 401)).toBe(true);
  });

  test('repeated failed login submissions are still rate limited', async () => {
    const responses = [];
    for (let attempt = 0; attempt < 51; attempt += 1) {
      responses.push(await request(app).post('/api/v1/auth/login').send({}));
    }

    expect(responses.slice(0, 50).every((response) => response.statusCode === 400)).toBe(true);
    expect(responses[50].statusCode).toBe(429);
  });
});

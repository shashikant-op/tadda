const request = require('supertest');
const app = require('../app');

describe('production CORS for image uploads', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = 'production';
  });

  afterAll(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  test('allows the production editor origin', async () => {
    const response = await request(app)
      .options('/api/v1/tutorials/upload/image')
      .set('Origin', 'https://tutorialsadda.vercel.app')
      .set('Access-Control-Request-Method', 'POST');

    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-origin']).toBe('https://tutorialsadda.vercel.app');
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });

  test('does not allow the reference site to make credentialed requests', async () => {
    const response = await request(app)
      .options('/api/v1/tutorials/upload/image')
      .set('Origin', 'https://thubf.vercel.app')
      .set('Access-Control-Request-Method', 'POST');

    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });
});

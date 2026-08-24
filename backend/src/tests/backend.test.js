require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

let studentToken;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tutorialsadda');
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Authentication", () => {
  test("user Signup", async () => {
    const username = `shashikant-${Math.random()}`;
    const email = `${username}@gmail.com`;
    const password = "shashikant";
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: username,
        email,
        password
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test("user signup fail with undefined name", async () => {
    const email = `fail-${Math.random()}@gmail.com`;
    const password = "shashikant";
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email,
        password
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("user Login success", async () => {
    const email = `login-${Math.random()}@gmail.com`;
    await request(app).post('/api/v1/auth/register').send({
      name: 'Login User',
      email,
      password: 'shashikant'
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password: 'shashikant' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    studentToken = res.body.data.token;
  });

  test("user Login fail with incorrect password", async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'student@tutorialsadda.com', password: 'wrongpassword' });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test("GET /api/v1/auth/me should return current user when protected", async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("POST /api/v1/auth/logout should logout successfully", async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe("User Profile & Management", () => {
  test("GET /api/v1/users/profile should return user profile", async () => {
    const res = await request(app)
      .get('/api/v1/users/profile')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("PUT /api/v1/users/profile should update profile", async () => {
    const res = await request(app)
      .put('/api/v1/users/profile')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ name: 'Updated Name', bio: 'New bio' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe("Categories & Tutorials APIs", () => {
  test("GET /api/v1/branches should return branches", async () => {
    const res = await request(app).get('/api/v1/branches');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("GET /api/v1/subjects should return subjects", async () => {
    const res = await request(app).get('/api/v1/subjects');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("GET /api/v1/tutorials should return tutorials", async () => {
    const res = await request(app).get('/api/v1/tutorials');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("GET /api/v1/tutorials/search should return search results", async () => {
    const res = await request(app).get('/api/v1/tutorials/search?q=Computer');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe("Bookmarks & Progress APIs", () => {
  test("GET /api/v1/bookmarks without token should return 401", async () => {
    const res = await request(app).get('/api/v1/bookmarks');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test("GET /api/v1/bookmarks with token should return bookmarks", async () => {
    const res = await request(app)
      .get('/api/v1/bookmarks')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("GET /api/v1/progress with token should return progress", async () => {
    const res = await request(app)
      .get('/api/v1/progress')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe("Health Check & Not Found", () => {
  test("GET / should return success health check", async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("GET /api/v1/nonexistent should return 404", async () => {
    const res = await request(app).get('/api/v1/nonexistent-route-12345');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

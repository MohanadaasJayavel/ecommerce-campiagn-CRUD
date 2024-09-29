const request = require('supertest');
const app = require('../app');
const db = require('../database/database');

beforeAll((done) => {
  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, email TEXT UNIQUE)', done);
  });
});

afterAll((done) => {
  db.serialize(() => {
    db.run('DROP TABLE users', done);
  });
});

describe('User Routes', () => {
  test('POST /api/users - create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        username: 'testuser1',
        password: 'Password1234!',
        email: 'testuser1@example.com',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');
  });
  test('GET /api/users - get all users', async () => {
    const response = await request(app)
      .get('/api/users/getall')
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzI3NTg4MDc5LCJleHAiOjE3Mjc1OTE2Nzl9.zqq8ufqR82PKbEt4RPHLBrva8OSFaoVML8zsN6pQ5ow`);

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });
  test('GET /api/users/:id - get user by ID', async () => {
    const response = await request(app)
      .get('/api/users/1')
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzI3NTg4MDc5LCJleHAiOjE3Mjc1OTE2Nzl9.zqq8ufqR82PKbEt4RPHLBrva8OSFaoVML8zsN6pQ5ow`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('username', 'testuser1');
  });
});

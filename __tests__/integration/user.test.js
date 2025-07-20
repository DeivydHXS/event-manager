const request = require('supertest');
const app = require('../../src/app');
const truncate = require('../utils/truncate');

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).not.toHaveProperty('password_hash');
  });

  it('should not be able to register with a duplicated email', async () => {
    await request(app).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });

    const response = await request(app).post('/users').send({
      name: 'Jane Doe',
      email: 'john.doe@example.com',
      password: 'password456',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('User already exists.');
  });
});

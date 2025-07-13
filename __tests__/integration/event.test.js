const request = require('supertest');
const app = require('../../src/app');
const truncate = require('../utils/truncate');
const factory = require('../factories'); // Vamos criar este arquivo a seguir

describe('Events', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to create a new event when authenticated', async () => {
    const user = await factory.create('User');
    const loginResponse = await request(app).post('/sessions').send({
      email: user.email,
      password: 'a-default-password',
    });

    const { token } = loginResponse.body;

    const eventResponse = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Community Meetup',
        description: 'A great meetup about Node.js',
        date: new Date(),
        location: 'Online',
      });

    expect(eventResponse.status).toBe(201);
    expect(eventResponse.body).toHaveProperty('id');
  });

  it('should not be able to create an event without authentication', async () => {
    const response = await request(app).post('/events').send({
      name: 'Unauthorized Meetup',
      description: 'This should fail',
      date: new Date(),
      location: 'Nowhere',
    });

    expect(response.status).toBe(401); // Esperamos um erro de Unauthorized
  });
});

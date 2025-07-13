const request = require('supertest');
const app = require('../../src/app');
const truncate = require('../utils/truncate');

// O 'describe' agrupa testes relacionados
describe('User', () => {
  // Antes de cada teste, limpe o banco de dados
  beforeEach(async () => {
    await truncate();
  });

  // O 'it' ou 'test' define um caso de teste específico
  it('should be able to register a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });

    // 'expect' é onde fazemos as nossas asserções (verificações)
    expect(response.status).toBe(201); // Esperamos que a resposta seja 201 Created
    expect(response.body).toHaveProperty('id'); // Esperamos que o corpo da resposta tenha uma propriedade 'id'
    expect(response.body).not.toHaveProperty('password_hash'); // MUITO IMPORTANTE: garantir que dados sensíveis não são retornados
  });

  it('should not be able to register with a duplicated email', async () => {
    // Primeiro, criamos um usuário para garantir que o email já existe
    await request(app).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });

    // Agora, tentamos criar outro com o mesmo email
    const response = await request(app).post('/users').send({
      name: 'Jane Doe',
      email: 'john.doe@example.com',
      password: 'password456',
    });

    expect(response.status).toBe(400); // Esperamos um erro de Bad Request
    expect(response.body.error).toBe('User already exists.'); // Verificamos a mensagem de erro
  });
});

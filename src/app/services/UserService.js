// src/app/services/UserService.js

const User = require('../models/User');
const AppError = require('../errors/AppError');

class UserService {
  /**
   * Cria um novo usuário.
   * @param {object} userData - Dados do usuário (name, email, password).
   * @returns {Promise<object>} - O objeto do usuário criado (sem dados sensíveis).
   */
  async create(userData) {
    const { email } = userData;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      throw new AppError('User already exists.');
    }

    // O hook 'beforeSave' no modelo User irá tratar da criptografia da senha.
    const user = await User.create(userData);

    // Retorna apenas os dados seguros do usuário.
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}

module.exports = new UserService();

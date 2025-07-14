// src/app/services/SessionService.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authConfig = require('../../config/auth');
const AppError = require('../errors/AppError');

class SessionService {
  /**
   * Autentica um usuário e gera um token JWT.
   * @param {object} credentials - Email e senha do usuário.
   * @returns {Promise<object>} - O objeto do usuário e o token.
   */
  async create(credentials) {
    const { email, password } = credentials;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Usamos uma mensagem genérica por segurança.
      throw new AppError('Invalid credentials.', 401);
    }

    if (!(await user.checkPassword(password))) {
      throw new AppError('Invalid credentials.', 401);
    }

    const { id, name } = user;

    return {
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    };
  }
}

module.exports = new SessionService();

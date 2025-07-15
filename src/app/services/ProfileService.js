// src/app/services/ProfileService.js

const User = require('../models/User');
const AppError = require('../errors/AppError');

class ProfileService {
  /**
   * Busca os dados do perfil do usuário logado.
   * @param {number} userId - O ID do usuário autenticado.
   * @returns {Promise<object>} - Os dados públicos do usuário.
   */
  async get(userId) {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'is_admin'],
    });

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    return user;
  }

  /**
   * Atualiza os dados do perfil do usuário logado.
   * @param {number} userId - O ID do usuário autenticado.
   * @param {object} data - Os dados a serem atualizados (name, email, oldPassword, password).
   * @returns {Promise<object>} - Os dados públicos atualizados do usuário.
   */
  async update(userId, data) {
    const { email, oldPassword, password } = data;

    const user = await User.findByPk(userId);

    if (email && email !== user.email) {
      const userWithNewEmail = await User.findOne({ where: { email } });
      if (userWithNewEmail) {
        throw new AppError('This email is already in use.');
      }
    }

    if (password && !oldPassword) {
      throw new AppError(
        'Old password is required to set a new password.',
        401
      );
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      throw new AppError('Old password does not match.', 401);
    }

    user.password = password;

    await user.update(data);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}

module.exports = new ProfileService();

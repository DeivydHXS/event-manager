const User = require('../models/User');
const AppError = require('../errors/AppError');

class UserService {
  async create(userData) {
    const { email } = userData;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      throw new AppError('User already exists.');
    }

    const user = await User.create(userData);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}

module.exports = new UserService();

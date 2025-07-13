const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const authConfig = require('../../config/auth');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided.' });
  }

  // O token vem no formato "Bearer TOKEN_AQUI"
  const [, token] = authHeader.split(' ');

  const decoded = await promisify(jwt.verify)(token, authConfig.secret);
  const user = await User.findByPk(decoded.id);

  if (!user) {
    return res.status(401).json({ error: 'Invalid user.' });
  }

  req.userId = user.id;
  req.isAdmin = user.is_admin;

  return next();
};

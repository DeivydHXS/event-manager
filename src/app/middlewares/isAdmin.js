const AppError = require('../errors/AppError');

module.exports = (req, res, next) => {
  if (!req.isAdmin) {
    throw new AppError(
      'Forbidden: This resource is accessible only by administrators.',
      403
    );
  }
  return next();
};

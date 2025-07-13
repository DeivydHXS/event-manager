const { factory } = require('factory-girl');
const User = require('../src/app/models/User');

factory.define('User', User, {
  name: 'Test User',
  email: factory.sequence('User.email', (n) => `user${n}@example.com`),
  password: 'a-default-password',
});

module.exports = factory;

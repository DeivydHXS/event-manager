const Sequelize = require('sequelize');
const databaseConfig = require('../config/database');
const User = require('../app/models/User');
const Event = require('../app/models/Event');
const Category = require('../app/models/Category');

const models = [User, Event, Category];
const env = process.env.NODE_ENV || 'development';
const config = databaseConfig[env];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(config);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

module.exports = new Database();

// src/database/index.js
const Sequelize = require('sequelize');
const databaseConfig = require('../config/database');
const User = require('../app/models/User');
const Event = require('../app/models/Event');

const models = [User, Event];

// 1. Determina o ambiente atual (development por padrão)
const env = process.env.NODE_ENV || 'development';
// 2. Seleciona a configuração correta do ficheiro database.js
const config = databaseConfig[env];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // 3. Usa a configuração específica do ambiente para criar a conexão
    this.connection = new Sequelize(config);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

module.exports = new Database();
// module.exports = {
//   dialect: 'sqlite',
//   // Se estiver em ambiente de teste, use test.sqlite, senão, use o padrão.
//   storage:
//     process.env.NODE_ENV === 'test'
//       ? './src/database/test.sqlite'
//       : process.env.DB_STORAGE,
//   define: {
//     timestamps: true,
//     underscored: true,
//     underscoredAll: true,
//   },
//   // Desativa os logs do Sequelize no ambiente de teste para um output mais limpo
//   logging: process.env.NODE_ENV === 'test' ? false : console.log,
// };


// src/config/database.js
require('dotenv').config();

const commonConfig = {
  dialect: 'sqlite',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
  logging: false, // Desativa os logs do SQL no console para um output mais limpo
};

module.exports = {
  development: {
    ...commonConfig,
    storage: process.env.DB_STORAGE || './src/database/database.sqlite',
  },
  test: {
    ...commonConfig,
    storage: './src/database/test.sqlite',
  },
  production: {
    // Exemplo para produção, se necessário no futuro
    // dialect: 'postgres',
    // ...
  },
};
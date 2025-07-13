'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Primeiro, precisamos de obter os IDs dos usuários que já existem (do seeder anterior)
    const users = await queryInterface.sequelize.query(
      `SELECT id from users;`
    );
    const userIds = users[0].map(user => user.id);

    const events = [];

    // Gerar 50 eventos falsos
    for (let i = 0; i < 50; i++) {
      events.push({
        name: faker.lorem.sentence(5),
        description: faker.lorem.paragraph(),
        date: faker.date.soon({ days: 60 }), // Gera datas nos próximos 60 dias
        location: faker.location.city(),
        // Escolhe um ID de usuário aleatório da nossa lista de IDs existentes
        user_id: userIds[Math.floor(Math.random() * userIds.length)],
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('events', events, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('events', null, {});
  }
};
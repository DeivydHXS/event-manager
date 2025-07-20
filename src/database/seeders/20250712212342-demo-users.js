'use strict';
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];
    const fixedPassword = 'password123';
    const hashedPassword = await bcrypt.hash(fixedPassword, 8);

    users.push({
      name: 'admin',
      email: 'admin@admin.com',
      password_hash: await bcrypt.hash('adminpass', 8),
      created_at: new Date(),
      updated_at: new Date(),
    });

    for (let i = 0; i < 15; i++) {
      users.push({
        name: faker.person.fullName(),
        email: faker.internet.email({ provider: 'example.com' }).toLowerCase(),
        password_hash: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove todos os dados inseridos pela seeder
    await queryInterface.bulkDelete('users', null, {});
  },
};

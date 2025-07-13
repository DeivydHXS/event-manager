'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminEmail = 'admin@admin.com';
    await queryInterface.bulkUpdate(
      'users',
      { is_admin: true },
      { email: adminEmail }
    );
  },

  down: async (queryInterface, Sequelize) => {
    const adminEmail = 'admin@admin.com';
    await queryInterface.bulkUpdate(
      'users',
      { is_admin: false },
      { email: adminEmail }
    );
  },
};

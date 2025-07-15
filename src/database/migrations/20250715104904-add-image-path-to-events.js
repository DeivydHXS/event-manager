'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('events', 'image_path', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn('events', 'image_path');
  },
};

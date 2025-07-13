/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('attendances', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      // Chave estrangeira para o evento
      event_id: {
        type: Sequelize.INTEGER,
        references: { model: 'events', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Se o evento for deletado, a inscrição some
        allowNull: false,
      },
      // Chave estrangeira para o usuário
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Se o usuário for deletado, a inscrição some
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('attendances'),
};

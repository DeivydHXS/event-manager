/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('events', 'user_id', {
      // Adiciona a coluna user_id
      type: Sequelize.INTEGER,
      references: { model: 'users', key: 'id' }, // Chave estrangeira
      onUpdate: 'CASCADE', // Se o id do usuário mudar, atualiza aqui também
      onDelete: 'SET NULL', // Se o usuário for deletado, o evento continua existindo
      allowNull: true,
    }),
  down: (queryInterface) => queryInterface.removeColumn('events', 'user_id'),
};

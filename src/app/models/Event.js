const { Model, DataTypes } = require('sequelize');

class Event extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        date: DataTypes.DATE,
        location: DataTypes.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    // Um evento pertence a um usuário (criador)
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'creator' });
    // Um evento tem muitos usuários (participantes), através da tabela 'attendances'
    this.belongsToMany(models.User, {
      foreignKey: 'event_id',
      through: 'attendances',
      as: 'attendees',
    });
  }
}

module.exports = Event;

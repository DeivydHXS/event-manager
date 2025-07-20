const { Model, DataTypes } = require('sequelize');

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: 'categories',
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Event, {
      foreignKey: 'category_id',
      through: 'event_categories',
      as: 'events',
    });
  }
}

module.exports = Category;

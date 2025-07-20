const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: {
          type: DataTypes.VIRTUAL,
          set(value) {
            this.setDataValue('password_hash', bcrypt.hashSync(value, 8));
          },
        },
        password_hash: DataTypes.STRING,
        is_admin: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        hooks: {
          beforeSave: async (user) => {
            if (user.password) {
              user.password_hash = await bcrypt.hash(user.password, 8);
            }
          },
        },
      }
    );

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  static associate(models) {
    this.hasMany(models.Event, {
      foreignKey: 'user_id',
      as: 'created_events',
    });

    this.belongsToMany(models.Event, {
      foreignKey: 'user_id',
      through: 'attendances',
      as: 'attended_events',
    });
  }
}

module.exports = User;

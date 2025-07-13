const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        // O password não é uma coluna no banco, é um campo virtual
        // que usamos para receber a senha e gerar o hash.
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
      }
    );

    return this;
  }

  // Método para verificar se a senha está correta
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  static associate(models) {
    // Um usuário é dono (criador) de muitos eventos
    this.hasMany(models.Event, { foreignKey: 'user_id', as: 'created_events' });
    // Um usuário pode participar de muitos eventos, através da tabela 'attendances'
    this.belongsToMany(models.Event, {
      foreignKey: 'user_id',
      through: 'attendances',
      as: 'attended_events',
    });
  }
}

module.exports = User;

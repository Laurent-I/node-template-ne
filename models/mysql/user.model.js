const { DataTypes, Model } = require('sequelize');
const {mysqlSequelize} = require('../../config/db/sequelize'); // assuming you have a sequelize instance in this file
const bcrypt = require('bcryptjs');
const {roles} = require('../../config/roles');

class User extends Model {
  static async isEmailTaken(email, excludeUserId) {
    const user = await this.findOne({ where: { email, id: { [Op.ne]: excludeUserId } } });
    return !!user;
  }

  async isPasswordMatch(password) {
    return bcrypt.compare(password, this.password);
  }
}

User.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true,
    validate: {
      notContains: 'password',
      is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    }
  },
  role: {
    type: DataTypes.ENUM,
    values: roles, 
    defaultValue: 'user'
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  mysqlSequelize,
  modelName: 'User',
  timestamps: true,
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 8);
      }
    }
  }
});

module.exports = User;
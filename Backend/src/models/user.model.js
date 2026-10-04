// Dummy Sequelize User Model
// Used for architectural visualization; actual operations are handled by Supabase API.

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/connection');

class User extends Model {}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  role: {
    type: DataTypes.ENUM('member', 'admin', 'manager', 'front_desk', 'bar_staff', 'kitchen_staff', 'shop_staff'),
    defaultValue: 'member'
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  underscored: true
});

module.exports = User;

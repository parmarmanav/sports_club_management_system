// Dummy Model Index
// Simulates a centralized Sequelize model registry.

const sequelize = require('../database/connection');
const User = require('./user.model');

// Define associations here if any
// Example: User.hasMany(Booking);

const models = {
  User,
};

module.exports = {
  sequelize,
  ...models
};

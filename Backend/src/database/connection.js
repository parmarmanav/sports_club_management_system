// Dummy ORM Connection file
// The actual connection is handled by Supabase JS client. This is for architectural consistency.

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:5432/sports_club', {
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;

const { Sequelize } = require('sequelize');
const path = require('path');

// Create Sequelize instance with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

// Test connection and sync database
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully (SQLite)');
    // Sync all models with database
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Database models synchronized');
  })
  .catch(err => {
    console.error('❌ Unable to connect to database:', err);
  });

module.exports = { sequelize };

// Made with Bob

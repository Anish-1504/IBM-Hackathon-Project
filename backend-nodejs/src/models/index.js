const { sequelize } = require('../config/database');

// Import model definitions
const UserModel = require('./User');
const ReviewModel = require('./Review');
const RepositoryModel = require('./Repository');

// Initialize models
const User = UserModel(sequelize);
const Review = ReviewModel(sequelize);
const Repository = RepositoryModel(sequelize);

// Define associations
User.hasMany(Review, {
  foreignKey: 'userId',
  as: 'reviews'
});

User.hasMany(Repository, {
  foreignKey: 'userId',
  as: 'repositories'
});

Review.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Review.belongsTo(Repository, {
  foreignKey: 'repositoryId',
  as: 'repository'
});

Repository.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Repository.hasMany(Review, {
  foreignKey: 'repositoryId',
  as: 'reviews'
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Review,
  Repository
};

// Made with Bob
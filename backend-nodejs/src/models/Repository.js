const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Repository = sequelize.define('Repository', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'full_name'
    },
    description: {
      type: DataTypes.TEXT
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    language: {
      type: DataTypes.STRING
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_private'
    },
    stars: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    forks: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastSyncedAt: {
      type: DataTypes.DATE,
      field: 'last_synced_at'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'repositories',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['full_name'],
        unique: true
      }
    ]
  });

  return Repository;
};

// Made with Bob
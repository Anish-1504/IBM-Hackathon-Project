const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
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
    repositoryId: {
      type: DataTypes.UUID,
      field: 'repository_id',
      references: {
        model: 'repositories',
        key: 'id'
      }
    },
    prNumber: {
      type: DataTypes.INTEGER,
      field: 'pr_number'
    },
    prTitle: {
      type: DataTypes.STRING,
      field: 'pr_title'
    },
    prDiff: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'pr_diff'
    },
    analysis: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    overallScore: {
      type: DataTypes.FLOAT,
      field: 'overall_score'
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending'
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
    tableName: 'reviews',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['repository_id']
      },
      {
        fields: ['created_at']
      }
    ]
  });

  // Instance methods
  Review.prototype.toJSON = function() {
    const values = { ...this.get() };
    // Parse analysis if it's a string
    if (typeof values.analysis === 'string') {
      try {
        values.analysis = JSON.parse(values.analysis);
      } catch (e) {
        // Keep as is if parsing fails
      }
    }
    return values;
  };

  return Review;
};

// Made with Bob
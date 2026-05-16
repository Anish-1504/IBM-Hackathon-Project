const { Review, Repository } = require('../models');
const reviewService = require('../services/review.service');

class ReviewController {
  async analyzeReview(req, res) {
    try {
      const { prDiff, repositoryId, prNumber, prTitle } = req.body;
      const userId = req.user.userId;

      // Validate repository if provided
      if (repositoryId) {
        const repository = await Repository.findOne({
          where: { id: repositoryId, userId }
        });

        if (!repository) {
          return res.status(404).json({ error: 'Repository not found' });
        }
      }

      // Perform analysis
      const result = await reviewService.analyzeReview(
        prDiff,
        userId,
        repositoryId,
        prNumber,
        prTitle
      );

      res.json(result);
    } catch (error) {
      console.error('Review analysis error:', error);
      res.status(500).json({ 
        error: error.message || 'Analysis failed' 
      });
    }
  }

  async getReview(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const review = await Review.findOne({
        where: { id, userId },
        include: [
          {
            model: Repository,
            as: 'repository',
            attributes: ['id', 'name', 'fullName', 'url']
          }
        ]
      });

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      res.json(review);
    } catch (error) {
      console.error('Get review error:', error);
      res.status(500).json({ error: 'Failed to fetch review' });
    }
  }

  async listReviews(req, res) {
    try {
      const userId = req.user.userId;
      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;
      const repositoryId = req.query.repositoryId;

      const where = { userId };
      if (repositoryId) {
        where.repositoryId = repositoryId;
      }

      const { count, rows: reviews } = await Review.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Repository,
            as: 'repository',
            attributes: ['id', 'name', 'fullName', 'url']
          }
        ]
      });

      res.json({
        reviews,
        pagination: {
          limit,
          offset,
          total: count
        }
      });
    } catch (error) {
      console.error('List reviews error:', error);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  }

  async deleteReview(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const review = await Review.findOne({
        where: { id, userId }
      });

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      await review.destroy();

      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Delete review error:', error);
      res.status(500).json({ error: 'Failed to delete review' });
    }
  }

  async getReviewStats(req, res) {
    try {
      const userId = req.user.userId;

      const totalReviews = await Review.count({ where: { userId } });
      
      const avgScore = await Review.findOne({
        where: { userId },
        attributes: [
          [require('sequelize').fn('AVG', require('sequelize').col('overall_score')), 'avgScore']
        ],
        raw: true
      });

      const recentReviews = await Review.findAll({
        where: { userId },
        limit: 5,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'prTitle', 'overallScore', 'createdAt']
      });

      res.json({
        totalReviews,
        averageScore: avgScore?.avgScore || 0,
        recentReviews
      });
    } catch (error) {
      console.error('Get review stats error:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }
}

module.exports = new ReviewController();

// Made with Bob
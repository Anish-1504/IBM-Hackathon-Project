const express = require('express');
const { validationResult } = require('express-validator');
const reviewController = require('../controllers/review.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const {
  analyzeReviewValidator,
  reviewIdValidator,
  listReviewsValidator
} = require('../utils/validators');

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// All routes require authentication
router.use(authMiddleware);

// Review routes
router.post('/analyze', analyzeReviewValidator, validate, reviewController.analyzeReview);
router.get('/stats', reviewController.getReviewStats);
router.get('/', listReviewsValidator, validate, reviewController.listReviews);
router.get('/:id', reviewIdValidator, validate, reviewController.getReview);
router.delete('/:id', reviewIdValidator, validate, reviewController.deleteReview);

module.exports = router;

// Made with Bob

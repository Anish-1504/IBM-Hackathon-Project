const { body, param, query } = require('express-validator');

// Auth validators
const registerValidator = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be 3-30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  body('fullName')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Full name must be less than 100 characters')
];

const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Review validators
const analyzeReviewValidator = [
  body('prDiff')
    .notEmpty()
    .withMessage('PR diff is required')
    .isLength({ max: 100000 })
    .withMessage('PR diff is too large'),
  body('repositoryId')
    .optional()
    .isUUID()
    .withMessage('Invalid repository ID'),
  body('prNumber')
    .optional()
    .isInt({ min: 1 })
    .withMessage('PR number must be a positive integer'),
  body('prTitle')
    .optional()
    .isLength({ max: 200 })
    .withMessage('PR title must be less than 200 characters')
];

const reviewIdValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid review ID')
];

const listReviewsValidator = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be non-negative'),
  query('repositoryId')
    .optional()
    .isUUID()
    .withMessage('Invalid repository ID')
];

// Profile validators
const updateProfileValidator = [
  body('fullName')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Full name must be less than 100 characters'),
  body('githubToken')
    .optional()
    .isString()
    .withMessage('GitHub token must be a string')
];

module.exports = {
  registerValidator,
  loginValidator,
  analyzeReviewValidator,
  reviewIdValidator,
  listReviewsValidator,
  updateProfileValidator
};

// Made with Bob
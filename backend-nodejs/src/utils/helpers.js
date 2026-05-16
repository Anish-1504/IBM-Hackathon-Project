const crypto = require('crypto');

/**
 * Generate a random token
 */
function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Sanitize error message for client
 */
function sanitizeError(error) {
  if (process.env.NODE_ENV === 'production') {
    return 'An error occurred';
  }
  return error.message || 'Unknown error';
}

/**
 * Parse pagination parameters
 */
function parsePagination(query) {
  const limit = Math.min(parseInt(query.limit) || 20, 100);
  const offset = Math.max(parseInt(query.offset) || 0, 0);
  return { limit, offset };
}

/**
 * Calculate pagination metadata
 */
function getPaginationMeta(total, limit, offset) {
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;
  const hasNext = offset + limit < total;
  const hasPrev = offset > 0;

  return {
    total,
    limit,
    offset,
    totalPages,
    currentPage,
    hasNext,
    hasPrev
  };
}

/**
 * Format date to ISO string
 */
function formatDate(date) {
  return date ? new Date(date).toISOString() : null;
}

/**
 * Validate UUID format
 */
function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry async function with exponential backoff
 */
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, i);
      await sleep(delay);
    }
  }
}

/**
 * Truncate string to specified length
 */
function truncate(str, length = 100, suffix = '...') {
  if (!str || str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
}

/**
 * Deep clone object
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Remove undefined and null values from object
 */
function cleanObject(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

/**
 * Calculate average from array of numbers
 */
function average(numbers) {
  if (!numbers || numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}

/**
 * Group array by key
 */
function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
}

module.exports = {
  generateToken,
  sanitizeError,
  parsePagination,
  getPaginationMeta,
  formatDate,
  isValidUUID,
  sleep,
  retryWithBackoff,
  truncate,
  deepClone,
  cleanObject,
  average,
  groupBy
};

// Made with Bob
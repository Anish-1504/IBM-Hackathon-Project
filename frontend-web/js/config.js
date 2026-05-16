// API Configuration
const API_CONFIG = {
    baseURL: 'http://localhost:5000/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
};

// Storage keys
const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER: 'user_data'
};

// API Endpoints
const API_ENDPOINTS = {
    // Auth
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    
    // Reviews
    ANALYZE: '/reviews/analyze',
    REVIEWS: '/reviews',
    REVIEW_STATS: '/reviews/stats',
    REVIEW_BY_ID: (id) => `/reviews/${id}`
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, STORAGE_KEYS, API_ENDPOINTS };
}

// Made with Bob

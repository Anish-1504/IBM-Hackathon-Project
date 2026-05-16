// API utility class for making HTTP requests
class API {
    static async request(endpoint, options = {}) {
        const url = `${API_CONFIG.baseURL}${endpoint}`;
        const token = Auth.getToken();

        const config = {
            method: options.method || 'GET',
            headers: {
                ...API_CONFIG.headers,
                ...options.headers
            }
        };

        // Add authorization header if token exists
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Add body if present
        if (options.body) {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                const isAuthEndpoint = endpoint === API_ENDPOINTS.LOGIN ||
                    endpoint === API_ENDPOINTS.REGISTER;

                // Only clear session on 401 for protected routes (not failed login/register)
                if (response.status === 401 && !isAuthEndpoint && Auth.isAuthenticated()) {
                    Auth.removeToken();
                    Auth.removeUser();
                    window.location.href = getLoginPageUrl();
                    throw new Error('Session expired. Please login again.');
                }

                const validationMessage = data.errors?.map((e) => e.msg).join('. ');
                throw new Error(
                    data.error || data.message || validationMessage || 'Request failed'
                );
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    static async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    static async post(endpoint, body) {
        return this.request(endpoint, { method: 'POST', body });
    }

    static async put(endpoint, body) {
        return this.request(endpoint, { method: 'PUT', body });
    }

    static async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Auth endpoints
    static async register(userData) {
        return this.post(API_ENDPOINTS.REGISTER, userData);
    }

    static async login(credentials) {
        return this.post(API_ENDPOINTS.LOGIN, credentials);
    }

    static async getProfile() {
        return this.get(API_ENDPOINTS.PROFILE);
    }

    static async updateProfile(userData) {
        return this.put(API_ENDPOINTS.PROFILE, userData);
    }

    // Review endpoints
    static async analyzeCode(reviewData) {
        return this.post(API_ENDPOINTS.ANALYZE, reviewData);
    }

    static async getReviews(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `${API_ENDPOINTS.REVIEWS}?${queryString}` : API_ENDPOINTS.REVIEWS;
        return this.get(endpoint);
    }

    static async getReview(id) {
        return this.get(API_ENDPOINTS.REVIEW_BY_ID(id));
    }

    static async deleteReview(id) {
        return this.delete(API_ENDPOINTS.REVIEW_BY_ID(id));
    }

    static async getReviewStats() {
        return this.get(API_ENDPOINTS.REVIEW_STATS);
    }
}

// Resolve login page path from current location (works from / and /pages/)
function getLoginPageUrl() {
    const path = window.location.pathname;
    return path.includes('/pages/') ? 'login.html' : 'pages/login.html';
}

// Utility functions
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

function setLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (button) {
        const btnText = button.querySelector('.btn-text');
        const btnLoader = button.querySelector('.btn-loader');
        
        if (isLoading) {
            button.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoader) btnLoader.style.display = 'inline-flex';
        } else {
            button.disabled = false;
            if (btnText) btnText.style.display = 'inline-flex';
            if (btnLoader) btnLoader.style.display = 'none';
        }
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getScoreColor(score) {
    if (score >= 80) return '#28a745'; // Green
    if (score >= 60) return '#ffc107'; // Yellow
    if (score >= 40) return '#fd7e14'; // Orange
    return '#dc3545'; // Red
}

function getScoreLabel(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor';
}

// Made with Bob

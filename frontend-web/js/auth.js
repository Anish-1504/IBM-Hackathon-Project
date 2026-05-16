// Authentication utilities
class Auth {
    static getToken() {
        return localStorage.getItem(STORAGE_KEYS.TOKEN);
    }

    static setToken(token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    }

    static removeToken() {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }

    static getUser() {
        const userData = localStorage.getItem(STORAGE_KEYS.USER);
        return userData ? JSON.parse(userData) : null;
    }

    static setUser(user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }

    static removeUser() {
        localStorage.removeItem(STORAGE_KEYS.USER);
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    static logout() {
        this.removeToken();
        this.removeUser();
        const path = window.location.pathname;
        window.location.href = path.includes('/pages/') ? '../index.html' : 'index.html';
    }

    static requireAuth() {
        if (!this.isAuthenticated()) {
            const path = window.location.pathname;
            window.location.href = path.includes('/pages/') ? 'login.html' : 'pages/login.html';
            return false;
        }
        return true;
    }

    static updateNavigation() {
        const isAuth = this.isAuthenticated();
        const user = this.getUser();

        // Update navigation links
        const loginLink = document.getElementById('loginLink');
        const registerLink = document.getElementById('registerLink');
        const dashboardLink = document.getElementById('dashboardLink');
        const logoutLink = document.getElementById('logoutLink');
        const getStartedBtn = document.getElementById('getStartedBtn');
        const ctaBtn = document.getElementById('ctaBtn');

        if (isAuth) {
            // Hide login/register, show dashboard/logout
            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';
            if (dashboardLink) dashboardLink.style.display = 'block';
            if (logoutLink) {
                logoutLink.style.display = 'block';
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }

            // Update CTA buttons to go to dashboard
            if (getStartedBtn) {
                getStartedBtn.href = 'pages/dashboard.html';
                getStartedBtn.textContent = 'Go to Dashboard';
            }
            if (ctaBtn) {
                ctaBtn.href = 'pages/dashboard.html';
                ctaBtn.textContent = 'Go to Dashboard';
            }

            // Update user name if element exists
            const userName = document.getElementById('userName');
            if (userName && user) {
                userName.textContent = user.fullName || user.username || user.email;
            }
        } else {
            // Show login/register, hide dashboard/logout
            if (loginLink) loginLink.style.display = 'block';
            if (registerLink) registerLink.style.display = 'block';
            if (dashboardLink) dashboardLink.style.display = 'none';
            if (logoutLink) logoutLink.style.display = 'none';
        }
    }
}

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', () => {
    Auth.updateNavigation();
});

// Made with Bob

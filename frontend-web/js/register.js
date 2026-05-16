// Register page functionality
document.addEventListener('DOMContentLoaded', () => {
    initPublicNav('register');

    if (Auth.isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }

    const registerForm = document.getElementById('registerForm');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Toggle password visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            
            const icon = togglePassword.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    }

    // Toggle confirm password visibility
    if (toggleConfirmPassword && confirmPasswordInput) {
        toggleConfirmPassword.addEventListener('click', () => {
            const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
            confirmPasswordInput.type = type;
            
            const icon = toggleConfirmPassword.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    }

    // Password strength indicator
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            const password = e.target.value;
            const strength = calculatePasswordStrength(password);
            // You can add visual feedback here
        });
    }

    // Handle register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fullName = document.getElementById('fullName').value.trim();
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;

            // Validation
            if (!username || !email || !password || !confirmPassword) {
                showError('registerError', 'Please fill in all required fields');
                return;
            }

            if (!agreeTerms) {
                showError('registerError', 'Please agree to the Terms of Service');
                return;
            }

            if (password !== confirmPassword) {
                showError('registerError', 'Passwords do not match');
                return;
            }

            if (password.length < 8) {
                showError('registerError', 'Password must be at least 8 characters long');
                return;
            }

            // Check password strength
            if (!isPasswordStrong(password)) {
                showError('registerError', 'Password must contain uppercase, lowercase, and number');
                return;
            }

            // Check username format
            const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
            if (!usernameRegex.test(username)) {
                showError('registerError', 'Username must be 3-30 characters and contain only letters, numbers, underscores, and hyphens');
                return;
            }

            try {
                setLoading('registerBtn', true);

                const userData = {
                    email,
                    username,
                    password,
                    fullName: fullName || undefined
                };

                const response = await API.register(userData);

                // Store token and user data
                Auth.setToken(response.token);
                Auth.setUser(response.user);

                showSuccess('registerSuccess', 'Registration successful! Redirecting...');

                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);

            } catch (error) {
                console.error('Registration error:', error);
                showError('registerError', error.message || 'Registration failed. Please try again.');
            } finally {
                setLoading('registerBtn', false);
            }
        });
    }
});

// Helper functions
function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    return strength;
}

function isPasswordStrong(password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isLongEnough = password.length >= 8;
    
    return hasUpperCase && hasLowerCase && hasNumber && isLongEnough;
}

// Made with Bob

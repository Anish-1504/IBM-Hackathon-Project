// Login page functionality
document.addEventListener('DOMContentLoaded', () => {
    initPublicNav('login');

    if (Auth.isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

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

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            // Basic validation
            if (!email || !password) {
                showError('loginError', 'Please fill in all fields');
                return;
            }

            try {
                setLoading('loginBtn', true);

                const response = await API.login({ email, password });

                // Store token and user data
                Auth.setToken(response.token);
                Auth.setUser(response.user);

                showSuccess('loginSuccess', 'Login successful! Redirecting...');

                // Redirect to dashboard
                const params = new URLSearchParams(window.location.search);
                const redirect = params.get('redirect') || 'dashboard.html';
                setTimeout(() => {
                    window.location.href = redirect;
                }, 1000);

            } catch (error) {
                console.error('Login error:', error);
                showError('loginError', error.message || 'Login failed. Please try again.');
            } finally {
                setLoading('loginBtn', false);
            }
        });
    }

    // Handle "Remember me" functionality
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
        const emailInput = document.getElementById('email');
        const rememberMeCheckbox = document.getElementById('rememberMe');
        if (emailInput) emailInput.value = savedEmail;
        if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
    }

    // Save email if "Remember me" is checked
    const rememberMeCheckbox = document.getElementById('rememberMe');
    if (rememberMeCheckbox) {
        rememberMeCheckbox.addEventListener('change', (e) => {
            const emailInput = document.getElementById('email');
            if (e.target.checked && emailInput) {
                localStorage.setItem('remembered_email', emailInput.value);
            } else {
                localStorage.removeItem('remembered_email');
            }
        });
    }
});

// Made with Bob

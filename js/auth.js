// =====================================================
// AUTHENTICATION HANDLER FOR LOGIN PAGE
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    const loginToggle = document.getElementById('loginToggle');
    const signupToggle = document.getElementById('signupToggle');
    const loginFormContainer = document.getElementById('loginForm');
    const signupFormContainer = document.getElementById('signupForm');
    const loginFormElement = document.getElementById('loginFormElement');
    const signupFormElement = document.getElementById('signupFormElement');
    
    // Check if user is already logged in
    checkAuthStatus();
    
    // Toggle between login and signup
    if (loginToggle && signupToggle) {
        loginToggle.addEventListener('click', function() {
            loginToggle.classList.add('active');
            signupToggle.classList.remove('active');
            loginFormContainer.style.display = 'block';
            signupFormContainer.style.display = 'none';
        });
        
        signupToggle.addEventListener('click', function() {
            signupToggle.classList.add('active');
            loginToggle.classList.remove('active');
            signupFormContainer.style.display = 'block';
            loginFormContainer.style.display = 'none';
        });
    }
    
    // Handle login form submission
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = loginFormElement.querySelector('button[type="submit"]');
            const email = loginFormElement.querySelector('input[type="email"]').value;
            const password = loginFormElement.querySelector('input[type="password"]').value;
            
            // Validate inputs
            if (!email || !password) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Show loading state
            showLoading(submitBtn, 'Logging in...');
            
            try {
                // Attempt to sign in
                const result = await signIn(email, password);
                
                if (result.success) {
                    showNotification('Login successful! Redirecting...', 'success');
                    
                    // Redirect to dashboard after short delay
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    showNotification(result.error || 'Login failed. Please check your credentials.', 'error');
                    hideLoading(submitBtn);
                }
            } catch (error) {
                console.error('Login error:', error);
                showNotification('An error occurred. Please try again.', 'error');
                hideLoading(submitBtn);
            }
        });
    }
    
    // Handle signup form submission
    if (signupFormElement) {
        signupFormElement.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = signupFormElement.querySelector('button[type="submit"]');
            const fullName = signupFormElement.querySelector('input[placeholder*="full name"]').value;
            const email = signupFormElement.querySelector('input[type="email"]').value;
            const phone = signupFormElement.querySelector('input[type="tel"]').value;
            const password = signupFormElement.querySelectorAll('input[type="password"]')[0].value;
            const confirmPassword = signupFormElement.querySelectorAll('input[type="password"]')[1].value;
            const termsCheckbox = signupFormElement.querySelector('input[type="checkbox"]');
            
            // Validate inputs
            if (!fullName || !email || !phone || !password || !confirmPassword) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters long', 'error');
                return;
            }
            
            if (!termsCheckbox.checked) {
                showNotification('Please accept the Terms and Conditions', 'error');
                return;
            }
            
            // Show loading state
            showLoading(submitBtn, 'Creating Account...');
            
            try {
                // Attempt to sign up
                const result = await signUp(email, password, fullName, phone);
                
                if (result.success) {
                    showNotification('Account created successfully! Please check your email to verify your account.', 'success');
                    
                    // Redirect to dashboard after short delay
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 2000);
                } else {
                    showNotification(result.error || 'Signup failed. Please try again.', 'error');
                    hideLoading(submitBtn);
                }
            } catch (error) {
                console.error('Signup error:', error);
                showNotification('An error occurred. Please try again.', 'error');
                hideLoading(submitBtn);
            }
        });
    }
});

// Check if user is already authenticated
async function checkAuthStatus() {
    const authenticated = await isAuthenticated();
    
    if (authenticated) {
        // User is already logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
}

// Check if already logged in
if (isLoggedIn()) {
    const user = getCurrentUser();
    if (user.role === 'ADMIN') {
        window.location.href = 'admin.html';
    } else {
        window.location.href = 'index.html';
    }
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const loginBtn = document.getElementById('loginBtn');
    
    // Hide previous errors
    errorMessage.classList.add('d-none');
    
    // Disable button
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
    
    try {
        const response = await fetch(API_ENDPOINTS.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Save user data
            saveUser(data);
            
            // Redirect based on role
            if (data.role === 'ADMIN') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            // Show error message
            errorMessage.textContent = data.message || 'Invalid email or password';
            errorMessage.classList.remove('d-none');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'An error occurred. Please try again.';
        errorMessage.classList.remove('d-none');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
    }
});
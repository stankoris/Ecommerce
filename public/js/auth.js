// Authentication utility functions

// Save user data to localStorage
function saveUser(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
}

// Get current user from localStorage
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Check if current user is admin
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'ADMIN';
}

// Logout user
function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    window.location.href = 'index.html';
}

// Redirect to login if not authenticated
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Redirect to login if not admin
function requireAdmin() {
    if (!isAdmin()) {
        alert('Access denied. Admin privileges required.');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Update navbar based on authentication status
function updateNavbar() {
    const user = getCurrentUser();
    const authButtons = document.getElementById('authButtons');
    const cartBadge = document.getElementById('cartBadge');
    
    if (!authButtons) return;
    
    if (user) {
        authButtons.innerHTML = `
            <span class="navbar-text me-3">
                Welcome, ${user.firstName}!
            </span>
            ${user.role === 'ADMIN' ? 
                '<a href="admin.html" class="btn btn-warning btn-sm me-2">Admin Panel</a>' : 
                ''}
            <button class="btn btn-outline-light btn-sm" onclick="logout()">Logout</button>
        `;
    } else {
        authButtons.innerHTML = `
            <a href="login.html" class="btn btn-outline-light btn-sm me-2">Login</a>
            <a href="register.html" class="btn btn-light btn-sm">Register</a>
        `;
    }
    
    // Update cart badge
    if (cartBadge) {
        const cart = getCart();
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (itemCount > 0) {
            cartBadge.textContent = itemCount;
            cartBadge.style.display = 'inline';
        } else {
            cartBadge.style.display = 'none';
        }
    }
}

// Cart functions
function getCart() {
    const cartStr = localStorage.getItem('cart');
    return cartStr ? JSON.parse(cartStr) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateNavbar(); // Update cart badge
}

function addToCart(product, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ product, quantity });
    }
    
    saveCart(cart);
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.product.id !== productId);
    saveCart(cart);
}

function updateCartQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.product.id === productId);
    
    if (item) {
        item.quantity = parseInt(quantity);
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart(cart);
        }
    }
}

function clearCart() {
    localStorage.removeItem('cart');
    updateNavbar();
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
}
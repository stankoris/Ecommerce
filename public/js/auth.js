function saveUser(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
}

function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'ADMIN';
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    window.location.href = 'index.html';
}

function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function requireAdmin() {
    if (!isAdmin()) {
        alert('Access denied. Admin privileges required.');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

function updateNavbar() {
    const user = getCurrentUser();
    const authButtons = document.getElementById('authButtons');
    const cartBtn = document.querySelector('.cartBtn');
    
    if (!authButtons) return;
    
    if (user) {

        if (cartBtn) {
            cartBtn.style.display = user.role === 'ADMIN' ? 'none' : 'inline-block';
        }
        
        authButtons.innerHTML = `
            <span class="navbar-text me-3">
                Welcome, ${user.firstName}!
            </span>
            ${user.role === 'ADMIN' ? 
                '<a href="admin.html" class="btn btn-warning btn-sm me-2">Admin Panel</a>' : 
                ''}
            <button class="btn btn-outline-light btn-sm" onclick="logout()"><i class="fa-solid fa-right-from-bracket"></i></button>
        `;
    } else {

        if (cartBtn) {
            cartBtn.style.display = 'inline-block';
        }
        authButtons.innerHTML = `
            <a href="login.html" class="authBtn"><i class="fa-solid fa-circle-user"></i></a>
        `;
    }
}

function getCart() {
    const cartStr = localStorage.getItem('cart');
    return cartStr ? JSON.parse(cartStr) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateNavbar();
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

async function validateToken() {
    const user = getCurrentUser();
    
    if (!user || !user.token) {
        return false;
    }
    
    try {
        const response = await fetch(API_ENDPOINTS.VALIDATE, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.valid;
        }
        
        return false;
    } catch (error) {
        console.error('Token validation error:', error);
        return false;
    }
}

async function checkTokenValidity() {
    if (isLoggedIn()) {
        const isValid = await validateToken();
        if (!isValid) {
            console.log('Token expired or invalid');
            logout();
        }
    }
}

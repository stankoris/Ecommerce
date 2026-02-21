let allProducts = [];
let allCategories = [];

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    loadCategories();
    loadProducts();
});

async function loadCategories() {
    try {
        const response = await fetch(API_ENDPOINTS.CATEGORIES);
        allCategories = await response.json();
        
        const categoryFilters = document.getElementById('categoryFilters');
        
        allCategories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'btn btn-outline category-btn';
            button.setAttribute('data-category', category.id);
            button.textContent = category.name;
            button.onclick = () => filterByCategory(category.id);
            categoryFilters.appendChild(button);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadProducts() {
    try {
        const response = await fetch(API_ENDPOINTS.PRODUCTS);
        allProducts = await response.json();
        renderProducts(allProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productsContainer').innerHTML = `
            <div class="col-md-12">
                <div class="alert alert-danger">Error loading products. Please try again.</div>
            </div>
        `;
    }
}

function renderProducts(products) {
    const container = document.getElementById('productsContainer');
    
    if (products.length === 0) {
        container.innerHTML = `
            <div class="col-md-12">
                <div class="alert alert-info text-center">No products found.</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="col-md-3 mb-4">
            <div class="product-card">
                <!-- Make image and title clickable -->
                <div onclick="goToProductDetails(${product.id})" style="cursor: pointer;">
                    <img src="${product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}" 
                         alt="${product.name}" 
                         class="product-image">
                    <div class="product-body">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-description">${product.description || 'No description available'}</p>
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                        <p class="product-stock ${product.stockQuantity === 0 ? 'out-of-stock' : ''}">
                            ${product.stockQuantity > 0 ? `In Stock: ${product.stockQuantity}` : 'Out of Stock'}
                        </p>
                    </div>
                </div>
                <!-- Add to cart button stays separate -->
                <div style="padding: 0 15px 15px 15px;">
                    <button class="btn btn-primary w-100" 
                            onclick="event.stopPropagation(); addProductToCart(${product.id})"
                            ${product.stockQuantity === 0 ? 'disabled' : ''}>
                        ${product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function goToProductDetails(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

async function filterByCategory(categoryId) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    if (categoryId === 'all') {
        renderProducts(allProducts);
    } else {
        try {
            const response = await fetch(API_ENDPOINTS.PRODUCTS_BY_CATEGORY(categoryId));
            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error('Error filtering products:', error);
        }
    }
}

async function searchProducts() {
    const keyword = document.getElementById('searchInput').value.trim();
    
    if (!keyword) {
        loadProducts();
        return;
    }
    
    try {
        const response = await fetch(API_ENDPOINTS.PRODUCT_SEARCH(keyword));
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error searching products:', error);
    }
}

function addProductToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) {
        alert('Product not found');
        return;
    }
    
    if (product.stockQuantity === 0) {
        alert('This product is out of stock');
        return;
    }
    
    addToCart(product, 1);
    alert(`${product.name} added to cart!`);
}

function showCart() {
    document.getElementById('cartModal').classList.add('show');
    renderCart();
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('show');
}

function renderCart() {
    const cart = getCart();
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const emptyCart = document.getElementById('emptyCart');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '';
        cartSummary.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }
    
    cartSummary.style.display = 'block';
    emptyCart.style.display = 'none';
    
    cartItems.innerHTML = cart.map(item => `
        <div class="card mb-3" style="padding: 15px;">
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="${item.product.imageUrl || 'https://via.placeholder.com/100'}" 
                         alt="${item.product.name}" 
                         style="width: 100%; border-radius: 5px;">
                </div>
                <div class="col-md-4">
                    <h4 style="margin: 0; font-size: 1.1rem;">${item.product.name}</h4>
                    <p style="margin: 5px 0; color: #666;">$${item.product.price.toFixed(2)}</p>
                </div>
                <div class="col-md-3">
                    <label style="display: block; margin-bottom: 5px; font-size: 0.9rem;">Quantity:</label>
                    <input type="number" 
                           value="${item.quantity}" 
                           min="1" 
                           max="${item.product.stockQuantity}"
                           onchange="updateCartQuantity(${item.product.id}, this.value); renderCart();"
                           style="width: 80px; padding: 5px; border: 1px solid #ddd; border-radius: 5px;">
                </div>
                <div class="col-md-2 text-right">
                    <p style="margin: 0; font-weight: bold; font-size: 1.1rem;">
                        $${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                </div>
                <div class="col-md-1 text-right">
                    <button class="btn btn-danger" 
                            onclick="removeFromCart(${item.product.id}); renderCart();"
                            style="padding: 5px 10px; font-size: 0.9rem;">
                        ✕
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('cartTotal').textContent = `$${getCartTotal().toFixed(2)}`;
}

function proceedToCheckout() {
    if (!isLoggedIn()) {
        alert('Please login to proceed to checkout');
        window.location.href = 'login.html?redirect=checkout';
        return;
    }
    
    window.location.href = 'checkout.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
});
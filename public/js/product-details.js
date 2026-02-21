let currentProduct = null;
let allProducts = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    loadProductDetails();
});

// Get product ID from URL
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Load product details
async function loadProductDetails() {
    const productId = getProductIdFromURL();
    
    if (!productId) {
        showError();
        return;
    }
    
    try {
        // Load the specific product
        const response = await fetch(API_ENDPOINTS.PRODUCT_BY_ID(productId));
        
        if (!response.ok) {
            throw new Error('Product not found');
        }
        
        currentProduct = await response.json();
        
        // Load all products for related products
        const allProductsResponse = await fetch(API_ENDPOINTS.PRODUCTS);
        allProducts = await allProductsResponse.json();
        
        // Display product details
        displayProductDetails();
        
        // Load related products
        loadRelatedProducts();
        
    } catch (error) {
        console.error('Error loading product:', error);
        showError();
    }
}

// Display product details
function displayProductDetails() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('productDetails').style.display = 'block';
    
    // Set product information
    document.getElementById('productImage').src = currentProduct.imageUrl || 'https://via.placeholder.com/600x600?text=No+Image';
    document.getElementById('productImage').alt = currentProduct.name;
    document.getElementById('productName').textContent = currentProduct.name;
    document.getElementById('productPrice').textContent = `$${currentProduct.price.toFixed(2)}`;
    document.getElementById('productDescription').textContent = currentProduct.description || 'No description available for this product.';
    
    // Set category
    if (currentProduct.category) {
        document.getElementById('productCategory').textContent = currentProduct.category.name;
    } else {
        document.getElementById('productCategory').textContent = 'Uncategorized';
    }
    
    // Set stock information
    const stockElement = document.getElementById('productStock');
    if (currentProduct.stockQuantity > 0) {
        stockElement.textContent = `In Stock: ${currentProduct.stockQuantity} units available`;
        stockElement.className = 'product-stock';
        document.getElementById('addToCartBtn').disabled = false;
    } else {
        stockElement.textContent = 'Out of Stock';
        stockElement.className = 'product-stock out-of-stock';
        document.getElementById('addToCartBtn').disabled = true;
        document.getElementById('addToCartBtn').textContent = 'Out of Stock';
    }
    
    // Set max quantity
    document.getElementById('quantity').max = currentProduct.stockQuantity;
    
    // Update page title
    document.title = `${currentProduct.name} - E-Commerce Store`;
}

// Load related products (same category)
function loadRelatedProducts() {
    if (!currentProduct.category) {
        return;
    }
    
    // Filter products
    const relatedProducts = allProducts.filter(p => 
        p.category && 
        p.category.id === currentProduct.category.id && 
        p.id !== currentProduct.id
    ).slice(0, 4);
    
    const container = document.getElementById('relatedProducts');
    
    if (relatedProducts.length === 0) {
        container.innerHTML = '<p class="text-center">No related products found.</p>';
        return;
    }
    
    container.innerHTML = relatedProducts.map(product => `
        <div class="col-md-3 mb-4">
            <div class="product-card" onclick="goToProduct(${product.id})" style="cursor: pointer;">
                <img src="${product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}" 
                     alt="${product.name}" 
                     class="product-image">
                <div class="product-body">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <p class="product-stock ${product.stockQuantity === 0 ? 'out-of-stock' : ''}">
                        ${product.stockQuantity > 0 ? `In Stock: ${product.stockQuantity}` : 'Out of Stock'}
                    </p>
                </div>
            </div>
        </div>
    `).join('');
}

function showError() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
}

function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    const currentValue = parseInt(quantityInput.value);
    const maxValue = parseInt(quantityInput.max);
    
    if (currentValue < maxValue) {
        quantityInput.value = currentValue + 1;
    }
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    const currentValue = parseInt(quantityInput.value);
    
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
}

function addToCartFromDetails() {
    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (!currentProduct) {
        alert('Product not found');
        return;
    }
    
    if (currentProduct.stockQuantity === 0) {
        alert('This product is out of stock');
        return;
    }
    
    if (quantity > currentProduct.stockQuantity) {
        alert(`Only ${currentProduct.stockQuantity} units available`);
        return;
    }
    
    addToCart(currentProduct, quantity);
    alert(`${quantity} x ${currentProduct.name} added to cart!`);
    
    document.getElementById('quantity').value = 1;
}

function buyNow() {
    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (!currentProduct) {
        alert('Product not found');
        return;
    }
    
    if (currentProduct.stockQuantity === 0) {
        alert('This product is out of stock');
        return;
    }
    
    if (quantity > currentProduct.stockQuantity) {
        alert(`Only ${currentProduct.stockQuantity} units available`);
        return;
    }

    addToCart(currentProduct, quantity);

    if (!isLoggedIn()) {
        alert('Please login to proceed to checkout');
        window.location.href = 'login.html?redirect=checkout';
        return;
    }

    window.location.href = 'checkout.html';
}

function goToProduct(productId) {
    window.location.href = `product-details.html?id=${productId}`;
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
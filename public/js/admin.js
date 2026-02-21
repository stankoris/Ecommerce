if (!requireAdmin()) {}

let allProducts = [];
let allCategories = [];
let allOrders = [];
let allUsers = [];

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    loadAllData();
});

async function loadAllData() {
    await loadProducts();
    await loadCategories();
    await loadOrders();
    await loadUsers();
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.add('btn-outline');
        btn.classList.remove('btn-primary');
    });
    
    document.getElementById(tabName + 'Tab').style.display = 'block';
    
    event.target.classList.add('active');
    event.target.classList.remove('btn-outline');
    event.target.classList.add('btn-primary');
}

// products
async function loadProducts() {
    try {
        const response = await fetch(API_ENDPOINTS.PRODUCTS);
        allProducts = await response.json();
        renderProductsTable();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function renderProductsTable() {
    const container = document.getElementById('productsTable');
    
    if (allProducts.length === 0) {
        container.innerHTML = '<p class="text-center">No products found.</p>';
        return;
    }
    
    container.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${allProducts.map(product => `
                    <tr>
                        <td>${product.id}</td>
                        <td><img src="${product.imageUrl || 'https://via.placeholder.com/50'}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"></td>
                        <td>${product.name}</td>
                        <td>$${product.price.toFixed(2)}</td>
                        <td>${product.stockQuantity}</td>
                        <td>${product.category ? product.category.name : 'N/A'}</td>
                        <td>
                            <button class="btn btn-warning" style="padding: 5px 10px; margin-right: 5px;" onclick="editProduct(${product.id})">Edit</button>
                            <button class="btn btn-danger" style="padding: 5px 10px;" onclick="deleteProduct(${product.id})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function showProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const title = document.getElementById('productModalTitle');
 
    const categorySelect = document.getElementById('productCategory');
    categorySelect.innerHTML = '<option value="">Select Category</option>' + 
        allCategories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    
    if (productId) {
        const product = allProducts.find(p => p.id === productId);
        title.textContent = 'Edit Product';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stockQuantity;
        document.getElementById('productImage').value = product.imageUrl || '';
        document.getElementById('productCategory').value = product.category ? product.category.id : '';
    } else {
        title.textContent = 'Add Product';
        form.reset();
        document.getElementById('productId').value = '';
    }
    
    modal.classList.add('show');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('show');
}

function editProduct(productId) {
    showProductModal(productId);
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    try {
        await fetch(API_ENDPOINTS.PRODUCT_BY_ID(productId), {
            method: 'DELETE'
        });
        
        alert('Product deleted successfully!');
        loadProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
    }
}

document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productId = document.getElementById('productId').value;
    const categoryId = document.getElementById('productCategory').value;
    
    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stockQuantity: parseInt(document.getElementById('productStock').value),
        imageUrl: document.getElementById('productImage').value,
        category: categoryId ? { id: parseInt(categoryId) } : null
    };
    
    try {
        if (productId) {
            await fetch(API_ENDPOINTS.PRODUCT_BY_ID(productId), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            alert('Product updated successfully!');
        } else {
            await fetch(API_ENDPOINTS.PRODUCTS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            alert('Product created successfully!');
        }
        
        closeProductModal();
        loadProducts();
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Error saving product');
    }
});

// categories
async function loadCategories() {
    try {
        const response = await fetch(API_ENDPOINTS.CATEGORIES);
        allCategories = await response.json();
        renderCategoriesTable();
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

function renderCategoriesTable() {
    const container = document.getElementById('categoriesTable');
    
    if (allCategories.length === 0) {
        container.innerHTML = '<p class="text-center">No categories found.</p>';
        return;
    }
    
    container.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${allCategories.map(category => `
                    <tr>
                        <td>${category.id}</td>
                        <td>${category.name}</td>
                        <td>${category.description || 'N/A'}</td>
                        <td>
                            <button class="btn btn-warning" style="padding: 5px 10px; margin-right: 5px;" onclick="editCategory(${category.id})">Edit</button>
                            <button class="btn btn-danger" style="padding: 5px 10px;" onclick="deleteCategory(${category.id})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function showCategoryModal(categoryId = null) {
    const modal = document.getElementById('categoryModal');
    const form = document.getElementById('categoryForm');
    const title = document.getElementById('categoryModalTitle');
    
    if (categoryId) {
        const category = allCategories.find(c => c.id === categoryId);
        title.textContent = 'Edit Category';
        document.getElementById('categoryId').value = category.id;
        document.getElementById('categoryName').value = category.name;
        document.getElementById('categoryDescription').value = category.description || '';
    } else {
        title.textContent = 'Add Category';
        form.reset();
        document.getElementById('categoryId').value = '';
    }
    
    modal.classList.add('show');
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('show');
}

function editCategory(categoryId) {
    showCategoryModal(categoryId);
}

async function deleteCategory(categoryId) {
    if (!confirm('Are you sure you want to delete this category?')) {
        return;
    }
    
    try {
        await fetch(API_ENDPOINTS.CATEGORY_BY_ID(categoryId), {
            method: 'DELETE'
        });
        
        alert('Category deleted successfully!');
        loadCategories();
    } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category');
    }
}

document.getElementById('categoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const categoryId = document.getElementById('categoryId').value;
    
    const categoryData = {
        name: document.getElementById('categoryName').value,
        description: document.getElementById('categoryDescription').value
    };
    
    try {
        if (categoryId) {
            await fetch(API_ENDPOINTS.CATEGORY_BY_ID(categoryId), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryData)
            });
            alert('Category updated successfully!');
        } else {
            await fetch(API_ENDPOINTS.CATEGORIES, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryData)
            });
            alert('Category created successfully!');
        }
        
        closeCategoryModal();
        loadCategories();
        loadProducts();
    } catch (error) {
        console.error('Error saving category:', error);
        alert('Error saving category');
    }
});

// orders
async function loadOrders() {
    try {
        const response = await fetch(API_ENDPOINTS.ORDERS);
        allOrders = await response.json();
        renderOrdersTable();
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

function renderOrdersTable() {
    const container = document.getElementById('ordersTable');
    
    if (allOrders.length === 0) {
        container.innerHTML = '<p class="text-center">No orders found.</p>';
        return;
    }
    
    container.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${allOrders.map(order => `
                    <tr>
                        <td>#${order.id}</td>
                        <td>${order.user.firstName} ${order.user.lastName}</td>
                        <td>${new Date(order.orderDate).toLocaleDateString()}</td>
                        <td>$${order.totalAmount.toFixed(2)}</td>
                        <td><span class="badge badge-primary">${order.status}</span></td>
                        <td><span class="badge badge-primary">${order.paymentStatus}</span></td>
                        <td>
                            <select onchange="updateOrderStatus(${order.id}, this.value)" class="form-control" style="width: auto; display: inline-block; padding: 5px;">
                                <option value="">Change Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function updateOrderStatus(orderId, status) {
    if (!status) return;
    
    try {
        await fetch(`${API_ENDPOINTS.ORDER_BY_ID(orderId)}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        
        alert('Order status updated successfully!');
        loadOrders();
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('Error updating order status');
    }
}

// users
async function loadUsers() {
    try {
        const response = await fetch(API_ENDPOINTS.USERS);
        allUsers = await response.json();
        renderUsersTable();
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function renderUsersTable() {
    const container = document.getElementById('usersTable');
    
    if (allUsers.length === 0) {
        container.innerHTML = '<p class="text-center">No users found.</p>';
        return;
    }
    
    container.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Registered</th>
                </tr>
            </thead>
            <tbody>
                ${allUsers.map(user => `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.firstName} ${user.lastName}</td>
                        <td>${user.email}</td>
                        <td><span class="badge ${user.role === 'ADMIN' ? 'badge-danger' : 'badge-primary'}">${user.role}</span></td>
                        <td>${user.phone || 'N/A'}</td>
                        <td>${user.city || 'N/A'}</td>
                        <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}
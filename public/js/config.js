const API_BASE_URL = 'http://localhost:8080/api';

const API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    VALIDATE: `${API_BASE_URL}/auth/validate`,

    
    PRODUCTS: `${API_BASE_URL}/products`,
    PRODUCT_BY_ID: (id) => `${API_BASE_URL}/products/${id}`,
    PRODUCTS_BY_CATEGORY: (categoryId) => `${API_BASE_URL}/products/category/${categoryId}`,
    PRODUCT_SEARCH: (keyword) => `${API_BASE_URL}/products/search?keyword=${keyword}`,
    
    CATEGORIES: `${API_BASE_URL}/categories`,
    CATEGORY_BY_ID: (id) => `${API_BASE_URL}/categories/${id}`,
    
    ORDERS: `${API_BASE_URL}/orders`,
    ORDER_BY_ID: (id) => `${API_BASE_URL}/orders/${id}`,
    ORDERS_BY_USER: (userId) => `${API_BASE_URL}/orders/user/${userId}`,
    
    USERS: `${API_BASE_URL}/users`,
    USER_BY_ID: (id) => `${API_BASE_URL}/users/${id}`
};
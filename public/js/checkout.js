if (!requireAuth()) {}

const cart = getCart();
if (cart.length === 0) {
    alert('Your cart is empty!');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    loadUserData();
    renderOrderSummary();
    setupPaymentMethodToggle();
});

function loadUserData() {
    const user = getCurrentUser();
    
    if (user) {
        document.getElementById('firstName').value = user.firstName || '';
        document.getElementById('lastName').value = user.lastName || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
        document.getElementById('address').value = user.address || '';
        document.getElementById('city').value = user.city || '';
        document.getElementById('postalCode').value = user.postalCode || '';
        document.getElementById('country').value = user.country || '';
    }
}

function renderOrderSummary() {
    const cart = getCart();
    const orderItemsContainer = document.getElementById('orderItems');
    
    orderItemsContainer.innerHTML = cart.map(item => `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
            <div style="flex: 1;">
                <div style="font-weight: bold;">${item.product.name}</div>
                <div style="color: #666; font-size: 0.9rem;">Qty: ${item.quantity}</div>
            </div>
            <div style="font-weight: bold;">$${(item.product.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
    
    const subtotal = getCartTotal();
    const shipping = 10.00;
    const tax = subtotal * 0.10;
    const total = subtotal + shipping + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function setupPaymentMethodToggle() {
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const cardDetails = document.getElementById('cardDetails');
    
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'CREDIT_CARD' || e.target.value === 'DEBIT_CARD') {
                cardDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
            }
        });
    });
}

function validateForm() {
    const form = document.getElementById('shippingForm');
    
    if (!form.checkValidity()) {
        alert('Please fill in all required shipping information fields.');
        return false;
    }
    
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') {
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        
        if (!cardNumber || !expiryDate || !cvv) {
            alert('Please fill in all card details.');
            return false;
        }

        if (cardNumber.replace(/\s/g, '').length < 13) {
            alert('Please enter a valid card number.');
            return false;
        }
        
        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            alert('Please enter expiry date in MM/YY format.');
            return false;
        }
        
        if (cvv.length < 3) {
            alert('Please enter a valid CVV.');
            return false;
        }
    }
    
    return true;
}

async function processPayment() {
    if (!validateForm()) {
        return;
    }
    
    const user = getCurrentUser();
    const cart = getCart();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    const shippingAddress = `${document.getElementById('address').value}, ${document.getElementById('city').value}, ${document.getElementById('postalCode').value}, ${document.getElementById('country').value}`;

    const orderItems = cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
    }));

    const orderRequest = {
        userId: user.id,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        items: orderItems
    };
    
    showPaymentModal();
    
    document.getElementById('placeOrderBtn').disabled = true;
    
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const response = await fetch(API_ENDPOINTS.ORDERS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderRequest)
        });
        
        if (!response.ok) {
            throw new Error('Failed to create order');
        }
        
        const order = await response.json();
        
        showPaymentSuccess(order.id);
        
        clearCart();
        
    } catch (error) {
        console.error('Payment error:', error);
        showPaymentError(error.message);
        document.getElementById('placeOrderBtn').disabled = false;
    }
}

function showPaymentModal() {
    document.getElementById('paymentModal').classList.add('show');
    document.getElementById('processingPayment').style.display = 'block';
    document.getElementById('paymentSuccess').style.display = 'none';
    document.getElementById('paymentError').style.display = 'none';
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('show');
}

function showPaymentSuccess(orderId) {
    document.getElementById('processingPayment').style.display = 'none';
    document.getElementById('paymentSuccess').style.display = 'block';
    document.getElementById('orderIdDisplay').textContent = orderId;
}

function showPaymentError(message) {
    document.getElementById('processingPayment').style.display = 'none';
    document.getElementById('paymentError').style.display = 'block';
    document.getElementById('errorMessage').textContent = message;
}

document.getElementById('cardNumber').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
});

document.getElementById('expiryDate').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
});

document.getElementById('cvv').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
});
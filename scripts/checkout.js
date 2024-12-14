document.addEventListener('DOMContentLoaded', () => {
    const cartTable = document.getElementById('cart-table');
    const overallTotal = document.getElementById('overall-total');
    const paymentMethod = document.getElementById('payment-method');
    const cardDetailsContainer = document.getElementById('card-details-container');
    const paymentForm = document.getElementById('payment-form');

    let cartItems = [];
    let total = 0;

    // Retrieve cart data from URL or LocalStorage
    const urlParams = new URLSearchParams(window.location.search);
    const cartDataFromURL = urlParams.get('cartData');
    
    if (cartDataFromURL) {
        cartItems = JSON.parse(decodeURIComponent(cartDataFromURL));
    } else {
        cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    }

    // Populate cart table
    const updateCartTable = () => {
        const tbody = cartTable.querySelector('tbody');
        tbody.innerHTML = '';
        total = 0;

        cartItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
            `;
            tbody.appendChild(row);
            total += item.price * item.quantity;
        });

        // Update overall total
        overallTotal.textContent = `$${total.toFixed(2)}`;
    };

    // Initial call to populate cart table
    updateCartTable();

    // Show or hide card payment fields based on the selected payment method
    paymentMethod.addEventListener('change', function () {
        const isCard = this.value === 'card';
        cardDetailsContainer.style.display = isCard ? 'block' : 'none';

        // Toggle required attribute for card payment fields
        ['card-number', 'card-pin', 'amount'].forEach(field => {
            const element = document.getElementById(field);
            if (isCard) {
                element.setAttribute('required', true);
            } else {
                element.removeAttribute('required');
            }
        });
    });

    // Validate and submit the payment form
    paymentForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Validate personal details
        if (!name) {
            alert('Please enter your name.');
            return;
        }

        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (phone.length !== 10 || isNaN(phone)) {
            alert('Please enter a valid 10-digit phone number.');
            return;
        }

        // Validate card details if payment method is card
        if (paymentMethod.value === 'card') {
            const cardNumber = document.getElementById('card-number').value.trim();
            const cardPin = document.getElementById('card-pin').value.trim();
            const amount = parseFloat(document.getElementById('amount').value);

            if (cardNumber.length !== 16 || isNaN(cardNumber)) {
                alert('Please enter a valid 16-digit card number.');
                return;
            }

            if (cardPin.length !== 4 || isNaN(cardPin)) {
                alert('Please enter a valid 4-digit card PIN.');
                return;
            }

            if (amount <= 0 || amount < total) {
                alert(`Please enter a valid amount (must be equal to or greater than $${total.toFixed(2)}).`);
                return;
            }
        }

        // Simulate successful payment and display delivery date
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 7); // Example: Delivery in 7 days
        alert(`Payment successful! Your items will be delivered by ${deliveryDate.toDateString()}.`);

        // Reset the form or clear cart data
        paymentForm.reset();
        localStorage.removeItem('cartItems');
    });
});

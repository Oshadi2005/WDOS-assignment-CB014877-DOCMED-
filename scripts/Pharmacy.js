document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartTable = document.getElementById('cart-table');
    const overallTotal = document.getElementById('overall-total');
    const buyNowButton = document.getElementById('buy-now');
    const addToFavouritesButton = document.getElementById('add-to-favourites');
    const applyFavouritesButton = document.getElementById('apply-favourites');

    let cartItems = [];

    const addToCart = (itemName, price, quantity) => {
        if (quantity <= 0) {
            alert('Quantity must be greater than zero.');
            return;
        }

        // Check if the item already exists in the cart
        const existingItemIndex = cartItems.findIndex(item => item.name === itemName);
        if (existingItemIndex !== -1) {
            // Replace the existing item's quantity with the new one
            cartItems[existingItemIndex].quantity = quantity;
        } else {
            // Add the new item to the cart
            cartItems.push({ name: itemName, price: price, quantity: quantity });
        }

        updateCartTable();
    };

    const updateCartTable = () => {
        const tbody = cartTable.querySelector('tbody');
        tbody.innerHTML = '';
        let total = 0;

        cartItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                <td><button class="remove-item">Remove</button></td>
            `;
            tbody.appendChild(row);
            total += item.price * item.quantity;

            row.querySelector('.remove-item').addEventListener('click', () => {
                cartItems = cartItems.filter(i => i.name !== item.name);
                updateCartTable();
            });
        });

        overallTotal.textContent = `$${total.toFixed(2)}`;
    };

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemName = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            const quantity = parseInt(button.closest('.medicine-item').querySelector('input').value);
            addToCart(itemName, price, quantity);
        });
    });

    buyNowButton.addEventListener('click', () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty. Add items before proceeding.');
            return;
        }

        const cartData = JSON.stringify(cartItems);
        window.location.href = `checkout.html?cartData=${encodeURIComponent(cartData)}`;
    });

    addToFavouritesButton.addEventListener('click', () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty. Add items to save as favourites.');
            return;
        }

        localStorage.setItem('favourites', JSON.stringify(cartItems));
        alert('Your favourites have been saved!');
    });

    applyFavouritesButton.addEventListener('click', () => {
        const favourites = JSON.parse(localStorage.getItem('favourites'));
        if (!favourites || favourites.length === 0) {
            alert('No favourites found. Add items to favourites first.');
            return;
        }

        favourites.forEach(favItem => {
            const existingItem = cartItems.find(item => item.name === favItem.name);
            if (existingItem) {
                existingItem.quantity += favItem.quantity;
            } else {
                cartItems.push({ ...favItem });
            }
        });

        updateCartTable();
        alert('Favourites have been applied to your cart.');
    });
});
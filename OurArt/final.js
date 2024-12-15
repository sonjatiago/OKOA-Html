document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout');
    let totalPrice = 0;

    // Function to update the cart
    function updateCart(itemName, itemPrice) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <p>${itemName} - €${itemPrice.toFixed(2)}</p>
            <button class="remove-item">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);

        // Update total price
        totalPrice += itemPrice;
        totalPriceElement.textContent = totalPrice.toFixed(2);
        checkoutButton.disabled = totalPrice === 0;

        // Remove item functionality
        cartItem.querySelector('.remove-item').addEventListener('click', () => {
            cartItemsContainer.removeChild(cartItem);
            totalPrice -= itemPrice;
            totalPriceElement.textContent = totalPrice.toFixed(2);
            checkoutButton.disabled = totalPrice === 0;
        });
    }

    // Function to display message for artworks
    function displayMessage(message) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message';
        messageContainer.textContent = message;
        document.body.appendChild(messageContainer);

        // Auto-hide message after 2 seconds
        setTimeout(() => {
            document.body.removeChild(messageContainer);
        }, 2000);
    }

    // Event listener for "Buy" buttons (artworks)
    document.querySelectorAll('.buy-item').forEach(button => {
        button.addEventListener('click', () => {
            const itemName = button.dataset.name;
            const itemPrice = parseFloat(button.dataset.price);
            updateCart(itemName, itemPrice);
            displayMessage('Item selected to cart');
        });
    });

    // Event listener for layout selection (radio button behavior)
    const layoutCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    let lastSelectedLayout = null; // Keep track of the last selected layout

    layoutCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                // Uncheck the previously selected layout if any
                if (lastSelectedLayout && lastSelectedLayout !== checkbox) {
                    lastSelectedLayout.checked = false;

                    // Remove the previous layout from the cart
                    const previousLayoutName = lastSelectedLayout.getAttribute('data-name');
                    const cartItemToRemove = Array.from(cartItemsContainer.children).find(item =>
                        item.textContent.includes(previousLayoutName)
                    );
                    if (cartItemToRemove) {
                        cartItemsContainer.removeChild(cartItemToRemove);
                        const previousPrice = parseFloat(lastSelectedLayout.getAttribute('data-price'));
                        totalPrice -= previousPrice;
                        totalPriceElement.textContent = totalPrice.toFixed(2);
                    }
                }

                // Add the newly selected layout to the cart
                const itemName = checkbox.getAttribute('data-name');
                const itemPrice = parseFloat(checkbox.getAttribute('data-price'));
                updateCart(itemName, itemPrice);
                lastSelectedLayout = checkbox; // Update the last selected layout
            } else {
                // Prevent unchecking the layout (recheck it)
                checkbox.checked = true;
            }
        });
    });

    // Event listener for color selection
    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', () => {
            const selectedOption = select.options[select.selectedIndex];
            const colorName = selectedOption.value;

            if (colorName && colorName !== 'Select') {
                const existingColor = Array.from(cartItemsContainer.children).find(
                    (child) => child.textContent.includes(`Color: ${colorName}`)
                );

                if (!existingColor) {
                    const cartColor = document.createElement('div');
                    cartColor.className = 'cart-item';
                    cartColor.innerHTML = `
                        <p>Color: ${colorName}</p>
                        <button class="remove-item">Remove</button>
                    `;
                    cartItemsContainer.appendChild(cartColor);

                    // Remove color functionality
                    cartColor.querySelector('.remove-item').addEventListener('click', () => {
                        cartItemsContainer.removeChild(cartColor);
                    });
                }
            }
        });
    });

    // Checkout button functionality
    checkoutButton.addEventListener('click', () => {
        alert(`Thank you for your purchase! Total: €${totalPrice.toFixed(2)}`);
        cartItemsContainer.innerHTML = '';
        totalPrice = 0;
        totalPriceElement.textContent = totalPrice.toFixed(2);
        checkoutButton.disabled = true;
    });
});

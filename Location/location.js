// Define an object to store image sources for each artwork
const imageSets = {
  goldencrack: ['goldencrack1.jpg', 'goldencrack2.jpg', 'goldencrack3.jpg', 'goldencrack4.jpg', 'goldencrack5.jpg'],
  freedom: ['freedom1.jpg', 'freedom2.jpg', 'freedom3.jpg'],
  galaxy: ['galaxy1.jpg'],
};

let currentImages = {
  goldencrack: 0,
  freedom: 0,
  galaxy: 0,
};

// Function to change image when navigation buttons are clicked or via keyboard
function changeImage(artwork, direction) {
  currentImages[artwork] += direction;

  // Wrap around logic for changing images
  if (currentImages[artwork] < 0) currentImages[artwork] = imageSets[artwork].length - 1;
  if (currentImages[artwork] >= imageSets[artwork].length) currentImages[artwork] = 0;

  const imageElement = document.getElementById(artwork + '-img');
  imageElement.style.opacity = 0;  // Fade out

  // Wait for the fade to complete before changing the image
  setTimeout(() => {
    imageElement.src = imageSets[artwork][currentImages[artwork]];  // Change the image
    imageElement.style.opacity = 1;  // Fade in
  }, 1000);  // Match the fade duration (1 second)
}

// Listen for keyboard events to allow arrow key navigation
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') {
    // Right arrow - move to the next image in all sliders
    Object.keys(imageSets).forEach(artwork => changeImage(artwork, 1));
  } else if (event.key === 'ArrowLeft') {
    // Left arrow - move to the previous image in all sliders
    Object.keys(imageSets).forEach(artwork => changeImage(artwork, -1));
  }
});

// Auto change images every 5 seconds
function autoChangeImages() {
  setInterval(() => {
    // Auto-change images for each artwork (cycle through them)
    Object.keys(imageSets).forEach(artwork => changeImage(artwork, 1));
  }, 5000); // Change image every 5 seconds
}

// Start the automatic image changes when the page loads (optional)
autoChangeImages();

// Get the form and button elements
const addToCartButton = document.getElementById("addToCart");
if (addToCartButton) {
  // Function to handle adding product to cart
  addToCartButton.addEventListener("click", function() {
    const color = document.getElementById("color").value;
    const size = document.getElementById("size").value;
    const quantity = parseInt(document.getElementById("quantity").value);

    // Get selected layout price
    const selectedLayout = document.querySelector('input[name="layout"]:checked');
    const layoutPrice = selectedLayout ? parseFloat(selectedLayout.getAttribute('data-price')) : 0;

    // Get selected color price
    const selectedColor = document.querySelector('#color');
    const colorPrice = selectedColor ? parseFloat(selectedColor.options[selectedColor.selectedIndex].getAttribute('data-price')) : 0;

    // Calculate total price (including layout and color)
    const totalPrice = (layoutPrice + colorPrice) * quantity;

    // Create an object to represent the product
    const product = {
      name: "Artwork",
      color: color,
      size: size,
      quantity: quantity,
      layout: selectedLayout ? selectedLayout.value : 'Unknown',
      colorPrice: colorPrice,
      layoutPrice: layoutPrice,
      totalPrice: totalPrice
    };

    // Get existing cart from localStorage or initialize an empty cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Add the new product to the cart
    cart.push(product);

    // Save updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Alert the user that the item was added to the cart
    alert("Product added to cart!");
  });
} else {
  console.error('Add to Cart button not found!');
}

// Function to update the cart display
function updateCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsDiv = document.getElementById("cart-items");
  const totalPriceSpan = document.getElementById("total-price");

  // Clear existing cart items
  cartItemsDiv.innerHTML = "";

  let totalPrice = 0;

  // Loop through cart items and create HTML for each item
  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");

    itemDiv.innerHTML = `
        <p><strong>${item.name}</strong> - ${item.layout} - ${item.color} - ${item.size} x ${item.quantity} - $${item.totalPrice}</p>
        <button class="remove" data-index="${index}">Remove</button>
    `;

    cartItemsDiv.appendChild(itemDiv);

    // Update total price
    totalPrice += item.totalPrice;
  });

  // Update total price in the UI
  totalPriceSpan.textContent = totalPrice.toFixed(2);

  // Add event listeners for remove buttons
  const removeButtons = document.querySelectorAll(".remove");
  removeButtons.forEach(button => {
    button.addEventListener("click", function() {
      const index = button.getAttribute("data-index");
      removeItemFromCart(index);
    });
  });
}

// Function to remove an item from the cart
function removeItemFromCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1); // Remove item from array
  localStorage.setItem("cart", JSON.stringify(cart)); // Update cart in localStorage

  // Update the cart display
  updateCart();
}

// Run updateCart when the page loads
document.addEventListener("DOMContentLoaded", updateCart);

// Function to update the price based on selected options
function updatePrice() {
  let totalPrice = 0;

  // Get selected layout price
  const selectedLayout = document.querySelector('input[name="layout"]:checked');
  if (selectedLayout) {
    totalPrice += parseFloat(selectedLayout.getAttribute('data-price'));
  }

  // Get selected color price
  const selectedColor = document.querySelector('#color');
  if (selectedColor) {
    totalPrice += parseFloat(selectedColor.options[selectedColor.selectedIndex].getAttribute('data-price'));
  }

  // Update the total price display
  document.getElementById('totalPrice').textContent = totalPrice.toFixed(2) + '€';
}

// Event listeners for changes in layout or color
document.querySelectorAll('input[name="layout"]').forEach(layout => {
  layout.addEventListener('change', updatePrice);
});

document.querySelector('#color').addEventListener('change', updatePrice);

// Initialize price when the page loads
window.addEventListener('load', updatePrice);

// Handle form submission (add to cart logic)
document.getElementById('productForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting normally

  const selectedLayout = document.querySelector('input[name="layout"]:checked');
  const selectedColor = document.querySelector('#color');

  if (selectedLayout && selectedColor) {
    const layoutPrice = parseFloat(selectedLayout.getAttribute('data-price'));
    const colorPrice = parseFloat(selectedColor.options[selectedColor.selectedIndex].getAttribute('data-price'));
    const finalPrice = layoutPrice + colorPrice;

    alert(`You selected Layout: ${selectedLayout.value}, Color: ${selectedColor.value}. Final Price: ${finalPrice.toFixed(2)}€`);
    // Here you would add the item to the cart, e.g., update a cart object or localStorage
  } else {
    alert('Please select a layout and color.');
  }
});

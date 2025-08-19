// Fixed Cart.js code
document.addEventListener("DOMContentLoaded", () => {
  // Navbar active link
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  // Load cart items
  displayCartItems();
  updateCartSummary();
  updateCartCount();

  // Event delegation for all cart interactions - FIXED
  const cartBody = document.querySelector(".card-body");
  if (cartBody) {
    cartBody.addEventListener("click", handleCartClick);
  }

  // Proceed to checkout
  document
    .querySelector(".btn-success")
    ?.addEventListener("click", proceedToCheckout);
});

// Fixed click handler
function handleCartClick(e) {
  const target = e.target;

  // Handle delete button - FIXED APPROACH
  const deleteBtn =
    target.closest(".delete-btn") ||
    (target.classList.contains("fa-trash") && target.closest(".btn"));

  if (deleteBtn) {
    e.preventDefault();
    e.stopPropagation();

    const cartItem = deleteBtn.closest(".cart-item");
    if (cartItem) {
      const productId = parseInt(cartItem.dataset.id);
      removeFromCart(productId);
    }
    return;
  }

  // Handle quantity minus button
  if (
    target.classList.contains("minus-btn") ||
    (target.classList.contains("btn-outline-danger") &&
      target.textContent === "-")
  ) {
    const input = target.nextElementSibling;
    if (parseInt(input.value) > 1) {
      input.value = parseInt(input.value) - 1;
      updateCartItemQuantity(input);
    }
    return;
  }

  // Handle quantity plus button
  if (
    target.classList.contains("plus-btn") ||
    (target.classList.contains("btn-outline-primary") &&
      target.textContent === "+")
  ) {
    const input = target.previousElementSibling;
    input.value = parseInt(input.value) + 1;
    updateCartItemQuantity(input);
    return;
  }

  // Handle quantity input changes
  if (target.classList.contains("quantity-input")) {
    updateCartItemQuantity(target);
    return;
  }
}

function displayCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsContainer = document.querySelector(".card-body");

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="text-center py-4">
        <p>Your cart is empty</p>
        <a href="Products.html" class="btn btn-primary">Continue Shopping</a>
      </div>
    `;
    return;
  }

  let cartHTML = "";
  cart.forEach((item) => {
    cartHTML += `
      <div class="row cart-item mb-3" data-id="${item.ID}">
        <div class="col-md-3">
          <img src="${item.Image}" alt="${item.Name}" class="img-fluid rounded">
        </div>
        <div class="col-md-5">
          <h5 class="card-title">${item.Name}</h5>
          <p class="text-muted">Category: ${item.Category}</p>
        </div>
        <div class="col-md-2">
          <div class="input-group">
            <button class="btn btn-outline-danger btn-sm minus-btn" type="button">-</button>
            <input 
              style="max-width: 100px" 
              type="number" 
              class="form-control form-control-sm text-center quantity-input" 
              value="${item.quantity || 1}" 
              min="1">
            <button class="btn btn-outline-primary btn-sm plus-btn" type="button">+</button>
          </div>
        </div>
        <div class="col-md-2 text-end">
          <p class="fw-bold item-total">$${(
            item.Price * (item.quantity || 1)
          ).toFixed(2)}</p>
          <button class="btn btn-sm btn-outline-danger delete-btn">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </div>
      </div>
      <hr>
    `;
  });

  cartItemsContainer.innerHTML = cartHTML;

  // Reattach event listeners to new elements
  attachEventListeners();
}

function attachEventListeners() {
  // Attach event listeners to all delete buttons
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const cartItem = this.closest(".cart-item");
      if (cartItem) {
        const productId = parseInt(cartItem.dataset.id);
        removeFromCart(productId);
      }
    });
  });

  // Attach event listeners to quantity buttons
  document.querySelectorAll(".minus-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const input = this.nextElementSibling;
      if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        updateCartItemQuantity(input);
      }
    });
  });

  document.querySelectorAll(".plus-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const input = this.previousElementSibling;
      input.value = parseInt(input.value) + 1;
      updateCartItemQuantity(input);
    });
  });

  // Attach event listeners to quantity inputs
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", function () {
      updateCartItemQuantity(this);
    });
  });
}

function updateCartItemQuantity(input) {
  const productId = parseInt(input.closest(".cart-item").dataset.id);
  const newQuantity = parseInt(input.value);
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const itemIndex = cart.findIndex((item) => item.ID === productId);
  if (itemIndex !== -1) {
    cart[itemIndex].quantity = newQuantity;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartSummary();

    // Update the displayed price for this item
    const priceElement = input.closest(".row").querySelector(".item-total");
    if (priceElement) {
      priceElement.textContent = `$${(
        cart[itemIndex].Price * newQuantity
      ).toFixed(2)}`;
    }
  }
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const initialLength = cart.length;
  cart = cart.filter((item) => item.ID !== productId);

  if (cart.length === initialLength) {
    console.warn("Product not found in cart:", productId);
    return;
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  // Remove just the specific item from DOM instead of re-rendering everything
  const itemToRemove = document.querySelector(
    `.cart-item[data-id="${productId}"]`
  );
  if (itemToRemove) {
    // Add animation class
    itemToRemove.style.transition = "all 0.3s ease";
    itemToRemove.style.opacity = "0";
    itemToRemove.style.transform = "translateX(100px)";

    // Remove after animation completes
    setTimeout(() => {
      const nextElement = itemToRemove.nextElementSibling;
      itemToRemove.remove();
      if (nextElement && nextElement.tagName === "HR") {
        nextElement.remove();
      }

      // If cart is empty now, show empty message
      if (cart.length === 0) {
        const cartItemsContainer = document.querySelector(".card-body");
        cartItemsContainer.innerHTML = `
          <div class="text-center py-4">
            <p>Your cart is empty</p>
            <a href="Products.html" class="btn btn-primary">Continue Shopping</a>
          </div>
        `;
      }

      updateCartSummary();
      updateCartCount(); // Update cart count in navbar
    }, 300);
  } else {
    // Fallback: re-render if DOM element not found
    displayCartItems();
    updateCartSummary();
    updateCartCount();
  }
}

function updateCartSummary() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let subtotal = 0;

  cart.forEach((item) => {
    subtotal += item.Price * (item.quantity || 1);
  });

  const shipping = subtotal > 0 ? 10 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const subtotalEl = document.querySelector(".subTotal");
  const shippingEl = document.querySelector(".Shipping");
  const taxEl = document.querySelector(".tax");
  const totalEl = document.querySelector(".total");

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCountElements = document.querySelectorAll(".cart-count");

  if (cartCountElements.length > 0) {
    const totalItems = cart.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
    cartCountElements.forEach((el) => {
      el.textContent = totalItems;
      el.style.display = totalItems > 0 ? "inline-block" : "none";
    });
  }
}

// Other functions (proceedToCheckout, createOrder, calculateOrderTotal) remain the same
function proceedToCheckout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Please login to proceed to checkout");
    window.location.href = "login.html";
    return;
  }

  createOrder();
  window.location.href = "Orders.html";
}

function createOrder() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (cart.length === 0) return;

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const newOrder = {
    id: orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1,
    userId: currentUser.id,
    date: new Date().toISOString(),
    items: [...cart],
    status: "Pending",
    total: calculateOrderTotal(cart),
  };

  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.setItem("cart", JSON.stringify([]));
}

function calculateOrderTotal(cart) {
  let subtotal = 0;
  cart.forEach((item) => {
    subtotal += item.Price * (item.quantity || 1);
  });
  const shipping = subtotal > 0 ? 10 : 0;
  const tax = subtotal * 0.1;
  return subtotal + shipping + tax;
}

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

  // Event listeners for quantity changes
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", function () {
      updateCartItemQuantity(this);
    });
  });

  // Event delegation for delete buttons
  document.querySelector(".card-body").addEventListener("click", function (e) {
    if (
      e.target.classList.contains("btn-outline-danger") &&
      e.target.querySelector("i.fa-trash")
    ) {
      e.preventDefault();
      const productId = parseInt(e.target.closest(".cart-item").dataset.id);
      removeFromCart(productId);
    }

    // Handle quantity buttons
    if (
      e.target.classList.contains("btn-outline-danger") &&
      e.target.textContent === "-"
    ) {
      const input = e.target.nextElementSibling;
      if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        updateCartItemQuantity(input);
      }
    }

    if (
      e.target.classList.contains("btn-outline-primary") &&
      e.target.textContent === "+"
    ) {
      const input = e.target.previousElementSibling;
      input.value = parseInt(input.value) + 1;
      updateCartItemQuantity(input);
    }
  });

  // Proceed to checkout
  document
    .querySelector(".btn-success")
    ?.addEventListener("click", function () {
      proceedToCheckout();
    });
});

function displayCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsContainer = document.querySelector(".card-body");

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
            <button class="btn btn-outline-danger btn-sm" type="button">-</button>
            <input 
              style="max-width: 100px" 
              type="number" 
              class="form-control form-control-sm text-center quantity-input" 
              value="${item.quantity || 1}" 
              min="1">
            <button class="btn btn-outline-primary btn-sm" type="button">+</button>
          </div>
        </div>
        <div class="col-md-2 text-end">
          <p class="fw-bold">$${(item.Price * (item.quantity || 1)).toFixed(
            2
          )}</p>
          <button class="btn btn-sm btn-outline-danger">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
      <hr>
    `;
  });

  cartItemsContainer.innerHTML = cartHTML;
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
    const priceElement = input.closest(".row").querySelector(".fw-bold");
    if (priceElement) {
      priceElement.textContent = `$${(
        cart[itemIndex].Price * newQuantity
      ).toFixed(2)}`;
    }
  }
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.ID !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCartItems();
  updateCartSummary();
}

function updateCartSummary() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let subtotal = 0;

  cart.forEach((item) => {
    subtotal += item.Price * (item.quantity || 1);
  });

  const shipping = subtotal > 0 ? 10 : 0; // $10 shipping if items in cart
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  document.querySelector(".subTotal").textContent = `$${subtotal.toFixed(2)}`;
  document.querySelector(".Shipping").textContent = `$${shipping.toFixed(2)}`;
  document.querySelector(".tax").textContent = `$${tax.toFixed(2)}`;
  document.querySelector(".total").textContent = `$${total.toFixed(2)}`;
}

function proceedToCheckout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Please login to proceed to checkout");
    window.location.href = "login.html";
    return;
  }

  // Create order
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

  // Clear cart after order is created
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

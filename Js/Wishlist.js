// navbar.js

document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
  updateCartCount();
});

function displayWishlist() {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  let container = document.getElementById("wishlistContainer");

  container.innerHTML = "";

  if (wishlist.length === 0) {
    container.innerHTML = `<p class="text-muted text-center">Your wishlist is empty ❤️</p>`;
    return;
  }

  wishlist.forEach((product) => {
    container.innerHTML += `
      <div class="card mb-3 shadow-sm">
        <div class="row g-0 align-items-center">
          <!-- Product Image -->
          <div class="col-md-2 text-center">
            <img src="${product.Image}" class="img-fluid rounded-start" alt="${product.Name}" style="max-height: 120px; object-fit: cover;">
          </div>

          <!-- Product Details -->
          <div class="col-md-7">
            <div class="card-body">
              <h5 class="card-title mb-1">${product.Name}</h5>
              <p class="text-muted mb-1">Category: ${product.Category}</p>
              <p class="fw-bold text-success mb-0">${product.Price} EGP</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="col-md-3 text-end pe-3">
            <button class="btn btn-sm btn-outline-success mb-2 w-100" onclick="addToCart(${product.ID})">
              Add to Cart <i class="fa-solid fa-cart-shopping"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger w-100" onclick="removeFromWishlist(${product.ID})">
              Remove <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

function removeFromWishlist(id) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist = wishlist.filter((item) => item.ID !== id);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  displayWishlist();
}

function addToCart(id) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let product = wishlist.find((item) => item.ID === id);
  if (product) {
    // Check if product already in cart
    let existsInCart = cart.some((item) => item.ID === id);
    if (!existsInCart) {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Product added to cart!");
    } else {
      alert("Product is already in the cart!");
    }
  }
}

document.addEventListener("DOMContentLoaded", displayWishlist);

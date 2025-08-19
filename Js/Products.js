// js/navbar.js

document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
  updateCartCount();
});

// Products + Filters
document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const productsContainer = document.getElementById("productsContainer");
  const searchInput = document.getElementById("searchInput");
  const categorySelect = document.getElementById("categorySelect");
  const minPriceInput = document.getElementById("minPrice");
  const maxPriceInput = document.getElementById("maxPrice");
  const filterForm = document.getElementById("filterForm");
  const urlParams = new URLSearchParams(window.location.search);

  // Data
  let productsList = JSON.parse(localStorage.getItem("productsList")) || [];

  // Helpers: notifications
  function showMessage(msg, type = "success") {
    alert(msg);
  }

  // Add to Cart
  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if product already exists in cart
    const exists = cart.find((p) => p.Name === product.Name);

    if (exists) {
      // Show alert if already added
      showMessage(`${product.Name} is already in Cart`, "warning");
    } else {
      // Add product and update storage
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      showMessage(`${product.Name} added to Cart`);
      updateCartCount(); // optional: update cart counter if you have one
    }
  }

  // Add to Wishlist
  function addToWishlist(product) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    // prevent duplicates
    if (!wishlist.find((p) => p.Name === product.Name)) {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      showMessage(`${product.Name} added to Wishlist`);
    } else {
      showMessage(`${product.Name} already in Wishlist`, "warning");
    }
  }

  // Render products
  function displayProducts(list) {
    if (!productsContainer) return;
    productsContainer.innerHTML = "";

    if (!list.length) {
      productsContainer.innerHTML = `
        <div class="col-12">
          <div class="alert alert-warning text-center mb-0">No products found</div>
        </div>`;
      return;
    }

    list.forEach((product) => {
      const card = document.createElement("div");
      card.className = "col-md-5 col-lg-4 mb-4";
      card.innerHTML = `
        <div class="card h-100 d-flex flex-column">
          <img src="${product.Image}" class="card-img-top" alt="${product.Name}">
          <div class="card-body d-flex flex-column text-center">
            <h5 class="card-title" style="min-height: 3rem;">${product.Name}</h5>
            <p class="card-text text-success fw-bold" style="min-height: 1.5rem;">$${product.Price}</p>
            <p class="card-text" style="min-height: 1.5rem;">
              <small class="text-muted">
                Category: <span class="text-capitalize">${product.Category}</span>
              </small>
            </p>
            <div class="mt-auto d-flex gap-2">
              <button class="btn btn-outline-primary flex-fill add-to-cart">
                Add to Cart
              </button>
              <button class="btn btn-outline-danger flex-fill add-to-wishlist">
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      `;

      // attach events
      card
        .querySelector(".add-to-cart")
        .addEventListener("click", () => addToCart(product));
      card
        .querySelector(".add-to-wishlist")
        .addEventListener("click", () => addToWishlist(product));

      productsContainer.appendChild(card);
    });
  }

  //! Populate categories
  function populateCategories() {
    const keyCats = (JSON.parse(localStorage.getItem("Categories")) || [])
      .map((c) => String(c).trim())
      .filter(Boolean);

    let categories = keyCats.length
      ? Array.from(new Set(keyCats))
      : Array.from(
          new Set(productsList.map((p) => p.Category).filter(Boolean))
        );

    // Reset options
    categorySelect.innerHTML = `<option value="">All Categories</option>`;
    categories.forEach((cat) => {
      const val = String(cat).trim();
      categorySelect.innerHTML += `<option value="${val}">${
        val.charAt(0).toUpperCase() + val.slice(1)
      }</option>`;
    });
  }

  // Init price fields
  function initPriceFields() {
    const prices = (productsList || [])
      .map((p) => Number(p.Price) || 0)
      .filter((p) => !isNaN(p));

    const maxPrice = prices.length ? Math.max(...prices) : 0;
    const minPrice = prices.length ? Math.min(...prices) : 0;

    if (minPriceInput) {
      minPriceInput.min = 0;
      minPriceInput.step = "1";
      minPriceInput.placeholder = `Min: ${Math.floor(minPrice)}`;
    }

    if (maxPriceInput) {
      maxPriceInput.min = 0;
      maxPriceInput.step = "1";
      maxPriceInput.placeholder = maxPrice
        ? `Max: ${Math.ceil(maxPrice)}`
        : "Enter max price";
    }
  }

  // Filter logic
  function applyFilters() {
    const q = (searchInput?.value || "").trim().toLowerCase();
    const cat = (categorySelect?.value || "").trim().toLowerCase();

    const minP = minPriceInput?.value ? Number(minPriceInput.value) : 0;
    const maxP = maxPriceInput?.value ? Number(maxPriceInput.value) : Infinity;

    const filtered = productsList.filter((p) => {
      const nameMatch =
        !q ||
        String(p.Name || "")
          .toLowerCase()
          .includes(q);
      const catMatch = !cat || String(p.Category || "").toLowerCase() === cat;
      const priceVal = Number(p.Price) || 0;
      const priceMatch = priceVal >= minP && priceVal <= maxP;
      return nameMatch && catMatch && priceMatch;
    });

    displayProducts(filtered);
  }

  // URL param ?category=...
  function applyCategoryFromURL() {
    const catParam = (urlParams.get("category") || "").trim();
    if (catParam && categorySelect) {
      const opt = Array.from(categorySelect.options).find(
        (o) => o.value.toLowerCase() === catParam.toLowerCase()
      );
      if (opt) {
        categorySelect.value = opt.value;
      }
    }
  }

  // Events
  searchInput?.addEventListener("input", applyFilters);
  categorySelect?.addEventListener("change", applyFilters);
  minPriceInput?.addEventListener("input", applyFilters);
  maxPriceInput?.addEventListener("input", applyFilters);

  filterForm?.addEventListener("reset", () => {
    setTimeout(() => {
      categorySelect.value = "";
      minPriceInput.value = "";
      maxPriceInput.value = "";
      searchInput.value = "";
      applyFilters();
    }, 0);
  });

  // Initial load
  populateCategories();
  initPriceFields();
  applyCategoryFromURL();
  displayProducts(productsList);
  applyFilters();
});

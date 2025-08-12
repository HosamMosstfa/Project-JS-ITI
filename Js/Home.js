// Products
document.addEventListener("DOMContentLoaded", () => {
  let products = JSON.parse(localStorage.getItem("productsList")) || [];

  // featured products
  products = products.map((p, i) => {
    if (p.isFeatured === undefined) {
      p.isFeatured = i === 0; 
    }
    return p;
  });

  localStorage.setItem("productsList", JSON.stringify(products));

  const featuredProducts = products.filter(p => p.isFeatured);
  const featureContainer = document.getElementById("featured-products-row");
  if (featureContainer) {
    featureContainer.innerHTML = "";
    featuredProducts.forEach(product => {
      featureContainer.innerHTML += `
    <div class="col-md-4 col-lg-3 mb-4">
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

            <button 
              class="btn btn-outline-primary flex-fill"
              onmouseover="this.classList.remove('btn-outline-primary'); this.classList.add('btn-primary');"
              onmouseout="this.classList.remove('btn-primary'); this.classList.add('btn-outline-primary');"
            >
              Add to Cart
            </button>

            <button class="btn btn-outline-danger flex-fill">
              Add to Wishlist
            </button>

          </div>
        </div>
      </div>
    </div>
  `;
    });
  }

  // all products
  const productsContainer = document.getElementById("productsContainer");
  if (productsContainer) {
    if (products.length === 0) {
      productsContainer.innerHTML = "<p class='text-center'>لا يوجد منتجات متاحة حالياً</p>";
    } else {
      let cardsHTML = "";
      products.forEach(product => {
        cardsHTML += `
    <div class="col-md-4 col-lg-3 mb-4">
      <div class="card h-100 d-flex flex-column">
        <img src="${product.Image}" class="card-img-top" alt="${product.Name}">
        <div class="card-body d-flex flex-column">

          <h5 class="card-title" style="min-height: 3rem;">${product.Name}</h5>

          <p class="card-text text-success fw-bold" style="min-height: 1.5rem;">$${product.Price}</p>

          <p class="card-text" style="min-height: 1.5rem;">
            <small class="text-muted">
              Category: <span class="text-capitalize">${product.Category}</span>
            </small>
          </p>

          <div class="mt-auto d-flex gap-2">

            <button 
              class="btn btn-outline-primary flex-fill"
              onmouseover="this.classList.remove('btn-outline-primary'); this.classList.add('btn-primary');"
              onmouseout="this.classList.remove('btn-primary'); this.classList.add('btn-outline-primary');"
            >
              Add to Cart
            </button>

            <button class="btn btn-outline-danger flex-fill">
              Add to Wishlist
            </button>

          </div>
        </div>
      </div>
    </div>
  `;
      });
      productsContainer.innerHTML = cardsHTML;
    }
  }
});

// categories
document.addEventListener("DOMContentLoaded", () => {
  const categories = JSON.parse(localStorage.getItem("Categories")) || [];
  const categoriesContainer = document.getElementById("categoriesContainer");

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  if (categoriesContainer) {
    if (categories.length === 0) {
      categoriesContainer.innerHTML = "<p class='text-center'>لا توجد فئات حالياً</p>";
    } else {
      let cardsHTML = "";

      categories.forEach(categoryName => {
        const imageName = categoryName.toLowerCase();
        const displayName = capitalizeFirstLetter(categoryName);

        cardsHTML += `
          <div class="col-6 col-md-4 col-lg-3">
            <a href="products.html?category=${encodeURIComponent(categoryName)}" class="text-decoration-none text-dark">
              <div class="card text-center p-3 h-100 category-card" style="cursor:pointer;">
                <img src="image/${imageName}.jpg" alt="${displayName}" class="img-fluid mb-2" style="max-height: 120px; object-fit: contain;">
                <div class="card-body d-flex align-items-center justify-content-center">
                  <h5 class="card-title m-0">${displayName}</h5>
                </div>
              </div>
            </a>
          </div>
        `;
      });

      categoriesContainer.innerHTML = cardsHTML;
    }
  }
});

//navbar
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  
  document.querySelectorAll(".navbar-nav .nav-link").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
});
document.getElementById("logoutBtn").addEventListener("click", function() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
});

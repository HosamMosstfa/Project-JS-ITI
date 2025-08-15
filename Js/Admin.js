let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  window.location.href = "login.html";
}

if (document.body.dataset.role === "admin" && currentUser.role !== "admin") {
  window.location.href = "index.html";
}

document.getElementById("logoutBtn").addEventListener("click", function () {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
});

// ------------------Local storage-----------------------------
// Navbar Section Switch
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document
      .querySelectorAll(".nav-link")
      .forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
    document
      .querySelectorAll("div[id$='Section']")
      .forEach((sec) => (sec.style.display = "none"));
    document.getElementById(link.getAttribute("data-section")).style.display =
      "block";
  });
});

// Add Product Section
function addProductToLocalStorage(newProduct) {
  const existingProductsRaw = localStorage.getItem("productsList");
  let existingProducts = [];
  try {
    existingProducts = existingProductsRaw ? JSON.parse(existingProductsRaw) : [];
  } catch (err) {
    existingProducts = [];
  }
  const newID = existingProducts.length > 0 ? Math.max(...existingProducts.map((p) => p.ID)) + 1 : 1;
  const productWithID = { ...newProduct, ID: newID };
  existingProducts.push(productWithID);
  localStorage.setItem("productsList", JSON.stringify(existingProducts));
  const categories = [...new Set(existingProducts.map((item) => item.Category))];
  localStorage.setItem("Categories", JSON.stringify(categories));
}

document.getElementById("saveProductBtn").addEventListener("click", () => {
  const name = document.getElementById("productName").value.trim();
  const image = document.getElementById("productImage").value.trim();
  const category = document.getElementById("productCategory").value.trim();
  const price = document.getElementById("productPrice").value.trim();
  const description = document.getElementById("productDescription").value.trim();
  const stock = document.getElementById("productStock").value.trim();
  const featured = document.getElementById("productFeatured").checked;
  if (!name || !image || !category || !price || !description || !stock) {
    alert("Please fill in all required fields.");
    return;
  }
  const newProduct = {
    Name: name,
    Image: image,
    Category: category,
    Price: parseFloat(price),
    Description: description,
    "Stock Quantity": parseInt(stock),
    isFeatured: featured
  };
  addProductToLocalStorage(newProduct);
  const modal = bootstrap.Modal.getInstance(document.getElementById("addProductModal"));
  modal.hide();
});

// Product Table + Pagination + Search
let products = JSON.parse(localStorage.getItem("productsList")) || [];
let rowsPerPage = 7;
let currentPage = 1;
let filteredProducts = [...products];

const tableBody = document.getElementById("productTableBody");
const pagination = document.getElementById("pagination");

function displayProducts(page) {
  tableBody.innerHTML = "";
  let start = (page - 1) * rowsPerPage;
  let end = start + rowsPerPage;
  let pageProducts = filteredProducts.slice(start, end);

  pageProducts.forEach((product) => {
    tableBody.innerHTML += `
      <tr>
        <td>${product.ID}</td>
        <td><img src="${product.Image}" alt="${product.Name}" width="60" height="60" class="product-img"></td>
        <td>${product.Name}</td>
        <td>${product.Category}</td>
        <td>${product.Price} EGP</td>
        <td>${product["Stock Quantity"]}</td>
        <td>
          <button class="btn btn-warning btn-sm">Edit</button>
          <button class="btn btn-danger btn-sm">Delete</button>
        </td>
      </tr>
    `;
  });
}

function setupPagination() {
  pagination.innerHTML = "";

  let pageCount = Math.ceil(filteredProducts.length / rowsPerPage);

  // Previous button
  pagination.innerHTML += `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" data-page="prev">Previous</a>
    </li>
  `;

  // Page numbers
  for (let i = 1; i <= pageCount; i++) {
    pagination.innerHTML += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>
    `;
  }

  // Next button
  pagination.innerHTML += `
    <li class="page-item ${currentPage === pageCount ? "disabled" : ""}">
      <a class="page-link" href="#" data-page="next">Next</a>
    </li>
  `;

  // Add event listeners
  document.querySelectorAll(".page-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      let page = link.getAttribute("data-page");

      if (page === "prev" && currentPage > 1) {
        currentPage--;
      } else if (page === "next" && currentPage < pageCount) {
        currentPage++;
      } else if (!isNaN(page)) {
        currentPage = parseInt(page);
      }

      displayProducts(currentPage);
      setupPagination();
    });
  });
}

// Search functionality
document.getElementById("searchInput").addEventListener("input", (e) => {
  let searchTerm = e.target.value.toLowerCase();
  filteredProducts = products.filter(
    (p) =>
      p.Name.toLowerCase().includes(searchTerm) ||
      p.Category.toLowerCase().includes(searchTerm)
  );
  currentPage = 1;
  displayProducts(currentPage);
  setupPagination();
});

// Initial load
displayProducts(currentPage);
setupPagination();

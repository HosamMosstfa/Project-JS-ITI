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

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
    existingProducts = existingProductsRaw
      ? JSON.parse(existingProductsRaw)
      : [];
  } catch (err) {
    existingProducts = [];
  }
  const newID =
    existingProducts.length > 0
      ? Math.max(...existingProducts.map((p) => p.ID)) + 1
      : 1;
  const productWithID = { ...newProduct, ID: newID };
  existingProducts.push(productWithID);
  localStorage.setItem("productsList", JSON.stringify(existingProducts));
  const categories = [
    ...new Set(existingProducts.map((item) => item.Category)),
  ];
  localStorage.setItem("Categories", JSON.stringify(categories));
}

document.getElementById("saveProductBtn").addEventListener("click", () => {
  const name = document.getElementById("productName").value.trim();
  const image = document.getElementById("productImage").value.trim();
  const category = document.getElementById("productCategory").value.trim();
  const price = document.getElementById("productPrice").value.trim();
  const description = document
    .getElementById("productDescription")
    .value.trim();
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
    isFeatured: featured,
  };
  addProductToLocalStorage(newProduct);
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("addProductModal")
  );
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
          <button class="btn btn-warning btn-sm edit-btn" data-id="${product.ID}" >Edit</button>       
        <button class="btn btn-danger btn-sm delete-btn" data-id="${product.ID}">Delete</button>
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
      setupEditButtons();
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
  setupEditButtons();
});

// Initial load
displayProducts(currentPage);
setupPagination();
setupEditButtons();

// ===================== CATEGORIES MANAGEMENT =====================

document
  .getElementById("searchCategories")
  ?.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll("#categoriesTableBody tr");

    rows.forEach((row) => {
      const nameCell = row.querySelector("td:nth-child(3)");
      if (nameCell) {
        const nameText = nameCell.textContent.toLowerCase();
        row.style.display = nameText.includes(searchTerm) ? "" : "none";
      }
    });
  });

(() => {
  const defaultDescriptions = {
    beauty: "High-quality beauty and personal care products.",
    fragrances: "Premium perfumes with long-lasting scents.",
    furniture: "Modern and comfortable furniture for every space.",
    groceries: "Fresh groceries to meet your daily needs.",
  };

  let catNames = JSON.parse(localStorage.getItem("Categories")) || [];
  let catDescs = JSON.parse(localStorage.getItem("CategoryDescriptions")) || {};
  let catImages = JSON.parse(localStorage.getItem("CategoryImages")) || {};

  const tableBody = document.getElementById("categoriesTableBody");
  const selectAll = document.getElementById("selectAllCategories");
  const addBtn = document.getElementById("addCategoryBtn");
  const bulkDelBtn = document.getElementById("deleteSelectedCategories");

  if (!tableBody) return;

  const modalEl = document.getElementById("categoryModal");
  const modal = modalEl ? new bootstrap.Modal(modalEl) : null;
  const form = document.getElementById("categoryForm");
  const deleteModalEl = document.getElementById("deleteConfirmModal");
  const deleteModal = deleteModalEl ? new bootstrap.Modal(deleteModalEl) : null;
  const warningModalEl = document.getElementById("warningModal");
  const warningModal = warningModalEl
    ? new bootstrap.Modal(warningModalEl)
    : null;

  let editIndex = null;
  let deleteIndexes = [];

  function cap1(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
  }

  function saveAll() {
    localStorage.setItem("Categories", JSON.stringify(catNames));
    localStorage.setItem("CategoryDescriptions", JSON.stringify(catDescs));
    localStorage.setItem("CategoryImages", JSON.stringify(catImages));
  }

  function showWarning(msg) {
    if (!warningModal) return alert(msg);
    document.getElementById("warningMessage").textContent = msg;
    warningModal.show();
  }

  function renderCategories() {
    if (!catNames.length) {
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No categories available</td></tr>`;
      return;
    }

    tableBody.innerHTML = catNames
      .map((name, i) => {
        const key = (name || "").toLowerCase();
        const desc =
          catDescs[key] ||
          defaultDescriptions[key] ||
          "No description available";
        const img = (catImages[key] || key) + ".jpg";
        return `
        <tr>
          <td><input type="checkbox" class="category-check" data-index="${i}"></td>
          <td><img src="image/${img}" alt="${cap1(
          name
        )}" style="max-width:80px; object-fit:contain;"></td>
          <td>${cap1(name)}</td>
          <td>${desc}</td>
          <td>
            <button class="btn btn-warning btn-sm" data-action="edit" data-index="${i}">Edit</button>
            <button class="btn btn-danger btn-sm"  data-action="delete" data-index="${i}">Delete</button>
          </td>
        </tr>
      `;
      })
      .join("");
  }

  function openAddModal() {
    editIndex = null;
    document.getElementById("categoryModalLabel").textContent = "Add Category";
    form.reset();
    modal && modal.show();
  }

  function openEditModal(index) {
    editIndex = index;
    const name = catNames[index] || "";
    const key = name.toLowerCase();
    document.getElementById("categoryModalLabel").textContent = "Edit Category";
    document.getElementById("categoryName").value = name;
    document.getElementById("categoryDescription").value = catDescs[key] || "";
    document.getElementById("categoryImage").value = catImages[key] || key;
    modal && modal.show();
  }

  function deleteOne(index) {
    const name = catNames[index];
    const key = (name || "").toLowerCase();
    catNames.splice(index, 1);
    delete catDescs[key];
    delete catImages[key];
  }

  function getSelectedIndexes() {
    return Array.from(document.querySelectorAll(".category-check"))
      .filter((ch) => ch.checked)
      .map((ch) => parseInt(ch.dataset.index));
  }

  function showDeleteModal(indexes) {
    deleteIndexes = indexes;
    const deleteCountText =
      indexes.length === 1 ? "this category" : `${indexes.length} categories`;
    document.getElementById("deleteCount").textContent = deleteCountText;
    deleteModal && deleteModal.show();
  }

  document
    .getElementById("confirmDeleteBtn")
    ?.addEventListener("click", function () {
      deleteIndexes.sort((a, b) => b - a).forEach(deleteOne);
      saveAll();
      renderCategories();
      deleteModal && deleteModal.hide();
    });

  addBtn?.addEventListener("click", openAddModal);

  bulkDelBtn?.addEventListener("click", () => {
    const sel = getSelectedIndexes();
    if (!sel.length)
      return showWarning("Please select at least one category to delete");
    showDeleteModal(sel);
  });

  selectAll?.addEventListener("change", (e) => {
    document
      .querySelectorAll(".category-check")
      .forEach((ch) => (ch.checked = e.target.checked));
  });

  tableBody.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const idx = parseInt(btn.dataset.index);
    if (btn.dataset.action === "edit") openEditModal(idx);
    if (btn.dataset.action === "delete") showDeleteModal([idx]);
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("categoryName").value.trim();
    const desc = document.getElementById("categoryDescription").value.trim();
    const image = document
      .getElementById("categoryImage")
      .value.trim()
      .toLowerCase();

    if (!name) return showWarning("Please enter a category name");

    const newKey = name.toLowerCase();

    if (editIndex === null) {
      if (catNames.some((n) => (n || "").toLowerCase() === newKey))
        return showWarning("Category already exists");
      catNames.push(name);
    } else {
      const oldName = catNames[editIndex];
      const oldKey = (oldName || "").toLowerCase();
      catNames[editIndex] = name;
      if (oldKey !== newKey) {
        if (catDescs.hasOwnProperty(oldKey)) {
          catDescs[newKey] = catDescs[oldKey];
          delete catDescs[oldKey];
        }
        if (catImages.hasOwnProperty(oldKey)) {
          catImages[newKey] = catImages[oldKey];
          delete catImages[oldKey];
        }
      }
    }

    if (desc) catDescs[newKey] = desc;
    else delete catDescs[newKey];
    catImages[newKey] = image || newKey;

    saveAll();
    renderCategories();
    modal && modal.hide();
  });

  renderCategories();
})();
// peter edit buttons
// Edit Product Functionality
function setupEditButtons() {
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const productId = parseInt(this.getAttribute("data-id"));
      const product = products.find((p) => p.ID === productId);

      if (product) {
        // Fill the edit modal with product data
        document.getElementById("editProductId").value = product.ID;
        document.getElementById("editProductName").value = product.Name;
        document.getElementById("editProductImage").value = product.Image;
        document.getElementById("editProductCategory").value = product.Category;
        document.getElementById("editProductPrice").value = product.Price;
        document.getElementById("editProductDescription").value =
          product.Description;
        document.getElementById("editProductStock").value =
          product["Stock Quantity"];
        document.getElementById("editProductFeatured").checked =
          product.isFeatured || false;

        // Show the modal
        const editModal = new bootstrap.Modal(
          document.getElementById("editModal")
        );
        editModal.show();
      }
    });
  });
}
//-----------DELETE FUNCTION-------------------
function deleteProduct(id) {
  let products = JSON.parse(localStorage.getItem("productsList")) || [];

  products = products.filter(product => product.ID !== id);

  localStorage.setItem("productsList", JSON.stringify(products));

  filteredProducts = [...products];

  displayProducts(currentPage);
  setupPagination();
}
//--------ADD EVENT LISTENER---------
tableBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const productId = parseInt(e.target.getAttribute("data-id"));
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId);
    }
  }
});
// Update Product Function
document
  .getElementById("updateProductBtn")
  .addEventListener("click", function () {
    const id = parseInt(document.getElementById("editProductId").value);
    const name = document.getElementById("editProductName").value.trim();
    const image = document.getElementById("editProductImage").value.trim();
    const category = document
      .getElementById("editProductCategory")
      .value.trim();
    const price = document.getElementById("editProductPrice").value.trim();
    const description = document
      .getElementById("editProductDescription")
      .value.trim();
    const stock = document.getElementById("editProductStock").value.trim();
    const featured = document.getElementById("editProductFeatured").checked;

    if (!name || !image || !category || !price || !description || !stock) {
      alert("Please fill in all required fields.");
      return;
    }

    // Find the product index
    const productIndex = products.findIndex((p) => p.ID === id);

    if (productIndex !== -1) {
      // Update the product
      products[productIndex] = {
        ...products[productIndex],
        Name: name,
        Image: image,
        Category: category,
        Price: parseFloat(price),
        Description: description,
        "Stock Quantity": parseInt(stock),
        isFeatured: featured,
      };

      // Save to localStorage
      localStorage.setItem("productsList", JSON.stringify(products));

      // Update categories if needed
      const categories = [...new Set(products.map((item) => item.Category))];
      localStorage.setItem("Categories", JSON.stringify(categories));

      // Refresh the table
      displayProducts(currentPage);
      setupPagination();
      setupEditButtons();

      // Close the modal
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("editModal")
      );
      window.location.reload();
      modal.hide();
    }
  });

// ------------------ORDERS MANAGEMENT-----------------------------

function updateOrderStatus(orderId, newStatus) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders = orders.map(order => {
    if (order.id === orderId) {
      order.status = newStatus;
    }
    return order;
  });
  localStorage.setItem("orders", JSON.stringify(orders));
  loadOrders();
}
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) window.location.href = "login.html";
  if (currentUser.role !== "admin") window.location.href = "index.html";

  // Display orders
  displayOrdersAdmin();

  // Search input
  const searchInput = document.getElementById("searchOrders");
  searchInput.addEventListener("input", (e) => {
    displayOrdersAdmin(e.target.value);
  });
});

function getUserName(userId) {
  const users = JSON.parse(localStorage.getItem("usersList")) || [];
  const user = users.find((u) => u.id === userId);
  return user ? user.name : `User ${userId}`;
}

function getOrders() {
  return JSON.parse(localStorage.getItem("orders")) || [];
}

function saveOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders));
}

function updateOrderStatus(orderId, newStatus) {
  let orders = getOrders();
  orders = orders.map((order) => {
    if (order.id === orderId) order.status = newStatus;
    return order;
  });
  saveOrders(orders);
  displayOrdersAdmin();
}

function getStatusBadgeClass(status) {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-warning";
    case "confirmed":
      return "bg-success";
    case "rejected":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
}

function displayOrdersAdmin(filter = "") {
  const orders = getOrders().filter(
    (order) =>
      order.id.toString().includes(filter) ||
      getUserName(order.userId).toLowerCase().includes(filter.toLowerCase()) ||
      order.status.toLowerCase().includes(filter.toLowerCase())
  );

  const tbody = document.getElementById("ordersTableBody");
  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center">No orders found</td></tr>`;
    return;
  }

  tbody.innerHTML = orders
    .map(
      (order) => `
    <tr>
      <td>${order.id}</td>
      <td>${getUserName(order.userId)}</td>
      <td>${new Date(order.date).toLocaleDateString()}</td>
      <td>$${order.total?.toFixed(2) || 0}</td>
      <td><span class="badge ${getStatusBadgeClass(order.status)}">${order.status
        }</span></td>
      <td>
        <button class="btn btn-success btn-sm me-1" onclick="updateOrderStatus(${order.id
        }, 'Confirmed')">Confirm</button>
        <button class="btn btn-danger btn-sm" onclick="updateOrderStatus(${order.id
        }, 'Rejected')">Reject</button>
      </td>
    </tr>
  `
    )
    .join("");
}
// Function to get users from localStorage safely
function getUsers() {
    return JSON.parse(localStorage.getItem("usersList")) || [];
}

// Function to save users to localStorage
function saveUsers(users) {
    localStorage.setItem("usersList", JSON.stringify(users));
}

// Function to render the Admin Users Table
function renderAdminUsersTable() {
    const users = getUsers();
    const tbody = document.getElementById("adminUsersTableBody");
    tbody.innerHTML = users.map((user) => {
        // Hide "Remove Admin" button if the current user is the same as the one being displayed
        const disableRemove = currentUser.email === user.email;

        return `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <span class="badge bg-${user.role === "admin" ? "success" : "secondary"}">${user.role}</span>
                </td>
                <td>
                    <div class="d-flex justify-content-center gap-2">
                        ${user.role === "customer" ? `<button class="btn btn-sm btn-success" onclick="changeUserRole('${user.email}', 'admin')">Make Admin</button>` : ''}
                        
                        ${user.role === "admin" && !disableRemove ? `<button class="btn btn-sm btn-danger" onclick="changeUserRole('${user.email}', 'customer')">Remove Admin</button>` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Function to change a user's role
window.changeUserRole = function(email, newRole) {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
        // Update user role
        users[userIndex].role = newRole;
        saveUsers(users);
        
        // If the current logged-in user's role is changed, redirect them
        if (currentUser.email === email && newRole === "customer") {
            alert("Your role has been changed. You will be logged out.");
            localStorage.removeItem("currentUser");
            window.location.href = "login.html";
        } else {
            // Re-render table to show the change
            renderAdminUsersTable();
        }
    }
};

// Handle the form for adding/updating an admin
document.getElementById("addAdminForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("newAdminEmail").value.trim();
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (user) {
        // If user exists, update their role to "admin"
        if (user.role === "admin") {
            alert("This user is already an admin.");
        } else {
            user.role = "admin";
            saveUsers(users);
            alert("User role updated to admin.");
        }
    } else {
        // If user doesn't exist, create a new user with "admin" role
        const newUserId = Date.now();
        const newAdmin = {
            id: newUserId,
            name: "New Admin",
            email: email,
            password: "defaultPassword", 
            role: "admin"
        };
        users.push(newAdmin);
        saveUsers(users);
        alert("New admin added.");
    }
    
    renderAdminUsersTable();
    this.reset();
    bootstrap.Modal.getInstance(document.getElementById('addAdminModal')).hide();
});

// Event listener for showing the Admin section
document.querySelector('a[data-section="adminSection"]').addEventListener('click', function() {
    document.querySelectorAll('div[id$="Section"]').forEach(sec => sec.style.display = 'none');
    document.getElementById('adminSection').style.display = 'block';
    renderAdminUsersTable();
});
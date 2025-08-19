document.addEventListener("DOMContentLoaded", () => {
  // Navbar active link
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  // Load user's orders
  displayUserOrders(currentUser.id);
});

function displayUserOrders(userId) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const userOrders = orders.filter((order) => order.userId === userId);
  const ordersTableBody = document.getElementById("ordersTableBody");

  if (userOrders.length === 0) {
    ordersTableBody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center">You have no orders yet</td>
      </tr>
    `;
    return;
  }

  ordersTableBody.innerHTML = userOrders
    .map(
      (order) => `
    <tr>
      <td>${order.id}</td>
      <td>${getUserName(order.userId)}</td>
      <td>${new Date(order.date).toLocaleDateString()}</td>
      <td>$${order.total.toFixed(2)}</td>
      <td>
        <span class="badge ${getStatusBadgeClass(order.status)}">
          ${order.status}
        </span>
      </td>
    </tr>
  `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  // Search functionality
  const searchInput = document.getElementById("ordersSearch");
  function renderOrders() {
    const filter = searchInput?.value || "";
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const userOrders = orders
      .filter((o) => o.userId === currentUser.id)
      .filter((o) => {
        const idStr = String(o.id);
        const dateStr = o.date ? new Date(o.date).toLocaleDateString() : "";
        const statusStr = (o.status || "").toLowerCase();
        const customerStr = getUserName(o.userId).toLowerCase();
        return (
          idStr.includes(filter) ||
          dateStr.includes(filter) ||
          statusStr.includes(filter.toLowerCase()) ||
          customerStr.includes(filter.toLowerCase())
        );
      });

    const tbody = document.getElementById("ordersTableBody");
    if (!userOrders.length) {
      tbody.innerHTML =
        '<tr><td colspan="5" class="text-center">No orders found</td></tr>';
      return;
    }

    tbody.innerHTML = userOrders
      .map(
        (o) => `
        <tr>
          <td>${o.id}</td>
          <td>${getUserName(o.userId)}</td>
          <td>${o.date ? new Date(o.date).toLocaleDateString() : "-"}</td>
          <td>$${o.total?.toFixed(2) || "0.00"}</td>
          <td><span class="badge ${getStatusBadgeClass(o.status)}">${
          o.status
        }</span></td>
        </tr>
      `
      )
      .join("");
  }

  searchInput?.addEventListener("input", renderOrders);
  renderOrders(); 
});

document.addEventListener("DOMContentLoaded", () => {
  displayOrdersAdmin();
});
function getUserName(userId) {
  const users = JSON.parse(localStorage.getItem("usersList")) || [];
  const user = users.find((u) => u.id === userId);
  return user ? user.name : "Unknown";
}

function getStatusBadgeClass(status) {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-success";
    case "shipped":
      return "bg-primary";
    case "processing":
      return "bg-warning";
    case "cancelled":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
}
// Function to get orders from localStorage
function getOrders() {
  return JSON.parse(localStorage.getItem("orders")) || [];
}

// Function to save orders to localStorage
function saveOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders));
}

// Function to add a new order
function addOrder(userId, items) {
  const orders = getOrders();
  const newOrder = {
    id: orders.length + 1,
    userId,
    date: new Date().toISOString(),
    items,
    status: "Pending"
  };
  orders.push(newOrder);
  saveOrders(orders);
}

// Function for admin to update order status (Confirm / Reject)
function updateOrderStatus(orderId, newStatus) {
  const orders = getOrders();
  const orderIndex = orders.findIndex(order => order.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].status = newStatus;
    saveOrders(orders);
  }
}

// Function for client to get orders by userId
function getUserOrders(userId) {
  return getOrders().filter(order => order.userId === userId);
}

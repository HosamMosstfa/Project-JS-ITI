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

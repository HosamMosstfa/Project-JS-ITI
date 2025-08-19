//navbar.js

document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  
  document.querySelectorAll(".navbar-nav .nav-link").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
});
/////////Place Order/////////////////////
document.getElementById("placeOrderBtn").addEventListener("click", () => {

  // Get cart from localStorage or empty if not found
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // If cart is empty → stop process
  if (cart.length == 0) {
    alert("Cart is empty! Please add products before placing an order.");
    return;
  }
  // Calculate total price of all items
  let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Get existing orders from localStorage (or empty list)
  let orders = JSON.parse(localStorage.getItem("ordersList")) || [];

  // Create order object
  let newOrder = {
    orderID: orders.length + 1,
    userID: currentUser.id,    
    products: cart,     
    total: total,          
    status: "Pending"      
  };

  // Add new order to orders list
  orders.push(newOrder);

  // Save updated orders list back to localStorage
  localStorage.setItem("ordersList", JSON.stringify(orders));

  
  localStorage.removeItem("cart");

  
  alert("Your order has been placed successfully!");

  // Redirect to Orders page
  window.location.href = "Orders.html";
});

/////////////////////////////////////////////


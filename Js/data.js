// Fetch users.json and keep local data (do not delete what was already saved)
fetch("/user_json/users.json")
  .then((response) => response.json())
  .then((userData) => {
    try {
      const existing = JSON.parse(localStorage.getItem("usersList"));

      if (!Array.isArray(existing) || existing.length === 0) {
        // If no usersList in localStorage, set it
        localStorage.setItem("usersList", JSON.stringify(userData));
        console.log("Users data saved from JSON (initial)");
      } else {
        // Merge without duplicating same email
        const merged = [...existing];
        userData.forEach((u) => {
          const found = merged.some(
            (m) =>
              (m.email || "").toLowerCase() === (u.email || "").toLowerCase()
          );
          if (!found) merged.push(u);
        });
        localStorage.setItem("usersList", JSON.stringify(merged));
        console.log("Users data merged with local users");
      }
    } catch (err) {
      // If parse failed, save new data
      localStorage.setItem("usersList", JSON.stringify(userData));
      console.log("Users data saved from JSON (fallback)");
    }
  })
  .catch((error) => console.error("Error loading users.json:", error));

fetch("/Data/products.json")
  .then((response) => response.json())
  .then((productData) => {
    // Ensure all products have their original Image field
    productData = productData.map((p) => ({
      ...p,
      Image: p.Image, // Keep the image from JSON
    }));

    const existingProductsRaw = localStorage.getItem("productsList");
    let existingProducts = [];

    try {
      existingProducts = existingProductsRaw
        ? JSON.parse(existingProductsRaw)
        : [];
    } catch (err) {
      existingProducts = [];
    }

    if (!Array.isArray(existingProducts) || existingProducts.length === 0) {
      // If no productsList in localStorage, set it
      localStorage.setItem("productsList", JSON.stringify(productData));
      console.log("Products data saved from JSON (with images)");
    } else {
      // Merge without duplication (based on ID)
      const merged = [...existingProducts];
      productData.forEach((p) => {
        const found = merged.some((m) => m.ID === p.ID);
        if (!found) merged.push(p);
      });
      localStorage.setItem("productsList", JSON.stringify(merged));
      console.log("Products merged with local products (with images)");
    }

    // Extract unique categories and save them
    const categories = [
      ...new Set(
        JSON.parse(localStorage.getItem("productsList") || "[]").map(
          (item) => item.Category
        )
      ),
    ];
    localStorage.setItem("Categories", JSON.stringify(categories));
    console.log("Categories saved:", categories);
  })
  .catch((error) => console.error("Error loading products.json:", error));
// create local for cart ( peter )
if (!localStorage.getItem("cart")) {
  localStorage.setItem("cart", JSON.stringify([]));
}
window.addToCart = function (productId) {
  let products = JSON.parse(localStorage.getItem("productsList")) || [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const product = products.find((p) => p.ID === productId);
  if (product) {
    // Check if product already in cart
    const existingItem = cart.find((item) => item.ID === productId);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      const productToAdd = { ...product, quantity: 1 };
      cart.push(productToAdd);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.Name} added to cart!`);
    updateCartCount();
  }
};

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCountElements = document.querySelectorAll(".cart-count");

  if (cartCountElements.length > 0) {
    const totalItems = cart.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
    cartCountElements.forEach((el) => {
      el.textContent = totalItems;
      el.style.display = totalItems > 0 ? "inline-block" : "none";
    });
  }
}

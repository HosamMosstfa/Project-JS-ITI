fetch("/user_json/users.json")
  .then((response) => response.json())
  .then((userData) => {
    localStorage.setItem("usersList", JSON.stringify(userData));
    console.log("Users data saved");
  })
  .catch((error) => console.error("Error loading user.json:", error));

fetch("/Products_Json/products.json")
  .then((response) => response.json())
  .then((productData) => {
    localStorage.setItem("productsList", JSON.stringify(productData));
    console.log("Products data saved");
  const categories = [...new Set(productData.map((item) => item.Category))];
  localStorage.setItem("Categories", JSON.stringify(categories));
  console.log("Unique Categories saved:", categories);
    console.log("Categories saved:", categories);
  })
  .catch((error) => console.error("Error loading product.json:", error));

const users = JSON.parse(localStorage.getItem("usersList"));
const products = JSON.parse(localStorage.getItem("productsList"));
const categories = JSON.parse(localStorage.getItem("Categories"));

console.log(users);
console.log(products);
console.log(categories);

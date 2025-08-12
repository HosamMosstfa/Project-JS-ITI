// users.json fetch + محافظه على البيانات المحلية (ما تمسحش اللي اتسجّل)
fetch("/user_json/users.json")
  .then((response) => response.json())
  .then((userData) => {
    try {
      const existing = JSON.parse(localStorage.getItem("usersList"));
      if (!Array.isArray(existing) || existing.length === 0) {
        // لو مفيش usersList اعمل set
        localStorage.setItem("usersList", JSON.stringify(userData));
        console.log("Users data saved from JSON (initial)");
      } else {
        // لو فيه بيانات محلية نعمل دمج (لا نكرر بنفس الإيميل)
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
      // لو حدث خطأ في parse
      localStorage.setItem("usersList", JSON.stringify(userData));
      console.log("Users data saved from JSON (fallback)");
    }
  })
  .catch((error) => console.error("Error loading user.json:", error));

// نفس الفكرة للـ products (لو عايز دمج)
fetch("/Data/products.json")
  .then((response) => response.json())
  .then((productData) => {
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
      localStorage.setItem("productsList", JSON.stringify(productData));
      console.log("Products data saved from JSON (initial)");
    } else {
      // دمج بدون تكرار بناءً على ID أو اسم المنتج (عدل الشرط حسب ملفك)
      const merged = [...existingProducts];
      productData.forEach((p) => {
        const found = merged.some((m) => m.ID === p.ID); // افترض إن كل منتج له ID
        if (!found) merged.push(p);
      });
      localStorage.setItem("productsList", JSON.stringify(merged));
      console.log("Products merged with local products");
    }

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
  .catch((error) => console.error("Error loading product.json:", error));

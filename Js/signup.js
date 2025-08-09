document.addEventListener("DOMContentLoaded", function () {
  // منع دخول صفحة التسجيل لو المستخدم مسجل دخول
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    if (currentUser.role === "admin") {
      window.location.replace("admin.html");
    } else {
      window.location.replace("Home.html");
    }
    return;
  }

  const form = document.getElementById("registerForm");
  if (!form) return console.error("registerForm not found");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = (document.getElementById("name")?.value || "").trim();
    const email = (document.getElementById("email")?.value || "")
      .trim()
      .toLowerCase();
    const password = (document.getElementById("password")?.value || "").trim();
    const role = (document.getElementById("role")?.value || "").trim();
    const errorMsgEl = document.getElementById("errorMsg");

    if (errorMsgEl) errorMsgEl.textContent = "";

    if (!name || !email || !password || !role) {
      if (errorMsgEl) errorMsgEl.textContent = "All fields are required!";
      return;
    }
    if (password.length < 6) {
      if (errorMsgEl)
        errorMsgEl.textContent = "Password must be at least 6 characters.";
      return;
    }

    let usersRaw = localStorage.getItem("usersList");
    let users = [];
    try {
      users = usersRaw ? JSON.parse(usersRaw) : [];
    } catch (err) {
      users = [];
    }
    if (!Array.isArray(users)) users = [];

    const exists = users.some((u) => (u.email || "").toLowerCase() === email);
    if (exists) {
      if (errorMsgEl) errorMsgEl.textContent = "Email already registered!";
      return;
    }

    const newId =
      users.length > 0 ? (users[users.length - 1].id || users.length) + 1 : 1;

    const newUser = { id: newId, name, email, password, role };
    users.push(newUser);
    localStorage.setItem("usersList", JSON.stringify(users));

    alert("Registration successful!");
    window.location.href = "login.html";
  });
});

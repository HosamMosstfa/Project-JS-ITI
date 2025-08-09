// -----------------------------Login Form------------------
document.addEventListener("DOMContentLoaded", function () {
  // منع دخول صفحة اللوجين لو المستخدم مسجل دخول
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    if (currentUser.role === "admin") {
      window.location.replace("admin.html");
    } else {
      window.location.replace("Home.html");
    }
    return;
  }

  const loginForm = document.getElementById("loginForm");

  if (!loginForm) {
    console.error("Form with id 'loginForm' not found!");
    return;
  }

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let errorMsg = document.getElementById("errorMsg");

    errorMsg.textContent = "";

    let users = JSON.parse(localStorage.getItem("usersList"));

    if (!Array.isArray(users)) {
      errorMsg.textContent =
        "No registered users found. Please register first.";
      return;
    }

    let foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      localStorage.setItem("loggedIn", "true");

      if (foundUser.role === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "Home.html";
      }
    } else {
      errorMsg.textContent = "Invalid email or password.";
    }
  });
});

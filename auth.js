// Handle login form submission
document.addEventListener("DOMContentLoaded", function () {
  // Login form handler
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("jobportal_users")) || [];

      // Find user
      const user = users.find(
        (user) => user.email === email && user.password === password
      );

      if (!user) {
        alert("Invalid email or password!");
        return;
      }

      // Set current user in localStorage
      localStorage.setItem(
        "jobportal_current_user",
        JSON.stringify({
          email: user.email,
          role: user.role,
          name: user.name,
        })
      );

      // Redirect based on role
      if (user.role === "seeker") {
        window.location.href = "seeker-dashboard.html";
      } else {
        window.location.href = "employer-dashboard.html";
      }
    });
  }

  // Signup form handler
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const role = document.querySelector('input[name="role"]:checked').value;

      // Simple validation
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("jobportal_users")) || [];
      const userExists = users.some((user) => user.email === email);

      if (userExists) {
        alert("User with this email already exists!");
        return;
      }

      // Create new user object
      const newUser = {
        name,
        email,
        password,
        role,
      };

      // Save to localStorage
      users.push(newUser);
      localStorage.setItem("jobportal_users", JSON.stringify(users));
      localStorage.setItem(
        "jobportal_current_user",
        JSON.stringify({
          email,
          role,
          name,
        })
      );

      // Redirect based on role
      if (role === "seeker") {
        window.location.href = "seeker-dashboard.html";
      } else {
        window.location.href = "employer-dashboard.html";
      }
    });
  }

  // Logout functionality
  const logoutLinks = document.querySelectorAll("#logout");
  logoutLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("jobportal_current_user");
      window.location.href = "login.html";
    });
  });
});

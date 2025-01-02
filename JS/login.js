// Retrieve existing users from localStorage
const registeredUsers = JSON.parse(localStorage.getItem("users")) || [];

// Delete all the users from localStorage
//localStorage.removeItem("users");

// Elements
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage");

// Track failed login attempts
const maxAttempts = 5;
let loginAttempts = JSON.parse(localStorage.getItem("loginAttempts")) || {};

// Initialize loginAttempts for registered users if not set
registeredUsers.forEach(user => {
    if (!loginAttempts[user.email] && loginAttempts[user.email] !== 0) {
        loginAttempts[user.email] = 0;
    }
});
localStorage.setItem("loginAttempts", JSON.stringify(loginAttempts));

// Event Listener for Login
loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Clear previous messages
    errorMessage.style.display = "none";

    // Initialize attempts for new email
    if (!loginAttempts[email] && loginAttempts[email] !== 0) {
        loginAttempts[email] = 0;
    }

    // Check if user is blocked
    if (loginAttempts[email] >= maxAttempts) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "Your account is blocked. Contact support.";
        return;
    }

    // Validate email and password
    const user = registeredUsers.find(user => user.email === email);
    if (!user) {
        errorMessage.style.display = "block";
        errorMessage.innerHTML = `Email not registered. <a href='../HTML/signup.html'>Sign up here</a>.`;
        return;
    }

    if (user.password !== password) {
        loginAttempts[email]++;
        localStorage.setItem("loginAttempts", JSON.stringify(loginAttempts));

        if (loginAttempts[email] >= maxAttempts) {
            errorMessage.style.display = "block";
            errorMessage.textContent = "Your account is blocked. Contact support.";
        } else {
            const attemptsLeft = maxAttempts - loginAttempts[email];
            errorMessage.style.display = "block";
            errorMessage.textContent = `Invalid password. ${attemptsLeft} attempt(s) left.`;
        }
        return;
    }

    // Successful login
    loginAttempts[email] = 0; // Reset attempts for this user
    localStorage.setItem("loginAttempts", JSON.stringify(loginAttempts));
    document.cookie = "session=active; max-age=3600; path=/"; // Simulate session cookie
    window.location.href = "../HTML/main-page.html"; // Redirect
});

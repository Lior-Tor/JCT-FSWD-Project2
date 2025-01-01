// Dummy user data for authentication
const dummyUsers = [
    { email: "test@example.com", password: "Password123" },
    { email: "user@games4u.com", password: "Games4U2023" }
];

// Elements
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage");

// Track failed login attempts
const maxAttempts = 3;
let attempts = localStorage.getItem("loginAttempts") || 0;

// Event Listener for Login
loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Check if user is blocked
    if (attempts >= maxAttempts) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "Your account is blocked. Contact support.";
        return;
    }

    // Validate email and password
    const user = dummyUsers.find((user) => user.email === email);
    if (!user) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "Email not registered. Please sign up.";
        return;
    }

    if (user.password !== password) {
        attempts++;
        localStorage.setItem("loginAttempts", attempts);

        if (attempts >= maxAttempts) {
            errorMessage.style.display = "block";
            errorMessage.textContent = "Your account is blocked. Contact support.";
        } else {
            errorMessage.style.display = "block";
            errorMessage.textContent = `Invalid password. ${maxAttempts - attempts} attempt(s) left.`;
        }
        return;
    }

    // Successful login
    localStorage.setItem("loginAttempts", 0); // Reset attempts
    document.cookie = "session=active; max-age=3600; path=/"; // Simulate session cookie
    window.location.href = "main-page.html"; // Redirect
});

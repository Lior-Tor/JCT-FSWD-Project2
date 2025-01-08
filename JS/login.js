// Retrieve existing users from localStorage
const registeredUsers = JSON.parse(localStorage.getItem("users")) || [];
console.log("Registered users: ", registeredUsers);

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
console.log("Login attempts: ", loginAttempts);

// Initialize loginAttempts for registered users if not set
registeredUsers.forEach(user => {
    if (!loginAttempts[user.email] && loginAttempts[user.email] !== 0) {
        loginAttempts[user.email] = 0;
        console.log("(ForEach) Initialized login attempts for: ", user.email);
    }
});
localStorage.setItem("loginAttempts", JSON.stringify(loginAttempts));
console.log("Updated login attempts: ", loginAttempts);

// Event Listener for Login
loginForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission behavior (page refresh)

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Clear previous messages
    errorMessage.style.display = "none";

    // Initialize attempts for new email
    if (!loginAttempts[email] && loginAttempts[email] !== 0) {
        loginAttempts[email] = 0;
        console.log("(Event Listener) Initialized login attempts for: ", email);
    }

    // Check if user is blocked
    if (loginAttempts[email] >= maxAttempts) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "Your account is blocked. Contact support.";
        return;
    }

    // Validate email and password
    const user = registeredUsers.find(user => user.email === email); // Returns undefined if not found
    console.log("User found: ", user);

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
    loginAttempts[email] = 0;
    localStorage.setItem("loginAttempts", JSON.stringify(loginAttempts));
    localStorage.setItem("loggedInUser", email);

    // Update user data
    const now = new Date();
    const formattedDate = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) +
                          " " +
                          now.toLocaleDateString("en-US");
    user.lastLogin = formattedDate; // Set the last login date
    if (!user.highScores) {
        user.highScores = { game1: 0, game2: 0 }; // Initialize high scores if not already set
    }

    // Update registered users in localStorage
    const updatedUsers = registeredUsers.map(u => u.email === email ? user : u);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    document.cookie = "session=active; max-age=3600; path=/"; // Set session cookie for 1 hour
    window.location.href = "HTML/main-page.html"; // Redirect
});
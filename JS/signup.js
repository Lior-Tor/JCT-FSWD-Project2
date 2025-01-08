// Retrieve existing users from localStorage
const newUsers = JSON.parse(localStorage.getItem("users")) || [];
console.log("Registered users: ", newUsers);

// Delete all the users from localStorage
//localStorage.removeItem("users");

// Elements
const signupForm = document.getElementById("signupForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const birthdateInput = document.getElementById("birthdate");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");
const togglePassword = document.getElementById("togglePassword");

// Toggle Show/Hide Password
togglePassword.addEventListener("click", () => {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type; // Password or Text
    confirmPasswordInput.type = type; // Password or Text
    togglePassword.textContent = type === "password" ? "👁️" : "🫣";
});

// Event Listener for Signup
signupForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission behavior (page refresh)

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const birthdate = new Date(birthdateInput.value);
    const today = new Date(); // Get today's date for age calculation

    // Calculate age
    const age = today.getFullYear() - birthdate.getFullYear();
    const isBeforeBirthdayThisYear = today.getMonth() < birthdate.getMonth() ||
        (today.getMonth() === birthdate.getMonth() && today.getDate() < birthdate.getDate());
    const actualAge = isBeforeBirthdayThisYear ? age - 1 : age;

    // Clear previous messages
    errorMessage.style.display = "none";
    successMessage.style.display = "none";

    // Validate fields
    if (!name || !email || !password || !confirmPassword || !birthdate) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "All fields are required.";
        return;
    }

    // Validate age
    if (actualAge < 13) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "You must be at least 13 years old to sign up.";
        return;
    }

    // Check if email is already registered
    if (newUsers.some(user => user.email === email)) {
        errorMessage.style.display = "block";
        errorMessage.innerHTML = `Email is already registered. <a href='../login.html'>Login here</a>.`;
        return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@#$%^&+=!]{8,}$/;
    if (!passwordRegex.test(password)) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "Password must be at least 8 characters long, include one uppercase letter, one number, and optionally special characters.";
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        errorMessage.style.display = "block";
        errorMessage.textContent = "Passwords do not match.";
        return;
    }

    // Save new user to localStorage
    const newUser = { name, email, password, birthdate };
    newUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(newUsers));
    console.log("New user registered: ", newUser);

    // Display success message
    successMessage.style.display = "block";
    successMessage.textContent = "Account created successfully! Redirecting to login...";

    // Redirect to login page after 3 seconds
    setTimeout(() => {
        window.location.href = "../login.html";
    }, 3000);
});
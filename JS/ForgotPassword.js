// Elements
const recoveryForm = document.getElementById("recoveryForm");
const emailInput = document.getElementById("email");
const birthdateInput = document.getElementById("birthdate");
const recoveryMessage = document.getElementById("recoveryMessage");

// Event Listener for Recovery Form
recoveryForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const birthdate = birthdateInput.value;

    // Clear previous messages
    recoveryMessage.style.display = "none";

    // Validate fields
    if (!email || !birthdate) {
        recoveryMessage.style.display = "block";
        recoveryMessage.textContent = "Both email and date of birth are required.";
        return;
    }

    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find the user with the matching email and birthdate
    const user = users.find(user => user.email === email && user.birthdate === birthdate);

    if (!user) {
        recoveryMessage.style.display = "block";
        recoveryMessage.textContent = "No matching account found. Please check your details and try again.";
        return;
    }

    // Display the recovered password
    recoveryMessage.style.display = "block";
    recoveryMessage.textContent = `Your password is: ${user.password}`;
});

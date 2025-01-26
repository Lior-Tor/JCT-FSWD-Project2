// Retrieve stored users from localStorage
const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
console.log("Stored users: ", storedUsers);

// Elements
const recoveryForm = document.getElementById("recoveryForm");
const emailInput = document.getElementById("email");
const recoveryMessage = document.getElementById("recoveryMessage");

// Event Listener for Password Recovery
recoveryForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission behavior (page refresh)

    const email = emailInput.value.trim();
    recoveryMessage.style.display = "none";

    // Find user in localStorage
    const user = storedUsers.find(user => user.email === email);

    // If email is not found
    if (!user) {
        recoveryMessage.style.display = "block";
        recoveryMessage.style.color = "red";
        recoveryMessage.innerHTML = `No account found with this email. <a href='HTML/signup.html' style="color: #6C63FF; text-decoration: none; font-weight: bold;">Sign up here</a>.`;
        console.log("Email not found: ", email);
        return;
    }

    // If email is found
    recoveryMessage.style.display = "block";
    recoveryMessage.style.color = "green";
    recoveryMessage.textContent = "A code has been sent to your email.";
    console.log("Recovery code sent to: ", email);

    // Simulate email sending delay
    setTimeout(() => {
        recoveryMessage.style.display = "none";
    }, 5000);
});
// Retrieve stored users from localStorage
const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

// Elements
const recoveryForm = document.getElementById("recoveryForm");
const emailInput = document.getElementById("email");
const recoveryMessage = document.getElementById("recoveryMessage");

// Event Listener for Password Recovery
recoveryForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevents page refresh

    const email = emailInput.value.trim();
    recoveryMessage.style.display = "none"; // Hide previous messages

    // Find user in localStorage
    const user = storedUsers.find(user => user.email === email);

    if (!user) {
        // If email is not found
        recoveryMessage.style.display = "block";
        recoveryMessage.style.color = "red";
        recoveryMessage.innerHTML = `No account found with this email. <a href='../HTML/signup.html' style="color: #6C63FF; text-decoration: none; font-weight: bold;">Sign up here</a>.`;
        return;
    }

    // If email is found
    recoveryMessage.style.display = "block";
    recoveryMessage.style.color = "green";
    recoveryMessage.textContent = "A code has been sent to your email.";

    // Simulate email sending delay (purely visual, no actual email is sent)
    setTimeout(() => {
        recoveryMessage.style.display = "none";
    }, 5000);
});

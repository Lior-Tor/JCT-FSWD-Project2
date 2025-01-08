// Check if the user is logged in
if (document.cookie.includes("session=active")) {
    console.log("User is logged in");
} else {
    window.location.href = "../../login.html"; // Redirect to login
}

// If the logout button is clicked, invalidate the session cookie
const logoutButton = document.querySelector(".logout-button");
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        document.cookie = "session=active; max-age=0; path=/";
    });
}

// Logout functionality
logoutButton.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser"); // Remove user session
    window.location.href = "../login.html"; // Redirect to login page
});

// Elements for the intro video
const introVideoContainer = document.getElementById("introVideoContainer");
const introVideo = document.getElementById("introVideo");
const mainContent = document.getElementById("mainContent");
const introAudio = new Audio("../sounds/intro-voice.mp3");
const introSound = new Audio("../sounds/intro-sound.mp3");

// Play the intro sound and audio at the launch of the page
introSound.play();
introAudio.play();

// Handle intro video ending
introVideo.addEventListener("ended", () => {
    introSound.pause();
    introSound.currentTime = 0;
    introAudio.pause();
    introAudio.currentTime = 0;
    introVideoContainer.style.animation = "fadeOut 1s ease forwards";

    setTimeout(() => {
        introVideoContainer.style.display = "none";
        mainContent.style.display = "block";
        document.body.style.overflowY = "auto";
    }, 1000); // Wait for fade-out animation
});

// Allow users to skip the intro by clicking the video
introVideoContainer.addEventListener("click", () => {
    introSound.pause();
    introSound.currentTime = 0;
    introAudio.pause();
    introAudio.currentTime = 0;
    introVideo.pause();
    introVideoContainer.style.animation = "fadeOut 1s ease forwards";

    setTimeout(() => {
        introVideoContainer.style.display = "none";
        mainContent.style.display = "block";
        document.body.style.overflowY = "auto";
    }, 1000); // Wait for fade-out animation
});

const email = localStorage.getItem("loggedInUser");
console.log("Logged in user: ", email);
const users = JSON.parse(localStorage.getItem("users"));
console.log("All users: ", users);
const user = users.find(u => u.email === email);
console.log("Current user: ", user);

if (user) {
    document.getElementById("lastLogin").textContent = `Last Login: ${user.lastLogin}`;
}

// Get the high scores for the logged-in user
if (user) {
    const highScoreGame1 = user.highScores?.game1 || 0;
    const highScoreGame2 = user.highScores?.game2 || 0;
    console.log(`High Score for Game 1: ${highScoreGame1}`);
    console.log(`High Score for Game 2: ${highScoreGame2}`);
}

// Dynamically set the current year in the footer
const currentYear = new Date().getFullYear();
document.getElementById("currentYear").textContent = currentYear;

// Dynamically set the user's username based on stored data
const userName = users.find(u => u.email === email);
if (userName && userName.name) {
    document.getElementById("username").textContent = userName.name;
} else {
    document.getElementById("username").textContent = "Player";
}

// Newsletter form submission
const newsletterForm = document.getElementById("newsletter-form");
newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent the default form submission behavior (page refresh)

    // Get the email input value
    const emailInput = newsletterForm.querySelector("input").value;

    // Check if an email was entered
    if (emailInput) {
        alert(`Thank you for subscribing !`);
        newsletterForm.reset();
    }
});
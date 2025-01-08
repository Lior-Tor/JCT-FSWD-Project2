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
        document.cookie = "session=active; max-age=0; path=/"; // Invalidate the session cookie
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Elements for the intro video
    const introVideoContainer = document.getElementById("introVideoContainer");
    const introVideo = document.getElementById("introVideo");
    const mainContent = document.getElementById("mainContent");
    const introAudio = new Audio("../sounds/intro-voice.mp3");
    const introSound = new Audio("../sounds/intro-sound.mp3"); // Add new intro sound

    // Play the intro sound at the launch of the page
    introSound.play();

    // Play intro audio along with the video
    introVideo.addEventListener("play", () => {
        introAudio.play();
    });

    // Handle intro video ending
    introVideo.addEventListener("ended", () => {
        introAudio.pause();
        introAudio.currentTime = 0; // Reset audio to the beginning
        introVideoContainer.style.animation = "fadeOut 1s ease forwards";

        setTimeout(() => {
            introVideoContainer.style.display = "none"; // Hide intro container
            mainContent.style.display = "block"; // Show main content
            document.body.style.overflowY = "auto"; // Enable scrolling
        }, 1000); // Wait for fade-out animation
    });

    // Allow users to skip the intro by clicking the video
    introVideoContainer.addEventListener("click", () => {
        introAudio.pause();
        introAudio.currentTime = 0; // Reset audio
        introVideo.pause();
        introVideoContainer.style.animation = "fadeOut 1s ease forwards";

        setTimeout(() => {
            introVideoContainer.style.display = "none"; // Hide intro container
            mainContent.style.display = "block"; // Show main content
            document.body.style.overflowY = "auto"; // Enable scrolling
        }, 1000); // Wait for fade-out animation
    });

    const email = localStorage.getItem("loggedInUser");
    const users = JSON.parse(localStorage.getItem("users"));
    const user = users.find(u => u.email === email);

    if (user) {
        console.log(`Welcome back! Last login: ${user.lastLogin}`);
        document.getElementById("lastLogin").textContent = `Last Login: ${user.lastLogin}`;
    }

    if (user) {
        // Get the high scores for the logged-in user
        const highScoreGame1 = user.highScores?.game1 || 0; // Default to 0 if undefined
        const highScoreGame2 = user.highScores?.game2 || 0; // Default to 0 if undefined

        // Log the high scores to the console
        console.log(`High Score for Game 1: ${highScoreGame1}`);
        console.log(`High Score for Game 2: ${highScoreGame2}`);
    } else {
        console.log("No user is currently logged in.");
    }

    // Dynamically set the current year in the footer
    const currentYear = new Date().getFullYear();
    document.getElementById("currentYear").textContent = currentYear;

    // Dynamically set the user's username based on stored data
    const userEmail = localStorage.getItem("loggedInUser") || "Player";
    const username = userEmail.split("@")[0];
    document.getElementById("username").textContent = username;
    console.log("User email: ", userEmail);

    // Newsletter form submission
    const newsletterForm = document.getElementById("newsletter-form");
    newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent the default form submission behavior (page refresh)
        console.log("Newsletter form submission prevented.");

        // Get the email input value
        const emailInput = newsletterForm.querySelector("input").value;

        // Check if an email was entered
        if (emailInput) {
            alert(`Thank you for subscribing, ${username}!`); // Show alert
            newsletterForm.reset(); // Reset the form
        } else {
            alert("Please enter a valid email address."); // Optional: Show validation message
        }
    });

    // Logout functionality
    const logoutButton = document.querySelector(".logout-button");
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser"); // Remove user session
        window.location.href = "../login.html"; // Redirect to login page
    });
});

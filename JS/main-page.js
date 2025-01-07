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

    // Dynamically set the current year in the footer
    const currentYear = new Date().getFullYear();
    document.getElementById("currentYear").textContent = currentYear;

    // Dynamically set the user's username based on stored data
    const userEmail = localStorage.getItem("loggedInUser") || "Player";
    const username = userEmail.split("@")[0];
    document.getElementById("username").textContent = username;
    console.log("User email: ", userEmail);

    // Dynamically load high scores (mocked for now; replace with real logic)
    const highScoreGame1 = localStorage.getItem("highScoreGame1") || 0;
    const highScoreGame2 = localStorage.getItem("highScoreGame2") || 0;
    document.getElementById("highScoreGame1").textContent = highScoreGame1;
    document.getElementById("highScoreGame2").textContent = highScoreGame2;
    console.log("High score for Game 1: ", highScoreGame1);
    console.log("High score for Game 2: ", highScoreGame2);

    // Newsletter form submission
    const newsletterForm = document.getElementById("newsletter-form");
    newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent the default form submission
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

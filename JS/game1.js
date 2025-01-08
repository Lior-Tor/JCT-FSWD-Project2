// Check if the user is logged in
if (document.cookie.includes("session=active")) {
    console.log("User is logged in");
} else {
    window.location.href = "../../login.html"; // Redirect to login
}

// Game variables
let gameRunning = false;
let score = 0;
let gameSpeed = 5; // Initial obstacle speed
let spawnInterval = 1000; // Initial spawn time

const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const startButton = document.getElementById("startButton");
const backButton = document.getElementById("backButton");

let obstacleInterval;
let difficultyIncrease;
let userEmail = localStorage.getItem("loggedInUser");

// Retrieve high scores for different users
let highScores = JSON.parse(localStorage.getItem("highScores")) || {};

// Assign high score to the current user or set to 0 if none exists
let highScore = highScores[userEmail] || 0;
highScoreDisplay.textContent = `High Score: ${highScore}`;

// Load Sounds
const collisionSound = new Audio("../../sounds/collision-sound.mp3");
const gameOverSound = new Audio("../../sounds/game-over-sound.mp3");
const newHighScoreSound = new Audio("../../sounds/new-high-score-sound.mp3");
const obstacleCreationSound = new Audio("../../sounds/obstacle-creation-sound.mp3");

// Player movement using arrow keys
document.addEventListener("keydown", (event) => {
    if (!gameRunning) return;

    let left = parseInt(getComputedStyle(player).left);

    if (event.key === "ArrowLeft" && left > 10) {
        player.style.left = left - 20 + "px";
    }
    if (event.key === "ArrowRight" && left < gameArea.clientWidth - 40) {
        player.style.left = left + 20 + "px";
    }
});

// Function to create falling obstacles
function createObstacle() {
    if (!gameRunning) return;

    // Play the obstacle creation sound
    obstacleCreationSound.play();

    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.left = Math.random() * (gameArea.clientWidth - 30) + "px";
    gameArea.appendChild(obstacle);

    let obstacleFall = setInterval(() => {
        if (!gameRunning) {
            clearInterval(obstacleFall);
            return;
        }

        let top = parseInt(getComputedStyle(obstacle).top);
        let playerRect = player.getBoundingClientRect();
        let obstacleRect = obstacle.getBoundingClientRect();

        // Collision detection
        let isColliding =
            playerRect.right > obstacleRect.left + 5 &&
            playerRect.left < obstacleRect.right - 5 &&
            playerRect.bottom > obstacleRect.top + 5 &&
            playerRect.top < obstacleRect.bottom - 5;

        if (isColliding) {
            collisionSound.play(); // Play collision sound
            clearInterval(obstacleFall);
            gameOver();
        }

        if (top > gameArea.clientHeight - 20) {
            // Increment score only when the obstacle disappears
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            obstacle.remove();
            clearInterval(obstacleFall); // Stop obstacle fall
        } else {
            obstacle.style.top = top + gameSpeed + "px";
        }
    }, 50);
}

// Start game function
function startGame() {
    if (gameRunning) return;

    gameRunning = true;
    score = 0;
    gameSpeed = 5; // Reset speed
    spawnInterval = 1000; // Reset spawn interval

    scoreDisplay.textContent = `Score: ${score}`;
    highScoreDisplay.textContent = `High Score: ${highScore}`;

    // Hide start button
    startButton.style.display = "none";

    // Gradually increase difficulty, but obstacles still come frequently
    difficultyIncrease = setInterval(() => {
        gameSpeed += 2; // Increase obstacle speed
        spawnInterval = Math.max(600, spawnInterval - 80); // Reduce spawn interval slightly
    }, 3000); // Every 3 seconds

    // Start spawning obstacles
    obstacleInterval = setInterval(() => {
        if (!gameRunning) {
            clearInterval(obstacleInterval);
            return;
        }
        createObstacle();
    }, spawnInterval);
}

// Game over function
function gameOver() {
    gameRunning = false; // Mark the game as not running
    clearInterval(obstacleInterval); // Stop spawning new obstacles
    clearInterval(difficultyIncrease); // Stop increasing difficulty

    // Check if the player achieved a new high score
    if (score > highScore) {
        highScore = score; // Update the high score
        highScores[userEmail] = highScore; // Save the high score for the current user
        localStorage.setItem("highScores", JSON.stringify(highScores)); // Store the updated high scores in localStorage
        newHighScoreSound.play(); // Play the new high score sound

        // Wait a short moment before displaying the alert
        setTimeout(() => {
            alert(`Game Over! New High Score: ${score}`);
            cleanupAfterGameOver(); // Cleanup obstacles and show Retry button
        }, 500); // Wait 500ms for the sound to play before showing the alert
    } else {
        gameOverSound.play(); // Play the game over sound

        // Wait a short moment before displaying the alert
        setTimeout(() => {
            alert(`Game Over! Your Score: ${score}`);
            cleanupAfterGameOver(); // Cleanup obstacles and show Retry button
        }, 500); // Wait 500ms for the sound to play before showing the alert
    }
}

// Function to clean up obstacles and show the Retry button
function cleanupAfterGameOver() {
    // Remove all existing obstacles
    document.querySelectorAll(".obstacle").forEach(obstacle => obstacle.remove());

    // Show Retry button (centered)
    startButton.textContent = "Retry";
    startButton.style.display = "block";
    startButton.style.margin = "10px auto";
}

// Function to display the Retry button
function showRetryButton() {
    startButton.textContent = "Retry";
    startButton.style.display = "block";
    startButton.style.margin = "10px auto";
}
    
// Event listener for Start/Retry button
startButton.addEventListener("click", startGame);

// Event listener for Back button to navigate to main page
backButton.addEventListener("click", () => {
    window.location.href = "../HTML/main-page.html";
});
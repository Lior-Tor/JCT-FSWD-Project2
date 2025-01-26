// Check if the user is logged in
if (document.cookie.includes("session=active")) {
    console.log("User is logged in");
} else {
    window.location.href = "../../login.html";
}

// Game variables
let gameRunning = false;
let score = 0;
let gameSpeed = 5;
let spawnInterval = 1000;

// Elements
const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const highestScoreInfo = document.getElementById("highestScoreInfo");
const startButton = document.getElementById("startButton");
const backButton = document.getElementById("backButton");

let obstacleInterval;
let difficultyIncrease;
const userEmail = localStorage.getItem("loggedInUser");
console.log("Logged in user: ", userEmail);

// Retrieve users from localStorage
const users = JSON.parse(localStorage.getItem("users")) || [];
const currentUser = users.find(u => u.email === userEmail);

// Initialize high score for Game 1 if not already present
if (!currentUser.highScores) {
    currentUser.highScores = { game1: 0, game2: 0 };
    localStorage.setItem("users", JSON.stringify(users));
}

// Set the initial high score for Game 1
let highScore = currentUser.highScores.game1 || 0;
highScoreDisplay.textContent = `High Score: ${highScore}`;

// Find the highest score across all users for Game 1
function findHighestScore(users) {
    let highestScore = 0;
    let highestScorer = "No One";

    users.forEach(user => {
        if (user.highScores && user.highScores.game1 > highestScore) {
            highestScore = user.highScores.game1;
            highestScorer = user.name || "Anonymous";
        }
    });

    return { highestScore, highestScorer };
}

const { highestScore, highestScorer } = findHighestScore(users);
highestScoreInfo.textContent = `The highest score is: ${highestScore} from ${highestScorer}`;

// Load Sounds
const collisionSound = new Audio("../../sounds/collision-sound.mp3");
const gameOverSound = new Audio("../../sounds/game-over-sound.mp3");
const newHighScoreSound = new Audio("../../sounds/new-high-score-sound.mp3");
const obstacleCreationSound = new Audio("../../sounds/obstacle-creation-sound.mp3");

// Player movement using arrow keys
document.addEventListener("keydown", (event) => {
    if (!gameRunning) return;

    let left = parseInt(getComputedStyle(player).left);

    if (event.key === "ArrowLeft" && left > 30) {
        player.style.left = left - 20 + "px";
    }
    if (event.key === "ArrowRight" && left < gameArea.clientWidth - 30) {
        player.style.left = left + 20 + "px";
    }
});

// Function to create falling obstacles
function createObstacle() {
    if (!gameRunning) return;

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
            collisionSound.play();
            clearInterval(obstacleFall);
            gameOver();
        }

        if (top > gameArea.clientHeight - 20) {
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            obstacle.remove();
            clearInterval(obstacleFall);
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
    gameSpeed = 5;
    spawnInterval = 1000;

    scoreDisplay.textContent = `Score: ${score}`;
    highScoreDisplay.textContent = `High Score: ${highScore}`;

    startButton.style.display = "none";

    // Gradually increase speed and reduce spawn interval
    difficultyIncrease = setInterval(() => {
        gameSpeed += 2;
        spawnInterval = Math.max(600, spawnInterval - 80);
    }, 3000);

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
    gameRunning = false;
    clearInterval(obstacleInterval);
    clearInterval(difficultyIncrease);

    if (score > highScore) {
        highScore = score;
        currentUser.highScores.game1 = highScore;
        localStorage.setItem("users", JSON.stringify(users));
        newHighScoreSound.play();

        setTimeout(() => {
            alert(`Game Over! New High Score: ${score}`);
            cleanupAfterGameOver();
        }, 500);

        // Update the highest score information
        const { highestScore, highestScorer } = findHighestScore(users);
        highestScoreInfo.textContent = `The highest score is: ${highestScore} from ${highestScorer}`;
    } else {
        gameOverSound.play();

        setTimeout(() => {
            alert(`Game Over! Your Score: ${score}`);
            cleanupAfterGameOver();
        }, 500);
    }
}

// Function to clean up obstacles and show the Retry button
function cleanupAfterGameOver() {
    document.querySelectorAll(".obstacle").forEach(obstacle => obstacle.remove());
    startButton.textContent = "Retry";
    startButton.style.display = "block";
    startButton.style.margin = "10px auto";
}

// Event listener for Start/Retry button
startButton.addEventListener("click", startGame);

// Event listener for Back button to navigate to main page
backButton.addEventListener("click", () => {
    window.location.href = "HTML/main-page.html";
});
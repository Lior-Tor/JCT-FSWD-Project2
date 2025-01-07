// Add jQuery to HTML file
const input = document.getElementById("word");
const list = document.getElementById("words");
const button = document.getElementById("submit");
const lettersContainer = document.getElementById("letters");
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("startButton");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");

let usedWords = [];
let randomLetters = "";
let timerInterval = null;
let timeRemaining = 60;
let currentScore = 0;
let userEmail = localStorage.getItem("loggedInUser");

// Retrieve high scores for different users
let wordHighScores = JSON.parse(localStorage.getItem("wordHighScores")) || {};

// Assign high score to the current user or set to 0 if none exists
let wordHighScore = wordHighScores[userEmail] || 0;
highScoreDisplay.textContent = `High Score: ${wordHighScore}`;

function getLetterCount(word) {
    const count = {};
    for (let char of word) {
        count[char] = (count[char] || 0) + 1;
    }
    return count;
}

function canWordBeFormed(word, letters) {
    const wordCount = getLetterCount(word);
    const lettersCount = getLetterCount(letters);

    for (let char in wordCount) {
        if (!lettersCount[char] || wordCount[char] > lettersCount[char]) {
            return false;
        }
    }
    return true;
}

function generateRandomLetters() {
    const vowels = 'aeiou';
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    randomLetters = "";

    randomLetters += vowels[Math.floor(Math.random() * vowels.length)];

    while (randomLetters.length < 5) {
        const useVowel = Math.random() < 0.3;
        const source = useVowel ? vowels : consonants;
        randomLetters += source[Math.floor(Math.random() * source.length)];
    }

    lettersContainer.innerHTML = "";
    for (let letter of randomLetters) {
        const div = document.createElement("div");
        div.className = "letter";
        div.textContent = letter;
        lettersContainer.appendChild(div);
    }
}

function checkWord(word) {
    return new Promise((resolve, reject) => {
        const settings = {
            async: true,
            crossDomain: true,
            url: `https://dictionary-by-api-ninjas.p.rapidapi.com/v1/dictionary?word=${word}`,
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'e85bc0a0afmsha340bbaea600b25p132f87jsn28aed2bee672',
                'x-rapidapi-host': 'dictionary-by-api-ninjas.p.rapidapi.com'
            }
        };

        $.ajax(settings)
            .done(function (response) {
                resolve(response.valid || false);
            })
            .fail(function (error) {
                console.error("Error fetching word data:", error);
                resolve(false);
            });
    });
}

function updateScore(word) {
    const points = word.length;
    currentScore += points;
    scoreDisplay.textContent = `Score: ${currentScore}`;

    if (currentScore > wordHighScore) {
        // Update the high score for the current user
        wordHighScore = currentScore;
        // Update the high scores object
        wordHighScores[userEmail] = wordHighScore;
        // Save the updated high scores object back to localStorage
        localStorage.setItem('wordHighScores', JSON.stringify(wordHighScores));
        // Update the display
        highScoreDisplay.textContent = `High Score: ${wordHighScore}`;
    }
}

function addWordToList(word) {
    const newItem = document.createElement("li");
    newItem.textContent = `${word} (+${word.length} points)`;
    list.appendChild(newItem);
}

button.addEventListener("click", async () => {
    if (timeRemaining <= 0) {
        alert("Game is over! Click Retry to play again.");
        return;
    }

    const word = input.value.trim().toLowerCase();
    if (!word) {
        alert("Please enter a word!");
        return;
    }

    if (word.length < 3) {
        alert("Word must be at least 3 letters long!");
        return;
    }

    if (!canWordBeFormed(word, randomLetters)) {
        alert("Word cannot be formed from the given letters!");
        return;
    }

    if (usedWords.includes(word)) {
        alert("Word already used!");
        return;
    }

    const isValid = await checkWord(word);
    if (isValid) {
        addWordToList(word);
        updateScore(word);
        usedWords.push(word);
        input.value = "";
    } else {
        alert("Not a valid word!");
    }
});

function startTimer() {
    clearInterval(timerInterval);
    timeRemaining = 60;
    currentScore = 0;
    scoreDisplay.textContent = `Score: ${currentScore}`;
    timerDisplay.textContent = `Time left: ${timeRemaining}s`;

    timerInterval = setInterval(() => {
        timeRemaining--;
        timerDisplay.textContent = `Time left: ${timeRemaining}s`;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            // Update high score one final time when game ends
            if (currentScore > wordHighScore) {
                wordHighScore = currentScore;
                wordHighScores[userEmail] = wordHighScore;
                localStorage.setItem('wordHighScores', JSON.stringify(wordHighScores));
                highScoreDisplay.textContent = `High Score: ${wordHighScore}`;
            }
            alert(`Game Over! Final Score: ${currentScore}`);
            input.disabled = true;
        }
    }, 1000);
}

startButton.addEventListener("click", () => {
    usedWords = [];
    input.disabled = false;
    input.value = "";
    startTimer();
    generateRandomLetters();
    list.innerHTML = "<h2>Your Words:</h2>";
    startButton.textContent = "Retry";
});

highScoreDisplay.textContent = `High Score: ${wordHighScore}`;
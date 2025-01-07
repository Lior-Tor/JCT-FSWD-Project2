document.addEventListener('DOMContentLoaded', () => {
    const userEmail=localStorage.getItem('loggedInUser');
    const username = userEmail.split('@')[0];
    // Retrieve high scores for different users
    let highScores = JSON.parse(localStorage.getItem("highScores")) || {};
    const highScoreGame1 = highScores[userEmail] || 0;
    const highScoreGame2 = 4500; // Replace with dynamic score fetching

    document.getElementById('username').textContent = username;
    document.getElementById('highScoreGame1').textContent = highScoreGame1;
    document.getElementById('highScoreGame2').textContent = highScoreGame2;

    const newsletterForm = document.getElementById('newsletter-form');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for subscribing!');
    });
});

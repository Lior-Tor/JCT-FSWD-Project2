document.addEventListener('DOMContentLoaded', () => {
    const username =localStorage.getItem('loggedInUser');
    const highScoreGame1 = localStorage.getItem("highScores") || {}; // Replace with dynamic score fetching
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

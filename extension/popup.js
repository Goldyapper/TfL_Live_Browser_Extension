// Simple JavaScript to demonstrate interaction (optional).
document.addEventListener('DOMContentLoaded', () => {
    const greeting = document.getElementById('greeting');
    const btn = document.getElementById('changeBtn');

    btn.addEventListener('click', () => {
        if (greeting.textContent.includes('Hello')) {
        greeting.textContent = 'Hi there!';
        } else {
        greeting.textContent = 'Hello';
        }
    });
});

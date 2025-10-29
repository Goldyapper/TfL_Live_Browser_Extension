// Simple JavaScript to demonstrate interaction (optional).
document.addEventListener('DOMContentLoaded', () => {
    const greeting = document.getElementById('greeting');
    const btn = document.getElementById('changeBtn');

    const resultsEl = document.getElementById('results');
    const stopPointId = '940GZZLUWYP';

    fetch(`https://api.tfl.gov.uk/StopPoint/${stopPointId}/Arrivals`)
    .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
    })
    .then(data => {
    // data is an array of arrival predictions
    // Sort by time to station 
    data.sort((a, b) => a.timeToStation - b.timeToStation);

    // Build a simple list of the next few trains
    const html = data.slice(0, 5).map(pred => {
        return `
        <li>
            Line: ${pred.lineName} - Destination: ${pred.destinationName} - In approx ${Math.round(pred.timeToStation/60)} min
        </li>`;
    }).join('');

    resultsEl.innerHTML = `<ul>${html}</ul>`;
    })
    .catch(err => {
    console.error('Fetch error:', err);
    resultsEl.textContent = 'Could not load departure data.';
    });
});

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('liveClock').textContent = timeString;

    const dateString = now.toLocaleDateString();
    document.getElementById('currentDate').textContent = dateString;
}
setInterval(updateClock, 1000);
updateClock();

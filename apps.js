// =====================================
// Dashboard JS - Live Clock & Cards
// =====================================

// Live analog-style clock (HH:MM:SS)
function updateClock() {
    const clockEl = document.getElementById("dashboardClock");
    if (!clockEl) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    clockEl.textContent = `${hours}:${minutes}:${seconds}`;
}

// Dummy card data for now
let bookingsToday = 0;
let vehiclesInWorkshop = 0;
let hoursBookedToday = 0;

function updateCards() {
    const dateEl = document.getElementById("bookingDate");
    if (dateEl) {
        const today = new Date();
        dateEl.textContent = today.toLocaleDateString("en-AU");
    }

    const bookingsEl = document.getElementById("bookingsCount");
    if (bookingsEl) bookingsEl.textContent = bookingsToday;

    const vehiclesEl = document.getElementById("vehiclesCount");
    if (vehiclesEl) vehiclesEl.textContent = vehiclesInWorkshop;

    const hoursEl = document.getElementById("hoursCount");
    if (hoursEl) hoursEl.textContent = hoursBookedToday;
}

// Initialize dashboard
function initDashboard() {
    updateClock();
    setInterval(updateClock, 1000); // update every second
    updateCards();
}

// Run after DOM loaded
document.addEventListener("DOMContentLoaded", () => {
    initDashboard();
});

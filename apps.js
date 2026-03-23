// ===== APP.JS =====
// Section references
const dashboardSection = document.getElementById("dashboardSection");
const calendarSection = document.getElementById("calendarSection");
const customersSection = document.getElementById("customersSection");

// ===== DASHBOARD CARD CLICK =====
const calendarCard = document.querySelector(".calendar-card");
calendarCard?.addEventListener("click", () => {
    dashboardSection.style.display = "none";
    calendarSection.style.display = "block";
    showCalendar(currentMonth, currentYear); // bookings.js function
});

// ===== DASHBOARD SIDEBAR CLICK =====
const dashboardTab = document.getElementById("dashboardTab");
dashboardTab?.addEventListener("click", () => {
    dashboardSection.style.display = "block";
    calendarSection.style.display = "none";
    customersSection.style.display = "none";
});

// ===== CUSTOMERS SIDEBAR CLICK =====
const customersTab = document.getElementById("customersTab");
customersTab?.addEventListener("click", () => {
    dashboardSection.style.display = "none";
    calendarSection.style.display = "none";
    customersSection.style.display = "block";
    renderCustomers(); // customers.js function
});
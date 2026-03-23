document.addEventListener("DOMContentLoaded", () => {
    // ===== SECTION REFERENCES =====
    const dashboardSection = document.getElementById("dashboardSection");
    const calendarSection = document.getElementById("calendarSection");
    const customersSection = document.getElementById("customersSection");

    // ===== DASHBOARD CARD CLICK =====
    const calendarCard = document.querySelector(".calendar-card");
    calendarCard?.addEventListener("click", () => {
        dashboardSection.classList.add("hidden");
        calendarSection.classList.remove("hidden");
        customersSection.classList.add("hidden");
        if (typeof showCalendar === "function") {
            showCalendar(currentMonth, currentYear); // bookings.js function
        }
    });

    // ===== DASHBOARD SIDEBAR CLICK =====
    const dashboardTab = document.getElementById("dashboardTab");
    dashboardTab?.addEventListener("click", () => {
        dashboardSection.classList.remove("hidden");
        calendarSection.classList.add("hidden");
        customersSection.classList.add("hidden");
    });

    // ===== CUSTOMERS SIDEBAR CLICK =====
    const customersTab = document.getElementById("customersTab");
    customersTab?.addEventListener("click", () => {
        dashboardSection.classList.add("hidden");
        calendarSection.classList.add("hidden");
        customersSection.classList.remove("hidden");
        if (typeof renderCustomers === "function") {
            renderCustomers(); // customers.js function
        }
    });
});
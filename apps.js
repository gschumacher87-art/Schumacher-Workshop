// ===== APPS.JS =====
document.addEventListener("DOMContentLoaded", () => {
    // ===== SECTION REFERENCES =====
    const dashboardSection = document.getElementById("dashboardSection");
    const calendarSection = document.getElementById("calendarSection");
    const customersSection = document.getElementById("customersSection");

    // ===== MODAL REFERENCES =====
    const bookingForm = document.getElementById("bookingForm");
    const bookingModal = document.getElementById("bookingModal");
    const customerModal = document.getElementById("customerModal");
    const vehicleModal = document.getElementById("vehicleModal");

    function hideAllSections() {
        dashboardSection.classList.add("hidden");
        calendarSection.classList.add("hidden");
        customersSection.classList.add("hidden");
    }

    function hideAllModals() {
        bookingForm.classList.add("hidden");
        bookingModal.classList.add("hidden");
        customerModal.classList.add("hidden");
        vehicleModal.classList.add("hidden");
    }

    function switchSection(showSection) {
        hideAllSections();
        hideAllModals();
        showSection.classList.remove("hidden");
    }

    // ===== DASHBOARD CARD CLICK =====
    const calendarCard = document.querySelector(".calendar-card");
    calendarCard?.addEventListener("click", () => {
        switchSection(calendarSection);
        if (typeof showCalendar === "function") {
            showCalendar(currentMonth, currentYear); // bookings.js
        }
    });

    // ===== DASHBOARD SIDEBAR CLICK =====
    const dashboardTab = document.getElementById("dashboardTab");
    dashboardTab?.addEventListener("click", () => switchSection(dashboardSection));

    // ===== CUSTOMERS SIDEBAR CLICK =====
    const customersTab = document.getElementById("customersTab");
    customersTab?.addEventListener("click", () => {
        switchSection(customersSection);
        if (typeof renderCustomers === "function") {
            renderCustomers(); // customers.js
        }
    });
});
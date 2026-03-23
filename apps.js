  // ===== APPS.JS =====
document.addEventListener("DOMContentLoaded", () => {

    // ===== SECTION REFERENCES =====
    const dashboardSection = document.getElementById("dashboardSection");
    const calendarSection = document.getElementById("calendarSection");
    const customersSection = document.getElementById("customersSection");
    const quotesSection = document.getElementById("quotesSection");
    const invoicesSection = document.getElementById("invoicesSection");
    const repairsSection = document.getElementById("repairsSection"); // added

    // ===== MODAL REFERENCES =====
    const bookingForm = document.getElementById("bookingForm");
    const bookingModal = document.getElementById("bookingModal");
    const customerModal = document.getElementById("customerModal");
    const vehicleModal = document.getElementById("vehicleModal");
    const quoteModal = document.getElementById("quoteModal");
    const invoiceModal = document.getElementById("invoiceModal");

    function hideAllSections() {
        dashboardSection.classList.add("hidden");
        calendarSection.classList.add("hidden");
        customersSection.classList.add("hidden");
        quotesSection.classList.add("hidden");
        invoicesSection.classList.add("hidden");
        repairsSection.classList.add("hidden"); // added
    }

    function hideAllModals() {
        bookingForm.classList.add("hidden");
        bookingModal.classList.add("hidden");
        customerModal.classList.add("hidden");
        vehicleModal.classList.add("hidden");
        quoteModal.classList.add("hidden");
        invoiceModal.classList.add("hidden");
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

    // ===== SIDEBAR TAB CLICKS =====
    const dashboardTab = document.getElementById("dashboardTab");
    dashboardTab?.addEventListener("click", () => switchSection(dashboardSection));

    const customersTab = document.getElementById("customersTab");
    customersTab?.addEventListener("click", () => {
        switchSection(customersSection);
        if (typeof renderCustomers === "function") {
            renderCustomers();
        }
    });

    const quotesTab = document.getElementById("quotesTab");
    quotesTab?.addEventListener("click", () => {
        switchSection(quotesSection);
        if (typeof renderQuotes === "function") {
            renderQuotes();
        }
    });

    const invoicesTab = document.getElementById("invoicesTab");
    invoicesTab?.addEventListener("click", () => {
        switchSection(invoicesSection);
        if (typeof renderInvoices === "function") {
            renderInvoices();
        }
    });

    const repairsTab = document.getElementById("repairsTab"); // added
    repairsTab?.addEventListener("click", () => {
        switchSection(repairsSection);
        if (typeof renderRepairs === "function") {
            renderRepairs();
        }
    });

    // ===== ADD QUOTE BUTTON =====
    const addQuoteBtn = document.getElementById("addQuoteBtn");
    addQuoteBtn?.addEventListener("click", () => {
        hideAllModals();
        quoteModal.classList.remove("hidden");
        if (typeof openQuoteModal === "function") {
            openQuoteModal();
        }
    });

    // ===== ADD INVOICE BUTTON =====
    const addInvoiceBtn = document.getElementById("addInvoiceBtn");
    addInvoiceBtn?.addEventListener("click", () => {
        hideAllModals();
        invoiceModal.classList.remove("hidden");
        if (typeof openInvoiceModal === "function") {
            openInvoiceModal();
        }
    });

    // ===== ADD REPAIR BUTTON =====
    const addRepairBtn = document.getElementById("addRepairBtn"); // optional if using repairs.js
    addRepairBtn?.addEventListener("click", () => {
        if (typeof addOrEditRepair === "function") {
            addOrEditRepair();
        }
    });

});
// ===== APPS.JS =====
document.addEventListener("DOMContentLoaded", () => {

    // ===== SECTION REFERENCES =====
    const sections = {
        dashboard: document.getElementById("dashboardSection"),
        calendar: document.getElementById("calendarSection"),
        customers: document.getElementById("customersSection"),
        quotes: document.getElementById("quotesSection"),
        invoices: document.getElementById("invoicesSection"),
        repairs: document.getElementById("repairsSection"),
        parts: document.getElementById("partsSection"),
        technicians: document.getElementById("techniciansSection") // new
    };

    // ===== MODAL REFERENCES =====
    const modals = {
        bookingForm: document.getElementById("bookingForm"),
        bookingModal: document.getElementById("bookingModal"),
        customerModal: document.getElementById("customerModal"),
        vehicleModal: document.getElementById("vehicleModal"),
        quoteModal: document.getElementById("quoteModal"),
        invoiceModal: document.getElementById("invoiceModal")
    };

    // ===== HIDE FUNCTIONS =====
    function hideAllSections() {
        Object.values(sections).forEach(sec => sec?.classList.add("hidden"));
    }

    function hideAllModals() {
        Object.values(modals).forEach(mod => mod?.classList.add("hidden"));
    }

    function switchSection(section) {
        hideAllSections();
        hideAllModals();
        section?.classList.remove("hidden");
    }

    // ===== DASHBOARD CARD CLICK =====
    document.querySelector(".calendar-card")?.addEventListener("click", () => {
        switchSection(sections.calendar);
        if (typeof showCalendar === "function") showCalendar(currentMonth, currentYear);
    });

    // ===== SIDEBAR TAB CLICKS =====
    const tabs = {
        dashboard: document.getElementById("dashboardTab"),
        customers: document.getElementById("customersTab"),
        quotes: document.getElementById("quotesTab"),
        invoices: document.getElementById("invoicesTab"),
        repairs: document.getElementById("repairsTab"),
        parts: document.getElementById("partsTab"),
        technicians: document.getElementById("techniciansTab") // new
    };

    tabs.dashboard?.addEventListener("click", () => switchSection(sections.dashboard));

    tabs.customers?.addEventListener("click", () => {
        switchSection(sections.customers);
        if (typeof renderCustomers === "function") renderCustomers();
    });

    tabs.quotes?.addEventListener("click", () => {
        switchSection(sections.quotes);
        if (typeof renderQuotes === "function") renderQuotes();
    });

    tabs.invoices?.addEventListener("click", () => {
        switchSection(sections.invoices);
        if (typeof renderInvoices === "function") renderInvoices();
    });

    tabs.repairs?.addEventListener("click", () => {
        switchSection(sections.repairs);
        if (typeof renderRepairs === "function") renderRepairs();
    });

    tabs.parts?.addEventListener("click", () => {
        switchSection(sections.parts);
        if (typeof renderParts === "function") renderParts();
    });

    tabs.technicians?.addEventListener("click", () => {
        switchSection(sections.technicians);
        if (typeof renderTechnicians === "function") renderTechnicians();
    });

    // ===== ADD BUTTONS =====
    document.getElementById("addQuoteBtn")?.addEventListener("click", () => {
        hideAllModals();
        modals.quoteModal?.classList.remove("hidden");
        if (typeof openQuoteModal === "function") openQuoteModal();
    });

    document.getElementById("addInvoiceBtn")?.addEventListener("click", () => {
        hideAllModals();
        modals.invoiceModal?.classList.remove("hidden");
        if (typeof openInvoiceModal === "function") openInvoiceModal();
    });

    document.getElementById("addRepairBtn")?.addEventListener("click", () => {
        if (typeof addOrEditRepair === "function") addOrEditRepair();
    });

    document.getElementById("addPartBtn")?.addEventListener("click", () => {
        if (typeof addOrEditPart === "function") addOrEditPart();
    });

    document.getElementById("addTechnicianBtn")?.addEventListener("click", () => {
        if (typeof addOrEditTechnician === "function") addOrEditTechnician();
    });

});
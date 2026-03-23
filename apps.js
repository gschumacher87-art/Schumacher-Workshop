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
        technicians: document.getElementById("techniciansSection")
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

    // ===== SWITCH SECTION =====
    function switchSection(section) {
        hideAllSections();
        hideAllModals();
        section?.classList.remove("hidden");
        updateActiveTab(section);
    }

    // ===== ACTIVE TAB HIGHLIGHT =====
    const tabElements = {
        dashboard: document.getElementById("dashboardTab"),
        customers: document.getElementById("customersTab"),
        quotes: document.getElementById("quotesTab"),
        invoices: document.getElementById("invoicesTab"),
        repairs: document.getElementById("repairsTab"),
        parts: document.getElementById("partsTab"),
        technicians: document.getElementById("techniciansTab")
    };

    function updateActiveTab(section) {
        Object.values(tabElements).forEach(tab => tab.classList.remove("active"));
        for (let key in sections) {
            if (sections[key] === section) {
                tabElements[key]?.classList.add("active");
            }
        }
    }

    // ===== DASHBOARD CARD CLICK =====
    document.querySelector(".calendar-card")?.addEventListener("click", () => {
        switchSection(sections.calendar);
        if (typeof showCalendar === "function") showCalendar(currentMonth, currentYear);
    });

    // ===== SIDEBAR TAB CLICKS =====
    for (let key in tabElements) {
        tabElements[key]?.addEventListener("click", () => {
            switchSection(sections[key]);
            if (typeof window["render" + capitalizeFirst(key)] === "function") {
                window["render" + capitalizeFirst(key)]();
            }
        });
    }

    // ===== ADD BUTTONS =====
    const addButtons = {
        addQuoteBtn: modals.quoteModal,
        addInvoiceBtn: modals.invoiceModal,
        addRepairBtn: "addOrEditRepair",
        addPartBtn: "addOrEditPart",
        addTechnicianBtn: "addOrEditTechnician"
    };

    Object.entries(addButtons).forEach(([btnId, action]) => {
        document.getElementById(btnId)?.addEventListener("click", () => {
            hideAllModals();
            if (typeof action === "string") {
                if (typeof window[action] === "function") window[action]();
            } else {
                action?.classList.remove("hidden");
                if (btnId === "addQuoteBtn" && typeof openQuoteModal === "function") openQuoteModal();
                if (btnId === "addInvoiceBtn" && typeof openInvoiceModal === "function") openInvoiceModal();
            }
        });
    });

    // ===== HELPER =====
    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

});
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

    function hideAllModals(exclude=null) {
        Object.entries(modals).forEach(([key, mod]) => {
            if (mod && key !== exclude) mod.classList.add("hidden");
        });
    }

    // ===== SWITCH SECTION =====
    function switchSection(section) {
        hideAllSections();
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

    // ===== NEW: TODAY JOBS CARD CLICK =====
    document.querySelector(".jobs-card")?.addEventListener("click", () => {
        switchSection(sections.invoices); // reuse invoices section for jobs
        if (typeof renderJobs === "function") renderJobs();
    });

    // ===== SIDEBAR TAB CLICKS =====
    for (let key in tabElements) {
        tabElements[key]?.addEventListener("click", () => {
            switchSection(sections[key]);
            const renderFuncName = "render" + capitalizeFirst(key);
            if (typeof window[renderFuncName] === "function") {
                window[renderFuncName]();
            }
        });
    }

    // ===== ADD BUTTONS =====
    const addButtons = {
        addQuoteBtn: () => {
            hideAllModals("quoteModal");
            if (typeof openQuoteModal === "function") openQuoteModal();
        },
        addInvoiceBtn: () => {
            hideAllModals("invoiceModal");
            if (typeof openInvoiceModal === "function") openInvoiceModal();
        },
        addRepairBtn: () => { if (typeof addOrEditRepair === "function") addOrEditRepair(); },
        addPartBtn: () => { if (typeof addOrEditPart === "function") addOrEditPart(); },
        addTechnicianBtn: () => { if (typeof addOrEditTechnician === "function") addOrEditTechnician(); }
    };

    Object.entries(addButtons).forEach(([btnId, action]) => {
        document.getElementById(btnId)?.addEventListener("click", action);
    });

    // ===== NEW: UPDATE TODAY JOBS COUNT =====
    function renderTodayJobsCount() {
        const jobsCountEl = document.getElementById("jobsCount");
        if (!jobsCountEl) return;

        const todayJobs = JSON.parse(localStorage.getItem("todayJobs")) || [];
        jobsCountEl.textContent = todayJobs.length;
    }

    renderTodayJobsCount();

    // ===== HELPER =====
    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

});
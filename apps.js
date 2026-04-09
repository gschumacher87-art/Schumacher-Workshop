// ================= APPS.JS (CENTRAL NAV + SYNC) =================
document.addEventListener("DOMContentLoaded", () => {

    const sections = {
        dashboard: document.getElementById("dashboardSection"),
        calendar: document.getElementById("calendarSection"),
        customers: document.getElementById("customersSection"),
        quotes: document.getElementById("quotesSection"),
        invoices: document.getElementById("invoicesSection"),
        repairs: document.getElementById("repairsSection"),
        parts: document.getElementById("partsSection"),
        technicians: document.getElementById("techniciansSection"),
        jobs: document.getElementById("jobsSection")
    };

    const tabs = {
        dashboard: document.getElementById("dashboardTab"),
        calendar: document.getElementById("calendarTab"),
        customers: document.getElementById("customersTab"),
        quotes: document.getElementById("quotesTab"),
        invoices: document.getElementById("invoicesTab"),
        repairs: document.getElementById("repairsTab"),
        parts: document.getElementById("partsTab"),
        technicians: document.getElementById("techniciansTab"),
        jobs: document.getElementById("jobsTab")
    };

    function hideAllSections() {
        Object.values(sections).forEach(s => s?.classList.add("hidden"));
    }

    function setActiveTab(key) {
        Object.values(tabs).forEach(t => t?.classList.remove("active"));
        tabs[key]?.classList.add("active");
    }

    function renderSection(key) {
        hideAllSections();
        sections[key]?.classList.remove("hidden");
        setActiveTab(key);

        switch (key) {
            case "customers":
                if (window.renderCustomers) window.renderCustomers();
                break;
            case "jobs":
                if (window.renderJobs) window.renderJobs();
                break;
            case "invoices":
                if (window.renderInvoices) window.renderInvoices();
                break;
        }
    }

    Object.keys(tabs).forEach(key => {
        tabs[key]?.addEventListener("click", () => renderSection(key));
    });

    // ===== DASHBOARD COUNTS =====
    function renderDashboard() {
        const bookingsEl = document.getElementById("bookingsCount");
        const vehiclesEl = document.getElementById("vehiclesCount");
        const jobsEl = document.getElementById("jobsCount");

        const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
        const customers = JSON.parse(localStorage.getItem("customers")) || [];

        if (bookingsEl) bookingsEl.textContent = jobs.filter(j => j.status === "booked").length;
        if (vehiclesEl) vehiclesEl.textContent = customers.reduce((s, c) => s + (c.vehicles?.length || 0), 0);
        if (jobsEl) jobsEl.textContent = jobs.filter(j => j.status === "active").length;
    }

    renderDashboard();

});
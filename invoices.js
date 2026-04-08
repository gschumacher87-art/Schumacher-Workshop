// ===== invoices.js =====

// Load existing invoices or start empty
let invoices = JSON.parse(localStorage.getItem("invoices")) || [];


// ===== ADD INVOICE =====
function addInvoice(customerEmail, vehicleRego, quotesIncluded) {
    let total = quotesIncluded.reduce((sum, q) => sum + (q.repairCost || 0), 0);

    let invoice = {
        customerEmail,
        vehicleRego,
        quotesIncluded,
        total,
        date: new Date().toISOString()
    };

    invoices.push(invoice);
    localStorage.setItem("invoices", JSON.stringify(invoices));
    return invoice;
}


// ===== ADD INVOICE FROM COMPLETED BOOKING =====
function addInvoiceFromBooking(booking) {
    if (!booking || !booking.finished) return null;

    let labourMs = 0;

    if (Array.isArray(booking.sessions)) {
        booking.sessions.forEach(s => {
            if (s.start && s.end) {
                labourMs += (new Date(s.end) - new Date(s.start));
            }
        });
    }

    let labourHours = labourMs / (1000 * 60 * 60);
    let HOURLY_RATE = 100;
    let labourCost = labourHours * HOURLY_RATE;

    let invoice = {
        customer: booking.customer,
        vehicle: booking.vehicle,
        rego: booking.rego,
        repair: booking.repair,
        sessions: booking.sessions || [],
        labourHours,
        labourCost,
        total: labourCost,
        date: new Date().toISOString(),
        source: "booking"
    };

    invoices.push(invoice);
    localStorage.setItem("invoices", JSON.stringify(invoices));
    return invoice;
}


// ===== GET ALL INVOICES =====
function getAllInvoices() {
    return invoices;
}

function getInvoicesByCustomer(email) {
    return invoices.filter(inv => inv.customer === email);
}

function getInvoicesByVehicle(rego) {
    return invoices.filter(inv => inv.rego === rego);
}


// ===== FIXED: GET FINISHED BOOKINGS =====
function getFinishedBookings() {
    const raw = localStorage.getItem("bookings");
    if (!raw) return [];

    let bookings;
    try {
        bookings = JSON.parse(raw);
    } catch {
        return [];
    }

    let finished = [];

    Object.keys(bookings).forEach(dateKey => {

        const dayBookings = bookings[dateKey];

        if (!Array.isArray(dayBookings)) return;

        dayBookings.forEach(b => {

            // 🔴 STRICT CHECK
            if (b && b.finished && b.finished !== null) {
                finished.push({
                    ...b,
                    dateKey
                });
            }

        });
    });

    console.log("FINISHED JOBS FOUND:", finished);

    return finished;
}


// ===== OPEN INVOICE MODAL =====
function openInvoiceFromBooking(booking) {

    const modal = document.getElementById("invoiceModal");
    modal.classList.add("show");
    modal.classList.remove("hidden");

    let content = document.getElementById("invoiceModalContent");

    if (!content) {
        content = document.createElement("div");
        content.id = "invoiceModalContent";
        Object.assign(content.style, {
            background: "#fff",
            padding: "20px",
            borderRadius: "5px",
            minWidth: "300px"
        });
        modal.appendChild(content);

        modal.addEventListener("click", e => {
            if (e.target === modal) modal.classList.remove("show");
        });
    }

    let labourMs = 0;

    if (Array.isArray(booking.sessions)) {
        booking.sessions.forEach(s => {
            if (s.start && s.end) {
                labourMs += (new Date(s.end) - new Date(s.start));
            }
        });
    }

    let labourHours = labourMs / (1000 * 60 * 60);
    let rate = 100;

    content.innerHTML = `
        <h3>Invoice</h3>
        <p>${booking.customer}</p>
        <p>${booking.vehicle}</p>
        <p>${booking.repair}</p>

        <input id="h" type="number" value="${labourHours.toFixed(2)}"><br>
        <input id="r" type="number" value="${rate}"><br>
        <h4 id="t">$${(labourHours * rate).toFixed(2)}</h4>

        <button id="save">Save</button>
    `;

    const h = document.getElementById("h");
    const r = document.getElementById("r");
    const t = document.getElementById("t");

    function update() {
        const hours = parseFloat(h.value) || 0;
        const rate = parseFloat(r.value) || 0;
        t.textContent = "$" + (hours * rate).toFixed(2);
    }

    h.oninput = update;
    r.oninput = update;

    document.getElementById("save").onclick = () => {
        const hours = parseFloat(h.value) || 0;
        const rate = parseFloat(r.value) || 0;

        invoices.push({
            customer: booking.customer,
            vehicle: booking.vehicle,
            rego: booking.rego,
            repair: booking.repair,
            labourHours: hours,
            labourCost: hours * rate,
            total: hours * rate,
            date: booking.finished,
            source: "booking"
        });

        localStorage.setItem("invoices", JSON.stringify(invoices));

        alert("Saved");
        modal.classList.remove("show");
    };
}


// ===== RENDER FINISHED JOBS =====
document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("finishedJobsList");
    if (!container) return;

    const jobs = getFinishedBookings();

    container.innerHTML = "";

    if (jobs.length === 0) {
        container.textContent = "No finished jobs.";
        return;
    }

    jobs.forEach(job => {

        const row = document.createElement("div");
        row.style.border = "1px solid #ccc";
        row.style.padding = "6px";
        row.style.marginTop = "6px";

        row.textContent = `${job.customer} - ${job.vehicle} - ${job.repair}`;

        row.onclick = () => openInvoiceFromBooking(job);

        container.appendChild(row);
    });

});
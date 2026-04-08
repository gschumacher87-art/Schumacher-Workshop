// ===== invoices.js =====

// Load existing invoices or start empty
let invoices = JSON.parse(localStorage.getItem("invoices")) || [];

// ===== ADD INVOICE =====
// Each invoice links to a customer + vehicle + one or more quotes
function addInvoice(customerEmail, vehicleRego, quotesIncluded) {
    // Calculate total from included quotes
    let total = quotesIncluded.reduce((sum, q) => sum + (q.repairCost || 0), 0);

    let invoice = {
        customerEmail: customerEmail,
        vehicleRego: vehicleRego,
        quotesIncluded: quotesIncluded, // array of quotes (or IDs if you prefer)
        total: total,
        date: new Date().toISOString()
    };

    invoices.push(invoice);
    localStorage.setItem("invoices", JSON.stringify(invoices));
    return invoice;
}


// ===== ADD INVOICE FROM COMPLETED BOOKING (YOUR STRUCTURE) =====
function addInvoiceFromBooking(booking) {

    // MUST be finished (your system)
    if (!booking || !booking.finished) return null;

    // ===== CALCULATE LABOUR FROM SESSIONS =====
    let labourMs = 0;

    if (booking.sessions?.length) {
        booking.sessions.forEach(s => {
            if (s.start && s.end) {
                labourMs += (new Date(s.end) - new Date(s.start));
            }
        });
    }

    // Convert ms → hours
    let labourHours = labourMs / (1000 * 60 * 60);

    // Simple hourly rate (you can change later)
    let HOURLY_RATE = 100;

    let labourCost = labourHours * HOURLY_RATE;

    let invoice = {
        customer: booking.customer,
        vehicle: booking.vehicle,
        rego: booking.rego,
        repair: booking.repair,
        sessions: booking.sessions || [],
        labourHours: labourHours,
        labourCost: labourCost,
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

// ===== GET INVOICES BY CUSTOMER =====
function getInvoicesByCustomer(email) {
    return invoices.filter(inv => inv.customer === email);
}

// ===== GET INVOICES BY VEHICLE =====
function getInvoicesByVehicle(rego) {
    return invoices.filter(inv => inv.rego === rego);
}


// ===== GET FINISHED BOOKINGS (FOR INVOICE SCREEN) =====
function getFinishedBookings() {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || {};
    let finished = [];

    Object.keys(bookings).forEach(dateKey => {
        bookings[dateKey].forEach(b => {
            if (b.finished) {
                finished.push({
                    ...b,
                    dateKey: dateKey
                });
            }
        });
    });

    return finished;
}


// ===== AUTO RENDER FINISHED JOBS + CLICK TO INVOICE =====
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
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.alignItems = "center";

        const text = document.createElement("span");
        text.textContent = `${job.customer} - ${job.vehicle} - ${job.repair}`;

        const btn = document.createElement("button");
        btn.textContent = "Create Invoice";

        btn.onclick = () => {
            const invoice = addInvoiceFromBooking(job);
            if (invoice) {
                alert("Invoice created");
            } else {
                alert("Invoice failed");
            }
        };

        row.appendChild(text);
        row.appendChild(btn);
        container.appendChild(row);
    });

});
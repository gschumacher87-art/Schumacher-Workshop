// ===== invoices.js =====

let invoices = JSON.parse(localStorage.getItem("invoices")) || [];


// ===== GET FINISHED BOOKINGS =====
function getFinishedBookings() {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || {};
    let finished = [];

    Object.keys(bookings).forEach(dateKey => {
        const day = bookings[dateKey];
        if (!Array.isArray(day)) return;

        day.forEach(b => {
            if (b && b.finished) {
                finished.push({ ...b, dateKey });
            }
        });
    });

    return finished;
}


// ===== SAVE INVOICE =====
function saveInvoice(data) {
    invoices.push(data);
    localStorage.setItem("invoices", JSON.stringify(invoices));
}


// ===== OPEN FULL INVOICE FORM =====
function openInvoiceForm(job) {

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
            borderRadius: "6px",
            minWidth: "320px",
            maxWidth: "90vw"
        });
        modal.appendChild(content);
    }

    // ===== CALCULATE DEFAULT LABOUR =====
    let labourMs = 0;

    if (Array.isArray(job.sessions)) {
        job.sessions.forEach(s => {
            if (s.start && s.end) {
                labourMs += (new Date(s.end) - new Date(s.start));
            }
        });
    }

    let hours = labourMs / (1000 * 60 * 60);
    let rate = 100;

    content.innerHTML = `
        <div style="display:flex;justify-content:space-between;">
            <h3>Create Invoice</h3>
            <button id="closeInvoice">X</button>
        </div>

        <hr>

        <label>Customer</label><br>
        <input id="invCustomer" value="${job.customer}"><br><br>

        <label>Vehicle</label><br>
        <input id="invVehicle" value="${job.vehicle}"><br><br>

        <label>Repair</label><br>
        <input id="invRepair" value="${job.repair}"><br><br>

        <h4>Labour</h4>

        <label>Hours</label><br>
        <input type="number" id="invHours" value="${hours.toFixed(2)}"><br><br>

        <label>Hourly Rate</label><br>
        <input type="number" id="invRate" value="${rate}"><br><br>

        <h4>Parts (manual for now)</h4>
        <input id="invParts" placeholder="e.g. Brake pads - 120"><br><br>

        <h3 id="invTotal">Total: $0.00</h3>

        <button id="saveInvoiceBtn">Save Invoice</button>
    `;

    const h = document.getElementById("invHours");
    const r = document.getElementById("invRate");
    const totalEl = document.getElementById("invTotal");

    function updateTotal() {
        const hoursVal = parseFloat(h.value) || 0;
        const rateVal = parseFloat(r.value) || 0;
        totalEl.textContent = "Total: $" + (hoursVal * rateVal).toFixed(2);
    }

    h.oninput = updateTotal;
    r.oninput = updateTotal;
    updateTotal();

    document.getElementById("closeInvoice").onclick = () => {
        modal.classList.remove("show");
        modal.classList.add("hidden");
    };

    document.getElementById("saveInvoiceBtn").onclick = () => {

        const invoice = {
            customer: document.getElementById("invCustomer").value,
            vehicle: document.getElementById("invVehicle").value,
            repair: document.getElementById("invRepair").value,
            labourHours: parseFloat(h.value) || 0,
            rate: parseFloat(r.value) || 0,
            total: (parseFloat(h.value) || 0) * (parseFloat(r.value) || 0),
            parts: document.getElementById("invParts").value,
            date: new Date().toISOString(),
            source: "booking"
        };

        saveInvoice(invoice);

        alert("Invoice saved");

        modal.classList.remove("show");
        modal.classList.add("hidden");
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
        row.style.padding = "8px";
        row.style.marginTop = "6px";
        row.style.cursor = "pointer";

        row.textContent = `${job.customer} - ${job.vehicle} - ${job.repair}`;

        row.onclick = () => openInvoiceForm(job);

        container.appendChild(row);
    });

});
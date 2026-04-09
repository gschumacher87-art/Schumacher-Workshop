// ================= INVOICES.JS (JOB-LINKED) =================
document.addEventListener("DOMContentLoaded", () => {

    let invoices = JSON.parse(localStorage.getItem("invoices")) || [];
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    let partsLibrary = JSON.parse(localStorage.getItem("parts")) || [];

    const finishedContainer = document.getElementById("finishedJobsList");
    const invoicesList = document.getElementById("invoicesList");

    function saveAll() {
        localStorage.setItem("invoices", JSON.stringify(invoices));
        localStorage.setItem("jobs", JSON.stringify(jobs));
        renderInvoices();
    }

    function calculateLabour(job) {
        let ms = 0;

        if (Array.isArray(job.sessions)) {
            job.sessions.forEach(s => {
                if (s.start && s.end) {
                    ms += (new Date(s.end) - new Date(s.start));
                }
            });
        }

        return ms / (1000 * 60 * 60);
    }

    function renderInvoices() {

        // ===== READY TO INVOICE =====
        if (finishedContainer) {
            finishedContainer.innerHTML = "";

            const ready = jobs.filter(j => j.status === "finished");

            if (!ready.length) {
                finishedContainer.textContent = "No finished jobs.";
            }

            ready.forEach(job => {

                const row = document.createElement("div");

                Object.assign(row.style, {
                    border: "1px solid #ccc",
                    padding: "8px",
                    marginTop: "6px",
                    cursor: "pointer"
                });

                row.textContent = `${job.customerName} - ${job.vehicle} - ${job.repair}`;

                row.onclick = () => openInvoiceModal(job);

                finishedContainer.appendChild(row);
            });
        }

        // ===== SAVED INVOICES =====
        if (invoicesList) {
            invoicesList.innerHTML = "";

            if (!invoices.length) {
                invoicesList.textContent = "No invoices.";
                return;
            }

            invoices.forEach(inv => {

                const job = jobs.find(j => j.id === inv.jobId);

                const row = document.createElement("div");

                Object.assign(row.style, {
                    border: "1px solid #ccc",
                    padding: "8px",
                    marginTop: "6px"
                });

                row.textContent = `${job?.customerName || "Unknown"} - $${inv.total.toFixed(2)}`;

                invoicesList.appendChild(row);
            });
        }
    }

    function openInvoiceModal(job) {

        const modal = document.getElementById("invoiceModal");
        if (!modal) return;

        modal.classList.remove("hidden");
        modal.classList.add("show");

        let selectedParts = [];

        const labourHours = calculateLabour(job);
        const labourRate = 100;

        modal.innerHTML = `
            <div class="modal-content">

                <h3>Create Invoice</h3>

                <label>Customer</label>
                <input value="${job.customerName}" disabled>

                <label>Vehicle</label>
                <input value="${job.vehicle}" disabled>

                <label>Repair</label>
                <input value="${job.repair}" disabled>

                <h4>Labour</h4>

                <input type="number" id="invHours" value="${labourHours.toFixed(2)}">
                <input type="number" id="invRate" value="${labourRate}">

                <h4>Parts</h4>

                <select id="partSelect">
                    <option value="">Select Part</option>
                    ${partsLibrary.map((p, i) => `
                        <option value="${i}">
                            ${p.partNumber} - ${p.description} ($${p.price})
                        </option>
                    `).join("")}
                </select>

                <button id="addPart">Add</button>

                <div id="partsWrap"></div>

                <h3 id="total">Total: $0.00</h3>

                <button id="saveInvoice">Save Invoice</button>

            </div>
        `;

        const hoursEl = document.getElementById("invHours");
        const rateEl = document.getElementById("invRate");
        const partsWrap = document.getElementById("partsWrap");
        const totalEl = document.getElementById("total");

        function renderParts() {
            partsWrap.innerHTML = "";

            selectedParts.forEach((p, i) => {
                const row = document.createElement("div");

                row.innerHTML = `
                    ${p.partNumber} - ${p.description} ($${p.price})
                    x <input type="number" value="${p.qty}" data-i="${i}" class="qty">
                    = $${(p.price * p.qty).toFixed(2)}
                    <button data-i="${i}" class="remove">X</button>
                `;

                partsWrap.appendChild(row);
            });
        }

        function calcTotal() {
            const labour = (parseFloat(hoursEl.value) || 0) * (parseFloat(rateEl.value) || 0);

            const partsTotal = selectedParts.reduce((s, p) => s + (p.price * p.qty), 0);

            totalEl.textContent = "Total: $" + (labour + partsTotal).toFixed(2);
        }

        hoursEl.oninput = calcTotal;
        rateEl.oninput = calcTotal;

        document.getElementById("addPart").onclick = () => {
            const select = document.getElementById("partSelect");
            const i = select.value;

            if (i === "") return;

            const p = partsLibrary[i];

            selectedParts.push({
                partNumber: p.partNumber,
                description: p.description,
                price: p.price,
                qty: 1
            });

            renderParts();
            calcTotal();
        };

        partsWrap.addEventListener("input", (e) => {
            if (e.target.classList.contains("qty")) {
                const i = e.target.dataset.i;
                selectedParts[i].qty = parseInt(e.target.value) || 1;
                renderParts();
                calcTotal();
            }
        });

        partsWrap.addEventListener("click", (e) => {
            if (e.target.classList.contains("remove")) {
                selectedParts.splice(e.target.dataset.i, 1);
                renderParts();
                calcTotal();
            }
        });

        calcTotal();

        document.getElementById("saveInvoice").onclick = () => {

            const h = parseFloat(hoursEl.value) || 0;
            const r = parseFloat(rateEl.value) || 0;

            const partsTotal = selectedParts.reduce((s, p) => s + (p.price * p.qty), 0);

            const total = (h * r) + partsTotal;

            invoices.push({
                id: Date.now(),
                jobId: job.id,
                labourHours: h,
                rate: r,
                parts: selectedParts,
                total,
                date: new Date().toISOString()
            });

            job.status = "invoiced";
            job.invoiceId = invoices[invoices.length - 1].id;

            saveAll();

            modal.classList.remove("show");
            modal.classList.add("hidden");
        };
    }

    renderInvoices();
});
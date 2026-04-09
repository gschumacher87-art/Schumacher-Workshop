// ================= BOOKINGS.JS (JOB-BASED CORE) =================
document.addEventListener("DOMContentLoaded", () => {

    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    let customers = JSON.parse(localStorage.getItem("customers")) || [];
    let repairs = JSON.parse(localStorage.getItem("repairs")) || [];

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    const calendarBody = document.querySelector("#calendarTable tbody");
    const monthYear = document.getElementById("monthYear");
    const dayView = document.getElementById("bookingForm");

    function saveJobs() {
        localStorage.setItem("jobs", JSON.stringify(jobs));
        renderCalendar();
        if (window.renderJobs) window.renderJobs();
    }

    // ===== CALENDAR =====
    function renderCalendar() {
        if (!calendarBody) return;

        calendarBody.innerHTML = "";
        monthYear.textContent = `${currentMonth + 1}/${currentYear}`;

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        let date = 1;

        for (let row = 0; row < 6; row++) {
            const tr = document.createElement("tr");

            for (let col = 0; col < 7; col++) {
                const td = document.createElement("td");

                if (row === 0 && col < firstDay || date > daysInMonth) {
                    td.textContent = "";
                } else {
                    const d = date;
                    td.textContent = d;
                    td.style.cursor = "pointer";

                    td.onclick = () => openDay(d);

                    date++;
                }

                tr.appendChild(td);
            }

            calendarBody.appendChild(tr);
        }
    }

    // ===== DAY VIEW =====
    function openDay(day) {
        if (!dayView) return;

        const dateKey = `${currentYear}-${currentMonth}-${day}`;

        dayView.innerHTML = `
            <h3>${day}/${currentMonth + 1}/${currentYear}</h3>
            <button id="addJobBtn">Add Booking</button>
            <div id="dayJobsList"></div>
        `;

        document.getElementById("addJobBtn").onclick = () => openModal(dateKey);

        renderDayJobs(dateKey);
    }

    function renderDayJobs(dateKey) {
        const list = document.getElementById("dayJobsList");
        if (!list) return;

        list.innerHTML = "";

        const dayJobs = jobs.filter(j => j.date === dateKey);

        if (dayJobs.length === 0) {
            list.textContent = "No bookings.";
            return;
        }

        dayJobs.forEach(job => {
            const row = document.createElement("div");

            Object.assign(row.style, {
                border: "1px solid #ccc",
                padding: "8px",
                marginTop: "6px",
                display: "flex",
                justifyContent: "space-between"
            });

            const text = document.createElement("span");
            text.textContent = `${job.customerName} - ${job.vehicle} - ${job.repair}`;

            const actions = document.createElement("div");

            const arrived = document.createElement("button");
            arrived.textContent = "Arrived";

            const edit = document.createElement("button");
            edit.textContent = "Edit";

            const del = document.createElement("button");
            del.textContent = "Delete";

            arrived.onclick = () => {
                job.status = "unassigned";
                saveJobs();
            };

            edit.onclick = () => openModal(dateKey, job.id);

            del.onclick = () => {
                jobs = jobs.filter(j => j.id !== job.id);
                saveJobs();
                renderDayJobs(dateKey);
            };

            actions.appendChild(arrived);
            actions.appendChild(edit);
            actions.appendChild(del);

            row.appendChild(text);
            row.appendChild(actions);

            list.appendChild(row);
        });
    }

    // ===== MODAL =====
    function openModal(dateKey, editId = null) {
        const modal = document.getElementById("bookingModal");
        if (!modal) return;

        modal.classList.remove("hidden");
        modal.classList.add("show");

        let job = {
            id: Date.now(),
            date: dateKey,
            customerId: "",
            vehicleId: "",
            customerName: "",
            vehicle: "",
            repair: "",
            status: "booked",
            sessions: [],
            checklist: []
        };

        if (editId) {
            const existing = jobs.find(j => j.id === editId);
            if (existing) job = existing;
        }

        modal.innerHTML = `
            <div class="modal-content">
                <h3>${editId ? "Edit Booking" : "New Booking"}</h3>

                <label>Customer</label>
                <select id="bCustomer"></select>

                <label>Vehicle</label>
                <select id="bVehicle"></select>

                <label>Repair</label>
                <select id="bRepair">
                    ${repairs.map(r => `<option value="${r.name}">${r.name}</option>`).join("")}
                </select>

                <button id="saveBooking">Save</button>
            </div>
        `;

        const cSelect = document.getElementById("bCustomer");
        const vSelect = document.getElementById("bVehicle");

        customers.forEach((c, i) => {
            const opt = document.createElement("option");
            opt.value = i;
            opt.textContent = `${c.firstName} ${c.surname}`;
            cSelect.appendChild(opt);
        });

        cSelect.onchange = () => {
            const c = customers[cSelect.value];
            vSelect.innerHTML = "";

            c.vehicles?.forEach((v, i) => {
                const opt = document.createElement("option");
                opt.value = i;
                opt.textContent = `${v.make} ${v.model}`;
                vSelect.appendChild(opt);
            });
        };

        if (customers.length) cSelect.dispatchEvent(new Event("change"));

        document.getElementById("saveBooking").onclick = () => {
            const c = customers[cSelect.value];
            const v = c.vehicles?.[vSelect.value];

            job.customerId = cSelect.value;
            job.vehicleId = vSelect.value;
            job.customerName = `${c.firstName} ${c.surname}`;
            job.vehicle = `${v.make} ${v.model}`;
            job.repair = document.getElementById("bRepair").value;

            if (!editId) jobs.push(job);

            saveJobs();

            modal.classList.remove("show");
            modal.classList.add("hidden");
        };
    }

    // ===== NAV =====
    document.getElementById("prevMonth")?.addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        renderCalendar();
    });

    document.getElementById("nextMonth")?.addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        renderCalendar();
    });

    window.showCalendar = renderCalendar;

    renderCalendar();
});
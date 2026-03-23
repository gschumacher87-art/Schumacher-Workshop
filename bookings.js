// ================= BOOKINGS.JS =================
document.addEventListener("DOMContentLoaded", () => {

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let bookings = JSON.parse(localStorage.getItem("bookings")) || {};

    // ===== ELEMENT REFERENCES =====
    const bookingsCount = document.getElementById("bookingsCount");
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    bookingsCount.textContent = today.toLocaleDateString('en-US', options);

    // ===== CALENDAR RENDER =====
    function showCalendar(month, year) {
        const monthYearEl = document.getElementById("monthYear");
        monthYearEl.textContent = `${month + 1}/${year}`;

        const tbody = document.querySelector("#calendarTable tbody");
        tbody.innerHTML = "";

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let date = 1;
        for (let row = 0; row < 6; row++) {
            const tr = document.createElement("tr");
            for (let col = 0; col < 7; col++) {
                const td = document.createElement("td");
                if ((row === 0 && col < firstDay) || date > daysInMonth) {
                    td.textContent = "";
                } else {
                    td.textContent = date;
                    td.style.cursor = "pointer";
                    td.addEventListener("click", () => openBooking(date, month, year));
                    date++;
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
            if (date > daysInMonth) break;
        }
    }

    // ===== NAVIGATION =====
    document.getElementById("prevMonth")?.addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        showCalendar(currentMonth, currentYear);
    });
    document.getElementById("nextMonth")?.addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        showCalendar(currentMonth, currentYear);
    });

    // ===== OPEN BOOKINGS LIST =====
    function openBooking(day, month, year) {
        const bookingForm = document.getElementById("bookingForm");
        bookingForm.innerHTML = "";
        bookingForm.classList.remove("hidden");

        const heading = document.createElement("h3");
        heading.textContent = `Bookings for ${day}/${month + 1}/${year}`;
        bookingForm.appendChild(heading);

        const addBtn = document.createElement("button");
        addBtn.textContent = "Add Booking";
        addBtn.addEventListener("click", () => showBookingModal(day, month, year));
        bookingForm.appendChild(addBtn);

        const key = `${day}-${month}-${year}`;
        if (!bookings[key]) bookings[key] = [];

        const list = document.createElement("div");
        list.id = "bookingList";

        if (bookings[key].length === 0) {
            list.textContent = "No bookings yet.";
        } else {
            bookings[key].forEach((b, idx) => {
                const item = document.createElement("div");
                Object.assign(item.style, {
                    border: "1px solid #ccc",
                    padding: "5px",
                    marginTop: "5px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                });

                const text = document.createElement("span");
                text.textContent = `${b.customer} - ${b.vehicle} - ${b.repair}`;
                if (b.sessions?.length) {
                    b.sessions.forEach((s, i) => {
                        const start = new Date(s.start).toLocaleTimeString();
                        const end = s.end ? new Date(s.end).toLocaleTimeString() : "-";
                        text.textContent += ` | Session ${i+1}: ${start} - ${end}`;
                    });
                }
                if (b.finished) text.textContent += ` | Finished: ${new Date(b.finished).toLocaleTimeString()}`;
                item.appendChild(text);

                const btnContainer = document.createElement("span");

                const editBtn = document.createElement("button");
                editBtn.textContent = "Edit";
                editBtn.addEventListener("click", () => showBookingModal(day, month, year, idx));
                btnContainer.appendChild(editBtn);

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.addEventListener("click", () => {
                    if (confirm("Delete this booking?")) {
                        bookings[key].splice(idx, 1);
                        localStorage.setItem("bookings", JSON.stringify(bookings));
                        openBooking(day, month, year);
                    }
                });
                btnContainer.appendChild(deleteBtn);

                const clockOnBtn = document.createElement("button");
                clockOnBtn.textContent = "Clock On";
                clockOnBtn.disabled = !!b.finished;
                clockOnBtn.addEventListener("click", () => {
                    if (!b.sessions) b.sessions = [];
                    if (!b.sessions.length || b.sessions[b.sessions.length-1].end) {
                        b.sessions.push({ start: new Date().toISOString(), end: null });
                        localStorage.setItem("bookings", JSON.stringify(bookings));
                        openBooking(day, month, year);
                    }
                });
                btnContainer.appendChild(clockOnBtn);

                const clockOffBtn = document.createElement("button");
                clockOffBtn.textContent = "Clock Off";
                clockOffBtn.disabled = !!b.finished || !b.sessions || b.sessions[b.sessions.length-1]?.end;
                clockOffBtn.addEventListener("click", () => {
                    if (b.sessions?.length && !b.sessions[b.sessions.length-1].end) {
                        b.sessions[b.sessions.length-1].end = new Date().toISOString();
                        localStorage.setItem("bookings", JSON.stringify(bookings));
                        openBooking(day, month, year);
                    }
                });
                btnContainer.appendChild(clockOffBtn);

                const finishBtn = document.createElement("button");
                finishBtn.textContent = "Finish";
                finishBtn.disabled = !!b.finished || !b.sessions || b.sessions.some(s => !s.end);
                finishBtn.addEventListener("click", () => {
                    b.finished = new Date().toISOString();
                    localStorage.setItem("bookings", JSON.stringify(bookings));
                    openBooking(day, month, year);
                });
                btnContainer.appendChild(finishBtn);

                item.appendChild(btnContainer);
                list.appendChild(item);
            });
        }

        bookingForm.appendChild(list);
    }

    // ===== BOOKING MODAL =====
    function showBookingModal(day, month, year, editIndex = null) {
        const modal = document.getElementById("bookingModal");
        modal.classList.remove("hidden");
        modal.classList.add("show");

        let content = document.getElementById("bookingModalContent");
        if (!content) {
            content = document.createElement("div");
            content.id = "bookingModalContent";
            Object.assign(content.style, { background:"#fff", padding:"20px", borderRadius:"5px", minWidth:"300px" });
            modal.appendChild(content);

            modal.addEventListener("click", e => { if(e.target === modal) modal.classList.add("hidden"); });
        }

        const key = `${day}-${month}-${year}`;
        let b = { customer:"", vehicle:"", rego:"", repair:"", sessions:[], finished:null };
        if (editIndex !== null) b = bookings[key][editIndex];

        const customers = JSON.parse(localStorage.getItem("customers")) || [];
        const repairs = JSON.parse(localStorage.getItem("repairs")) || [];

        content.innerHTML = `
            <h3>${editIndex!==null?"Edit":"New"} Booking for ${day}/${month+1}/${year}</h3>
            <form id="bookingFormFields">
                <label>Customer:</label>
                <select id="bookingCustomer">
                    <option value="">Select customer</option>
                    ${customers.map(c=>`<option value="${c.firstName} ${c.surname}" ${b.customer===c.firstName+' '+c.surname?'selected':''}>${c.firstName} ${c.surname}</option>`).join('')}
                </select><br><br>

                <label>Vehicle:</label>
                <select id="bookingVehicle">
                    <option value="">Select vehicle</option>
                    ${customers.find(c=>c.firstName+' '+c.surname===b.customer)?.vehicles.map(v=>`<option value="${v.make} ${v.model}">${v.make} ${v.model}</option>`).join('')||''}
                </select><br><br>

                <label>Rego:</label>
                <input type="text" id="bookingRego" value="${b.rego}" placeholder="Enter registration"><br><br>

                <label>Repair Type:</label>
                <select id="bookingRepair">
                    <option value="">Select repair</option>
                    ${repairs.map(r=>`<option value="${r.type}" ${b.repair===r.type?'selected':''}>${r.type}</option>`).join('')}
                </select><br><br>

                <button type="button" id="saveBookingBtn">Save Booking</button>
            </form>
        `;

        const custSelect = document.getElementById("bookingCustomer");
        custSelect.addEventListener("change", () => {
            const vehicleSelect = document.getElementById("bookingVehicle");
            vehicleSelect.innerHTML = "<option value=''>Select vehicle</option>";
            const cust = customers.find(c => c.firstName+' '+c.surname === custSelect.value);
            cust?.vehicles.forEach(v => {
                const opt = document.createElement("option");
                opt.value = `${v.make} ${v.model}`;
                opt.textContent = `${v.make} ${v.model}`;
                vehicleSelect.appendChild(opt);
            });
        });

        document.getElementById("saveBookingBtn").onclick = () => {
            const bookingData = {
                customer: document.getElementById("bookingCustomer").value,
                vehicle: document.getElementById("bookingVehicle").value,
                rego: document.getElementById("bookingRego").value,
                repair: document.getElementById("bookingRepair").value,
                sessions: b.sessions || [],
                finished: b.finished || null
            };
            if (!bookings[key]) bookings[key] = [];
            if (editIndex !== null) bookings[key][editIndex] = bookingData;
            else bookings[key].push(bookingData);
            localStorage.setItem("bookings", JSON.stringify(bookings));
            modal.classList.remove("show");
            modal.classList.add("hidden");
            openBooking(day, month, year);
        };
    }

    // ===== INITIAL CALENDAR =====
    showCalendar(currentMonth, currentYear);

    // ===== EXPOSE FUNCTIONS =====
    window.showCalendar = showCalendar;
    window.openBooking = openBooking;
});

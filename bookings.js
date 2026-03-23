document.addEventListener("DOMContentLoaded", () => {

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let bookings = JSON.parse(localStorage.getItem("bookings")) || {};

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
        for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
            const row = document.createElement("tr");
            for (let colIndex = 0; colIndex < 7; colIndex++) {
                const cell = document.createElement("td");
                if ((rowIndex === 0 && colIndex < firstDay) || date > daysInMonth) {
                    cell.textContent = "";
                } else {
                    const thisDate = date;
                    cell.textContent = thisDate;
                    cell.style.cursor = "pointer";
                    cell.addEventListener("click", () => openBooking(thisDate, month, year));
                    date++;
                }
                row.appendChild(cell);
            }
            tbody.appendChild(row);
            if (date > daysInMonth) break;
        }
    }

    // ===== PREV / NEXT MONTH =====
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
        bookingForm.classList.remove("hidden");
        bookingForm.innerHTML = "";

        const heading = document.createElement("h3");
        heading.style.display = "inline-block";
        heading.style.marginRight = "10px";
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

        if (bookings[key].length > 0) {
            bookings[key].forEach((b, index) => {
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
                if (b.clockIn) text.textContent += ` | Clock In: ${new Date(b.clockIn).toLocaleTimeString()}`;
                if (b.clockOut) text.textContent += ` | Clock Out: ${new Date(b.clockOut).toLocaleTimeString()}`;
                if (b.finished) text.textContent += ` | Finished: ${new Date(b.finished).toLocaleTimeString()}`;
                item.appendChild(text);

                const btnContainer = document.createElement("span");

                const editBtn = document.createElement("button");
                editBtn.textContent = "Edit";
                editBtn.addEventListener("click", () => showBookingModal(day, month, year, index));
                btnContainer.appendChild(editBtn);

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.addEventListener("click", () => {
                    if (confirm("Delete this booking?")) {
                        bookings[key].splice(index, 1);
                        localStorage.setItem("bookings", JSON.stringify(bookings));
                        openBooking(day, month, year);
                    }
                });
                btnContainer.appendChild(deleteBtn);

                // ===== CLOCK ON/OFF/FINISH =====
                const clockOnBtn = document.createElement("button");
                clockOnBtn.textContent = "Clock On";
                clockOnBtn.disabled = !!b.clockIn;
                clockOnBtn.addEventListener("click", () => {
                    b.clockIn = new Date().toISOString();
                    localStorage.setItem("bookings", JSON.stringify(bookings));
                    openBooking(day, month, year);
                });
                btnContainer.appendChild(clockOnBtn);

                const clockOffBtn = document.createElement("button");
                clockOffBtn.textContent = "Clock Off";
                clockOffBtn.disabled = !b.clockIn || !!b.clockOut;
                clockOffBtn.addEventListener("click", () => {
                    b.clockOut = new Date().toISOString();
                    localStorage.setItem("bookings", JSON.stringify(bookings));
                    openBooking(day, month, year);
                });
                btnContainer.appendChild(clockOffBtn);

                const finishBtn = document.createElement("button");
                finishBtn.textContent = "Finish";
                finishBtn.disabled = !b.clockOut || !!b.finished;
                finishBtn.addEventListener("click", () => {
                    b.finished = new Date().toISOString();
                    localStorage.setItem("bookings", JSON.stringify(bookings));
                    openBooking(day, month, year);
                });
                btnContainer.appendChild(finishBtn);

                item.appendChild(btnContainer);
                list.appendChild(item);
            });
        } else {
            list.textContent = "No bookings yet.";
        }

        bookingForm.appendChild(list);
    }

    // ===== BOOKING MODAL =====
    function showBookingModal(day, month, year, editIndex = null) {
        const modal = document.getElementById("bookingModal");
        modal.classList.remove("hidden");

        const contentId = "bookingModalContent";
        let content = document.getElementById(contentId);
        if (!content) {
            content = document.createElement("div");
            content.id = contentId;
            Object.assign(content.style, {
                background: "#fff",
                padding: "20px",
                borderRadius: "5px",
                minWidth: "300px",
            });
            modal.appendChild(content);

            modal.addEventListener("click", (e) => {
                if (e.target === modal) modal.classList.add("hidden");
            });
        }

        let b = { customer: "", vehicle: "", rego: "", repair: "", clockIn: null, clockOut: null, finished: null };
        const key = `${day}-${month}-${year}`;
        if (editIndex !== null) b = bookings[key][editIndex];

        content.innerHTML = `
            <h3>${editIndex !== null ? "Edit" : "New"} Booking for ${day}/${month + 1}/${year}</h3>
            <form id="bookingFormFields">
                <label>Customer Name:</label>
                <input type="text" placeholder="Select customer" value="${b.customer}"><br><br>
                <label>Vehicle:</label>
                <input type="text" placeholder="Select vehicle" value="${b.vehicle}"><br><br>
                <label>Rego:</label>
                <input type="text" placeholder="Enter registration" value="${b.rego}"><br><br>
                <label>Repair Type:</label>
                <input type="text" placeholder="Select repair type" value="${b.repair}"><br><br>
                <button type="button" id="saveBookingBtn">Save Booking</button>
            </form>
        `;

        document.getElementById("saveBookingBtn").onclick = () => {
            const inputs = document.querySelectorAll("#bookingFormFields input");
            const bookingData = {
                customer: inputs[0].value,
                vehicle: inputs[1].value,
                rego: inputs[2].value,
                repair: inputs[3].value,
                clockIn: b.clockIn || null,
                clockOut: b.clockOut || null,
                finished: b.finished || null
            };

            if (!bookings[key]) bookings[key] = [];
            if (editIndex !== null) bookings[key][editIndex] = bookingData;
            else bookings[key].push(bookingData);

            localStorage.setItem("bookings", JSON.stringify(bookings));
            modal.classList.add("hidden");
            openBooking(day, month, year);
        };
    }

    // ===== INITIAL CALENDAR RENDER =====
    showCalendar(currentMonth, currentYear);

    // Expose functions for apps.js
    window.showCalendar = showCalendar;
    window.openBooking = openBooking;

});
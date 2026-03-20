document.addEventListener("DOMContentLoaded", () => {

    // ===== DASHBOARD TO CALENDAR SWITCH =====
    const calendarCard = document.querySelector(".calendar-card");
    const dashboardSection = document.getElementById("dashboardSection");
    const calendarSection = document.getElementById("calendarSection");

    // Show today on dashboard card
    const bookingsCount = document.getElementById("bookingsCount");
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    bookingsCount.textContent = today.toLocaleDateString('en-US', options);

    calendarCard?.addEventListener("click", () => {
        dashboardSection.style.display = "none";
        calendarSection.style.display = "block";
        showCalendar(currentMonth, currentYear);
    });

    // ===== DASHBOARD SIDEBAR CLICK =====
    const dashboardTab = document.getElementById("dashboardTab");
    dashboardTab?.addEventListener("click", () => {
        dashboardSection.style.display = "block";
        calendarSection.style.display = "none";
    });

    // ===== CALENDAR =====
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let bookings = JSON.parse(localStorage.getItem("bookings")) || {};

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
                    cell.addEventListener("click", () => {
                        openBooking(thisDate, month, year);
                    });
                    date++;
                }
                row.appendChild(cell);
            }
            tbody.appendChild(row);
            if (date > daysInMonth) break;
        }
    }

    // ===== PREV / NEXT MONTH =====
    document.getElementById("prevMonth").addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        showCalendar(currentMonth, currentYear);
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        showCalendar(currentMonth, currentYear);
    });

    // ===== OPEN BOOKING FUNCTION =====
    function openBooking(day, month, year) {
        const bookingForm = document.getElementById("bookingForm");
        bookingForm.style.display = "block";
        bookingForm.innerHTML = "";

        const heading = document.createElement("h3");
        heading.style.display = "inline-block";
        heading.style.marginRight = "10px";
        heading.textContent = `Booking for ${day}/${month + 1}/${year}`;
        bookingForm.appendChild(heading);

        const addBtn = document.createElement("button");
        addBtn.textContent = "Add Booking";
        addBtn.addEventListener("click", () => {
            showBookingModal(day, month, year);
        });
        bookingForm.appendChild(addBtn);
    const key = `${day}-${month}-${year}`;

const list = document.createElement("div");

if (bookings[key] && bookings[key].length > 0) {
    bookings[key].forEach((b, index) => {
        const item = document.createElement("div");
        item.style.border = "1px solid #ccc";
        item.style.padding = "5px";
        item.style.marginTop = "5px";
        item.style.cursor = "pointer";

        item.textContent = `${b.customer} - ${b.vehicle} - ${b.repair}`;

        list.appendChild(item);
    });
} else {
    list.textContent = "No bookings yet.";
}

bookingForm.appendChild(list);
}


    // ===== GENERIC BOOKING POP-UP =====
    function showBookingModal(day, month, year) {
        let modal = document.getElementById("bookingModal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "bookingModal";
            Object.assign(modal.style, {
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: "1000",
            });

            const content = document.createElement("div");
            content.id = "bookingModalContent";
            Object.assign(content.style, {
                background: "#fff",
                padding: "20px",
                borderRadius: "5px",
                minWidth: "300px",
            });

            modal.appendChild(content);
            document.body.appendChild(modal);

            modal.addEventListener("click", (e) => {
                if (e.target === modal) modal.style.display = "none";
            });
        }

        const content = document.getElementById("bookingModalContent");
        content.innerHTML = `
            <h3>New Booking for ${day}/${month + 1}/${year}</h3>
            <form id="bookingFormFields">
                <label>Customer Name:</label>
                <input type="text" placeholder="Select customer"><br><br>
                <label>Vehicle:</label>
                <input type="text" placeholder="Select vehicle"><br><br>
                <label>Rego:</label>
                <input type="text" placeholder="Enter registration"><br><br>
                <label>Repair Type:</label>
                <input type="text" placeholder="Select repair type"><br><br>
                <button type="button" id="saveBookingBtn">Save Booking</button>
            </form>
        `;

        modal.style.display = "flex";
        const saveBtn = document.getElementById("saveBookingBtn");

        saveBtn.onclick = () => {
    const inputs = document.querySelectorAll("#bookingFormFields input");

    const bookingData = {
        customer: inputs[0].value,
        vehicle: inputs[1].value,
        rego: inputs[2].value,
        repair: inputs[3].value
    };

    const key = `${day}-${month}-${year}`;

    if (!bookings[key]) bookings[key] = [];
    bookings[key].push(bookingData);

    localStorage.setItem("bookings", JSON.stringify(bookings));

    modal.style.display = "none";

    openBooking(day, month, year); // refresh list
};
    }

    // Initial calendar render
    showCalendar(currentMonth, currentYear);
});

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
    bookingForm.innerHTML = `
        <h3 style="display:inline-block; margin-right:10px;">Booking for ${day}/${month + 1}/${year}</h3>
        <button onclick="alert('Add Booking clicked for ${day}/${month + 1}/${year}')">Add Booking</button>
    `;
}

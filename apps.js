document.addEventListener("DOMContentLoaded", () => {

    // ===== CLOCK BLOCK =====
    const canvas = document.getElementById("analogClock");
    const ctx = canvas.getContext("2d");
    const radius = canvas.height / 2;
    ctx.translate(radius, radius);

    function drawClock() {
        ctx.clearRect(-radius, -radius, canvas.width, canvas.height);

        // Clock face
        ctx.beginPath();
        ctx.arc(0, 0, radius - 2, 0, Math.PI * 2);
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 3;
        ctx.stroke();

        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();

        // Draw hour, minute, second hands
        drawHand((hour % 12 + minute / 60) * Math.PI / 6, radius * 0.5, 5);
        drawHand((minute + second / 60) * Math.PI / 30, radius * 0.7, 3);
        drawHand(second * Math.PI / 30, radius * 0.9, 1, "red");
    }

    function drawHand(angle, length, width, color = "#000") {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.moveTo(0, 0);
        ctx.rotate(angle);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-angle);
    }

    setInterval(drawClock, 1000);
    drawClock();
    // ===== CLOCK BLOCK END =====

    // ===== DATE BLOCK =====
    const dateEl = document.getElementById("currentDate");
    function updateDate() {
        if (!dateEl) return;
        const now = new Date();
        dateEl.textContent = now.toLocaleDateString("en-AU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }
    updateDate();
    // ===== DATE BLOCK END =====

    // ===== CALENDAR BLOCK =====
    const calendarCard = Array.from(document.querySelectorAll(".cards .card"))
        .find(card => card.querySelector("h3")?.textContent.trim() === "Calendar");
    const dashboardSection = document.getElementById("dashboardSection");
    const calendarSection = document.getElementById("calendarSection");

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    function showCalendar(month, year) {
        const monthYearEl = document.getElementById("monthYear");
        monthYearEl.textContent = `${month + 1}/${year}`;

        const tbody = document.getElementById("calendarTable").querySelector("tbody");
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
                    cell.textContent = date++;
                }
                row.appendChild(cell);
            }
            tbody.appendChild(row);
            if (date > daysInMonth) break;
        }
    }

    if (calendarCard) {
        calendarCard.addEventListener("click", () => {
            dashboardSection.style.display = "none";
            calendarSection.style.display = "block";
            showCalendar(currentMonth, currentYear);
        });
    }

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
    // ===== CALENDAR BLOCK END =====

});

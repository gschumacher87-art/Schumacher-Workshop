document.addEventListener("DOMContentLoaded", () => {

    // ===== CLOCK BLOCK =====
    const canvas = document.getElementById("analogClock");
    const ctx = canvas.getContext("2d");
    const radius = canvas.height / 2;

    ctx.translate(radius, radius);

    function drawClock() {
        ctx.clearRect(-radius, -radius, canvas.width, canvas.height);

        // clock face
        ctx.beginPath();
        ctx.arc(0, 0, radius - 2, 0, Math.PI * 2);
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 3;
        ctx.stroke();

        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();

        // hour hand
        drawHand((hour % 12 + minute / 60) * Math.PI / 6, radius * 0.5, 5);

        // minute hand
        drawHand((minute + second / 60) * Math.PI / 30, radius * 0.7, 3);

        // second hand
        drawHand(second * Math.PI / 30, radius * 0.9, 1, "red");
    }

    function drawHand(pos, length, width, color = "#000") {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    }

    setInterval(drawClock, 1000);
    drawClock();

    // ===== DATE BLOCK =====
    function updateDate() {
        const el = document.getElementById("currentDate");
        if (!el) return;

        const now = new Date();
        el.textContent = now.toLocaleDateString("en-AU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }

    updateDate();
    // ===== CLOCK + DATE BLOCK END =====


  document.addEventListener("DOMContentLoaded", () => {

    // ===== CALENDAR BLOCK =====
    const calendarCard = Array.from(document.querySelectorAll(".cards .card"))
        .find(card => card.querySelector("h3")?.textContent.trim === "Calendar");
    const dashboardSection = document.getElementById("dashboardSection");
    const calendarSection = document.getElementById("calendarSection");

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    // Generate calendar
    function showCalendar(month, year) {
        const monthYearEl = document.getElementById("monthYear");
        monthYearEl.textContent = `${month + 1}/${year}`;

        const tbody = document.getElementById("calendarTable").querySelector("tbody");
        tbody.innerHTML = "";

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let row = document.createElement("tr");
        let cell;
        let date = 1;

        // First week
        for (let i = 0; i < 7; i++) {
            cell = document.createElement("td");
            if (i < firstDay) cell.textContent = "";
            else cell.textContent = date++;
            row.appendChild(cell);
        }
        tbody.appendChild(row);

        // Remaining weeks
        while (date <= daysInMonth) {
            row = document.createElement("tr");
            for (let i = 0; i < 7; i++) {
                cell = document.createElement("td");
                if (date <= daysInMonth) cell.textContent = date++;
                else cell.textContent = "";
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        }
    }

    // Click calendar card
    if (calendarCard) {
        calendarCard.addEventListener("click", () => {
            dashboardSection.style.display = "none";
            calendarSection.style.display = "block";
            showCalendar(currentMonth, currentYear);
        });
    }

    // Month navigation
    document.getElementById("prevMonth").addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        showCalendar(currentMonth, currentYear);
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        showCalendar(currentMonth, currentYear);
    });
    // ===== CALENDAR BLOCK END =====

});

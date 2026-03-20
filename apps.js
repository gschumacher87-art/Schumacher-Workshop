alert("JS LOADED");
document.addEventListener("DOMContentLoaded", () => {

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

    // ===== DATE UNDER CLOCK =====
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
});

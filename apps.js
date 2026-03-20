// Analog Clock
function startAnalogClock() {
    const canvas = document.getElementById('analogClock');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const radius = canvas.height / 2;
    ctx.translate(radius, radius);

    function drawClock() {
        ctx.clearRect(-radius, -radius, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.arc(0, 0, radius-4, 0, 2*Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#333';
        ctx.stroke();

        const now = new Date();
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();

        drawHand(ctx, (hour%12 + minute/60)*Math.PI/6, radius*0.5, 6);
        drawHand(ctx, (minute + second/60)*Math.PI/30, radius*0.7, 4);
        drawHand(ctx, second*Math.PI/30, radius*0.9, 2, '#FF0000');
    }

    function drawHand(ctx, pos, length, width, color='#333'){
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.moveTo(0,0);
        ctx.rotate(pos);
        ctx.lineTo(0,-length);
        ctx.stroke();
        ctx.rotate(-pos);
    }

    setInterval(drawClock, 1000);
}

function updateCurrentDate() {
    const el = document.getElementById('currentDate');
    if(!el) return;
    const now = new Date();
    el.textContent = now.toLocaleDateString('en-AU', { weekday:'short', day:'2-digit', month:'2-digit', year:'numeric' });
}

document.addEventListener("DOMContentLoaded", ()=>{
    startAnalogClock();
    updateCurrentDate();
    setInterval(updateCurrentDate, 1000);
});

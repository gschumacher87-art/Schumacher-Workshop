// ===== Analog Clock =====
const canvas = document.getElementById("analogClock");
const ctx = canvas.getContext("2d");
const radius = canvas.height / 2;
ctx.translate(radius, radius);

function drawClock() {
    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius);
}

function drawFace(ctx, radius) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();

    const grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
    grad.addColorStop(0, "#333");
    grad.addColorStop(0.5, "#fff");
    grad.addColorStop(1, "#333");
    ctx.strokeStyle = grad;
    ctx.lineWidth = radius*0.05;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, radius*0.05, 0, 2*Math.PI);
    ctx.fillStyle = "#333";
    ctx.fill();
}

function drawNumbers(ctx, radius) {
    ctx.font = radius*0.15 + "px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for(let num=1; num<=12; num++){
        const ang = num * Math.PI/6;
        ctx.rotate(ang);
        ctx.translate(0, -radius*0.85);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius*0.85);
        ctx.rotate(-ang);
    }
}

function drawTime(ctx, radius){
    const now = new Date();
    const hour = now.getHours() % 12;
    const minute = now.getMinutes();
    const second = now.getSeconds();

    // Hour
    drawHand(ctx, (hour + minute/60) * Math.PI/6, radius*0.5, radius*0.07);
    // Minute
    drawHand(ctx, (minute + second/60) * Math.PI/30, radius*0.75, radius*0.05);
    // Second
    drawHand(ctx, second * Math.PI/30, radius*0.85, radius*0.02, "#ff0000");
}

function drawHand(ctx, pos, length, width, color="#333"){
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}

// Update clock every second
setInterval(drawClock, 1000);
drawClock(); // initial draw

// ===== Current Date =====
const currentDateEl = document.getElementById("currentDate");
function updateDate(){
    const now = new Date();
    const options = { weekday: "long", year:"numeric", month:"long", day:"numeric" };
    currentDateEl.textContent = now.toLocaleDateString("en-AU", options);
}
setInterval(updateDate, 1000);
updateDate();

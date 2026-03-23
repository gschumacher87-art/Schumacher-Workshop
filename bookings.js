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

                ["Edit","Delete","Clock On","Clock Off","Finish"].forEach(action => {
                    const btn = document.createElement("button");
                    btn.textContent = action;
                    btnContainer.appendChild(btn);
                });

                const [editBtn, deleteBtn, clockOnBtn, clockOffBtn, finishBtn] = btnContainer.children;

                editBtn.addEventListener("click", () => showBookingModal(day, month, year, idx));

                deleteBtn.addEventListener("click", () => {
                    if(confirm("Delete this booking?")){
                        bookings[key].splice(idx,1);
                        localStorage.setItem("bookings", JSON.stringify(bookings));
                        openBooking(day, month, year);
                    }
                });

                clockOnBtn.disabled = !!b.finished;
                clockOnBtn.addEventListener("click", () => {
                    if(!b.sessions) b.sessions=[];
                    if(!b.sessions.length || b.sessions[b.sessions.length-1].end){
                        b.sessions.push({start:new Date().toISOString(),end:null});
                        localStorage.setItem("bookings", JSON.stringify(bookings));
                        openBooking(day, month, year);
                    }
                });

                clockOffBtn.disabled = !!b.finished || !b.sessions || b.sessions[b.sessions.length-1]?.end;
                clockOffBtn.addEventListener("click", () => {
                    if(b.sessions?.length && !b.sessions[b.sessions.length-1].end){
                        b.sessions[b.sessions.length-1].end = new Date().toISOString();
                        localStorage.setItem("bookings", JSON.stringify(bookings));
                        openBooking(day, month, year);
                    }
                });

                finishBtn.disabled = !!b.finished || !b.sessions || b.sessions.some(s => !s.end);
                finishBtn.addEventListener("click", () => {
                    b.finished = new Date().toISOString();
                    localStorage.setItem("bookings", JSON.stringify(bookings));
                    openBooking(day, month, year);
                });

                item.appendChild(btnContainer);
                list.appendChild(item);
            });
        }

        bookingForm.appendChild(list);
    }

    // ===== BOOKING MODAL WITH AUTOCOMPLETE SEARCH =====
    function showBookingModal(day, month, year, editIndex=null) {
        const modal = document.getElementById("bookingModal");
        modal.classList.add("show");
        modal.classList.remove("hidden");

        let content = document.getElementById("bookingModalContent");
        if(!content){
            content = document.createElement("div");
            content.id = "bookingModalContent";
            Object.assign(content.style, { background:"#fff", padding:"20px", borderRadius:"5px", minWidth:"300px" });
            modal.appendChild(content);
            modal.addEventListener("click", e=>{if(e.target===modal) modal.classList.remove("show")});
        }

        const key = `${day}-${month}-${year}`;
        let b = {customer:"",vehicle:"",rego:"",repair:"",sessions:[],finished:null};
        if(editIndex!==null) b = bookings[key][editIndex];

        const customers = JSON.parse(localStorage.getItem("customers"))||[];
        const repairs = JSON.parse(localStorage.getItem("repairs"))||[];

        content.innerHTML = `
            <h3>${editIndex!==null?"Edit":"New"} Booking for ${day}/${month+1}/${year}</h3>
            <form id="bookingFormFields">
                <label>Customer / Contact:</label>
                <input type="text" id="bookingCustomer" value="${b.customer}" placeholder="Type customer or contact number"><br><br>

                <label>Vehicle / Rego:</label>
                <input type="text" id="bookingVehicle" value="${b.vehicle}" placeholder="Type vehicle or rego"><br><br>

                <label>Repair Type:</label>
                <select id="bookingRepair">
                    <option value="">Select repair</option>
                    ${repairs.map(r=>`<option value="${r.type}" ${b.repair===r.type?'selected':''}>${r.type}</option>`).join('')}
                </select><br><br>

                <button type="button" id="saveBookingBtn">Save Booking</button>
            </form>
            <div id="autocompleteList" style="border:1px solid #ccc;max-height:150px;overflow:auto;margin-top:2px;"></div>
        `;

        const custInput = document.getElementById("bookingCustomer");
        const vehInput = document.getElementById("bookingVehicle");
        const autoList = document.getElementById("autocompleteList");

        function updateAutocomplete(){
            const val = custInput.value.toLowerCase();
            autoList.innerHTML = "";
            if(!val) return;
            const matches = customers.filter(c=>{
                return c.firstName.toLowerCase().includes(val) ||
                       c.surname.toLowerCase().includes(val) ||
                       c.contact?.includes(val);
            });
            matches.forEach(c=>{
                const div = document.createElement("div");
                div.style.padding="5px";
                div.style.cursor="pointer";
                div.textContent=`${c.firstName} ${c.surname} | ${c.contact || ''}`;
                div.addEventListener("click", ()=>{
                    custInput.value=`${c.firstName} ${c.surname}`;
                    vehInput.value=c.vehicles?.[0]?.make+' '+c.vehicles?.[0]?.model || '';
                    regoInput.value=c.vehicles?.[0]?.rego||'';
                    autoList.innerHTML="";
                });
                autoList.appendChild(div);
            });
        }

        custInput.addEventListener("input", updateAutocomplete);

        const regoInput = document.createElement("input");
        regoInput.type="hidden";
        content.appendChild(regoInput);

        document.getElementById("saveBookingBtn").onclick = ()=>{
            const bookingData = {
                customer:custInput.value,
                vehicle:vehInput.value,
                rego:regoInput.value,
                repair:document.getElementById("bookingRepair").value,
                sessions:b.sessions||[],
                finished:b.finished||null
            };
            if(!bookings[key]) bookings[key]=[];
            if(editIndex!==null) bookings[key][editIndex]=bookingData;
            else bookings[key].push(bookingData);
            localStorage.setItem("bookings", JSON.stringify(bookings));
            modal.classList.remove("show");
            modal.classList.add("hidden");
            openBooking(day, month, year);
        };
    }

    // ===== INITIAL CALENDAR =====
    showCalendar(currentMonth,currentYear);

    // ===== EXPOSE FUNCTIONS =====
    window.showCalendar=showCalendar;
    window.openBooking=openBooking;
});

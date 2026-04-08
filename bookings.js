// ================= BOOKINGS.JS =================
document.addEventListener("DOMContentLoaded", () => {

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let bookings = JSON.parse(localStorage.getItem("bookings")) || {};

    const bookingsCount = document.getElementById("bookingsCount");
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    bookingsCount.textContent = today.toLocaleDateString('en-US', options);

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

                if (row === 0 && col < firstDay || date > daysInMonth) {
                    td.textContent = "";
                } else {
                    const displayDate = date;
                    td.textContent = displayDate;
                    td.style.cursor = "pointer";
                    td.addEventListener("click", () => openBooking(displayDate, month, year));
                    date++;
                }

                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    }

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

    function openBooking(day, month, year) {
        const bookingForm = document.getElementById("bookingForm");
        bookingForm.innerHTML = "";
        bookingForm.classList.remove("hidden");

        const heading = document.createElement("h3");
        heading.textContent = `Bookings for ${day}/${month + 1}/${year}`;
        bookingForm.appendChild(heading);

        const addBtn = document.createElement("button");
        addBtn.textContent = "Add Booking";
        addBtn.onclick = () => showCustomerPopup(day, month, year);
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
                item.appendChild(text);

                const btnContainer = document.createElement("span");

                ["Edit","Delete","Arrived"].forEach(a=>{
                    const btn=document.createElement("button");
                    btn.textContent=a;
                    btnContainer.appendChild(btn);
                });

                const [editBtn, deleteBtn, arrivedBtn] = btnContainer.children;

                editBtn.addEventListener("click", ()=>showBookingModal(day, month, year, idx));

                deleteBtn.addEventListener("click", ()=>{
                    if(confirm("Delete this booking?")){
                        bookings[key].splice(idx,1);
                        localStorage.setItem("bookings", JSON.stringify(bookings));
                        openBooking(day, month, year);
                    }
                });

                // ===== ARRIVED =====
                arrivedBtn.addEventListener("click", ()=>{

                    let todayJobs = JSON.parse(localStorage.getItem("todayJobs")) || [];

                    todayJobs.push({
                        customer: b.customer,
                        vehicle: b.vehicle,
                        repair: b.repair,
                        arrivedAt: new Date().toISOString()
                    });

                    localStorage.setItem("todayJobs", JSON.stringify(todayJobs));

                    alert("Marked as arrived");
                });

                item.appendChild(btnContainer);
                list.appendChild(item);
            });
        }

        bookingForm.appendChild(list);
    }

    function showCustomerPopup(day, month, year){
        const modal = document.getElementById("bookingModal");
        modal.classList.add("show");
        modal.classList.remove("hidden");

        let content = document.getElementById("bookingModalContent");
        if(!content){
            content = document.createElement("div");
            content.id = "bookingModalContent";
            Object.assign(content.style,{background:"#fff",padding:"20px",borderRadius:"5px",minWidth:"300px"});
            modal.appendChild(content);
        }

        content.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <h3>Select Customer</h3>
                <button id="closeModalBtn">X</button>
            </div>
            <button id="existingCustomerBtn">Existing Customer</button><br><br>
            <button id="newCustomerBtn">New Customer</button>
        `;

        document.getElementById("closeModalBtn").onclick=()=>{
            modal.classList.remove("show");
            modal.classList.add("hidden");
        };

        document.getElementById("existingCustomerBtn").onclick=()=>{
            const customers = JSON.parse(localStorage.getItem("customers")) || [];

            content.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <h3>Select Customer</h3>
                    <button id="closeModalBtn">X</button>
                </div>
                <input type="text" id="searchInput" placeholder="Search..."><br><br>
                <div id="searchResults"></div>
            `;

            document.getElementById("closeModalBtn").onclick=()=>{
                modal.classList.remove("show");
                modal.classList.add("hidden");
            };

            const input = document.getElementById("searchInput");
            const results = document.getElementById("searchResults");

            function render(list){
                results.innerHTML = "";

                list.forEach((c, index)=>{
                    const item = document.createElement("div");
                    item.style.padding="5px";
                    item.style.cursor="pointer";
                    item.style.borderBottom="1px solid #ccc";

                    item.textContent = `${c.firstName} ${c.surname}`;

                    item.onclick = ()=>{
                        results.innerHTML = "";

                        c.vehicles?.forEach(v=>{
                            const vRow = document.createElement("div");
                            vRow.style.padding="5px";
                            vRow.style.cursor="pointer";

                            vRow.textContent = `${v.make} ${v.model} - ${v.rego}`;

                            vRow.onclick = ()=>{
                                modal.classList.remove("show");
                                modal.classList.add("hidden");

                                setTimeout(()=>{
                                    showBookingModal(day, month, year);

                                    setTimeout(()=>{
                                        document.getElementById("bookingCustomer").value = `${c.firstName} ${c.surname}`;
                                        document.getElementById("bookingVehicle").value = `${v.make} ${v.model}`;
                                    },50);

                                },100);
                            };

                            results.appendChild(vRow);
                        });
                    };

                    results.appendChild(item);
                });
            }

            render(customers);

            input.addEventListener("input", ()=>{
                const val = input.value.toLowerCase();

                const filtered = customers.filter(c=>{
                    return (
                        c.firstName.toLowerCase().includes(val) ||
                        c.surname.toLowerCase().includes(val) ||
                        (c.phone||"").toLowerCase().includes(val) ||
                        c.vehicles?.some(v=> (v.rego||"").toLowerCase().includes(val))
                    );
                });

                render(filtered);
            });
        };

        document.getElementById("newCustomerBtn").onclick=()=>{
            modal.classList.remove("show");
            modal.classList.add("hidden");
            setTimeout(()=>showBookingModal(day, month, year),100);
        };
    }

    function showBookingModal(day, month, year, editIndex=null){
        const modal = document.getElementById("bookingModal");
        modal.classList.add("show");
        modal.classList.remove("hidden");

        let content = document.getElementById("bookingModalContent");
        if(!content){
            content=document.createElement("div");
            content.id="bookingModalContent";
            Object.assign(content.style,{background:"#fff",padding:"20px",borderRadius:"5px",minWidth:"300px"});
            modal.appendChild(content);
            modal.addEventListener("click", e=>{if(e.target===modal) modal.classList.remove("show")});
        }

        const key=`${day}-${month}-${year}`;
        let b={customer:"",vehicle:"",rego:"",repair:""};
        if(editIndex!==null) b=bookings[key][editIndex];

        const customers=JSON.parse(localStorage.getItem("customers"))||[];
        const repairs=JSON.parse(localStorage.getItem("repairs"))||[];

        content.innerHTML=`
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <h3>${editIndex!==null?"Edit":"New"} Booking for ${day}/${month+1}/${year}</h3>
                <button id="closeModalBtn">X</button>
            </div>
            <form id="bookingFormFields">
                <label>Customer / Contact:</label>
                <input type="text" id="bookingCustomer" value="${b.customer}"><br><br>
                <label>Vehicle:</label>
                <input type="text" id="bookingVehicle" value="${b.vehicle}"><br><br>
                <label>Repair:</label>
                <select id="bookingRepair">
                    ${repairs.map(r=>`<option value="${r.name}" ${b.repair===r.name?'selected':''}>${r.name}</option>`).join('')}
                </select><br><br>
                <button type="button" id="saveBookingBtn">Save Booking</button>
            </form>
        `;

        document.getElementById("closeModalBtn").onclick=()=>{
            modal.classList.remove("show");
            modal.classList.add("hidden");
        };

        document.getElementById("saveBookingBtn").onclick=()=>{
            const bookingData={
                customer:document.getElementById("bookingCustomer").value,
                vehicle:document.getElementById("bookingVehicle").value,
                repair:document.getElementById("bookingRepair").value
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

    showCalendar(currentMonth,currentYear);

    window.showCalendar=showCalendar;
    window.openBooking=openBooking;

});
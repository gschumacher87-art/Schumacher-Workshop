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
    dashboardSection.style.display = "block";   // show dashboard
    calendarSection.style.display = "none";     // hide calendar
    customersSection.style.display = "none";    // hide customers
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

    // ===== OPEN BOOKING FUNCTION WITH EDIT / DELETE =====
function openBooking(day, month, year) {
    const bookingForm = document.getElementById("bookingForm");
    bookingForm.style.display = "block";
    bookingForm.innerHTML = "";

    const heading = document.createElement("h3");
    heading.style.display = "inline-block";
    heading.style.marginRight = "10px";
    heading.textContent = `Bookings for ${day}/${month + 1}/${year}`;
    bookingForm.appendChild(heading);

    const addBtn = document.createElement("button");
    addBtn.textContent = "Add Booking";
    addBtn.addEventListener("click", () => {
        showBookingModal(day, month, year);
    });
    bookingForm.appendChild(addBtn);

    const key = `${day}-${month}-${year}`;
    if (!bookings[key]) bookings[key] = [];

    const list = document.createElement("div");
    list.id = "bookingList";

    if (bookings[key].length > 0) {
        bookings[key].forEach((b, index) => {
            const item = document.createElement("div");
            item.style.border = "1px solid #ccc";
            item.style.padding = "5px";
            item.style.marginTop = "5px";
            item.style.display = "flex";
            item.style.justifyContent = "space-between";
            item.style.alignItems = "center";

            const text = document.createElement("span");
            text.textContent = `${b.customer} - ${b.vehicle} - ${b.repair}`;
            item.appendChild(text);

            const btnContainer = document.createElement("span");

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.addEventListener("click", () => {
                showBookingModal(day, month, year, index);
            });
            btnContainer.appendChild(editBtn);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => {
                if (confirm("Delete this booking?")) {
                    bookings[key].splice(index, 1);
                    localStorage.setItem("bookings", JSON.stringify(bookings));
                    openBooking(day, month, year); // refresh list
                }
            });
            btnContainer.appendChild(deleteBtn);

            item.appendChild(btnContainer);
            list.appendChild(item);
        });
    } else {
        list.textContent = "No bookings yet.";
    }

    bookingForm.appendChild(list);
}

// ===== GENERIC BOOKING POP-UP WITH EDIT SUPPORT =====
function showBookingModal(day, month, year, editIndex = null) {
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

    let b = { customer: "", vehicle: "", rego: "", repair: "" };
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

    modal.style.display = "flex";

    document.getElementById("saveBookingBtn").onclick = () => {
        const inputs = document.querySelectorAll("#bookingFormFields input");
        const bookingData = {
            customer: inputs[0].value,
            vehicle: inputs[1].value,
            rego: inputs[2].value,
            repair: inputs[3].value
        };

        if (!bookings[key]) bookings[key] = [];

        if (editIndex !== null) {
            bookings[key][editIndex] = bookingData;
        } else {
            bookings[key].push(bookingData);
        }

        localStorage.setItem("bookings", JSON.stringify(bookings));
        modal.style.display = "none";
        openBooking(day, month, year); // refresh list
    };
}

    // Initial calendar render
    showCalendar(currentMonth, currentYear);
});

// ===== CUSTOMERS SIDEBAR CLICK =====
const customersSection = document.getElementById("customersSection");
const customersTab = document.getElementById("customersTab");
const customersList = document.getElementById("customersList");

let customers = JSON.parse(localStorage.getItem("customers")) || [];

function renderCustomers() {
    customersList.innerHTML = "";
    if (customers.length === 0) {
        customersList.textContent = "No customers yet.";
        return;
    }
    customers.forEach((c, index) => {
        const item = document.createElement("div");
        item.style.border = "1px solid #ccc";
        item.style.padding = "5px";
        item.style.marginTop = "5px";
        item.style.display = "flex";
        item.style.flexDirection = "column"; // separate lines for customer + vehicle
        item.style.justifyContent = "space-between";

        // ===== CUSTOMER INFO =====
        const customerText = document.createElement("span");
        customerText.textContent = `${c.firstName} ${c.surname} - ${c.phone} - ${c.email}`;
        item.appendChild(customerText);

        // ===== VEHICLE INFO (if any) =====
        if (c.vehicles && c.vehicles.length > 0) {
            c.vehicles.forEach((v) => {
                const vehicleText = document.createElement("span");
                vehicleText.style.marginLeft = "10px";
                vehicleText.style.fontSize = "0.9em";
                vehicleText.textContent = `Vehicle: ${v.make} ${v.model}, ${v.year}, Rego: ${v.rego}, VIN: ${v.vin}`;
                item.appendChild(vehicleText);
            });
        }

        // ===== EDIT / DELETE / ADD VEHICLE BUTTONS =====
        const btnContainer = document.createElement("span");
        btnContainer.style.marginTop = "5px";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => showAddCustomerModal(index));
        btnContainer.appendChild(editBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
            if (confirm("Delete this customer?")) {
                customers.splice(index, 1);
                localStorage.setItem("customers", JSON.stringify(customers));
                renderCustomers();
            }
        });
        btnContainer.appendChild(deleteBtn);

        const addVehicleBtn = document.createElement("button");
        addVehicleBtn.textContent = "Add Vehicle";
        addVehicleBtn.addEventListener("click", () => showAddVehicleModal(index));
        btnContainer.appendChild(addVehicleBtn);

        item.appendChild(btnContainer);
        customersList.appendChild(item);
    });
}

customersTab?.addEventListener("click", () => {
    // ===== SHOW CUSTOMERS & HIDE OTHERS =====
    dashboardSection.style.display = "none";
    calendarSection.style.display = "none";
    customersSection.style.display = "block";
    renderCustomers();
});

// ===== CUSTOMER DATABASE & ADD CUSTOMER MODAL =====
const addCustomerBtn = document.getElementById("addCustomerBtn");

function showAddCustomerModal(editIndex = null) {
    let modal = document.getElementById("customerModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "customerModal";
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
            zIndex: "1000"
        });

        const content = document.createElement("div");
        content.id = "customerModalContent";
        Object.assign(content.style, {
            background: "#fff",
            padding: "20px",
            borderRadius: "5px",
            minWidth: "300px"
        });

        modal.appendChild(content);
        document.body.appendChild(modal);

        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.style.display = "none";
        });
    }

    const content = document.getElementById("customerModalContent");
    let customerData = { firstName: "", surname: "", phone: "", email: "" };
    if (editIndex !== null) customerData = customers[editIndex];

    content.innerHTML = `
        <h3>${editIndex !== null ? "Edit" : "Add"} Customer</h3>
        <form id="customerFormFields">
            <label>First Name:</label>
            <input type="text" placeholder="First Name" value="${customerData.firstName}"><br><br>
            <label>Surname:</label>
            <input type="text" placeholder="Surname" value="${customerData.surname}"><br><br>
            <label>Phone:</label>
            <input type="text" placeholder="Phone Number" value="${customerData.phone}"><br><br>
            <label>Email:</label>
            <input type="email" placeholder="Email" value="${customerData.email}"><br><br>
            <button type="button" id="saveCustomerBtn">${editIndex !== null ? "Update" : "Add"}</button>
        </form>
    `;

    modal.style.display = "flex";

    document.getElementById("saveCustomerBtn").onclick = () => {
        const inputs = document.querySelectorAll("#customerFormFields input");
        const newCustomer = {
            firstName: inputs[0].value.trim(),
            surname: inputs[1].value.trim(),
            phone: inputs[2].value.trim(),
            email: inputs[3].value.trim()
        };

        if (!newCustomer.firstName || !newCustomer.surname) {
            alert("First Name and Surname are required.");
            return;
        }

        if (editIndex !== null) {
            customers[editIndex] = newCustomer;
        } else {
            newCustomer.vehicles = [];
            customers.push(newCustomer);
        }

        localStorage.setItem("customers", JSON.stringify(customers));
        modal.style.display = "none";
        renderCustomers();
    };
}

// ===== VEHICLE MODAL =====
function showAddVehicleModal(customerIndex) {
    let modal = document.getElementById("vehicleModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "vehicleModal";
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
            zIndex: "1000"
        });

        const content = document.createElement("div");
        content.id = "vehicleModalContent";
        Object.assign(content.style, {
            background: "#fff",
            padding: "20px",
            borderRadius: "5px",
            minWidth: "300px"
        });

        modal.appendChild(content);
        document.body.appendChild(modal);

        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.style.display = "none";
        });
    }

    const content = document.getElementById("vehicleModalContent");
    content.innerHTML = `
        <h3>Add Vehicle</h3>
        <form id="vehicleFormFields">
            <label>Make:</label><input type="text"><br><br>
            <label>Model:</label><input type="text"><br><br>
            <label>Year:</label><input type="text"><br><br>
            <label>Rego:</label><input type="text"><br><br>
            <label>VIN:</label><input type="text"><br><br>
            <button type="button" id="saveVehicleBtn">Add Vehicle</button>
        </form>
    `;
    modal.style.display = "flex";

    document.getElementById("saveVehicleBtn").onclick = () => {
        const inputs = document.querySelectorAll("#vehicleFormFields input");
        const vehicle = {
            make: inputs[0].value.trim(),
            model: inputs[1].value.trim(),
            year: inputs[2].value.trim(),
            rego: inputs[3].value.trim(),
            vin: inputs[4].value.trim()
        };

        if (!vehicle.make || !vehicle.model) {
            alert("Vehicle Make and Model are required.");
            return;
        }

        if (!customers[customerIndex].vehicles) customers[customerIndex].vehicles = [];
        customers[customerIndex].vehicles.push(vehicle);

        localStorage.setItem("customers", JSON.stringify(customers));
        modal.style.display = "none";
        renderCustomers();
    };
}

// ===== OPEN MODAL ON BUTTON CLICK =====
addCustomerBtn?.addEventListener("click", () => showAddCustomerModal());
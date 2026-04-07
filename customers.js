document.addEventListener("DOMContentLoaded", () => {
    let customers = JSON.parse(localStorage.getItem("customers")) || [];
    const customersList = document.getElementById("customersList");
    const addCustomerBtn = document.getElementById("addCustomerBtn");

    // ===== RENDER CUSTOMERS =====
    function renderCustomers() {
        customersList.innerHTML = "";
        if (customers.length === 0) {
            customersList.textContent = "No customers yet.";
            return;
        }
        customers.forEach((c, index) => {
            const item = document.createElement("div");
            Object.assign(item.style, {
                border: "1px solid #ccc",
                padding: "5px",
                marginTop: "5px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            });

            const customerText = document.createElement("span");
            customerText.textContent = `${c.firstName} ${c.surname} - ${c.phone} - ${c.email}`;
            item.appendChild(customerText);

            if (c.vehicles && c.vehicles.length > 0) {
                c.vehicles.forEach((v) => {
                    const vehicleText = document.createElement("span");
                    vehicleText.style.marginLeft = "10px";
                    vehicleText.style.fontSize = "0.9em";
                    vehicleText.textContent = `Vehicle: ${v.make} ${v.model}, ${v.year}, Rego: ${v.rego}, VIN: ${v.vin}`;
                    item.appendChild(vehicleText);
                });
            }

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

    // ===== CUSTOMER MODAL =====
    function showAddCustomerModal(editIndex = null) {
        const modal = document.getElementById("customerModal");
        modal.classList.remove("hidden");

        let content = document.getElementById("customerModalContent");
        if (!content) {
            content = document.createElement("div");
            content.id = "customerModalContent";
            Object.assign(content.style, {
                background: "#fff",
                padding: "20px",
                borderRadius: "5px",
                minWidth: "300px"
            });
            modal.appendChild(content);

            modal.addEventListener("click", (e) => {
                if (e.target === modal) modal.classList.add("hidden");
            });
        }

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

        document.getElementById("saveCustomerBtn").onclick = () => {
            const inputs = document.querySelectorAll("#customerFormFields input");
            const newCustomer = {
                firstName: inputs[0].value.trim(),
                surname: inputs[1].value.trim(),
                phone: inputs[2].value.trim(),
                email: inputs[3].value.trim(),
                vehicles: editIndex !== null ? customers[editIndex].vehicles : []
            };

            if (!newCustomer.firstName || !newCustomer.surname) {
                alert("First Name and Surname are required.");
                return;
            }

            if (editIndex !== null) customers[editIndex] = newCustomer;
            else customers.push(newCustomer);

            localStorage.setItem("customers", JSON.stringify(customers));
            modal.classList.add("hidden");
            renderCustomers();
        };
    }

    // ===== VEHICLE MODAL =====
    function showAddVehicleModal(customerIndex) {
        const modal = document.getElementById("vehicleModal");
        modal.classList.remove("hidden");

        let content = document.getElementById("vehicleModalContent");
        if (!content) {
            content = document.createElement("div");
            content.id = "vehicleModalContent";
            Object.assign(content.style, {
                background: "#fff",
                padding: "20px",
                borderRadius: "5px",
                minWidth: "300px"
            });
            modal.appendChild(content);

            modal.addEventListener("click", (e) => {
                if (e.target === modal) modal.classList.add("hidden");
            });
        }

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

        // 🔥 FIX: scope inputs + lock correct customer
        const form = document.getElementById("vehicleFormFields");
        const btn = document.getElementById("saveVehicleBtn");

        btn.onclick = () => {
            const inputs = form.querySelectorAll("input");

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
            modal.classList.add("hidden");
            renderCustomers();
        };
    }

    // ===== ADD CUSTOMER BUTTON CLICK =====
    addCustomerBtn?.addEventListener("click", () => showAddCustomerModal());

    // Expose render function globally for apps.js
    window.renderCustomers = renderCustomers;
});
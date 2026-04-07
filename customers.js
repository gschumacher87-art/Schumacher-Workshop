document.addEventListener("DOMContentLoaded", () => {
    let customers = JSON.parse(localStorage.getItem("customers")) || [];
    const customersList = document.getElementById("customersList");
    const addCustomerBtn = document.getElementById("addCustomerBtn");

    let openCustomerIndex = null;

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
                padding: "8px",
                marginTop: "5px",
                display: "flex",
                flexDirection: "column"
            });

            // ===== CLICKABLE CUSTOMER HEADER =====
            const header = document.createElement("div");
            header.textContent = `${c.firstName} ${c.surname} - ${c.phone}`;
            header.style.fontWeight = "bold";
            header.style.cursor = "pointer";

            header.onclick = () => {
                openCustomerIndex = openCustomerIndex === index ? null : index;
                renderCustomers();
            };

            item.appendChild(header);

            // ===== EXPANDED VIEW =====
            if (openCustomerIndex === index) {
                const details = document.createElement("div");
                details.style.marginTop = "5px";
                details.style.paddingLeft = "10px";

                const email = document.createElement("div");
                email.textContent = c.email;
                details.appendChild(email);

                // ===== VEHICLES =====
                if (c.vehicles && c.vehicles.length > 0) {
                    c.vehicles.forEach((v, vIndex) => {
                        const vRow = document.createElement("div");
                        vRow.style.marginTop = "4px";
                        vRow.style.cursor = "pointer";

                        vRow.textContent = `${v.make} ${v.model} (${v.year}) - ${v.rego}`;

                        vRow.onclick = (e) => {
                            e.stopPropagation();
                            showAddVehicleModal(index, vIndex);
                        };

                        details.appendChild(vRow);
                    });
                }

                // ===== ADD VEHICLE =====
                const addVehicle = document.createElement("div");
                addVehicle.textContent = "+ Add Vehicle";
                addVehicle.style.marginTop = "6px";
                addVehicle.style.cursor = "pointer";
                addVehicle.style.color = "blue";

                addVehicle.onclick = (e) => {
                    e.stopPropagation();
                    showAddVehicleModal(index);
                };

                details.appendChild(addVehicle);

                item.appendChild(details);
            }

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
                <input type="text" value="${customerData.firstName}"><br><br>
                <label>Surname:</label>
                <input type="text" value="${customerData.surname}"><br><br>
                <label>Phone:</label>
                <input type="text" value="${customerData.phone}"><br><br>
                <label>Email:</label>
                <input type="email" value="${customerData.email}"><br><br>
                <button type="button" id="saveCustomerBtn">${editIndex !== null ? "Update" : "Add"}</button>
            </form>
        `;

        document.getElementById("saveCustomerBtn").onclick = () => {
            const inputs = content.querySelectorAll("input");

            const newCustomer = {
                firstName: inputs[0].value.trim(),
                surname: inputs[1].value.trim(),
                phone: inputs[2].value.trim(),
                email: inputs[3].value.trim(),
                vehicles: editIndex !== null ? customers[editIndex].vehicles : []
            };

            if (!newCustomer.firstName || !newCustomer.surname) return;

            if (editIndex !== null) customers[editIndex] = newCustomer;
            else customers.push(newCustomer);

            localStorage.setItem("customers", JSON.stringify(customers));
            modal.classList.add("hidden");
            renderCustomers();
        };
    }

    // ===== VEHICLE MODAL =====
    function showAddVehicleModal(customerIndex, vehicleIndex = null) {
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

        let v = { make: "", model: "", year: "", rego: "", vin: "" };
        if (vehicleIndex !== null) {
            v = customers[customerIndex].vehicles[vehicleIndex];
        }

        content.innerHTML = `
            <h3>${vehicleIndex !== null ? "Edit" : "Add"} Vehicle</h3>
            <form id="vehicleFormFields">
                <label>Make:</label><input type="text" value="${v.make}"><br><br>
                <label>Model:</label><input type="text" value="${v.model}"><br><br>
                <label>Year:</label><input type="text" value="${v.year}"><br><br>
                <label>Rego:</label><input type="text" value="${v.rego}"><br><br>
                <label>VIN:</label><input type="text" value="${v.vin}"><br><br>
                <button type="button" id="saveVehicleBtn">${vehicleIndex !== null ? "Update" : "Add"} Vehicle</button>
            </form>
        `;

        document.getElementById("saveVehicleBtn").onclick = () => {
            const inputs = content.querySelectorAll("input");

            const vehicle = {
                make: inputs[0].value.trim(),
                model: inputs[1].value.trim(),
                year: inputs[2].value.trim(),
                rego: inputs[3].value.trim(),
                vin: inputs[4].value.trim()
            };

            if (!vehicle.make || !vehicle.model) return;

            if (!customers[customerIndex].vehicles) {
                customers[customerIndex].vehicles = [];
            }

            if (vehicleIndex !== null) {
                customers[customerIndex].vehicles[vehicleIndex] = vehicle;
            } else {
                customers[customerIndex].vehicles.push(vehicle);
            }

            localStorage.setItem("customers", JSON.stringify(customers));
            modal.classList.add("hidden");
            renderCustomers();
        };
    }

    addCustomerBtn?.addEventListener("click", () => showAddCustomerModal());

    window.renderCustomers = renderCustomers;

    // 🔥 THIS WAS MISSING
    renderCustomers();
});
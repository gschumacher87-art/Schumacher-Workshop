// ================= CUSTOMERS.JS (ID LINKED + VEHICLES) =================
document.addEventListener("DOMContentLoaded", () => {

    let customers = JSON.parse(localStorage.getItem("customers")) || [];

    const customersList = document.getElementById("customersList");
    const addCustomerBtn = document.getElementById("addCustomerBtn");

    let openIndex = null;

    function saveCustomers() {
        localStorage.setItem("customers", JSON.stringify(customers));
        renderCustomers();
    }

    function renderCustomers() {
        if (!customersList) return;

        customersList.innerHTML = "";

        if (!customers.length) {
            customersList.textContent = "No customers.";
            return;
        }

        customers.forEach((c, index) => {

            const wrapper = document.createElement("div");

            Object.assign(wrapper.style, {
                border: "1px solid #ccc",
                padding: "10px",
                marginTop: "6px"
            });

            const header = document.createElement("div");
            header.style.fontWeight = "bold";
            header.style.cursor = "pointer";
            header.textContent = `${c.firstName} ${c.surname} - ${c.phone || ""}`;

            header.onclick = () => {
                openIndex = openIndex === index ? null : index;
                renderCustomers();
            };

            wrapper.appendChild(header);

            if (openIndex === index) {

                const details = document.createElement("div");
                details.style.marginTop = "6px";

                const email = document.createElement("div");
                email.textContent = c.email || "";
                details.appendChild(email);

                // ===== VEHICLES =====
                if (c.vehicles && c.vehicles.length) {
                    c.vehicles.forEach((v, vIndex) => {

                        const row = document.createElement("div");
                        row.style.cursor = "pointer";
                        row.style.marginTop = "4px";

                        row.textContent = `${v.make} ${v.model} (${v.year}) - ${v.rego}`;

                        row.onclick = (e) => {
                            e.stopPropagation();
                            openVehicleModal(index, vIndex);
                        };

                        details.appendChild(row);
                    });
                }

                const addVehicle = document.createElement("div");
                addVehicle.textContent = "+ Add Vehicle";
                addVehicle.style.cursor = "pointer";
                addVehicle.style.marginTop = "6px";

                addVehicle.onclick = (e) => {
                    e.stopPropagation();
                    openVehicleModal(index);
                };

                details.appendChild(addVehicle);

                wrapper.appendChild(details);
            }

            customersList.appendChild(wrapper);
        });
    }

    function openCustomerModal(editIndex = null) {

        const modal = document.getElementById("customerModal");
        if (!modal) return;

        modal.classList.remove("hidden");
        modal.classList.add("show");

        let c = {
            firstName: "",
            surname: "",
            phone: "",
            email: "",
            vehicles: []
        };

        if (editIndex !== null) c = customers[editIndex];

        modal.innerHTML = `
            <div class="modal-content">
                <h3>${editIndex !== null ? "Edit" : "Add"} Customer</h3>

                <input id="cFirst" placeholder="First Name" value="${c.firstName}">
                <input id="cLast" placeholder="Surname" value="${c.surname}">
                <input id="cPhone" placeholder="Phone" value="${c.phone || ""}">
                <input id="cEmail" placeholder="Email" value="${c.email || ""}">

                <button id="saveCustomer">Save</button>
            </div>
        `;

        document.getElementById("saveCustomer").onclick = () => {

            const newC = {
                id: c.id || Date.now(),
                firstName: document.getElementById("cFirst").value.trim(),
                surname: document.getElementById("cLast").value.trim(),
                phone: document.getElementById("cPhone").value.trim(),
                email: document.getElementById("cEmail").value.trim(),
                vehicles: c.vehicles || []
            };

            if (!newC.firstName || !newC.surname) return;

            if (editIndex !== null) customers[editIndex] = newC;
            else customers.push(newC);

            saveCustomers();

            modal.classList.remove("show");
            modal.classList.add("hidden");
        };
    }

    function openVehicleModal(customerIndex, vehicleIndex = null) {

        const modal = document.getElementById("vehicleModal") || document.getElementById("customerModal");
        if (!modal) return;

        modal.classList.remove("hidden");
        modal.classList.add("show");

        let v = {
            make: "",
            model: "",
            year: "",
            rego: "",
            vin: ""
        };

        if (vehicleIndex !== null) {
            v = customers[customerIndex].vehicles[vehicleIndex];
        }

        modal.innerHTML = `
            <div class="modal-content">
                <h3>${vehicleIndex !== null ? "Edit" : "Add"} Vehicle</h3>

                <input id="vMake" placeholder="Make" value="${v.make}">
                <input id="vModel" placeholder="Model" value="${v.model}">
                <input id="vYear" placeholder="Year" value="${v.year}">
                <input id="vRego" placeholder="Rego" value="${v.rego}">
                <input id="vVin" placeholder="VIN" value="${v.vin}">

                <button id="saveVehicle">Save</button>
            </div>
        `;

        document.getElementById("saveVehicle").onclick = () => {

            const newV = {
                make: document.getElementById("vMake").value.trim(),
                model: document.getElementById("vModel").value.trim(),
                year: document.getElementById("vYear").value.trim(),
                rego: document.getElementById("vRego").value.trim(),
                vin: document.getElementById("vVin").value.trim()
            };

            if (!newV.make || !newV.model) return;

            if (!customers[customerIndex].vehicles) {
                customers[customerIndex].vehicles = [];
            }

            if (vehicleIndex !== null) {
                customers[customerIndex].vehicles[vehicleIndex] = newV;
            } else {
                customers[customerIndex].vehicles.push(newV);
            }

            saveCustomers();

            modal.classList.remove("show");
            modal.classList.add("hidden");
        };
    }

    addCustomerBtn?.addEventListener("click", () => openCustomerModal());

    window.renderCustomers = renderCustomers;

    renderCustomers();
});
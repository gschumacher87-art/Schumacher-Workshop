// ================= TECHNICIANS.JS (RESOURCE POOL + JOB LINKING) =================
document.addEventListener("DOMContentLoaded", () => {

    let technicians = JSON.parse(localStorage.getItem("technicians")) || [];

    const techniciansList = document.getElementById("techniciansList");
    const addTechnicianBtn = document.getElementById("addTechnicianBtn");

    function saveTechs() {
        localStorage.setItem("technicians", JSON.stringify(technicians));
        renderTechnicians();
    }

    function renderTechnicians() {
        if (!techniciansList) return;

        techniciansList.innerHTML = "";

        if (!technicians.length) {
            techniciansList.textContent = "No technicians.";
            return;
        }

        technicians.forEach((t, index) => {

            const li = document.createElement("li");

            li.innerHTML = `
                <strong>${t.name}</strong> - ${t.speciality || ""}
                <button data-i="${index}" class="edit">Edit</button>
                <button data-i="${index}" class="delete">Delete</button>
            `;

            techniciansList.appendChild(li);
        });

        window.technicians = technicians;
    }

    function openTechModal(index = null) {

        const modal = document.getElementById("customerModal") || document.getElementById("bookingModal");
        if (!modal) return;

        modal.classList.remove("hidden");
        modal.classList.add("show");

        let t = {
            name: "",
            speciality: ""
        };

        if (index !== null) t = technicians[index];

        modal.innerHTML = `
            <div class="modal-content">
                <h3>${index !== null ? "Edit" : "Add"} Technician</h3>

                <input id="tName" placeholder="Name" value="${t.name}">
                <input id="tSpec" placeholder="Speciality" value="${t.speciality || ""}">

                <button id="saveTech">Save</button>
            </div>
        `;

        document.getElementById("saveTech").onclick = () => {

            const newT = {
                name: document.getElementById("tName").value.trim(),
                speciality: document.getElementById("tSpec").value.trim()
            };

            if (!newT.name) return;

            if (index !== null) technicians[index] = newT;
            else technicians.push(newT);

            saveTechs();

            modal.classList.remove("show");
            modal.classList.add("hidden");
        };
    }

    function deleteTech(index) {
        if (!confirm("Delete technician?")) return;
        technicians.splice(index, 1);
        saveTechs();
    }

    addTechnicianBtn?.addEventListener("click", () => openTechModal());

    techniciansList?.addEventListener("click", (e) => {
        if (e.target.classList.contains("edit")) {
            openTechModal(e.target.dataset.i);
        }
        if (e.target.classList.contains("delete")) {
            deleteTech(e.target.dataset.i);
        }
    });

    renderTechnicians();
});
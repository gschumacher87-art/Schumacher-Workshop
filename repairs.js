// ================= REPAIRS.JS (TEMPLATES + JOB LINKED CHECKLISTS) =================
document.addEventListener("DOMContentLoaded", () => {

    let repairs = JSON.parse(localStorage.getItem("repairs")) || [];

    const repairsList = document.getElementById("repairsList");
    const addRepairBtn = document.getElementById("addRepairBtn");

    function saveRepairs() {
        localStorage.setItem("repairs", JSON.stringify(repairs));
        renderRepairs();
    }

    function renderRepairs() {
        if (!repairsList) return;

        repairsList.innerHTML = "";

        if (!repairs.length) {
            repairsList.textContent = "No repair templates.";
            return;
        }

        repairs.forEach((r, index) => {

            const li = document.createElement("li");

            li.innerHTML = `
                <strong>${r.name}</strong>
                <br>
                ${r.checklist?.length ? r.checklist.map(c => `☑ ${c}`).join("<br>") : "No checklist"}
                <br>
                <button data-i="${index}" class="edit">Edit</button>
                <button data-i="${index}" class="delete">Delete</button>
            `;

            repairsList.appendChild(li);
        });
    }

    function openRepairModal(index = null) {

        const modal = document.getElementById("customerModal") || document.getElementById("bookingModal");
        if (!modal) return;

        modal.classList.remove("hidden");
        modal.classList.add("show");

        let r = {
            name: "",
            checklist: []
        };

        if (index !== null) r = repairs[index];

        modal.innerHTML = `
            <div class="modal-content">
                <h3>${index !== null ? "Edit" : "Add"} Repair</h3>

                <input id="rName" placeholder="Repair Name" value="${r.name}">

                <textarea id="rChecklist" placeholder="Checklist (one per line)">${(r.checklist || []).join("\n")}</textarea>

                <button id="saveRepair">Save</button>
            </div>
        `;

        document.getElementById("saveRepair").onclick = () => {

            const name = document.getElementById("rName").value.trim();
            const checklistRaw = document.getElementById("rChecklist").value;

            if (!name) return;

            const checklist = checklistRaw
                .split("\n")
                .map(x => x.trim())
                .filter(x => x);

            const newR = { name, checklist };

            if (index !== null) repairs[index] = newR;
            else repairs.push(newR);

            saveRepairs();

            modal.classList.remove("show");
            modal.classList.add("hidden");
        };
    }

    function deleteRepair(index) {
        if (!confirm("Delete repair template?")) return;
        repairs.splice(index, 1);
        saveRepairs();
    }

    addRepairBtn?.addEventListener("click", () => openRepairModal());

    repairsList?.addEventListener("click", (e) => {
        if (e.target.classList.contains("edit")) {
            openRepairModal(e.target.dataset.i);
        }
        if (e.target.classList.contains("delete")) {
            deleteRepair(e.target.dataset.i);
        }
    });

    window.getRepairs = () => repairs;

    renderRepairs();
});
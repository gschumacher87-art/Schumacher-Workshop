// ================= PARTS.JS (LIBRARY + INVOICE READY) =================
document.addEventListener("DOMContentLoaded", () => {

    let parts = JSON.parse(localStorage.getItem("parts")) || [];

    const partsList = document.getElementById("partsList");
    const addPartBtn = document.getElementById("addPartBtn");

    function saveParts() {
        localStorage.setItem("parts", JSON.stringify(parts));
        renderParts();
    }

    function renderParts() {
        if (!partsList) return;

        partsList.innerHTML = "";

        if (!parts.length) {
            partsList.textContent = "No parts.";
            return;
        }

        parts.forEach((p, index) => {

            const li = document.createElement("li");

            li.innerHTML = `
                <strong>${p.partNumber}</strong> - ${p.description} - $${p.price.toFixed(2)}
                <button data-i="${index}" class="edit">Edit</button>
                <button data-i="${index}" class="delete">Delete</button>
            `;

            partsList.appendChild(li);
        });
    }

    function openPartModal(index = null) {

        const modal = document.getElementById("customerModal") || document.getElementById("bookingModal");
        if (!modal) return;

        modal.classList.remove("hidden");
        modal.classList.add("show");

        let p = {
            partNumber: "",
            description: "",
            price: 0
        };

        if (index !== null) p = parts[index];

        modal.innerHTML = `
            <div class="modal-content">
                <h3>${index !== null ? "Edit" : "Add"} Part</h3>

                <input id="pNum" placeholder="Part Number" value="${p.partNumber}">
                <input id="pDesc" placeholder="Description" value="${p.description}">
                <input id="pPrice" type="number" placeholder="Price" value="${p.price}">

                <button id="savePart">Save</button>
            </div>
        `;

        document.getElementById("savePart").onclick = () => {

            const newP = {
                partNumber: document.getElementById("pNum").value.trim(),
                description: document.getElementById("pDesc").value.trim(),
                price: parseFloat(document.getElementById("pPrice").value) || 0
            };

            if (!newP.partNumber || !newP.description) return;

            if (index !== null) parts[index] = newP;
            else parts.push(newP);

            saveParts();

            modal.classList.remove("show");
            modal.classList.add("hidden");
        };
    }

    function deletePart(index) {
        if (!confirm("Delete part?")) return;
        parts.splice(index, 1);
        saveParts();
    }

    addPartBtn?.addEventListener("click", () => openPartModal());

    partsList?.addEventListener("click", (e) => {
        if (e.target.classList.contains("edit")) {
            openPartModal(e.target.dataset.i);
        }
        if (e.target.classList.contains("delete")) {
            deletePart(e.target.dataset.i);
        }
    });

    window.getParts = () => parts;

    renderParts();
});
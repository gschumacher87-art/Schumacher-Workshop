/*****************************************
 * repairs.js
 * ---------------------------------------
 * Repairs Block - CRUD for repair types
 * Stored in localStorage
 *****************************************/

document.addEventListener("DOMContentLoaded", () => {
  // ===== LOAD REPAIRS =====
  let repairs = JSON.parse(localStorage.getItem("repairs")) || [];

  const repairsList = document.getElementById("repairsList"); // container for list
  const addRepairBtn = document.getElementById("addRepairBtn"); // button to open add form

  // ===== RENDER REPAIRS =====
  function renderRepairs() {
    repairsList.innerHTML = "";
    if (repairs.length === 0) {
      repairsList.textContent = "No repair types yet.";
      return;
    }

    repairs.forEach((repair, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${repair.name}</strong> - Duration: ${repair.duration}h - Cost: $${repair.cost}
        <button class="editRepair" data-index="${index}">Edit</button>
        <button class="deleteRepair" data-index="${index}">Delete</button>
      `;
      repairsList.appendChild(li);
    });
  }

  // ===== SAVE REPAIRS =====
  function saveRepairs() {
    localStorage.setItem("repairs", JSON.stringify(repairs));
    renderRepairs();
  }

  // ===== ADD OR EDIT REPAIR =====
  function addOrEditRepair(index = null) {
    const name = prompt("Repair Name:", index !== null ? repairs[index].name : "");
    if (!name) return;

    const duration = prompt("Duration in hours:", index !== null ? repairs[index].duration : "");
    if (!duration || isNaN(duration)) return alert("Invalid duration");

    const cost = prompt("Default Cost:", index !== null ? repairs[index].cost : "");
    if (!cost || isNaN(cost)) return alert("Invalid cost");

    const repairObj = { name, duration: parseFloat(duration), cost: parseFloat(cost) };

    if (index === null) {
      repairs.push(repairObj);
    } else {
      repairs[index] = repairObj;
    }

    saveRepairs();
  }

  // ===== DELETE REPAIR =====
  function deleteRepair(index) {
    if (confirm(`Delete repair "${repairs[index].name}"?`)) {
      repairs.splice(index, 1);
      saveRepairs();
    }
  }

  // ===== EVENT LISTENERS =====
  addRepairBtn.addEventListener("click", () => addOrEditRepair());

  repairsList.addEventListener("click", (e) => {
    if (e.target.classList.contains("editRepair")) {
      addOrEditRepair(e.target.dataset.index);
    } else if (e.target.classList.contains("deleteRepair")) {
      deleteRepair(e.target.dataset.index);
    }
  });

  // ===== INITIAL RENDER =====
  renderRepairs();
});
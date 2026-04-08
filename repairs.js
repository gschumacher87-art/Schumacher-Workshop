/*****************************************
 * repairs.js (TEMPLATES VERSION)
 *****************************************/

document.addEventListener("DOMContentLoaded", () => {

  let repairs = JSON.parse(localStorage.getItem("repairs")) || [];

  const repairsList = document.getElementById("repairsList");
  const addRepairBtn = document.getElementById("addRepairBtn");


  // ===== RENDER =====
  function renderRepairs() {
    repairsList.innerHTML = "";

    if (repairs.length === 0) {
      repairsList.textContent = "No repair templates yet.";
      return;
    }

    repairs.forEach((repair, index) => {

      const li = document.createElement("li");

      li.innerHTML = `
        <strong>${repair.name}</strong>
        <br>
        ${repair.checklist?.length ? repair.checklist.map(c => `☑ ${c}`).join("<br>") : "No checklist"}
        <br>
        <button class="editRepair" data-index="${index}">Edit</button>
        <button class="deleteRepair" data-index="${index}">Delete</button>
      `;

      repairsList.appendChild(li);
    });
  }


  // ===== SAVE =====
  function saveRepairs() {
    localStorage.setItem("repairs", JSON.stringify(repairs));
    renderRepairs();
  }


  // ===== ADD / EDIT TEMPLATE =====
  function addOrEditRepair(index = null) {

    const existing = index !== null ? repairs[index] : null;

    const name = prompt("Service / Repair Name:", existing?.name || "");
    if (!name) return;

    // ===== CHECKLIST BUILDER =====
    let checklist = existing?.checklist ? [...existing.checklist] : [];

    while (true) {

      let message = "Checklist items:\n\n";

      checklist.forEach((item, i) => {
        message += `${i + 1}. ${item}\n`;
      });

      message += "\nType new item\nOR type number to remove\nOR leave blank to finish";

      const input = prompt(message);

      if (!input) break;

      // remove item
      if (!isNaN(input)) {
        const idx = parseInt(input) - 1;
        if (checklist[idx]) checklist.splice(idx, 1);
      } else {
        // add item
        checklist.push(input);
      }
    }

    const repairObj = {
      name,
      checklist
    };

    if (index === null) {
      repairs.push(repairObj);
    } else {
      repairs[index] = repairObj;
    }

    saveRepairs();
  }


  // ===== DELETE =====
  function deleteRepair(index) {
    if (confirm(`Delete template "${repairs[index].name}"?`)) {
      repairs.splice(index, 1);
      saveRepairs();
    }
  }


  // ===== EVENTS =====
  addRepairBtn.addEventListener("click", () => addOrEditRepair());

  repairsList.addEventListener("click", (e) => {

    if (e.target.classList.contains("editRepair")) {
      addOrEditRepair(e.target.dataset.index);
    }

    if (e.target.classList.contains("deleteRepair")) {
      deleteRepair(e.target.dataset.index);
    }

  });


  // ===== INIT =====
  renderRepairs();

});
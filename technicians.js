/*****************************************
 * technicians.js
 * ---------------------------------------
 * Technicians Block - CRUD for technicians
 * Stored in localStorage
 *****************************************/

document.addEventListener("DOMContentLoaded", () => {
  // ===== LOAD TECHNICIANS =====
  let technicians = JSON.parse(localStorage.getItem("technicians")) || [];

  const techniciansList = document.getElementById("techniciansList"); // container for list
  const addTechnicianBtn = document.getElementById("addTechnicianBtn"); // button to add technician

  // ===== RENDER TECHNICIANS =====
  function renderTechnicians() {
    techniciansList.innerHTML = "";
    if (technicians.length === 0) {
      techniciansList.textContent = "No technicians yet.";
      return;
    }

    technicians.forEach((tech, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${tech.name}</strong> - Speciality: ${tech.speciality}
        <button class="editTechnician" data-index="${index}">Edit</button>
        <button class="deleteTechnician" data-index="${index}">Delete</button>
      `;
      techniciansList.appendChild(li);
    });

    // ===== ADDED =====
    window.technicians = technicians;
  }

  // ===== SAVE TECHNICIANS =====
  function saveTechnicians() {
    localStorage.setItem("technicians", JSON.stringify(technicians));
    renderTechnicians();
  }

  // ===== ADD OR EDIT TECHNICIAN =====
  function addOrEditTechnician(index = null) {
    const name = prompt("Technician Name:", index !== null ? technicians[index].name : "");
    if (!name) return;

    const speciality = prompt("Speciality:", index !== null ? technicians[index].speciality : "");
    if (!speciality) return;

    const techObj = { name, speciality };

    if (index === null) {
      technicians.push(techObj);
    } else {
      technicians[index] = techObj;
    }

    saveTechnicians();
  }

  // ===== DELETE TECHNICIAN =====
  function deleteTechnician(index) {
    if (confirm(`Delete technician "${technicians[index].name}"?`)) {
      technicians.splice(index, 1);
      saveTechnicians();
    }
  }

  // ===== EVENT LISTENERS =====
  addTechnicianBtn?.addEventListener("click", () => addOrEditTechnician());

  techniciansList?.addEventListener("click", (e) => {
    if (e.target.classList.contains("editTechnician")) {
      addOrEditTechnician(e.target.dataset.index);
    } else if (e.target.classList.contains("deleteTechnician")) {
      deleteTechnician(e.target.dataset.index);
    }
  });

  // ===== INITIAL RENDER =====
  renderTechnicians();
});
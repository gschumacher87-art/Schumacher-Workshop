/*****************************************
 * parts.js
 * ---------------------------------------
 * Parts Block - CRUD for workshop parts
 * Stored in localStorage
 *****************************************/
document.addEventListener("DOMContentLoaded", () => {
  // ===== LOAD PARTS =====
  let parts = JSON.parse(localStorage.getItem("parts")) || [];

  const partsList = document.getElementById("partsList"); // container for list
  const addPartBtn = document.getElementById("addPartBtn"); // button to add part

  // ===== RENDER PARTS =====
  function renderParts() {
    partsList.innerHTML = "";
    if (parts.length === 0) {
      partsList.textContent = "No parts yet.";
      return;
    }
    parts.forEach((part, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${part.partNumber}</strong> - ${part.description} - $${part.price}
        <button class="editPart" data-index="${index}">Edit</button>
        <button class="deletePart" data-index="${index}">Delete</button>
      `;
      partsList.appendChild(li);
    });
  }

  // ===== SAVE PARTS =====
  function saveParts() {
    localStorage.setItem("parts", JSON.stringify(parts));
    renderParts();
  }

  // ===== ADD OR EDIT PART =====
  function addOrEditPart(index = null) {
    const partNumber = prompt("Part Number:", index !== null ? parts[index].partNumber : "");
    if (!partNumber) return;

    const description = prompt("Description:", index !== null ? parts[index].description : "");
    if (!description) return;

    const price = prompt("Price:", index !== null ? parts[index].price : "");
    if (!price || isNaN(price)) return alert("Invalid price");

    const partObj = { partNumber, description, price: parseFloat(price) };

    if (index === null) {
      parts.push(partObj);
    } else {
      parts[index] = partObj;
    }

    saveParts();
  }

  // ===== DELETE PART =====
  function deletePart(index) {
    if (confirm(`Delete part "${parts[index].partNumber}"?`)) {
      parts.splice(index, 1);
      saveParts();
    }
  }

  // ===== EVENT LISTENERS =====
  addPartBtn.addEventListener("click", () => addOrEditPart());

  partsList.addEventListener("click", (e) => {
    if (e.target.classList.contains("editPart")) {
      addOrEditPart(e.target.dataset.index);
    } else if (e.target.classList.contains("deletePart")) {
      deletePart(e.target.dataset.index);
    }
  });

  // ===== INITIAL RENDER =====
  renderParts();
});
// ===== INTERACTIONS.JS =====
document.addEventListener("DOMContentLoaded", () => {

    // ===== MODAL HANDLING =====
    const modals = document.querySelectorAll(".modal");
    const modalContents = document.querySelectorAll(".modal-content");

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add("show");
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove("show");
    }

    // Close modal when clicking outside content
    modals.forEach(modal => {
        modal.addEventListener("click", e => {
            if (e.target === modal) modal.classList.remove("show");
        });
    });

    // Close modal with close buttons
    const closeButtons = document.querySelectorAll(".modal-close");
    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const modal = btn.closest(".modal");
            if (modal) modal.classList.remove("show");
        });
    });

    // ===== SIDEBAR TABS =====
    const sidebarTabs = document.querySelectorAll(".sidebar ul li");
    sidebarTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            sidebarTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            // Optional: show/hide sections based on tab
            const targetSection = tab.dataset.target;
            if (targetSection) {
                document.querySelectorAll(".section").forEach(sec => sec.classList.add("hidden"));
                const section = document.getElementById(targetSection);
                if (section) section.classList.remove("hidden");
            }
        });
    });

    // ===== GENERIC BUTTON OPEN MODAL =====
    const openModalButtons = document.querySelectorAll("[data-modal]");
    openModalButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const modalId = btn.dataset.modal;
            if (modalId) openModal(modalId);
        });
    });

});
// ================= INTERACTIONS.JS =================
document.addEventListener("DOMContentLoaded", () => {

    // ===== MODAL UTILITY FUNCTIONS =====
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.classList.add("show");
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.classList.remove("show");
    }

    // Close modal when clicking outside content
    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", (e) => {
            const content = modal.querySelector(".modal-content");
            if (e.target === modal) modal.classList.remove("show");
            if (content && e.target === content) return; // allow clicks inside content
        });
    });

    // Close modal with ESC key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            document.querySelectorAll(".modal.show").forEach(m => m.classList.remove("show"));
        }
    });

    // ===== GLOBAL BUTTON CLICK HANDLER =====
    document.body.addEventListener("click", (e) => {
        const btn = e.target;

        // Open modals by data attribute
        if (btn.dataset.open) {
            openModal(btn.dataset.open + "Modal");
        }

        // Close modals by data attribute
        if (btn.dataset.close) {
            closeModal(btn.dataset.close);
        }
    });

    // ===== SIDEBAR / TAB CLICK =====
    const sidebarItems = document.querySelectorAll(".sidebar ul li");
    sidebarItems.forEach(item => {
        item.addEventListener("click", () => {
            sidebarItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
        });
    });

    // ===== DYNAMIC MODAL HOOKS =====
    // Expose openModal and closeModal globally for BOOKINGS / CUSTOMERS dynamic modals
    window.openModal = openModal;
    window.closeModal = closeModal;
});

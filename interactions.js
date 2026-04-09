// ================= INTERACTIONS.JS (GLOBAL MODAL + UI CONTROL) =================
document.addEventListener("DOMContentLoaded", () => {

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.classList.remove("hidden");
        modal.classList.add("show");
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.classList.remove("show");
        modal.classList.add("hidden");
    }

    // ===== CLICK OUTSIDE CLOSE =====
    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", (e) => {
            const content = modal.querySelector(".modal-content");
            if (e.target === modal) closeModal(modal.id);
            if (content && e.target === content) return;
        });
    });

    // ===== ESC CLOSE =====
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            document.querySelectorAll(".modal.show").forEach(m => {
                m.classList.remove("show");
                m.classList.add("hidden");
            });
        }
    });

    // ===== GLOBAL DATA ATTR HANDLER =====
    document.body.addEventListener("click", (e) => {

        const btn = e.target;

        if (btn.dataset.open) {
            openModal(btn.dataset.open + "Modal");
        }

        if (btn.dataset.close) {
            closeModal(btn.dataset.close);
        }
    });

    // ===== SIDEBAR ACTIVE STATE =====
    const sidebarItems = document.querySelectorAll(".sidebar ul li");

    sidebarItems.forEach(item => {
        item.addEventListener("click", () => {
            sidebarItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
        });
    });

    // ===== EXPOSE =====
    window.openModal = openModal;
    window.closeModal = closeModal;

});
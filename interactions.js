// ================= INTERACTIONS.JS =================

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {

    // ===== MODAL HANDLERS =====
    const modals = document.querySelectorAll(".modal");
    const modalContents = document.querySelectorAll(".modal-content");

    // Open modal
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add("show");
    }

    // Close modal
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove("show");
    }

    // Close modal on clicking outside content
    modals.forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.classList.remove("show");
        });
    });

    // ===== GLOBAL BUTTON HANDLERS =====
    document.body.addEventListener("click", (e) => {
        const btn = e.target;

        // Open customer popup
        if (btn.matches("[data-open='customer']")) {
            openModal("customerModal");
        }

        // Open booking popup
        if (btn.matches("[data-open='booking']")) {
            openModal("bookingModal");
        }

        // Open invoice popup
        if (btn.matches("[data-open='invoice']")) {
            openModal("invoiceModal");
        }

        // Open quote popup
        if (btn.matches("[data-open='quote']")) {
            openModal("quoteModal");
        }

        // Close buttons
        if (btn.matches("[data-close]")) {
            const modalId = btn.getAttribute("data-close");
            closeModal(modalId);
        }
    });

    // ===== ESC KEY TO CLOSE ANY MODAL =====
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            modals.forEach(modal => modal.classList.remove("show"));
        }
    });

    // ===== TAB / SIDEBAR CLICK =====
    const sidebarItems = document.querySelectorAll(".sidebar ul li");
    sidebarItems.forEach(item => {
        item.addEventListener("click", () => {
            sidebarItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
        });
    });

    // ===== OPTIONAL: DYNAMIC CONTENT LOAD =====
    // Example: load bookings when modal opens
    const bookingModal = document.getElementById("bookingModal");
    if (bookingModal) {
        bookingModal.addEventListener("transitionend", () => {
            if (bookingModal.classList.contains("show")) {
                // bookings.render(); // call your bookings.js render function
            }
        });
    }

});
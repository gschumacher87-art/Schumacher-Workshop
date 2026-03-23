// ===== invoices.js =====

// Load existing invoices or start empty
let invoices = JSON.parse(localStorage.getItem("invoices")) || [];

// ===== ADD INVOICE =====
// Each invoice links to a customer + vehicle + one or more quotes
function addInvoice(customerEmail, vehicleRego, quotesIncluded) {
    // Calculate total from included quotes
    let total = quotesIncluded.reduce((sum, q) => sum + (q.repairCost || 0), 0);

    let invoice = {
        customerEmail: customerEmail,
        vehicleRego: vehicleRego,
        quotesIncluded: quotesIncluded, // array of quotes (or IDs if you prefer)
        total: total,
        date: new Date().toISOString()
    };

    invoices.push(invoice);
    localStorage.setItem("invoices", JSON.stringify(invoices));
    return invoice;
}

// ===== GET ALL INVOICES =====
function getAllInvoices() {
    return invoices;
}

// ===== GET INVOICES BY CUSTOMER =====
function getInvoicesByCustomer(email) {
    return invoices.filter(inv => inv.customerEmail === email);
}

// ===== GET INVOICES BY VEHICLE =====
function getInvoicesByVehicle(rego) {
    return invoices.filter(inv => inv.vehicleRego === rego);
}

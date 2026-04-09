// ================= QUOTES.JS (ID LINKED + CUSTOMER / VEHICLE CONNECTED) =================

let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
let customers = JSON.parse(localStorage.getItem("customers")) || [];

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ===== CREATE QUOTE =====
function addQuote(customerId, vehicleIndex, repair, cost) {

    const customer = customers[customerId];
    const vehicle = customer?.vehicles?.[vehicleIndex];

    if (!customer || !vehicle) return;

    const quote = {
        id: Date.now(),
        customerId,
        vehicleIndex,
        customerName: `${customer.firstName} ${customer.surname}`,
        vehicle: `${vehicle.make} ${vehicle.model}`,
        repair,
        cost: parseFloat(cost) || 0,
        date: new Date().toISOString()
    };

    quotes.push(quote);
    saveQuotes();

    return quote;
}

// ===== GET ALL =====
function getAllQuotes() {
    return quotes;
}

// ===== GET BY CUSTOMER =====
function getQuotesByCustomer(customerId) {
    return quotes.filter(q => q.customerId == customerId);
}

// ===== GET BY VEHICLE =====
function getQuotesByVehicle(customerId, vehicleIndex) {
    return quotes.filter(q => q.customerId == customerId && q.vehicleIndex == vehicleIndex);
}

// ===== DELETE =====
function deleteQuote(id) {
    quotes = quotes.filter(q => q.id !== id);
    saveQuotes();
}

// ===== EXPOSE =====
window.addQuote = addQuote;
window.getAllQuotes = getAllQuotes;
window.getQuotesByCustomer = getQuotesByCustomer;
window.getQuotesByVehicle = getQuotesByVehicle;
window.deleteQuote = deleteQuote;
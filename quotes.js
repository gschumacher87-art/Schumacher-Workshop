// ===== quotes.js =====

// Load existing quotes or start empty
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

// ===== ADD A SINGLE REPAIR QUOTE =====
function addQuote(customerEmail, vehicleRego, repairDescription, repairCost) {
    let quote = {
        customerEmail: customerEmail,     // links to customer
        vehicleRego: vehicleRego,         // links to vehicle
        repairDescription: repairDescription,
        repairCost: repairCost,
        date: new Date().toISOString()
    };
    quotes.push(quote);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    return quote;
}

// ===== GET ALL QUOTES =====
function getAllQuotes() {
    return quotes;
}

// ===== GET QUOTES FOR A CUSTOMER =====
function getQuotesByCustomer(email) {
    return quotes.filter(q => q.customerEmail === email);
}

// ===== GET QUOTES FOR A VEHICLE =====
function getQuotesByVehicle(rego) {
    return quotes.filter(q => q.vehicleRego === rego);
}
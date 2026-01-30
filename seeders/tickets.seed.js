const Ticket = require("../models/Ticket");

const seedTickets = async () => {
  await Ticket.insertMany([
    { type: "Adult", price: 200, description: "Standard adult ticket" },
    { type: "Student", price: 100, description: "Valid student ID required" },
    { type: "Child", price: 75, description: "Ages 6-12" }
  ]);
};

module.exports = { seedTickets };

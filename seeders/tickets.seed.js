const Ticket = require("../models/Ticket");

const seedTickets = async () => {
  await Ticket.insertMany([
    { group: "egyptian", audience: "adult", price: 50, description: "Egyptian adult ticket" },
    { group: "egyptian", audience: "student", price: 25, description: "Egyptian student ticket" },
    { group: "egyptian", audience: "child", price: 15, description: "Egyptian child ticket" },
    { group: "egyptian", audience: "senior", price: 30, description: "Egyptian senior ticket" },
    { group: "arab", audience: "adult", price: 100, description: "Arab adult ticket" },
    { group: "arab", audience: "student", price: 60, description: "Arab student ticket" },
    { group: "arab", audience: "child", price: 40, description: "Arab child ticket" },
    { group: "arab", audience: "senior", price: 80, description: "Arab senior ticket" },
    { group: "foreigner", audience: "adult", price: 300, description: "Foreigner adult ticket" },
    { group: "foreigner", audience: "student", price: 200, description: "Foreigner student ticket" },
    { group: "foreigner", audience: "child", price: 150, description: "Foreigner child ticket" },
    { group: "foreigner", audience: "senior", price: 250, description: "Foreigner senior ticket" }
  ]);
};

module.exports = { seedTickets };

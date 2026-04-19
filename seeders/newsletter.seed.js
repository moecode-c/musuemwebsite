const Newsletter = require("../models/Newsletter");

const seedNewsletter = async () => {
  await Newsletter.insertMany([
    { name: "Museum News", phone: "+20 2 1234 5678", email: "news@museum.com" },
    { name: "Museum Updates", phone: "+20 2 9876 5432", email: "updates@museum.com" }
  ]);
};

module.exports = { seedNewsletter };

const Newsletter = require("../models/Newsletter");

const seedNewsletter = async () => {
  await Newsletter.insertMany([
    { email: "news@museum.com" },
    { email: "updates@museum.com" }
  ]);
};

module.exports = { seedNewsletter };

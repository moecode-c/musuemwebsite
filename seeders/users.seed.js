const bcrypt = require("bcrypt");
const User = require("../models/User");

const seedUsers = async () => {
  const adminPass = await bcrypt.hash("Admin123", 10);
  const userPass = await bcrypt.hash("User1234", 10);

  await User.insertMany([
    { name: "Admin", email: "admin@museum.com", password: adminPass, role: "admin" },
    { name: "Laila Ahmed", email: "laila@museum.com", password: userPass, role: "user" }
  ]);
};

module.exports = { seedUsers };

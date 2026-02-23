const bcrypt = require("bcrypt");
const User = require("../models/User");

const seedUsers = async () => {
  const adminPass = await bcrypt.hash("Admin123", 10);
  const userPass = await bcrypt.hash("User1234", 10);

  await User.insertMany([
    { name: "Admin", email: "admin@museum.com", password: adminPass, role: "admin" },
    { name: "Mona Hassan", email: "manager@museum.com", password: userPass, role: "museum_manager" },
    { name: "Karim Nader", email: "curator@museum.com", password: userPass, role: "curator" },
    { name: "Nour Adel", email: "frontdesk@museum.com", password: userPass, role: "front_desk" },
    { name: "Amr Fathy", email: "security@museum.com", password: userPass, role: "security_officer" },
    { name: "Heba Youssef", email: "technician@museum.com", password: userPass, role: "maintenance_technician" },
    { name: "Salma Ali", email: "janitor@museum.com", password: userPass, role: "janitor" },
    { name: "Dina Samir", email: "educator@museum.com", password: userPass, role: "educator_guide" },
    { name: "Laila Ahmed", email: "laila@museum.com", password: userPass, role: "user" }
  ]);
};

module.exports = { seedUsers };

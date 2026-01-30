const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Exhibit = require("../models/Exhibit");
const Collection = require("../models/Collection");
const Product = require("../models/Product");
const MapPin = require("../models/MapPin");
const Ticket = require("../models/Ticket");
const Testimonial = require("../models/Testimonial");

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/egyptian_museum");

  await Promise.all([
    User.deleteMany(),
    Exhibit.deleteMany(),
    Collection.deleteMany(),
    Product.deleteMany(),
    MapPin.deleteMany(),
    Ticket.deleteMany(),
    Testimonial.deleteMany()
  ]);

  const adminPass = await bcrypt.hash("Admin123", 10);
  await User.create({ name: "Admin", email: "admin@museum.com", password: adminPass, role: "admin" });

  await Exhibit.insertMany([
    {
      title: "Golden Mask of Tutankhamun",
      category: "Pharaoh",
      description: "A masterpiece of ancient gold craftsmanship and royal symbolism.",
      imageUrl: "/assets/hero.svg",
      modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
      era: "New Kingdom"
    },
    {
      title: "Mamluk Lanterns",
      category: "Islamic",
      description: "Ornate glasswork illuminating Cairo's historic mosques.",
      imageUrl: "/assets/hero.svg",
      modelUrl: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
      era: "Islamic Era"
    }
  ]);

  await Collection.insertMany([
    { title: "Royal Regalia", summary: "Crowns, jewelry, and ceremonial artifacts.", imageUrl: "/assets/hero.svg" },
    { title: "Nile Life", summary: "Daily tools and crafts from the Nile valley.", imageUrl: "/assets/hero.svg" }
  ]);

  await Product.insertMany([
    { name: "Ankh Pendant", description: "Sterling silver pendant.", price: 350, imageUrl: "/assets/hero.svg", stock: 20 },
    { name: "Papyrus Scroll", description: "Handmade papyrus art.", price: 200, imageUrl: "/assets/hero.svg", stock: 50 }
  ]);

  await MapPin.insertMany([
    { label: "Main Entrance", x: 20, y: 30, description: "Ticketing and security gate." },
    { label: "Pharaoh Hall", x: 60, y: 40, description: "Royal artifacts and mummies." }
  ]);

  await Ticket.insertMany([
    { type: "Adult", price: 200, description: "Standard adult ticket" },
    { type: "Student", price: 100, description: "Valid student ID required" }
  ]);

  await Testimonial.insertMany([
    { name: "Laila", message: "A breathtaking journey through time.", rating: 5 },
    { name: "Omar", message: "The 3D exhibits were unforgettable.", rating: 5 }
  ]);

  console.log("Seed data created");
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

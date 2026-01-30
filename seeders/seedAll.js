const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

const { seedUsers } = require("./users.seed");
const { seedExhibits } = require("./exhibits.seed");
const { seedProducts } = require("./products.seed");
const { seedMapPins } = require("./mapPins.seed");
const { seedTickets } = require("./tickets.seed");
const { seedTestimonials } = require("./testimonials.seed");
const { seedNewsletter } = require("./newsletter.seed");

const User = require("../models/User");
const Exhibit = require("../models/Exhibit");
const Product = require("../models/Product");
const MapPin = require("../models/MapPin");
const Ticket = require("../models/Ticket");
const Testimonial = require("../models/Testimonial");
const Newsletter = require("../models/Newsletter");

dotenv.config();

const configureDns = () => {
  const servers = process.env.DNS_SERVERS
    ? process.env.DNS_SERVERS.split(",").map((s) => s.trim()).filter(Boolean)
    : ["8.8.8.8", "1.1.1.1"];
  if (servers.length) {
    dns.setServers(servers);
  }
};

const seedAll = async () => {
  configureDns();
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/egyptian_museum");

  await Promise.all([
    User.deleteMany(),
    Exhibit.deleteMany(),
    Product.deleteMany(),
    MapPin.deleteMany(),
    Ticket.deleteMany(),
    Testimonial.deleteMany(),
    Newsletter.deleteMany()
  ]);

  await seedUsers();
  await seedExhibits();
  await seedProducts();
  await seedMapPins();
  await seedTickets();
  await seedTestimonials();
  await seedNewsletter();

  console.log("Seeders completed");
  await mongoose.disconnect();
};

seedAll().catch((err) => {
  console.error(err);
  process.exit(1);
});

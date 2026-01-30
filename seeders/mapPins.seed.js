const MapPin = require("../models/MapPin");

const seedMapPins = async () => {
  await MapPin.insertMany([
    { label: "Main Entrance", x: 20, y: 30, description: "Ticketing and security gate." },
    { label: "Pharaoh Hall", x: 60, y: 40, description: "Royal artifacts and mummies." },
    { label: "Islamic Gallery", x: 40, y: 55, description: "Islamic art and textiles." }
  ]);
};

module.exports = { seedMapPins };

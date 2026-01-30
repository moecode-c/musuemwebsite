const Product = require("../models/Product");

const seedProducts = async () => {
  await Product.insertMany([
    { name: "Ankh Pendant", description: "Sterling silver pendant.", price: 350, imageUrl: "/assets/hero.svg", stock: 20 },
    { name: "Papyrus Scroll", description: "Handmade papyrus art.", price: 200, imageUrl: "/assets/hero.svg", stock: 50 },
    { name: "Hieroglyph Mug", description: "Ceramic mug with hieroglyphs.", price: 120, imageUrl: "/assets/hero.svg", stock: 35 }
  ]);
};

module.exports = { seedProducts };

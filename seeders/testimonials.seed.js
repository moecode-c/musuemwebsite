const Testimonial = require("../models/Testimonial");

const seedTestimonials = async () => {
  await Testimonial.insertMany([
    { name: "Laila", message: "A breathtaking journey through time.", rating: 5 },
    { name: "Omar", message: "The 3D exhibits were unforgettable.", rating: 5 },
    { name: "Sara", message: "Friendly staff and beautiful exhibits.", rating: 4 }
  ]);
};

module.exports = { seedTestimonials };

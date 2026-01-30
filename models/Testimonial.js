const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    rating: { type: Number, default: 5 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);

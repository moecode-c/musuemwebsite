const mongoose = require("mongoose");

const mapPinSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MapPin", mapPinSchema);

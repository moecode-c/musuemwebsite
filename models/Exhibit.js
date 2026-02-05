const mongoose = require("mongoose");

const exhibitSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    modelUrl: { type: String, required: true },
    era: { type: String, default: "Ancient Egypt" },
    x: { type: Number, default: null },
    y: { type: Number, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exhibit", exhibitSchema);

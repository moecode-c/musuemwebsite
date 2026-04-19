const mongoose = require("mongoose");

const zonePointSchema = new mongoose.Schema(
  {
    x: { type: Number, required: true, min: 0, max: 100 },
    y: { type: Number, required: true, min: 0, max: 100 }
  },
  { _id: false }
);

const cleaningZoneSchema = new mongoose.Schema(
  {
    zoneName: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    floor: { type: String, trim: true, default: "Ground" },
    color: {
      type: String,
      trim: true,
      default: "#b7842a",
      match: /^#([0-9a-fA-F]{6})$/
    },
    polygon: {
      type: [zonePointSchema],
      validate: {
        validator: (value) => Array.isArray(value) && value.length >= 3,
        message: "Polygon must have at least 3 points"
      }
    },
    isActive: { type: Boolean, default: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    assignedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CleaningZone", cleaningZoneSchema);

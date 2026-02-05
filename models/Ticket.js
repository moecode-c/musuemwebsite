const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    group: {
      type: String,
      required: true,
      enum: ["egyptian", "arab", "foreigner"],
      trim: true
    },
    audience: {
      type: String,
      required: true,
      enum: ["adult", "student", "child", "senior"],
      trim: true
    },
    price: { type: Number, required: true },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);

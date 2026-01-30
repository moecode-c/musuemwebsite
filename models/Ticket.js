const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);

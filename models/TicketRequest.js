const mongoose = require("mongoose");

const ticketRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, trim: true },
    nationality: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    category: {
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
    quantity: { type: Number, default: 1 },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    status: { type: String, default: "pending" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TicketRequest", ticketRequestSchema);
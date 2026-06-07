const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    items: { type: [orderItemSchema], default: [] },
    total: { type: Number, required: true, default: 0 },
    customer: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      notes: { type: String, default: "" }
    },
    payment: {
      method: { type: String, default: "card" }
    },
    delivery: {
      option: { type: String, default: "delivery" },
      date: { type: String, default: "" },
      window: { type: String, default: "" },
      pickupSpot: { type: String, default: "" },
      notes: { type: String, default: "" }
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "fulfilled", "cancelled"],
      default: "pending"
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

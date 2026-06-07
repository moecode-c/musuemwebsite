const Order = require("../models/Order");
const { asyncHandler } = require("../utils/asyncHandler");

const ALLOWED_STATUSES = ["pending", "confirmed", "fulfilled", "cancelled"];

// List all orders (admin). Newest first.
const list = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// Update an order's status (admin). Used by the Confirm / Fulfill / Cancel buttons.
const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(422).json({ message: "Invalid status" });
  }
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.json(order);
});

// Delete an order (admin).
const remove = asyncHandler(async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = { list, updateStatus, remove };

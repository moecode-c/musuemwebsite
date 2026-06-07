const AssistanceRequest = require("../models/AssistanceRequest");
const { asyncHandler } = require("../utils/asyncHandler");

const ALLOWED_STATUSES = ["new", "in_progress", "resolved"];

// Public: a visitor submits an accessibility assistance request.
const create = asyncHandler(async (req, res) => {
  const { name, email, phone, date, type, notes } = req.body;
  const request = await AssistanceRequest.create({
    name,
    email,
    phone: phone || "",
    date: date || "",
    type: type || "other",
    notes: notes || "",
    user: req.session.user ? req.session.user.id : null
  });
  res.status(201).json({ message: "Assistance request submitted", id: request._id });
});

// Admin: list all assistance requests, newest first.
const list = asyncHandler(async (req, res) => {
  const requests = await AssistanceRequest.find().sort({ createdAt: -1 });
  res.json(requests);
});

// Admin: update a request's status (new / in_progress / resolved).
const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(422).json({ message: "Invalid status" });
  }
  const request = await AssistanceRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }
  res.json(request);
});

// Admin: delete a request.
const remove = asyncHandler(async (req, res) => {
  await AssistanceRequest.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = { create, list, updateStatus, remove };

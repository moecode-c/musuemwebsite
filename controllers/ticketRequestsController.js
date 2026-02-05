const TicketRequest = require("../models/TicketRequest");
const { asyncHandler } = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const requests = await TicketRequest.find().sort({ createdAt: -1 });
  res.json(requests);
});

const create = asyncHandler(async (req, res) => {
  const { name, age, email, nationality, phone, category, audience, quantity, date, timeSlot } = req.body;
  const request = await TicketRequest.create({
    name,
    age,
    email,
    nationality,
    phone,
    category,
    audience,
    quantity,
    date,
    timeSlot
  });
  res.status(201).json(request);
});

module.exports = { list, create };
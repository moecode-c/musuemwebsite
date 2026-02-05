const Ticket = require("../models/Ticket");
const { asyncHandler } = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const items = await Ticket.find();
  res.json(items);
});

const create = asyncHandler(async (req, res) => {
  const { group, audience, price, description } = req.body;
  const ticket = await Ticket.create({ group, audience, price, description });
  res.status(201).json(ticket);
});

const update = asyncHandler(async (req, res) => {
  const { group, audience, price, description } = req.body;
  const ticket = await Ticket.findByIdAndUpdate(
    req.params.id,
    { group, audience, price, description },
    { new: true }
  );
  res.json(ticket);
});

const remove = asyncHandler(async (req, res) => {
  await Ticket.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = { list, create, update, remove };

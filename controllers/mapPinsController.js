const MapPin = require("../models/MapPin");
const { asyncHandler } = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const items = await MapPin.find();
  res.json(items);
});

const create = asyncHandler(async (req, res) => {
  const { label, x, y, description, isCommon } = req.body;
  const pin = await MapPin.create({ label, x, y, description, isCommon });
  res.status(201).json(pin);
});

const update = asyncHandler(async (req, res) => {
  const { label, x, y, description, isCommon } = req.body;
  const pin = await MapPin.findByIdAndUpdate(
    req.params.id,
    { label, x, y, description, isCommon },
    { new: true }
  );
  res.json(pin);
});

const remove = asyncHandler(async (req, res) => {
  await MapPin.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = { list, create, update, remove };

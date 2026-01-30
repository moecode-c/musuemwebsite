const Testimonial = require("../models/Testimonial");
const { asyncHandler } = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const items = await Testimonial.find();
  res.json(items);
});

const create = asyncHandler(async (req, res) => {
  const { name, message, rating } = req.body;
  const testimonial = await Testimonial.create({ name, message, rating });
  res.status(201).json(testimonial);
});

const update = asyncHandler(async (req, res) => {
  const { name, message, rating } = req.body;
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, { name, message, rating }, { new: true });
  res.json(testimonial);
});

const remove = asyncHandler(async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = { list, create, update, remove };

const Product = require("../models/Product");
const { asyncHandler } = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const items = await Product.find();
  res.json(items);
});

const create = asyncHandler(async (req, res) => {
  const { name, description, price, stock } = req.body;
  const imageFile = req.file;
  const imageUrl = imageFile ? `/assets/uploads/${imageFile.filename}` : req.body.imageUrl;
  const product = await Product.create({ name, description, price, stock, imageUrl });
  res.status(201).json(product);
});

const update = asyncHandler(async (req, res) => {
  const { name, description, price, stock } = req.body;
  const imageFile = req.file;
  const updates = { name, description, price, stock };
  if (imageFile) updates.imageUrl = `/assets/uploads/${imageFile.filename}`;
  const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.json(product);
});

const remove = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = { list, create, update, remove };

const Collection = require("../models/Collection");
const { asyncHandler } = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const items = await Collection.find();
  res.json(items);
});

const create = asyncHandler(async (req, res) => {
  const { title, summary } = req.body;
  const imageFile = req.file;
  const imageUrl = imageFile ? `/assets/uploads/${imageFile.filename}` : req.body.imageUrl;
  const collection = await Collection.create({ title, summary, imageUrl });
  res.status(201).json(collection);
});

const update = asyncHandler(async (req, res) => {
  const { title, summary } = req.body;
  const imageFile = req.file;
  const updates = { title, summary };
  if (imageFile) updates.imageUrl = `/assets/uploads/${imageFile.filename}`;
  const collection = await Collection.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.json(collection);
});

const remove = asyncHandler(async (req, res) => {
  await Collection.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = { list, create, update, remove };

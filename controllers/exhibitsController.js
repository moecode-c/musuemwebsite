const Exhibit = require("../models/Exhibit");
const { asyncHandler } = require("../utils/asyncHandler");

const parseCoordinate = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const numeric = Number(value);
  return Number.isNaN(numeric) ? undefined : numeric;
};

const list = asyncHandler(async (req, res) => {
  const items = await Exhibit.find();
  res.json(items);
});

const create = asyncHandler(async (req, res) => {
  const { title, category, description, era } = req.body;
  const imageUrl = req.file && req.file.fieldname === "image" ? `/assets/uploads/${req.file.filename}` : req.body.imageUrl;
  const modelUrl = req.body.modelUrl || "";
  const x = parseCoordinate(req.body.x);
  const y = parseCoordinate(req.body.y);
  const exhibit = await Exhibit.create({ title, category, description, era, imageUrl, modelUrl, x, y });
  res.status(201).json(exhibit);
});

const createWithFiles = asyncHandler(async (req, res) => {
  const { title, category, description, era } = req.body;
  const imageFile = req.files?.image?.[0];
  const modelFile = req.files?.model?.[0];
  const imageUrl = imageFile ? `/assets/uploads/${imageFile.filename}` : "";
  const modelUrl = modelFile ? `/assets/uploads/${modelFile.filename}` : "";
  const x = parseCoordinate(req.body.x);
  const y = parseCoordinate(req.body.y);
  const exhibit = await Exhibit.create({ title, category, description, era, imageUrl, modelUrl, x, y });
  res.status(201).json(exhibit);
});

const update = asyncHandler(async (req, res) => {
  const { title, category, description, era } = req.body;
  const imageFile = req.files?.image?.[0];
  const modelFile = req.files?.model?.[0];
  const updates = { title, category, description, era };
  const x = parseCoordinate(req.body.x);
  const y = parseCoordinate(req.body.y);
  if (x !== undefined) updates.x = x;
  if (y !== undefined) updates.y = y;
  if (imageFile) updates.imageUrl = `/assets/uploads/${imageFile.filename}`;
  if (modelFile) updates.modelUrl = `/assets/uploads/${modelFile.filename}`;
  const exhibit = await Exhibit.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.json(exhibit);
});

const remove = asyncHandler(async (req, res) => {
  await Exhibit.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = { list, create, createWithFiles, update, remove };

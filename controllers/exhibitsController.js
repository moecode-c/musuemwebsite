const Exhibit = require("../models/Exhibit");
const { asyncHandler } = require("../utils/asyncHandler");
const { uploadBuffer } = require("../utils/cloudinaryUpload");

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
  const { title, category, description, era, period, location } = req.body;
  let imageUrl = req.body.imageUrl || "";
  const modelUrl = req.body.modelUrl || "";

  if (req.file && req.file.fieldname === "image") {
    const imageUpload = await uploadBuffer(req.file.buffer, {
      folder: "exhibits/images",
      resource_type: "image",
      originalFilename: req.file.originalname,
      requireCloudinary: true
    });
    imageUrl = imageUpload.secure_url;
  }

  if (!imageUrl || !modelUrl) {
    return res.status(400).json({ message: "Image and 3D model are required." });
  }

  const x = parseCoordinate(req.body.x);
  const y = parseCoordinate(req.body.y);
  const exhibit = await Exhibit.create({ title, category, description, era, period, location, imageUrl, modelUrl, x, y });
  res.status(201).json(exhibit);
});

const createWithFiles = asyncHandler(async (req, res) => {
  const { title, category, description, era, period, location } = req.body;
  const imageFile = req.files?.image?.[0];
  const modelFile = req.files?.model?.[0];
  const imageUpload = imageFile
    ? await uploadBuffer(imageFile.buffer, {
      folder: "exhibits/images",
      resource_type: "image",
      originalFilename: imageFile.originalname,
      requireCloudinary: true
    })
    : null;
  const modelUpload = modelFile
    ? await uploadBuffer(modelFile.buffer, {
      folder: "exhibits/models",
      resource_type: "raw",
      originalFilename: modelFile.originalname,
      requireCloudinary: true
    })
    : null;

  const imageUrl = imageUpload?.secure_url || req.body.imageUrl || "";
  const modelUrl = modelUpload?.secure_url || req.body.modelUrl || "";

  if (!imageUrl || !modelUrl) {
    return res.status(400).json({ message: "Image and 3D model are required." });
  }

  const x = parseCoordinate(req.body.x);
  const y = parseCoordinate(req.body.y);
  const exhibit = await Exhibit.create({ title, category, description, era, period, location, imageUrl, modelUrl, x, y });
  res.status(201).json(exhibit);
});

const update = asyncHandler(async (req, res) => {
  const { title, category, description, era, period, location } = req.body;
  const imageFile = req.files?.image?.[0];
  const modelFile = req.files?.model?.[0];
  const updates = { title, category, description, era, period, location };
  const x = parseCoordinate(req.body.x);
  const y = parseCoordinate(req.body.y);
  if (x !== undefined) updates.x = x;
  if (y !== undefined) updates.y = y;
  if (imageFile) {
    const imageUpload = await uploadBuffer(imageFile.buffer, {
      folder: "exhibits/images",
      resource_type: "image",
      originalFilename: imageFile.originalname,
      requireCloudinary: true
    });
    updates.imageUrl = imageUpload.secure_url;
  }

  if (modelFile) {
    const modelUpload = await uploadBuffer(modelFile.buffer, {
      folder: "exhibits/models",
      resource_type: "raw",
      originalFilename: modelFile.originalname,
      requireCloudinary: true
    });
    updates.modelUrl = modelUpload.secure_url;
  }

  const exhibit = await Exhibit.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.json(exhibit);
});

const remove = asyncHandler(async (req, res) => {
  await Exhibit.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = { list, create, createWithFiles, update, remove };

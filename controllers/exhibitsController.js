const Exhibit = require("../models/Exhibit");
const { asyncHandler } = require("../utils/asyncHandler");
const { uploadBuffer } = require("../utils/cloudinaryUpload");

const EXHIBIT_CATEGORY_ALIASES = {
  pharaoh: "Pharaoh",
  pharaonic: "Pharaoh",
  islamic: "Islamic",
  christian: "Christian",
  coptic: "Christian"
};

const normalizeExhibitCategory = (value) => {
  if (typeof value !== "string") return "";
  const normalized = value.trim().toLowerCase();
  if (!normalized) return "";
  return EXHIBIT_CATEGORY_ALIASES[normalized] || value.trim();
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseCoordinate = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const numeric = Number(value);
  return Number.isNaN(numeric) ? undefined : numeric;
};

const list = asyncHandler(async (req, res) => {
  const category = normalizeExhibitCategory(req.query.category);
  const queryText = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const filter = {};

  if (category) {
    filter.category = new RegExp(`^${escapeRegex(category)}$`, "i");
  }

  if (queryText) {
    const searchRegex = new RegExp(escapeRegex(queryText), "i");
    filter.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { era: searchRegex },
      { period: searchRegex },
      { location: searchRegex }
    ];
  }

  const items = await Exhibit.find(filter).sort({ createdAt: -1 });
  res.json(items);
});

// Creating an exhibit requires BOTH an uploaded image AND an uploaded 3D model
// file. Image-only (or URL-only) submissions are rejected — both files are
// mandatory. This is the single create path; the form posts `image` + `model`
// multipart fields to it.
const create = asyncHandler(async (req, res) => {
  const { title, category, description, era, period, location } = req.body;
  const normalizedCategory = normalizeExhibitCategory(category) || category;
  const imageFile = req.files?.image?.[0];
  const modelFile = req.files?.model?.[0];

  if (!imageFile || !modelFile) {
    return res.status(400).json({
      message: "Both an image and a 3D model file are required to create an exhibit."
    });
  }

  const imageUpload = await uploadBuffer(imageFile.buffer, {
    folder: "exhibits/images",
    resource_type: "image",
    originalFilename: imageFile.originalname,
    requireCloudinary: true
  });
  const modelUpload = await uploadBuffer(modelFile.buffer, {
    folder: "exhibits/models",
    resource_type: "raw",
    originalFilename: modelFile.originalname,
    requireCloudinary: true
  });

  const x = parseCoordinate(req.body.x);
  const y = parseCoordinate(req.body.y);
  const exhibit = await Exhibit.create({
    title,
    category: normalizedCategory,
    description,
    era,
    period,
    location,
    imageUrl: imageUpload.secure_url,
    modelUrl: modelUpload.secure_url,
    x,
    y
  });
  res.status(201).json(exhibit);
});

const update = asyncHandler(async (req, res) => {
  const { title, category, description, era, period, location } = req.body;
  const normalizedCategory = normalizeExhibitCategory(category) || category;
  const imageFile = req.files?.image?.[0];
  const modelFile = req.files?.model?.[0];
  const updates = {
    title,
    category: normalizedCategory,
    description,
    era,
    period,
    location
  };
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

module.exports = { list, create, update, remove };

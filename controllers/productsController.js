const Product = require("../models/Product");
const { asyncHandler } = require("../utils/asyncHandler");
const { uploadBuffer } = require("../utils/cloudinaryUpload");

const list = asyncHandler(async (req, res) => {
  const items = await Product.find();
  res.json(items);
});

const create = asyncHandler(async (req, res) => {
  const { name, description, price, stock } = req.body;
  const imageFile = req.file;

  let imageUrl = req.body.imageUrl || "";
  if (imageFile) {
    const imageUpload = await uploadBuffer(imageFile.buffer, {
      folder: "products/images",
      resource_type: "image",
      originalFilename: imageFile.originalname,
      requireCloudinary: true
    });
    imageUrl = imageUpload.secure_url;
  }

  if (!imageUrl) {
    return res.status(400).json({ message: "Product image is required." });
  }

  const product = await Product.create({ name, description, price, stock, imageUrl });
  res.status(201).json(product);
});

const update = asyncHandler(async (req, res) => {
  const { name, description, price, stock } = req.body;
  const imageFile = req.file;
  const updates = { name, description, price, stock };

  if (imageFile) {
    const imageUpload = await uploadBuffer(imageFile.buffer, {
      folder: "products/images",
      resource_type: "image",
      originalFilename: imageFile.originalname,
      requireCloudinary: true
    });
    updates.imageUrl = imageUpload.secure_url;
  }

  const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.json(product);
});

const remove = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = { list, create, update, remove };

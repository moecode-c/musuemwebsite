const bcrypt = require("bcrypt");
const User = require("../models/User");
const { asyncHandler } = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

const create = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash, role: role || "user" });
  res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
});

const update = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const updates = { name, email, role };
  if (password) {
    updates.password = await bcrypt.hash(password, 10);
  }
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
  res.json(user);
});

const remove = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = { list, create, update, remove };

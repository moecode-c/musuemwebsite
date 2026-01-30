const Newsletter = require("../models/Newsletter");
const { asyncHandler } = require("../utils/asyncHandler");

const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const existing = await Newsletter.findOne({ email });
  if (existing) {
    return res.json({ message: "Already subscribed" });
  }
  await Newsletter.create({ email });
  res.json({ message: "Subscribed" });
});

module.exports = { subscribe };

const CleaningZone = require("../models/CleaningZone");
const { asyncHandler } = require("../utils/asyncHandler");
const { hasPermission } = require("../middleware/roles");

const parsePolygon = (polygonInput) => {
  if (Array.isArray(polygonInput)) {
    return polygonInput
      .map((point) => ({ x: Number(point.x), y: Number(point.y) }))
      .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
  }

  if (typeof polygonInput === "string" && polygonInput.trim().length) {
    try {
      const parsed = JSON.parse(polygonInput);
      if (Array.isArray(parsed)) {
        return parsed
          .map((point) => ({ x: Number(point.x), y: Number(point.y) }))
          .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
      }
    } catch (error) {
      return [];
    }
  }

  return [];
};

const list = asyncHandler(async (req, res) => {
  const role = req.session.user.role;
  const userId = req.session.user.id;
  const canManage = hasPermission(role, "zone:manage");
  const filter = {};

  if (!canManage || req.query.mine === "true") {
    filter.assignedTo = userId;
    filter.isActive = true;
  }

  const zones = await CleaningZone.find(filter)
    .populate("assignedTo", "name email role")
    .populate("assignedBy", "name email role")
    .sort({ createdAt: -1 });

  res.json(zones);
});

const create = asyncHandler(async (req, res) => {
  const zone = await CleaningZone.create({
    zoneName: req.body.zoneName,
    description: req.body.description || "",
    floor: req.body.floor || "Ground",
    color: req.body.color || "#b7842a",
    polygon: parsePolygon(req.body.polygon),
    isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true
  });

  res.status(201).json(zone);
});

const update = asyncHandler(async (req, res) => {
  const updates = {
    zoneName: req.body.zoneName,
    description: req.body.description,
    floor: req.body.floor,
    color: req.body.color,
    isActive: req.body.isActive
  };

  if (req.body.polygon !== undefined) {
    updates.polygon = parsePolygon(req.body.polygon);
  }

  Object.keys(updates).forEach((key) => {
    if (updates[key] === undefined) {
      delete updates[key];
    }
  });

  const zone = await CleaningZone.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!zone) {
    return res.status(404).json({ message: "Zone not found" });
  }

  return res.json(zone);
});

const assign = asyncHandler(async (req, res) => {
  const zone = await CleaningZone.findById(req.params.id);
  if (!zone) {
    return res.status(404).json({ message: "Zone not found" });
  }

  zone.assignedTo = req.body.assignedTo || null;
  zone.assignedBy = req.body.assignedTo ? req.session.user.id : null;
  zone.assignedAt = req.body.assignedTo ? new Date() : null;
  await zone.save();

  const populated = await zone.populate("assignedTo", "name email role");
  return res.json(populated);
});

const remove = asyncHandler(async (req, res) => {
  await CleaningZone.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = {
  list,
  create,
  update,
  assign,
  remove
};

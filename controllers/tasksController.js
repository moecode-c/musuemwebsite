const mongoose = require("mongoose");
const Task = require("../models/Task");
const { asyncHandler } = require("../utils/asyncHandler");
const { hasPermission } = require("../middleware/roles");

const normalizeChecklist = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
};

const canManageAllTasks = (role) => hasPermission(role, "task:view_any");

const list = asyncHandler(async (req, res) => {
  const role = req.session.user.role;
  const userId = req.session.user.id;
  const filter = {};

  if (!canManageAllTasks(role)) {
    filter.assignedTo = userId;
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.assignedTo && canManageAllTasks(role) && mongoose.Types.ObjectId.isValid(req.query.assignedTo)) {
    filter.assignedTo = req.query.assignedTo;
  }

  const tasks = await Task.find(filter)
    .populate("assignedTo", "name email role")
    .populate("assignedBy", "name email role")
    .populate("zoneId", "zoneName floor color description")
    .sort({ createdAt: -1 });

  res.json(tasks);
});

const create = asyncHandler(async (req, res) => {
  const payload = {
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    dueAt: req.body.dueAt || null,
    assignedTo: req.body.assignedTo,
    assignedBy: req.session.user.id,
    roleTarget: req.body.roleTarget || "",
    zoneId: req.body.zoneId || null,
    checklist: normalizeChecklist(req.body.checklist)
  };

  if (payload.assignedTo) {
    payload.status = "assigned";
  }

  const task = await Task.create(payload);
  res.status(201).json(task);
});

const update = asyncHandler(async (req, res) => {
  const updates = {
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    dueAt: req.body.dueAt || null,
    assignedTo: req.body.assignedTo,
    roleTarget: req.body.roleTarget || "",
    zoneId: req.body.zoneId || null,
    checklist: normalizeChecklist(req.body.checklist)
  };

  Object.keys(updates).forEach((key) => {
    if (updates[key] === undefined) {
      delete updates[key];
    }
  });

  if (updates.assignedTo) {
    updates.status = "assigned";
  }

  const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  return res.json(task);
});

const remove = asyncHandler(async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

const updateStatus = asyncHandler(async (req, res) => {
  const role = req.session.user.role;
  const userId = String(req.session.user.id);
  const { status, completionNote, proofPhotos } = req.body;

  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const isOwner = String(task.assignedTo) === userId;
  const isManager = canManageAllTasks(role);

  if (!isOwner && !isManager) {
    return res.status(403).json({ message: "Access denied" });
  }

  const allowedByEmployee = ["assigned", "in_progress", "completed"];
  if (!isManager && !allowedByEmployee.includes(status)) {
    return res.status(422).json({ message: "Invalid status" });
  }

  if (!isManager && task.status === "new" && status === "completed") {
    return res.status(422).json({ message: "Task must be in progress before completion" });
  }

  if (role === "janitor" && status === "completed" && !completionNote && !(Array.isArray(proofPhotos) && proofPhotos.length)) {
    return res.status(422).json({ message: "Janitor completion requires note or photo proof" });
  }

  task.status = status;

  if (completionNote !== undefined) {
    task.completionNote = completionNote;
  }

  if (Array.isArray(proofPhotos)) {
    task.proofPhotos = proofPhotos.map((item) => String(item).trim()).filter(Boolean);
  }

  if (status === "completed") {
    task.completedAt = new Date();
  }

  if (status === "verified") {
    task.verifiedAt = new Date();
  }

  await task.save();
  return res.json(task);
});

module.exports = {
  list,
  create,
  update,
  remove,
  updateStatus
};

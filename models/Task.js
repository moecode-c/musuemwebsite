const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium"
    },
    status: {
      type: String,
      enum: ["new", "assigned", "in_progress", "completed", "verified"],
      default: "new"
    },
    dueAt: { type: Date, default: null },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    roleTarget: { type: String, trim: true, default: "" },
    zoneId: { type: mongoose.Schema.Types.ObjectId, ref: "CleaningZone", default: null },
    checklist: [{ type: String, trim: true }],
    proofPhotos: [{ type: String, trim: true }],
    completionNote: { type: String, trim: true, default: "" },
    completedAt: { type: Date, default: null },
    verifiedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);

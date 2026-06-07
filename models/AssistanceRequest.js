const mongoose = require("mongoose");

const assistanceRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    date: { type: String, default: "" },
    type: {
      type: String,
      enum: ["wheelchair", "listening", "visual", "sensory", "other"],
      default: "other"
    },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "in_progress", "resolved"],
      default: "new"
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AssistanceRequest", assistanceRequestSchema);

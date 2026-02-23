const mongoose = require("mongoose");

const roleValues = [
  "user",
  "admin",
  "museum_manager",
  "curator",
  "front_desk",
  "security_officer",
  "maintenance_technician",
  "janitor",
  "educator_guide"
];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: roleValues, default: "user" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

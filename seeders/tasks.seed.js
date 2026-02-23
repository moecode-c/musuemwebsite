const Task = require("../models/Task");
const User = require("../models/User");
const CleaningZone = require("../models/CleaningZone");

const seedTasks = async () => {
  const manager = await User.findOne({ role: "museum_manager" });
  const janitor = await User.findOne({ role: "janitor" });
  const curator = await User.findOne({ role: "curator" });
  const zone = await CleaningZone.findOne({ zoneName: "Main Entrance Hall" });

  if (!manager) return;

  const tasks = [
    {
      title: "Morning entrance cleaning",
      description: "Complete full cleaning cycle before opening hours.",
      priority: "high",
      status: "assigned",
      assignedBy: manager._id,
      assignedTo: janitor ? janitor._id : manager._id,
      roleTarget: "janitor",
      zoneId: zone ? zone._id : null,
      checklist: ["Sweep floor", "Sanitize railings", "Check trash bins"],
      dueAt: new Date(Date.now() + 4 * 60 * 60 * 1000)
    },
    {
      title: "Artifact label QA review",
      description: "Review and verify new labels in Islamic collection.",
      priority: "medium",
      status: "assigned",
      assignedBy: manager._id,
      assignedTo: curator ? curator._id : manager._id,
      roleTarget: "curator",
      checklist: ["Cross-check dates", "Verify bilingual text", "Report corrections"],
      dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  ];

  await Task.insertMany(tasks);
};

module.exports = { seedTasks };

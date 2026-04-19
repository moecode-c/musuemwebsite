const CleaningZone = require("../models/CleaningZone");
const User = require("../models/User");

const seedCleaningZones = async () => {
  const janitor = await User.findOne({ role: "janitor" });
  const manager = await User.findOne({ role: "museum_manager" });

  await CleaningZone.insertMany([
    {
      zoneName: "Main Entrance Hall",
      description: "Daily entrance cleaning and sanitization",
      floor: "Ground",
      polygon: [
        { x: 10, y: 18 },
        { x: 33, y: 20 },
        { x: 30, y: 34 },
        { x: 12, y: 32 }
      ],
      assignedTo: janitor ? janitor._id : null,
      assignedBy: manager ? manager._id : null,
      assignedAt: janitor && manager ? new Date() : null
    },
    {
      zoneName: "Pharaoh Gallery East Wing",
      description: "Gallery aisle and display perimeter cleaning",
      floor: "1",
      polygon: [
        { x: 52, y: 24 },
        { x: 77, y: 26 },
        { x: 74, y: 44 },
        { x: 50, y: 41 }
      ]
    }
  ]);
};

module.exports = { seedCleaningZones };

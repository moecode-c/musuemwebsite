const Exhibit = require("../models/Exhibit");

const seedExhibits = async () => {
  await Exhibit.insertMany([
    {
      title: "Golden Mask of Tutankhamun",
      category: "Pharaoh",
      description: "A masterpiece of ancient gold craftsmanship and royal symbolism.",
      imageUrl: "/assets/hero.svg",
      modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
      era: "New Kingdom"
    },
    {
      title: "Mamluk Lanterns",
      category: "Islamic",
      description: "Ornate glasswork illuminating Cairo's historic mosques.",
      imageUrl: "/assets/hero.svg",
      modelUrl: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
      era: "Islamic Era"
    },
    {
      title: "Christian Egypt Gallery",
      category: "Christian",
      description: "Icons, textiles, and devotional art from Egypt's Christian heritage.",
      imageUrl: "/assets/hero.svg",
      modelUrl: "https://modelviewer.dev/shared-assets/models/Chair.glb",
      era: "Christian Era"
    }
  ]);
};

module.exports = { seedExhibits };

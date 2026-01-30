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
      title: "Modern Egypt Gallery",
      category: "Modern",
      description: "Contemporary art reflecting Egypt's evolving identity.",
      imageUrl: "/assets/hero.svg",
      modelUrl: "https://modelviewer.dev/shared-assets/models/Chair.glb",
      era: "Modern Era"
    }
  ]);
};

module.exports = { seedExhibits };

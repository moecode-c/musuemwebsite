/**
 * Static sample datasets used to seed the database in some integration tests and
 * in the E2E test server. Kept deliberately small and deterministic.
 */
module.exports = {
  products: [
    { name: "Ankh Pendant", description: "Sterling silver pendant.", price: 350, imageUrl: "/assets/hero.svg", stock: 20 },
    { name: "Papyrus Scroll", description: "Handmade papyrus art.", price: 200, imageUrl: "/assets/hero.svg", stock: 50 },
    { name: "Scarab Replica", description: "Collector-quality scarab replica.", price: 120, imageUrl: "/assets/hero.svg", stock: 0 },
  ],
  exhibits: [
    {
      title: "Golden Mask of Tutankhamun",
      category: "Pharaoh",
      description: "A masterpiece of ancient gold craftsmanship and royal symbolism.",
      imageUrl: "/assets/hero.svg",
      modelUrl: "https://example.com/models/mask.glb",
      era: "New Kingdom",
    },
    {
      title: "Mamluk Lanterns",
      category: "Islamic",
      description: "Ornate glasswork illuminating Cairo's historic mosques.",
      imageUrl: "/assets/hero.svg",
      modelUrl: "https://example.com/models/lantern.glb",
      era: "Islamic Era",
    },
  ],
  testimonials: [
    { name: "Laila", message: "A breathtaking journey through time.", rating: 5 },
    { name: "Omar", message: "The 3D exhibits were unforgettable.", rating: 5 },
  ],
  tickets: [
    { group: "egyptian", audience: "adult", price: 50, description: "Egyptian adult ticket" },
    { group: "foreigner", audience: "adult", price: 300, description: "Foreigner adult ticket" },
  ],
  mapPins: [
    { label: "Main Entrance", x: 20, y: 30, description: "Ticketing and security gate.", isCommon: true },
    { label: "Pharaoh Hall", x: 60, y: 40, description: "Royal artifacts and mummies.", isCommon: false },
  ],
};

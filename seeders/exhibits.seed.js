const Exhibit = require("../models/Exhibit");

const seedExhibits = async () => {
  await Exhibit.insertMany([
    {
      title: "Golden Mask of Tutankhamun",
      category: "Pharaoh",
      description: "A masterpiece of royal goldsmithing that symbolizes kingship and divine protection.",
      imageUrl: "/assets/images/20260130_1955_Image Generation_simple_compose_01kg80pd3rfrhvfa20nx9gk66h.png",
      modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
      era: "New Kingdom",
      period: "18th Dynasty",
      location: "Valley of the Kings",
      x: 68,
      y: 46
    },
    {
      title: "Narmer Palette",
      category: "Pharaoh",
      description: "Ceremonial palette recording the unification of Upper and Lower Egypt.",
      imageUrl: "/assets/images/pillarsbg.png",
      modelUrl: "https://modelviewer.dev/shared-assets/models/Chair.glb",
      era: "Early Dynastic",
      period: "c. 3100 BCE",
      location: "Hierakonpolis",
      x: 63,
      y: 43
    },
    {
      title: "Khafre Enthroned Statue",
      category: "Pharaoh",
      description: "Diorite royal portrait emphasizing eternal kingship and state order.",
      imageUrl: "/assets/images/pyramidsbg.png",
      modelUrl: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
      era: "Old Kingdom",
      period: "4th Dynasty",
      location: "Giza",
      x: 66,
      y: 45
    },
    {
      title: "Djoser Step Pyramid Relief",
      category: "Pharaoh",
      description: "Architectural fragments from Egypt's earliest monumental stone complex.",
      imageUrl: "/assets/images/pyramidsbg.png",
      modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
      era: "Old Kingdom",
      period: "3rd Dynasty",
      location: "Saqqara",
      x: 61,
      y: 44
    },
    {
      title: "Hatshepsut Temple Panels",
      category: "Pharaoh",
      description: "Painted and carved panels depicting ritual processions and trade missions.",
      imageUrl: "/assets/images/pillarsbg.png",
      modelUrl: "https://modelviewer.dev/shared-assets/models/Chair.glb",
      era: "New Kingdom",
      period: "18th Dynasty",
      location: "Deir el-Bahari",
      x: 69,
      y: 41
    },
    {
      title: "Book of the Dead Papyrus",
      category: "Pharaoh",
      description: "Illustrated funerary manuscript guiding the soul through judgment and rebirth.",
      imageUrl: "/assets/images/desertmap.png",
      modelUrl: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
      era: "New Kingdom",
      period: "19th Dynasty",
      location: "Thebes",
      x: 71,
      y: 39
    },
    {
      title: "Canopic Jar Ensemble",
      category: "Pharaoh",
      description: "Ritual vessels connected to embalming rites and sacred protection symbolism.",
      imageUrl: "/assets/images/20260130_1955_Image Generation_simple_compose_01kg80pd3rfrhvfa20nx9gk66h.png",
      modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
      era: "Middle Kingdom",
      period: "12th Dynasty",
      location: "Abydos",
      x: 64,
      y: 40
    },
    {
      title: "Rosetta Stone Decree",
      category: "Pharaoh",
      description: "Multilingual decree that enabled modern decipherment of hieroglyphic writing.",
      imageUrl: "/assets/images/desertmap.png",
      modelUrl: "https://modelviewer.dev/shared-assets/models/Chair.glb",
      era: "Ptolemaic",
      period: "196 BCE",
      location: "Rosetta",
      x: 59,
      y: 47
    },
    {
      title: "Mamluk Lanterns",
      category: "Islamic",
      description: "Ornate glass lamps that illuminated major mosques and madrasa halls.",
      imageUrl: "/assets/images/pillarsbg.png",
      modelUrl: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
      era: "Islamic Era",
      period: "Mamluk Sultanate",
      location: "Historic Cairo",
      x: 48,
      y: 35
    },
    {
      title: "Kufic Quran Folio",
      category: "Islamic",
      description: "Early Qur'anic calligraphy representing foundational Islamic manuscript culture.",
      imageUrl: "/assets/images/desertmap.png",
      modelUrl: "https://modelviewer.dev/shared-assets/models/Chair.glb",
      era: "Early Islamic",
      period: "8th-9th Century",
      location: "Fustat",
      x: 46,
      y: 33
    },
    {
      title: "Fatimid Carved Wood Minbar",
      category: "Islamic",
      description: "Intricately carved geometric panels from ceremonial mosque furnishings.",
      imageUrl: "/assets/images/pillarsbg.png",
      modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
      era: "Fatimid",
      period: "10th-12th Century",
      location: "Cairo",
      x: 49,
      y: 36
    },
    {
      title: "Ayyubid Bronze Basin",
      category: "Islamic",
      description: "Luxury metalwork vessel decorated with inscriptions and courtly motifs.",
      imageUrl: "/assets/images/20260130_1955_Image Generation_simple_compose_01kg80pd3rfrhvfa20nx9gk66h.png",
      modelUrl: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
      era: "Ayyubid",
      period: "12th-13th Century",
      location: "Cairo Citadel",
      x: 51,
      y: 34
    },
    {
      title: "Ottoman Iznik Tile Panel",
      category: "Islamic",
      description: "Vibrant ceramic tilework reflecting Ottoman floral and arabesque design.",
      imageUrl: "/assets/images/pyramidsbg.png",
      modelUrl: "https://modelviewer.dev/shared-assets/models/Chair.glb",
      era: "Ottoman",
      period: "16th-17th Century",
      location: "Cairo",
      x: 45,
      y: 37
    },
    {
      title: "Coptic Icon of the Virgin",
      category: "Christian",
      description: "Devotional icon painting with layered symbolism in Coptic liturgical tradition.",
      imageUrl: "/assets/images/20260130_1955_Image Generation_simple_compose_01kg80pd3rfrhvfa20nx9gk66h.png",
      modelUrl: "https://modelviewer.dev/shared-assets/models/Chair.glb",
      era: "Christian Era",
      period: "Medieval Coptic",
      location: "Old Cairo",
      x: 74,
      y: 26
    },
    {
      title: "Monastic Textile Fragment",
      category: "Christian",
      description: "Woven liturgical textile preserving monastic visual language and symbolism.",
      imageUrl: "/assets/images/pillarsbg.png",
      modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
      era: "Late Antique",
      period: "6th-8th Century",
      location: "Wadi El Natrun",
      x: 72,
      y: 28
    },
    {
      title: "Processional Cross",
      category: "Christian",
      description: "Bronze cross used in major feasts and ceremonial processions.",
      imageUrl: "/assets/images/desertmap.png",
      modelUrl: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
      era: "Byzantine-Coptic",
      period: "9th-11th Century",
      location: "Alexandria",
      x: 75,
      y: 29
    },
    {
      title: "Gospel Manuscript Page",
      category: "Christian",
      description: "Illuminated manuscript page with Coptic and Greek liturgical annotations.",
      imageUrl: "/assets/images/pyramidsbg.png",
      modelUrl: "https://modelviewer.dev/shared-assets/models/Chair.glb",
      era: "Christian Era",
      period: "12th-13th Century",
      location: "Coptic Cairo",
      x: 73,
      y: 25
    },
    {
      title: "Saints Wall Fresco Fragment",
      category: "Christian",
      description: "Painted chapel fragment depicting saints with characteristic Coptic iconography.",
      imageUrl: "/assets/images/pillarsbg.png",
      modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
      era: "Medieval Coptic",
      period: "13th-14th Century",
      location: "Asyut",
      x: 71,
      y: 27
    }
  ]);
};

module.exports = { seedExhibits };

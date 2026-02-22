const Exhibit = require("../models/Exhibit");
const Product = require("../models/Product");
const Testimonial = require("../models/Testimonial");
const Ticket = require("../models/Ticket");
const MapPin = require("../models/MapPin");
const { asyncHandler } = require("../utils/asyncHandler");
const { getWeather } = require("../utils/apiClient");
const { buildPagination } = require("../utils/pagination");
const toArabicNumber = (value) =>
  String(value).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);


const buildCards = (items, type) => {
  return items
    .map((item) => {
      if (type === "exhibit") {
        return `
          <article class="card">
            <img src="${item.imageUrl}" alt="${item.title}">
            <h3>${item.title}</h3>
            <p>${item.description.substring(0, 120)}...</p>
            <a class="btn" href="/exhibits/${item._id}">View Details</a>
          </article>
        `;
      }
      if (type === "product") {
        return `
          <article class="card">
            <img src="${item.imageUrl}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>EGP ${item.price.toFixed(2)}</p>
            <button class="btn add-to-cart" data-id="${item._id}">Add to Cart</button>
          </article>
        `;
      }
      if (type === "testimonial") {
        return `
          <article class="card testimonial-card">
            <div class="card-quote">
              <i class="fas fa-quote-left nav-icon"></i>
              <p>${item.message}</p>
            </div>
            <div class="card-footer">
              <span class="nav-title testimonial-name">${item.name}</span>
            </div>
          </article>
        `;
      }
      return "";
    })
    .join("");
};

const home = asyncHandler(async (req, res) => {
  const [exhibits, products, testimonials] = await Promise.all([
    Exhibit.find().limit(3),
    Product.find().limit(3),
    Testimonial.find().limit(3)
  ]);
  const weather = await getWeather().catch(() => null);
const isAr = req.session.language === "ar";

const weatherHtml = weather
  ? `<div class="weather-card">${
      isAr
        ? `درجة الحرارة الحالية: ${toArabicNumber(weather.temperature_2m)}°C | سرعة الرياح: ${toArabicNumber(weather.wind_speed_10m)} كم/س`
        : `Current temperature: ${weather.temperature_2m}°C | Wind: ${weather.wind_speed_10m} km/h`
    }</div>`
  : `<div class="weather-card">${isAr ? "بيانات الطقس غير متاحة" : "Weather data unavailable"}</div>`;

  res.render("home", {
    pageTitle: "Home",
    pageCss: "home",
    weatherHtml,
    exhibitsHtml: buildCards(exhibits, "exhibit"),
    productsHtml: buildCards(products, "product"),
    testimonialsHtml: buildCards(testimonials, "testimonial")
  });
});

const about = (req, res) => res.render("about/about", { pageTitle: "About" });
const mission = (req, res) => res.render("about/mission", { pageTitle: "Mission & Goal", pageCss: "mission" });
const accessibility = (req, res) =>
  res.render("about/accessibility", { pageTitle: "Accessibility", pageCss: "accessibility" });
const newsletter = (req, res) => res.render("about/newsletter", { pageTitle: "Newsletter", pageCss: "newsletter" });

const location = asyncHandler(async (req, res) => {
  const [pins, commonPins] = await Promise.all([
    MapPin.find(),
    MapPin.find({ isCommon: true })
  ]);
  const pinsHtml = pins
    .map(
      (pin) => `
      <div class="map-pin" data-x="${pin.x}" data-y="${pin.y}" data-label="${pin.label}" data-description="${pin.description}"></div>
    `
    )
    .join("");
  res.render("about/location", { pageTitle: "Map", pageCss: "location", pinsHtml, commonPins });
});

const categoryConfig = {
  pharaoh: {
    label: "Pharaoh's",
    categoryValue: "Pharaoh",
    subtitle: "Explore royal artifacts, sacred relics, and treasures of the dynasties."
  },
  islamic: {
    label: "Islamic",
    categoryValue: "Islamic",
    subtitle: "Discover artistic traditions, manuscripts, and architectural masterpieces."
  },
  christian: {
    label: "Christian",
    categoryValue: "Christian",
    subtitle: "Experience icons, textiles, and heritage from Egypt's Christian era."
  }
};

const artifactEraInsights = {
  "early dynastic": "State unification and royal symbolism emerged in this phase, shaping the earliest formal dynastic traditions.",
  "old kingdom": "Known for pyramid-building and centralized court workshops, this era refined monumentality and royal funerary arts.",
  "middle kingdom": "A period of reunification and administrative reform with strong growth in literary, temple, and elite craft traditions.",
  "new kingdom": "Egypt's imperial age; expanded diplomacy and warfare fueled major temple projects and luxury workshop production.",
  ptolemaic: "Greek and Egyptian traditions coexisted, producing bilingual administration and hybrid artistic and religious expressions.",
  "early islamic": "Early Islamic Egypt saw growth in manuscript culture, religious institutions, and urban craft production in Fustat.",
  fatimid: "Fatimid Cairo became a major center for calligraphy, carved wood, and ceremonial arts tied to court patronage.",
  ayyubid: "Ayyubid rule strengthened citadel and religious complexes, with metalwork and epigraphy prominent in elite objects.",
  mamluk: "Mamluk patronage made Cairo a global hub of scholarship and craftsmanship, especially in glass and inlaid metalwork.",
  ottoman: "Ottoman-era Egypt remained integrated in Mediterranean exchange networks, visible in ceramics and decorative arts.",
  "late antique": "Late Antique workshops sustained textile and monastic production, preserving religious and regional visual identities.",
  "byzantine-coptic": "Coptic communities adapted Byzantine liturgical and visual forms in devotional objects and church furnishings.",
  "medieval coptic": "Medieval Coptic art preserved icon, fresco, and manuscript traditions through active church and monastic centers.",
  "christian era": "Christian Egyptian heritage reflects long continuity in liturgical art, manuscript production, and monastic life.",
  "islamic era": "Islamic-era material culture in Egypt highlights calligraphy, geometry, and highly specialized craft guild traditions."
};

const artifactCategoryFallback = {
  pharaoh: "Pharaonic collections emphasize kingship, ritual practice, and funerary beliefs across multiple dynasties.",
  islamic: "Islamic collections document urban religious life, manuscript traditions, and refined decorative craftsmanship.",
  christian: "Christian collections preserve Coptic devotional, liturgical, and monastic traditions across centuries."
};

const artifactEraExtraDetails = {
  "early dynastic": {
    significance: "Royal imagery and ceremonial palettes from this period helped establish visual language for kingship in later dynasties.",
    legacy: "Administrative standardization and early hieroglyphic usage laid the foundations of pharaonic state culture."
  },
  "old kingdom": {
    significance: "Monumental stone architecture and elite statuary defined the court-centered aesthetics of the Pyramid Age.",
    legacy: "Workshop conventions in proportion, materials, and funerary symbolism influenced Egyptian art for centuries."
  },
  "middle kingdom": {
    significance: "Cultural revival and political reunification supported temple patronage and refinement of funerary equipment.",
    legacy: "Texts and material culture from this era became reference models for later royal and elite traditions."
  },
  "new kingdom": {
    significance: "Imperial expansion linked Egypt to wider trade networks, increasing diversity in materials and artistic motifs.",
    legacy: "Temple relief programs and elite burial assemblages from this era remain central to understanding state ideology."
  },
  ptolemaic: {
    significance: "Multilingual inscriptions and decrees, including those in multiple scripts, document interactions between Greek and Egyptian administration.",
    legacy: "Ptolemaic evidence was critical for modern epigraphy and historical reconstruction of late pharaonic religious institutions."
  },
  "early islamic": {
    significance: "Early Islamic Egypt shaped new religious, civic, and manuscript practices centered around Fustat and related urban hubs.",
    legacy: "Calligraphic and architectural traditions formed in this phase informed later Fatimid and Mamluk developments."
  },
  fatimid: {
    significance: "Fatimid patronage stimulated high-quality craftsmanship in carved wood, manuscript arts, and ceremonial objects.",
    legacy: "Urban and artistic institutions founded in Fatimid Cairo had long-term influence on later Islamic visual culture in Egypt."
  },
  ayyubid: {
    significance: "Ayyubid military-religious patronage supported architectural and decorative programs across major political centers.",
    legacy: "Metalwork and epigraphic styles from this era bridge earlier Fatimid and later Mamluk artistic traditions."
  },
  mamluk: {
    significance: "Mamluk-era Cairo became a major intellectual and commercial center, reflected in sophisticated glass, metal, and manuscript arts.",
    legacy: "Institutional endowments and workshop systems contributed to durable artistic continuity across late medieval Egypt."
  },
  ottoman: {
    significance: "Ottoman-period works show adaptation of imperial styles to local Egyptian tastes and existing craft practices.",
    legacy: "Ceramic and decorative motifs from this era document Egypt's role in wider Mediterranean artistic exchange."
  },
  "late antique": {
    significance: "Late Antique material reflects transitions in religious life, especially monastic growth and changing devotional practices.",
    legacy: "Textiles, manuscripts, and sacred objects preserve evidence of local communities during a transformative historical phase."
  },
  "byzantine-coptic": {
    significance: "Objects from this period illustrate adaptation of Byzantine forms within distinct Coptic theological and liturgical contexts.",
    legacy: "Church metalwork and icon-related production helped define long-standing Coptic visual traditions."
  },
  "medieval coptic": {
    significance: "Monasteries and churches served as key centers for manuscript production, icon painting, and devotional arts.",
    legacy: "These artistic traditions preserved language, ritual memory, and communal identity across changing political periods."
  },
  "christian era": {
    significance: "Christian-period artifacts document the continuity of Coptic worship, education, and artistic production.",
    legacy: "Their preservation offers rare insight into liturgical life, script traditions, and regional workshop networks."
  },
  "islamic era": {
    significance: "Islamic-era collections in Egypt reveal deep integration of calligraphy, geometry, and religious patronage.",
    legacy: "These works help trace the evolution of urban institutions and artisan knowledge across multiple dynasties."
  }
};

const artifactCategoryExtraFallback = {
  pharaoh: {
    significance: "Pharaonic objects preserve key evidence for royal ideology, funerary theology, and temple-centered ritual systems.",
    legacy: "Their inscriptions and iconography remain primary sources for reconstructing ancient Egyptian governance and belief."
  },
  islamic: {
    significance: "Islamic collections reflect major developments in scholarly, civic, and devotional life across medieval and early modern Egypt.",
    legacy: "Material evidence from these works documents continuity in craftsmanship, epigraphy, and institutional patronage."
  },
  christian: {
    significance: "Christian collections preserve Coptic liturgical and monastic traditions expressed through manuscripts, icons, and ritual objects.",
    legacy: "They provide long-duration evidence of local worship practices and artistic continuity in Egypt."
  }
};

const resolveArtifactEraInfo = (item) => {
  const eraKey = String(item?.era || "").trim().toLowerCase();
  const categoryKey = String(item?.category || "").trim().toLowerCase();
  return (
    artifactEraInsights[eraKey] ||
    artifactCategoryFallback[categoryKey] ||
    "This artifact represents an important phase in Egypt's evolving historical and artistic legacy."
  );
};

const resolveArtifactEraExtras = (item) => {
  const eraKey = String(item?.era || "").trim().toLowerCase();
  const categoryKey = String(item?.category || "").trim().toLowerCase();
  return (
    artifactEraExtraDetails[eraKey] ||
    artifactCategoryExtraFallback[categoryKey] || {
      significance: "This object is part of an important historical context within Egypt's long cultural timeline.",
      legacy: "Ongoing scholarship continues to refine how this artifact is interpreted in relation to its era."
    }
  );
};

const buildExhibitDetailsHref = (id, returnTo) => {
  if (!id) return "/exhibits";
  const safeReturnTo = typeof returnTo === "string" && returnTo.startsWith("/") ? returnTo : "/exhibits";
  return `/exhibits/${id}?returnTo=${encodeURIComponent(safeReturnTo)}`;
};

const buildArtifactCardModel = (item, exhibitsBasePath, returnTo) => ({
  _id: item._id,
  title: item.title,
  imageUrl: item.imageUrl,
  description: item.description || "",
  eraInfo: resolveArtifactEraInfo(item),
  era: item.era,
  period: item.period,
  location: item.location,
  museumLabel: "Egyptian Museum",
  ctaLabel: "View 3D Model Artifact",
  ctaHref: item._id ? buildExhibitDetailsHref(item._id, returnTo) : exhibitsBasePath || "/exhibits"
});

const buildTimelineCardModel = (item, returnTo) => ({
  _id: item._id,
  title: item.title,
  imageUrl: item.imageUrl,
  description: item.description || "",
  era: item.era,
  period: item.period,
  location: item.location,
  ctaLabel: item._id ? "View 3D Model Artifact" : null,
  ctaHref: item._id ? buildExhibitDetailsHref(item._id, returnTo) : null
});

const TARGET_ARTIFACT_CARDS = 8;
const TARGET_TIMELINE_ITEMS = 8;

const renderExhibitsPage = async (req, res, categoryKey, basePath) => {
  const page = parseInt(req.query.page || "1", 10);
  const limit = 8;
  const config = categoryKey ? categoryConfig[categoryKey] : null;
  const filter = config ? { category: new RegExp(`^${config.categoryValue}$`, "i") } : {};
  const total = await Exhibit.countDocuments(filter);
  const totalPages = Math.ceil(total / limit) || 1;
  const items = await Exhibit.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  let cardSourceItems = [...items];

  if (cardSourceItems.length < TARGET_ARTIFACT_CARDS) {
    const existingIds = cardSourceItems.map((item) => item._id);
    const cardFillFilter = {
      ...filter,
      _id: { $nin: existingIds }
    };
    const fillItems = await Exhibit.find(cardFillFilter)
      .sort({ createdAt: -1 })
      .limit(TARGET_ARTIFACT_CARDS - cardSourceItems.length);
    cardSourceItems = [...cardSourceItems, ...fillItems];
  }

  let timelineSourceItems = [...items];

  if (timelineSourceItems.length < TARGET_TIMELINE_ITEMS) {
    const existingIds = timelineSourceItems.map((item) => item._id);
    const timelineFillFilter = {
      ...filter,
      _id: { $nin: existingIds }
    };
    const fillTimelineItems = await Exhibit.find(timelineFillFilter)
      .sort({ createdAt: -1 })
      .limit(TARGET_TIMELINE_ITEMS - timelineSourceItems.length);
    timelineSourceItems = [...timelineSourceItems, ...fillTimelineItems];
  }

  const returnTo = req.originalUrl || basePath || "/exhibits";
  const artifactItems = cardSourceItems.map((item) => buildArtifactCardModel(item, basePath, returnTo));
  const timelineItems = timelineSourceItems.map((item) => buildTimelineCardModel(item, returnTo));

  res.render("exhibits/index", {
    pageTitle: config ? `${config.label} Collection` : "Exhibits",
    pageCss: "exhibits",
    heroTitle: config ? `${config.label} Collection` : "Exhibits",
    heroSubtitle: config ? config.subtitle : "Discover Pharaoh, Islamic, and Christian galleries.",
    exhibits: items,
    timelineItems,
    artifactItems,
    collectionKey: categoryKey || "all",
    exhibitsBasePath: basePath,
    paginationHtml: buildPagination(page, totalPages, basePath)
  });
};

const exhibits = asyncHandler(async (req, res) => {
  const categoryKey = (req.query.category || "").toLowerCase();
  if (categoryKey && categoryConfig[categoryKey]) {
    return renderExhibitsPage(req, res, categoryKey, `/exhibits/${categoryKey}`);
  }
  return renderExhibitsPage(req, res, null, "/exhibits");
});

const exhibitsPharaoh = asyncHandler(async (req, res) => renderExhibitsPage(req, res, "pharaoh", "/exhibits/pharaoh"));
const exhibitsIslamic = asyncHandler(async (req, res) => renderExhibitsPage(req, res, "islamic", "/exhibits/islamic"));
const exhibitsChristian = asyncHandler(async (req, res) => renderExhibitsPage(req, res, "christian", "/exhibits/christian"));

const exhibitDetails = asyncHandler(async (req, res) => {
  const exhibit = await Exhibit.findById(req.params.id);
  if (!exhibit) {
    return res.status(404).render("404", { pageTitle: "Not Found", message: "Exhibit not found" });
  }
  const requestedReturnTo = typeof req.query.returnTo === "string" ? req.query.returnTo : "";
  const backHref = requestedReturnTo.startsWith("/") && !requestedReturnTo.startsWith("//")
    ? requestedReturnTo
    : "/exhibits";
  const eraInfo = resolveArtifactEraInfo(exhibit);
  const eraExtras = resolveArtifactEraExtras(exhibit);
  res.render("exhibits/details", { pageTitle: exhibit.title, pageCss: "exhibits", exhibit, backHref, eraInfo, eraExtras });
});

const virtualTour = (req, res) => res.render("virtual-tour/index", { pageTitle: "Virtual Tour" });
const virtualTourIslamic = (req, res) => res.render("virtual-tour/islamic", { pageTitle: "Islamic Virtual Tour" });
const virtualTourPharaoh = (req, res) => res.render("virtual-tour/pharaoh", { pageTitle: "Pharaohs Virtual Tour" });
const virtualTourChristian = (req, res) => res.render("virtual-tour/christian", { pageTitle: "Christian Virtual Tour" });
const games = (req, res) => res.render("games/index", { pageTitle: "Games" });
const gameQuiz = (req, res) => res.render("games/quiz", { pageTitle: "Quiz Game" });
const gameExplorer = (req, res) => res.render("games/explorer", { pageTitle: "Explorer Game", pageCss: "pyramid-builder" });
const gamePyramid = (req, res) => res.render("games/pyramid", { pageTitle: "Pyramid Builder", pageCss: "pyramid-builder" });

const shop = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page || "1", 10);
  const limit = 6;
  const total = await Product.countDocuments();
  const totalPages = Math.ceil(total / limit) || 1;
  const items = await Product.find()
    .skip((page - 1) * limit)
    .limit(limit);
  res.render("shop/index", {
    pageTitle: "Shop",
    productsHtml: buildCards(items, "product"),
    paginationHtml: buildPagination(page, totalPages, "/shop")
  });
});

const cart = (req, res) => {
  const cartState = req.session.cart || { items: [], total: 0 };
  const itemsHtml = cartState.items
    .map(
      (item) => `
      <div class="cart-item">
        <span>${item.name}</span>
        <span>EGP ${item.price.toFixed(2)}</span>
        <span>Qty: ${item.quantity}</span>
      </div>
    `
    )
    .join("");
  res.render("shop/cart", { pageTitle: "Cart", cartItemsHtml: itemsHtml, total: cartState.total.toFixed(2) });
};

const checkout = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find();
  const groupedTickets = tickets.reduce((acc, ticket) => {
    const key = ticket.group || "egyptian";
    if (!acc[key]) acc[key] = [];
    acc[key].push(ticket);
    return acc;
  }, {});
  const audienceOrder = ["adult", "student", "child", "senior"];
  Object.keys(groupedTickets).forEach((groupKey) => {
    groupedTickets[groupKey].sort(
      (a, b) => audienceOrder.indexOf(a.audience) - audienceOrder.indexOf(b.audience)
    );
  });
  res.render("shop/checkout", {
    pageTitle: "Request Ticket",
    pageCss: "checkout",
    groupedTickets
  });
});

const testimonials = asyncHandler(async (req, res) => {
  const items = await Testimonial.find().limit(10);
  res.render("testimonials/index", {
    pageTitle: "Testimonials",
    pageCss: "testimonials",
    testimonialsHtml: buildCards(items, "testimonial")
  });
});

const planTrip = asyncHandler(async (req, res) => {
  const weather = await getWeather().catch(() => null);
const isAr = req.session.language === "ar";

const weatherHtml = weather
  ? `<div class="weather-card">${
      isAr
        ? `درجة الحرارة الحالية: ${toArabicNumber(weather.temperature_2m)}°C | سرعة الرياح: ${toArabicNumber(weather.wind_speed_10m)} كم/س`
        : `Current temperature: ${weather.temperature_2m}°C | Wind: ${weather.wind_speed_10m} km/h`
    }</div>`
  : `<div class="weather-card">${isAr ? "بيانات الطقس غير متاحة" : "Weather data unavailable"}</div>`;
  const tickets = await Ticket.find();
  const groupOrder = ["egyptian", "arab", "foreigner"];
  const audienceOrder = ["adult", "student", "child", "senior"];
  tickets.sort(
    (a, b) =>
      groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group) ||
      audienceOrder.indexOf(a.audience) - audienceOrder.indexOf(b.audience)
  );
  res.render("plan-trip/index", { pageTitle: "Plan Your Trip", weatherHtml, tickets });
});

module.exports = {
  home,
  about,
  mission,
  accessibility,
  newsletter,
  location,
  exhibits,
  exhibitsPharaoh,
  exhibitsIslamic,
  exhibitsChristian,
  exhibitDetails,
  virtualTour,
  virtualTourIslamic,
  virtualTourPharaoh,
  virtualTourChristian,
  games,
  gameQuiz,
  gameExplorer,
  gamePyramid,
  shop,
  cart,
  checkout,
  testimonials,
  planTrip
};

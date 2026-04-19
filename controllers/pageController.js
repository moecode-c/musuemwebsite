const Exhibit = require("../models/Exhibit");
const Product = require("../models/Product");
const Testimonial = require("../models/Testimonial");
const Ticket = require("../models/Ticket");
const MapPin = require("../models/MapPin");
const fs = require("fs");
const path = require("path");
const { asyncHandler } = require("../utils/asyncHandler");
const { getWeather } = require("../utils/apiClient");
const { buildPagination } = require("../utils/pagination");
const { ROLES } = require("../middleware/roles");
const toArabicNumber = (value) =>
  String(value).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);

const employeeDashboardViewByRole = {
  [ROLES.MUSEUM_MANAGER]: "employee/manager-dashboard",
  [ROLES.CURATOR]: "employee/curator-dashboard",
  [ROLES.FRONT_DESK]: "employee/frontdesk-dashboard",
  [ROLES.SECURITY_OFFICER]: "employee/security-dashboard",
  [ROLES.MAINTENANCE_TECHNICIAN]: "employee/technician-dashboard",
  [ROLES.JANITOR]: "employee/janitor-dashboard",
  [ROLES.EDUCATOR_GUIDE]: "employee/educator-dashboard"
};

const panelLabelByRole = {
  [ROLES.MUSEUM_MANAGER]: "Museum Manager Panel",
  [ROLES.CURATOR]: "Curator Panel",
  [ROLES.FRONT_DESK]: "Front Desk Panel",
  [ROLES.SECURITY_OFFICER]: "Security Officer Panel",
  [ROLES.MAINTENANCE_TECHNICIAN]: "Maintenance Technician Panel",
  [ROLES.JANITOR]: "Janitor Panel",
  [ROLES.EDUCATOR_GUIDE]: "Educator Guide Panel",
  [ROLES.ADMIN]: "Admin Panel"
};

const getPanelLabelByRole = (role) => panelLabelByRole[role] || "Employee Panel";

const DEFAULT_EXHIBIT_IMAGE = "/assets/images/pillarsbg.png";
const PUBLIC_ROOT = path.join(__dirname, "..", "public");

const decodeSafely = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const localAssetExists = (urlPath) => {
  if (typeof urlPath !== "string" || !urlPath.startsWith("/")) return false;

  const cleanPath = urlPath.split("#")[0].split("?")[0];
  const relativePath = cleanPath.replace(/^\/+/, "");
  if (!relativePath) return false;

  const absolutePath = path.resolve(PUBLIC_ROOT, relativePath);
  if (!absolutePath.startsWith(PUBLIC_ROOT)) return false;

  return fs.existsSync(absolutePath);
};

const normalizeImageUrl = (rawUrl, fallback = DEFAULT_EXHIBIT_IMAGE) => {
  if (typeof rawUrl !== "string") return fallback;

  let normalized = rawUrl.trim();
  if (!normalized) return fallback;

  normalized = normalized.replace(/\\/g, "/");

  if (normalized.startsWith("public/")) {
    normalized = normalized.slice("public".length);
  }

  if (/^(https?:)?\/\//i.test(normalized) || normalized.startsWith("data:") || normalized.startsWith("blob:")) {
    return normalized;
  }

  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  // Decode at most twice to recover already-encoded or double-encoded local filenames.
  let decoded = normalized;
  for (let i = 0; i < 2; i += 1) {
    const next = decodeSafely(decoded);
    if (next === decoded) break;
    decoded = next;
  }

  const localPath = decoded.split("#")[0].split("?")[0];
  if (!localAssetExists(localPath)) {
    return fallback;
  }

  // Return a browser-safe local URL without double encoding percent signs.
  return encodeURI(localPath);
};

const shopTypeConfig = {
  books: {
    label: "Books & Materials",
    keywords: ["book", "guide", "catalog", "papyrus", "scroll", "manuscript", "material"],
    heroTitle: "Stories in print, wisdom in every page.",
    heroSubtitle: "Browse scholarly catalogs, illustrated guides, and collectible museum publications.",
    heroTags: ["Curator notes included", "Archive-grade print", "Ideal for researchers"]
  },
  souvenirs: {
    label: "Souvenirs",
    keywords: ["souvenir", "gift", "mug", "postcard", "keychain", "magnet", "keepsake"],
    heroTitle: "Memories you can hold and gift.",
    heroSubtitle: "Take home meaningful keepsakes inspired by iconic artifacts and galleries.",
    heroTags: ["Gift-ready packaging", "Limited artisan runs", "Ships in 48h"]
  },
  replicas: {
    label: "Replicas",
    keywords: ["replica", "statuette", "artifact", "ankh", "scarab", "model"],
    heroTitle: "Iconic forms, faithfully recreated.",
    heroSubtitle: "Discover precision-crafted replicas modeled after treasured museum pieces.",
    heroTags: ["Gallery-inspired design", "Collector quality", "Certificate included"]
  },
  decor: {
    label: "Home Decor",
    keywords: ["decor", "vase", "lamp", "wall", "textile", "cushion", "home"],
    heroTitle: "Turn your home into a gallery corner.",
    heroSubtitle: "Refined decor pieces that blend contemporary interiors with ancient aesthetics.",
    heroTags: ["Design-forward pieces", "Hand-finished details", "Museum-inspired palette"]
  }
};

const defaultShopHero = {
  heroTitle: "Curated relics, crafted keepsakes.",
  heroSubtitle: "Bring home design-forward replicas, artisan-made decor, and exclusive souvenirs inspired by the galleries.",
  heroTags: ["Gallery-approved quality", "Limited artisan runs", "Ships in 48h"]
};

const inferShopType = (item) => {
  const text = `${item?.name || ""} ${item?.description || ""}`.toLowerCase();
  for (const [type, config] of Object.entries(shopTypeConfig)) {
    if (config.keywords.some((keyword) => text.includes(keyword))) {
      return type;
    }
  }
  return "souvenirs";
};

const buildCards = (items, type) => {
  return items
    .map((item) => {
      if (type === "exhibit") {
        const imageUrl = normalizeImageUrl(item.imageUrl);
        return `
          <article class="card">
            <img src="${imageUrl}" alt="${item.title}" onerror="this.onerror=null;this.src='${DEFAULT_EXHIBIT_IMAGE}';">
            <h3>${item.title}</h3>
            <p>${item.description.substring(0, 120)}...</p>
            <a class="btn" href="/exhibits/${item._id}">View Details</a>
          </article>
        `;
      }
      if (type === "product") {
        const productType = inferShopType(item);
        const createdDate = item.createdAt ? new Date(item.createdAt) : null;
        const isNew = createdDate ? Date.now() - createdDate.getTime() < 1000 * 60 * 60 * 24 * 30 : false;
        const isPreorder = item.stock <= 0;
        const preorderDate = isPreorder ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 10) : null;
        const stockLabel = isPreorder ? "Preorder" : item.stock < 5 ? "Low stock" : "In stock";
        const stockClass = isPreorder ? "is-preorder" : item.stock < 5 ? "is-low" : "is-available";
        const baseDescription = item.description || "";
        const preview = baseDescription.substring(0, 110);
        const safeName = item.name.replace(/"/g, "&quot;");
        const safePreview = preview.toLowerCase().replace(/"/g, "&quot;");
        const safeFullDesc = baseDescription.replace(/"/g, "&quot;");

        // Split stock across sizes for per-size visibility
        const sizeLabels = ["S", "M", "L", "XL"];
        const totalStock = Math.max(0, item.stock || 0);
        const sizeBreakdown = sizeLabels.map((label, idx) => {
          const weight = [0.2, 0.35, 0.3, 0.15][idx];
          return {
            size: label,
            qty: isPreorder ? 0 : Math.max(0, Math.round(totalStock * weight))
          };
        });
        const allocated = sizeBreakdown.reduce((sum, s) => sum + s.qty, 0);
        if (!isPreorder && allocated < totalStock) {
          sizeBreakdown[1].qty += totalStock - allocated; // top up M to match total
        }
        const sizeLine = sizeBreakdown
          .filter((s) => s.qty > 0)
          .map((s) => `${s.size}:${s.qty}${s.qty < 3 ? " low" : ""}`)
          .slice(0, 3)
          .join(" · ");
        const sizeJson = JSON.stringify(sizeBreakdown).replace(/"/g, "&quot;");

        return `
          <article class="card product-card" data-id="${item._id}" data-name="${safeName.toLowerCase()}" data-description="${safePreview}" data-description-full="${safeFullDesc}" data-price="${item.price}" data-stock="${item.stock}" data-created="${createdDate ? createdDate.toISOString() : ""}" data-image="${item.imageUrl}" data-sizes="${sizeJson}" data-preorder="${preorderDate ? preorderDate.toISOString() : ""}" data-category="${productType}">
            <div class="card-media">
              <span class="status-badge ${stockClass}">${stockLabel}</span>
              ${isNew ? "<span class=\"status-badge is-new\">New</span>" : ""}
              ${preorderDate ? `<span class="status-badge is-preorder-date">Ships ${preorderDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>` : ""}
              <img src="${item.imageUrl}" alt="${item.name}" loading="lazy">
            </div>
            <div class="card-body">
              <div class="card-top">
                <p class="eyebrow">EGP ${item.price.toFixed(2)}</p>
                <p class="meta">${item.stock > 0 ? `${item.stock} in stock` : "Preorder opens"}</p>
              </div>
              <h3>${item.name}</h3>
              <p class="card-desc">${preview}${baseDescription.length > preview.length ? "..." : ""}</p>
              <p class="meta small">${sizeLine || "Sizes reserved for preorder"}</p>
              <div class="card-actions">
                <div class="price-block">
                  <span class="price">EGP ${item.price.toFixed(2)}</span>
                  <span class="meta small">${preorderDate ? `Preorder · ships ${preorderDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "Ships in 48h · Free returns 14d"}</span>
                </div>
                <button class="btn ghost quick-view" type="button" data-id="${item._id}">Quick view</button>
                <button class="btn add-to-cart" data-id="${item._id}" data-name="${item.name}" ${item.stock <= 0 ? "disabled" : ""}>${item.stock <= 0 ? "Preorder" : "Add to Cart"}</button>
              </div>
            </div>
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
  const isAr = req.cookies.lang === "ar";

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

const about = (req, res) => res.render("about/about", { pageTitle: "About", pageCss: "about" });
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

const exploreAges = (req, res) =>
  res.render("exhibits/explore-ages", {
    pageTitle: "Explore the Ages",
    pageCss: "explore-ages"
  });
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
    significance: "Multilingual inscriptions and decrees document interactions between Greek and Egyptian administration.",
    legacy: "Ptolemaic evidence was critical for modern epigraphy and historical reconstruction of late pharaonic religious institutions."
  },
  "early islamic": {
    significance: "Early Islamic Egypt shaped new religious, civic, and manuscript practices centered around Fustat.",
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
  imageUrl: normalizeImageUrl(item.imageUrl),
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
  imageUrl: normalizeImageUrl(item.imageUrl),
  description: item.description || "",
  era: item.era,
  period: item.period,
  location: item.location,
  ctaLabel: item._id ? "View 3D Model Artifact" : null,
  ctaHref: item._id ? buildExhibitDetailsHref(item._id, returnTo) : null
});

const TARGET_ARTIFACT_CARDS = 8;
const TARGET_TIMELINE_ITEMS = 8;

const getCategoryTitles = (t, categoryKey) => {
  if (!categoryKey) {
    return {
      heroTitle: t.exhibits.allTitle,
      heroSubtitle: t.exhibits.allSubtitle
    };
  }
  const map = {
    pharaoh: { heroTitle: t.exhibits.pharaohTitle, heroSubtitle: t.exhibits.pharaohSubtitle },
    islamic: { heroTitle: t.exhibits.islamicTitle, heroSubtitle: t.exhibits.islamicSubtitle },
    christian: { heroTitle: t.exhibits.christianTitle, heroSubtitle: t.exhibits.christianSubtitle }
  };
  return map[categoryKey] || { heroTitle: t.exhibits.allTitle, heroSubtitle: t.exhibits.allSubtitle };
};

const categoryConfig = {
  pharaoh: { categoryValue: "Pharaoh" },
  islamic: { categoryValue: "Islamic" },
  christian: { categoryValue: "Christian" }
};

const renderExhibitsPage = async (req, res, categoryKey, basePath) => {
  const t = res.locals.t;
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
    const fillItems = await Exhibit.find({ ...filter, _id: { $nin: existingIds } })
      .sort({ createdAt: -1 })
      .limit(TARGET_ARTIFACT_CARDS - cardSourceItems.length);
    cardSourceItems = [...cardSourceItems, ...fillItems];
  }

  let timelineSourceItems = [...items];
  if (timelineSourceItems.length < TARGET_TIMELINE_ITEMS) {
    const existingIds = timelineSourceItems.map((item) => item._id);
    const fillTimelineItems = await Exhibit.find({ ...filter, _id: { $nin: existingIds } })
      .sort({ createdAt: -1 })
      .limit(TARGET_TIMELINE_ITEMS - timelineSourceItems.length);
    timelineSourceItems = [...timelineSourceItems, ...fillTimelineItems];
  }

  const returnTo = req.originalUrl || basePath || "/exhibits";
  const artifactItems = cardSourceItems.map((item) => buildArtifactCardModel(item, basePath, returnTo));
  const timelineItems = timelineSourceItems.map((item) => buildTimelineCardModel(item, returnTo));
  const { heroTitle, heroSubtitle } = getCategoryTitles(t, categoryKey);

  res.render("exhibits/exhibits", {
    pageTitle: heroTitle,
    pageCss: "exhibits",
    heroTitle,
    heroSubtitle,
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
const artifactPopup = asyncHandler(async (req, res) => {
  const exhibitId = typeof req.query.id === "string" ? req.query.id : "";
  let exhibit = null;

  if (exhibitId) {
    exhibit = await Exhibit.findById(exhibitId);
  }

  if (!exhibit) {
    exhibit = await Exhibit.findOne().sort({ createdAt: -1 });
  }

  if (!exhibit) {
    return res.status(404).render("404", { pageTitle: "Not Found", message: "Exhibit not found" });
  }

  const eraInfo = resolveArtifactEraInfo(exhibit);
  const eraExtras = resolveArtifactEraExtras(exhibit);
  const popupImageUrl = normalizeImageUrl(exhibit.imageUrl);

  return res.render("exhibits/artifactPopup", {
    pageTitle: exhibit.title,
    exhibit,
    eraInfo,
    eraExtras,
    popupImageUrl
  });
});

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
  const detailImageUrl = normalizeImageUrl(exhibit.imageUrl);
  res.render("exhibits/artifactDetails", { pageTitle: exhibit.title, pageCss: "exhibits", exhibit, backHref, eraInfo, eraExtras, detailImageUrl });
});

const virtualTour = (req, res) => res.render("virtual-tour/index", { pageTitle: "Virtual Tour", pageCss: "virtual-tour" });
const virtualTourIslamic = (req, res) =>
  res.render("virtual-tour/islamic", { pageTitle: "Islamic Virtual Tour", pageCss: "virtual-tour" });
const virtualTourPharaoh = (req, res) =>
  res.render("virtual-tour/pharaoh", { pageTitle: "Pharaohs Virtual Tour", pageCss: "virtual-tour" });
const virtualTourChristian = (req, res) =>
  res.render("virtual-tour/christian", { pageTitle: "Christian Virtual Tour", pageCss: "virtual-tour" });
const vrExperience = (req, res) =>
  res.render("virtual-tour/vr-experience", { pageTitle: "VR Experience", pageCss: "vr-experience" });
const games = (req, res) => res.render("games/index", { pageTitle: "Games" });
const gameQuiz = (req, res) => res.render("games/quiz", { pageTitle: "Quiz Game" });
const gameExplorer = (req, res) => res.render("games/explorer", { pageTitle: "Explorer Game", pageCss: "pyramid-builder" });
const gamePyramid = (req, res) => res.render("games/pyramid", { pageTitle: "Pyramid Builder", pageCss: "pyramid-builder" });

const shop = asyncHandler(async (req, res) => {
  const requestedType = (req.query.type || "").toLowerCase();
  const activeType = shopTypeConfig[requestedType] ? requestedType : "";
  const heroContent = activeType
    ? {
      heroTitle: shopTypeConfig[activeType].heroTitle,
      heroSubtitle: shopTypeConfig[activeType].heroSubtitle,
      heroTags: shopTypeConfig[activeType].heroTags
    }
    : defaultShopHero;
  const page = parseInt(req.query.page || "1", 10);
  const limit = 6;
  const allItems = await Product.find();
  const filteredItems = activeType ? allItems.filter((item) => inferShopType(item) === activeType) : allItems;
  const total = filteredItems.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const items = filteredItems.slice((page - 1) * limit, page * limit);
  const shopBasePath = activeType ? `/shop?type=${activeType}` : "/shop";

  res.render("shop/index", {
    pageTitle: "Shop",
    pageCss: "shop",
    activeType,
    activeTypeLabel: activeType ? shopTypeConfig[activeType].label : "All Collections",
    heroTitle: heroContent.heroTitle,
    heroSubtitle: heroContent.heroSubtitle,
    heroTags: heroContent.heroTags,
    productsHtml: buildCards(items, "product"),
    paginationHtml: buildPagination(page, totalPages, shopBasePath)
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

const contact = (req, res) => res.render("about/contact", { pageTitle: "Contact", pageCss: "info-pages" });
const membership = (req, res) =>
  res.render("about/membership", { pageTitle: "Membership", pageCss: "info-pages" });
const faqs = (req, res) => res.render("about/faqs", { pageTitle: "FAQs", pageCss: "info-pages" });

const planTrip = asyncHandler(async (req, res) => {
  const weather = await getWeather().catch(() => null);
  const isAr = req.cookies.lang === "ar";

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

const employeeDashboard = (req, res) => {
  const user = req.session.user;
  const role = user?.role;
  const viewName = employeeDashboardViewByRole[role];

  if (!viewName) {
    return res.status(403).render("404", { pageTitle: "Forbidden", message: "Access denied." });
  }

  return res.render(viewName, {
    pageTitle: "Employee Dashboard",
    pageCss: "admin",
    dashboardRole: role,
    employeeNavKey: "dashboard",
    employeeName: user?.name || "Employee",
    panelLabel: getPanelLabelByRole(role)
  });
};

const managerTasksDashboard = (req, res) => {
  const user = req.session.user;
  return res.render("employee/manager-tasks", {
    pageTitle: "Manager Tasks",
    pageCss: "admin",
    dashboardRole: user?.role,
    employeeNavKey: "tasks",
    employeeName: user?.name || "Employee",
    panelLabel: getPanelLabelByRole(user?.role)
  });
};

const managerZonesDashboard = (req, res) => {
  const user = req.session.user;
  return res.render("employee/manager-zones", {
    pageTitle: "Manager Zones",
    pageCss: "admin",
    dashboardRole: user?.role,
    employeeNavKey: "zones",
    employeeName: user?.name || "Employee",
    panelLabel: getPanelLabelByRole(user?.role)
  });
};

module.exports = {
  home,
  about,
  mission,
  accessibility,
  newsletter,
  location,
  exploreAges,
  exhibits,
  exhibitsPharaoh,
  exhibitsIslamic,
  exhibitsChristian,
  artifactPopup,
  exhibitDetails,
  virtualTour,
  virtualTourIslamic,
  virtualTourPharaoh,
  virtualTourChristian,
  vrExperience,
  games,
  gameQuiz,
  gameExplorer,
  gamePyramid,
  shop,
  cart,
  checkout,
  testimonials,
  contact,
  membership,
  faqs,
  planTrip,
  employeeDashboard,
  managerTasksDashboard,
  managerZonesDashboard
};

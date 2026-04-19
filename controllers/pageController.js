const Exhibit = require("../models/Exhibit");
const Product = require("../models/Product");
const Testimonial = require("../models/Testimonial");
const Ticket = require("../models/Ticket");
const MapPin = require("../models/MapPin");
const { asyncHandler } = require("../utils/asyncHandler");
const { getWeather } = require("../utils/apiClient");
const { buildPagination } = require("../utils/pagination");

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
          <article class="card">
            <h3>${item.name}</h3>
            <p>${item.message}</p>
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
  const weatherHtml = weather
    ? `<div class="weather-card">Current temperature: ${weather.temperature_2m}°C | Wind: ${weather.wind_speed_10m} km/h</div>`
    : "<div class=\"weather-card\">Weather data unavailable</div>";

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
const accessibility = (req, res) => res.render("about/accessibility", { pageTitle: "Accessibility" });
const newsletter = (req, res) => res.render("about/newsletter", { pageTitle: "Newsletter" });

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

const renderExhibitsPage = asyncHandler(async (req, res, categoryKey, basePath) => {
  const page = parseInt(req.query.page || "1", 10);
  const limit = 6;
  const config = categoryKey ? categoryConfig[categoryKey] : null;
  const filter = config ? { category: new RegExp(`^${config.categoryValue}$`, "i") } : {};
  const total = await Exhibit.countDocuments(filter);
  const totalPages = Math.ceil(total / limit) || 1;
  const items = await Exhibit.find(filter)
    .skip((page - 1) * limit)
    .limit(limit);

  res.render("exhibits/index", {
    pageTitle: config ? `${config.label} Collection` : "Exhibits",
    heroTitle: config ? `${config.label} Collection` : "Exhibits",
    heroSubtitle: config ? config.subtitle : "Discover Pharaoh, Islamic, and Christian galleries.",
    exhibitsHtml: buildCards(items, "exhibit"),
    paginationHtml: buildPagination(page, totalPages, basePath)
  });
});

const exhibits = asyncHandler(async (req, res) => {
  const categoryKey = (req.query.category || "").toLowerCase();
  if (categoryKey && categoryConfig[categoryKey]) {
    return renderExhibitsPage(req, res, categoryKey, `/exhibits/${categoryKey}`);
  }
  return renderExhibitsPage(req, res, null, "/exhibits");
});

const exhibitsPharaoh = (req, res) => renderExhibitsPage(req, res, "pharaoh", "/exhibits/pharaoh");
const exhibitsIslamic = (req, res) => renderExhibitsPage(req, res, "islamic", "/exhibits/islamic");
const exhibitsChristian = (req, res) => renderExhibitsPage(req, res, "christian", "/exhibits/christian");

const exhibitDetails = asyncHandler(async (req, res) => {
  const exhibit = await Exhibit.findById(req.params.id);
  if (!exhibit) {
    return res.status(404).render("404", { pageTitle: "Not Found", message: "Exhibit not found" });
  }
  res.render("exhibits/details", { pageTitle: exhibit.title, exhibit });
});

const virtualTour = (req, res) => res.render("virtual-tour/index", { pageTitle: "Virtual Tour" });
const virtualTourIslamic = (req, res) => res.render("virtual-tour/islamic", { pageTitle: "Islamic Virtual Tour" });
const virtualTourPharaoh = (req, res) => res.render("virtual-tour/pharaoh", { pageTitle: "Pharaohs Virtual Tour" });
const virtualTourChristian = (req, res) => res.render("virtual-tour/christian", { pageTitle: "Christian Virtual Tour" });
const games = (req, res) => res.render("games/index", { pageTitle: "Games" });
const gameQuiz = (req, res) => res.render("games/quiz", { pageTitle: "Quiz Game" });
const gameExplorer = (req, res) => res.render("games/explorer", { pageTitle: "Explorer Game" });
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
    testimonialsHtml: buildCards(items, "testimonial")
  });
});

const planTrip = asyncHandler(async (req, res) => {
  const weather = await getWeather().catch(() => null);
  const weatherHtml = weather
    ? `<div class="weather-card">Current temperature: ${weather.temperature_2m}°C | Wind: ${weather.wind_speed_10m} km/h</div>`
    : "<div class=\"weather-card\">Weather data unavailable</div>";
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

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
    t: res.locals.t,
    weatherHtml,
    exhibitsHtml: buildCards(exhibits, "exhibit"),
    productsHtml: buildCards(products, "product"),
    testimonialsHtml: buildCards(testimonials, "testimonial")
  });
});

const about = (req, res) => res.render("about/about", { pageTitle: "About", t: res.locals.t });
const accessibility = (req, res) => res.render("about/accessibility", { pageTitle: "Accessibility", t: res.locals.t });
const newsletter = (req, res) => res.render("about/newsletter", { pageTitle: "Newsletter", t: res.locals.t });

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
  res.render("about/location", { pageTitle: "Map", pageCss: "location", t: res.locals.t, pinsHtml, commonPins });
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
    t: res.locals.t,
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
    return res.status(404).render("404", { pageTitle: "Not Found", t: res.locals.t, message: "Exhibit not found" });
  }
  res.render("exhibits/details", { pageTitle: exhibit.title, t: res.locals.t, exhibit });
});

const virtualTour = (req, res) => res.render("virtual-tour/index", { pageTitle: "Virtual Tour", t: res.locals.t });
const virtualTourIslamic = (req, res) => res.render("virtual-tour/islamic", { pageTitle: "Islamic Virtual Tour", t: res.locals.t });
const virtualTourPharaoh = (req, res) => res.render("virtual-tour/pharaoh", { pageTitle: "Pharaohs Virtual Tour", t: res.locals.t });
const virtualTourChristian = (req, res) => res.render("virtual-tour/christian", { pageTitle: "Christian Virtual Tour", t: res.locals.t });
const games = (req, res) => res.render("games/index", { pageTitle: "Games", t: res.locals.t });
const gameQuiz = (req, res) => res.render("games/quiz", { pageTitle: "Quiz Game", t: res.locals.t });
const gameExplorer = (req, res) => res.render("games/explorer", { pageTitle: "Explorer Game", t: res.locals.t });
const gamePyramid = (req, res) => res.render("games/pyramid", { pageTitle: "Pyramid Builder", pageCss: "pyramid-builder", t: res.locals.t });

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
    t: res.locals.t,
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
  res.render("shop/cart", { pageTitle: "Cart", t: res.locals.t, cartItemsHtml: itemsHtml, total: cartState.total.toFixed(2) });
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
    t: res.locals.t,
    groupedTickets
  });
});

const testimonials = asyncHandler(async (req, res) => {
  const items = await Testimonial.find().limit(10);
  res.render("testimonials/index", {
    pageTitle: "Testimonials",
    t: res.locals.t,
    testimonialsHtml: buildCards(items, "testimonial")
  });
});

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
  res.render("plan-trip/index", { pageTitle: "Plan Your Trip", t: res.locals.t, weatherHtml, tickets });
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
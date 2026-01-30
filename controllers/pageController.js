const Exhibit = require("../models/Exhibit");
const Product = require("../models/Product");
const Testimonial = require("../models/Testimonial");
const Ticket = require("../models/Ticket");
const MapPin = require("../models/MapPin");
const { asyncHandler } = require("../utils/asyncHandler");
const { getWeather } = require("../utils/apiClient");
const { buildPagination } = require("../utils/pagination");

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
  const weatherHtml = weather
    ? `<div class="weather-card">Current temperature: ${weather.temperature_2m}°C | Wind: ${weather.wind_speed_10m} km/h</div>`
    : "<div class=\"weather-card\">Weather data unavailable</div>";

  res.render("home", {
    pageTitle: "Home",
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
  const pins = await MapPin.find();
  const pinsHtml = pins
    .map(
      (pin) => `
      <div class="map-pin" data-x="${pin.x}" data-y="${pin.y}" data-label="${pin.label}" data-description="${pin.description}"></div>
    `
    )
    .join("");
  res.render("about/location", { pageTitle: "Location", pinsHtml });
});

const exhibits = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page || "1", 10);
  const limit = 6;
  const total = await Exhibit.countDocuments();
  const totalPages = Math.ceil(total / limit) || 1;
  const items = await Exhibit.find()
    .skip((page - 1) * limit)
    .limit(limit);
  res.render("exhibits/index", {
    pageTitle: "Exhibits",
    exhibitsHtml: buildCards(items, "exhibit"),
    paginationHtml: buildPagination(page, totalPages, "/exhibits")
  });
});

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
const gamePyramid = (req, res) => res.render("games/pyramid", { pageTitle: "Pyramid Builder" });

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
  const ticketsHtml = tickets
    .map(
      (ticket) => `
      <div class="ticket-row">
        <span>${ticket.type}</span>
        <span>EGP ${ticket.price.toFixed(2)}</span>
      </div>
    `
    )
    .join("");
  res.render("shop/checkout", { pageTitle: "Checkout", ticketsHtml });
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
  res.render("plan-trip/index", { pageTitle: "Plan Your Trip", weatherHtml });
});

module.exports = {
  home,
  about,
  accessibility,
  newsletter,
  location,
  exhibits,
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

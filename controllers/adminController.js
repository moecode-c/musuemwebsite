const Exhibit = require("../models/Exhibit");
const Product = require("../models/Product");
const MapPin = require("../models/MapPin");
const Ticket = require("../models/Ticket");
const User = require("../models/User");
const Testimonial = require("../models/Testimonial");
const TicketRequest = require("../models/TicketRequest");
const { asyncHandler } = require("../utils/asyncHandler");

const dashboard = asyncHandler(async (req, res) => {
  const [exhibitCount, productCount, userCount, ticketCount, testimonialCount, ticketRequestCount] = await Promise.all([
    Exhibit.countDocuments(),
    Product.countDocuments(),
    User.countDocuments(),
    Ticket.countDocuments(),
    Testimonial.countDocuments(),
    TicketRequest.countDocuments()
  ]);

  res.render("admin/dashboard", {
    pageTitle: "Overview",
    pageCss: "admin",
    stats: {
      exhibitCount,
      productCount,
      userCount,
      ticketCount,
      testimonialCount,
      ticketRequestCount
    }
  });
});

const adminExhibits = (req, res) => res.render("admin/exhibits", { pageTitle: "Manage Exhibits", pageCss: "admin" });
const adminProducts = (req, res) => res.render("admin/products", { pageTitle: "Manage Products", pageCss: "admin" });
const adminMap = asyncHandler(async (req, res) => {
  const pins = await MapPin.find();
  const pinsHtml = pins
    .map(
      (pin) => `
      <div class="map-pin" data-x="${pin.x}" data-y="${pin.y}" data-label="${pin.label}" data-description="${pin.description}"></div>
    `
    )
    .join("");
  res.render("admin/map", { pageTitle: "Manage Map", pageCss: "admin", pinsHtml });
});
const adminTickets = (req, res) => res.render("admin/tickets", { pageTitle: "Manage Tickets", pageCss: "admin" });
const adminUsers = (req, res) => res.render("admin/users", { pageTitle: "Manage Users", pageCss: "admin" });
const adminSettings = (req, res) => res.render("admin/settings", { pageTitle: "Settings", pageCss: "admin" });
const adminTicketRequests = asyncHandler(async (req, res) => {
  const requests = await TicketRequest.find().sort({ createdAt: -1 });
  const countryCounts = requests.reduce((acc, request) => {
    const key = (request.nationality || "Unknown").trim();
    const normalized = key.length ? key[0].toUpperCase() + key.slice(1).toLowerCase() : "Unknown";
    acc[normalized] = (acc[normalized] || 0) + 1;
    return acc;
  }, {});
  const countries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([country, count]) => ({ country, count }));

  res.render("admin/ticket-requests", {
    pageTitle: "Ticket Overview",
    pageCss: "admin",
    requests,
    countries
  });
});

module.exports = {
  dashboard,
  adminExhibits,
  adminProducts,
  adminMap,
  adminTickets,
  adminUsers,
  adminSettings,
  adminTicketRequests
};

const Exhibit = require("../models/Exhibit");
const Collection = require("../models/Collection");
const Product = require("../models/Product");
const MapPin = require("../models/MapPin");
const Ticket = require("../models/Ticket");
const User = require("../models/User");
const Testimonial = require("../models/Testimonial");
const { asyncHandler } = require("../utils/asyncHandler");

const dashboard = asyncHandler(async (req, res) => {
  const [exhibitCount, collectionCount, productCount, userCount, ticketCount, testimonialCount] = await Promise.all([
    Exhibit.countDocuments(),
    Collection.countDocuments(),
    Product.countDocuments(),
    User.countDocuments(),
    Ticket.countDocuments(),
    Testimonial.countDocuments()
  ]);

  res.render("admin/dashboard", {
    pageTitle: "Admin Dashboard",
    stats: {
      exhibitCount,
      collectionCount,
      productCount,
      userCount,
      ticketCount,
      testimonialCount
    }
  });
});

const adminExhibits = (req, res) => res.render("admin/exhibits", { pageTitle: "Manage Exhibits" });
const adminCollections = (req, res) => res.render("admin/collections", { pageTitle: "Manage Collections" });
const adminProducts = (req, res) => res.render("admin/products", { pageTitle: "Manage Products" });
const adminMap = asyncHandler(async (req, res) => {
  const pins = await MapPin.find();
  const pinsHtml = pins
    .map(
      (pin) => `
      <div class="map-pin" data-x="${pin.x}" data-y="${pin.y}" data-label="${pin.label}" data-description="${pin.description}"></div>
    `
    )
    .join("");
  res.render("admin/map", { pageTitle: "Manage Map", pinsHtml });
});
const adminTickets = (req, res) => res.render("admin/tickets", { pageTitle: "Manage Tickets" });
const adminUsers = (req, res) => res.render("admin/users", { pageTitle: "Manage Users" });
const adminSettings = (req, res) => res.render("admin/settings", { pageTitle: "Settings" });

module.exports = {
  dashboard,
  adminExhibits,
  adminCollections,
  adminProducts,
  adminMap,
  adminTickets,
  adminUsers,
  adminSettings
};

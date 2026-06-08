const Exhibit = require("../models/Exhibit");
const Product = require("../models/Product");
const MapPin = require("../models/MapPin");
const Ticket = require("../models/Ticket");
const User = require("../models/User");
const Testimonial = require("../models/Testimonial");
const TicketRequest = require("../models/TicketRequest");
const Task = require("../models/Task");
const CleaningZone = require("../models/CleaningZone");
const Order = require("../models/Order");
const AssistanceRequest = require("../models/AssistanceRequest");
const Newsletter = require("../models/Newsletter");
const { asyncHandler } = require("../utils/asyncHandler");

const dashboard = asyncHandler(async (req, res) => {
  const [exhibitCount, productCount, userCount, ticketCount, testimonialCount, ticketRequestCount, taskCount, cleaningZoneCount, orderCount, pendingOrderCount, assistanceCount, newAssistanceCount] = await Promise.all([
    Exhibit.countDocuments(),
    Product.countDocuments(),
    User.countDocuments(),
    Ticket.countDocuments(),
    Testimonial.countDocuments(),
    TicketRequest.countDocuments(),
    Task.countDocuments(),
    CleaningZone.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ status: "pending" }),
    AssistanceRequest.countDocuments(),
    AssistanceRequest.countDocuments({ status: "new" })
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
      ticketRequestCount,
      taskCount,
      cleaningZoneCount,
      orderCount,
      pendingOrderCount,
      assistanceCount,
      newAssistanceCount
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
      <div class="map-pin" data-id="${pin._id}" data-x="${pin.x}" data-y="${pin.y}" data-label="${pin.label}" data-description="${pin.description}"></div>
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

const adminOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.render("admin/orders", {
    pageTitle: "Orders",
    pageCss: "admin",
    orders
  });
});

const adminAssistance = asyncHandler(async (req, res) => {
  const requests = await AssistanceRequest.find().sort({ createdAt: -1 });
  res.render("admin/assistance", {
    pageTitle: "Assistance Requests",
    pageCss: "admin",
    requests
  });
});

const adminNewsletter = asyncHandler(async (req, res) => {
  const subscribers = await Newsletter.find().sort({ createdAt: -1 });
  const newThisMonth = subscribers.filter((sub) => {
    if (!sub.createdAt) return false;
    const created = new Date(sub.createdAt);
    const now = new Date();
    return created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth();
  }).length;

  res.render("admin/newsletter", {
    pageTitle: "Newsletter Subscriptions",
    pageCss: "admin",
    subscribers,
    newThisMonth
  });
});

// Download every subscriber as a CSV file (UTF-8 with BOM so Excel opens it cleanly).
const adminNewsletterExport = asyncHandler(async (req, res) => {
  const subscribers = await Newsletter.find().sort({ createdAt: -1 });
  const escapeCsv = (value) => {
    const str = value === undefined || value === null ? "" : String(value);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const header = ["Name", "Email", "Phone", "Subscribed At"];
  const rows = subscribers.map((sub) =>
    [sub.name, sub.email, sub.phone, sub.createdAt ? new Date(sub.createdAt).toISOString() : ""]
      .map(escapeCsv)
      .join(",")
  );
  const csv = [header.join(","), ...rows].join("\n");
  const stamp = new Date().toISOString().slice(0, 10);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="newsletter-subscribers-${stamp}.csv"`);
  res.send(`﻿${csv}`);
});

const adminAnalytics = asyncHandler(async (req, res) => {
  // Build a rolling six-month window for trend charts.
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleString("en-US", { month: "short" })
    });
  }
  const windowStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const monthlyCount = (Model) =>
    Model.aggregate([
      { $match: { createdAt: { $gte: windowStart } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } }
    ]);

  const [
    totalUsers,
    totalSubscribers,
    totalOrders,
    totalExhibits,
    totalProducts,
    totalTestimonials,
    totalTicketRequests,
    totalAssistance,
    totalTicketTypes,
    totalTasks,
    totalCleaningZones,
    totalMapPins,
    ordersByStatusAgg,
    revenueAgg,
    usersByRoleAgg,
    exhibitsByCategoryAgg,
    ticketByStatusAgg,
    ticketByCategoryAgg,
    ticketByAudienceAgg,
    ticketNationalityAgg,
    assistanceByTypeAgg,
    assistanceByStatusAgg,
    testimonialAvgAgg,
    testimonialDistAgg,
    productStockAgg,
    lowStockCount,
    outOfStockCount,
    topProductsAgg,
    usersMonthlyAgg,
    subscribersMonthlyAgg,
    ordersMonthlyAgg
  ] = await Promise.all([
    User.countDocuments(),
    Newsletter.countDocuments(),
    Order.countDocuments(),
    Exhibit.countDocuments(),
    Product.countDocuments(),
    Testimonial.countDocuments(),
    TicketRequest.countDocuments(),
    AssistanceRequest.countDocuments(),
    Ticket.countDocuments(),
    Task.countDocuments(),
    CleaningZone.countDocuments(),
    MapPin.countDocuments(),
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 }, revenue: { $sum: "$total" } } }]),
    Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
    User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
    Exhibit.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
    TicketRequest.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    TicketRequest.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
    TicketRequest.aggregate([{ $group: { _id: "$audience", count: { $sum: 1 } } }]),
    TicketRequest.aggregate([
      { $group: { _id: "$nationality", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]),
    AssistanceRequest.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),
    AssistanceRequest.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Testimonial.aggregate([{ $group: { _id: null, avg: { $avg: "$rating" } } }]),
    Testimonial.aggregate([{ $group: { _id: "$rating", count: { $sum: 1 } } }]),
    Product.aggregate([
      { $group: { _id: null, totalStock: { $sum: "$stock" }, inventoryValue: { $sum: { $multiply: ["$price", "$stock"] } } } }
    ]),
    Product.countDocuments({ stock: { $gt: 0, $lte: 5 } }),
    Product.countDocuments({ stock: { $lte: 0 } }),
    Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          qty: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { qty: -1 } },
      { $limit: 6 }
    ]),
    monthlyCount(User),
    monthlyCount(Newsletter),
    Order.aggregate([
      { $match: { createdAt: { $gte: windowStart } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
          revenue: { $sum: "$total" }
        }
      }
    ])
  ]);

  const toMap = (agg, field = "count") => {
    const map = new Map();
    agg.forEach((row) => map.set(row._id == null ? "" : String(row._id), row[field] || 0));
    return map;
  };
  const fromAgg = (agg, field = "count") =>
    agg
      .map((row) => ({ key: row._id == null ? "—" : String(row._id), value: row[field] || 0 }))
      .sort((a, b) => b.value - a.value);
  const mapMonthly = (agg, field = "count") => {
    const map = toMap(agg, field);
    return months.map((m) => map.get(m.key) || 0);
  };

  const orderStatusMap = new Map(ordersByStatusAgg.map((r) => [r._id, r]));
  const orderStatusKeys = [
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "fulfilled", label: "Fulfilled" },
    { key: "cancelled", label: "Cancelled" }
  ];
  const ordersByStatus = orderStatusKeys.map((k) => ({
    label: k.label,
    count: (orderStatusMap.get(k.key) || {}).count || 0,
    revenue: (orderStatusMap.get(k.key) || {}).revenue || 0
  }));
  const totalRevenue = (revenueAgg[0] || {}).total || 0;
  const paidRevenue =
    ((orderStatusMap.get("confirmed") || {}).revenue || 0) + ((orderStatusMap.get("fulfilled") || {}).revenue || 0);
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  const ratingDistMap = toMap(testimonialDistAgg);
  const ratingDistribution = [5, 4, 3, 2, 1].map((r) => ({ rating: r, count: ratingDistMap.get(String(r)) || 0 }));

  const ROLE_LABELS = {
    user: "Visitors",
    admin: "Admins",
    museum_manager: "Managers",
    curator: "Curators",
    front_desk: "Front Desk",
    security_officer: "Security",
    maintenance_technician: "Technicians",
    janitor: "Janitors",
    educator_guide: "Educators"
  };
  const usersByRole = fromAgg(usersByRoleAgg).map((r) => ({ ...r, label: ROLE_LABELS[r.key] || r.key }));

  res.render("admin/analytics", {
    pageTitle: "Statistics & Analytics",
    pageCss: "admin",
    analytics: {
      totals: {
        users: totalUsers,
        subscribers: totalSubscribers,
        orders: totalOrders,
        revenue: totalRevenue,
        exhibits: totalExhibits,
        products: totalProducts,
        testimonials: totalTestimonials,
        ticketRequests: totalTicketRequests,
        assistance: totalAssistance,
        ticketTypes: totalTicketTypes,
        tasks: totalTasks,
        cleaningZones: totalCleaningZones,
        mapPins: totalMapPins
      },
      revenue: { total: totalRevenue, paid: paidRevenue, avgOrderValue },
      ordersByStatus,
      usersByRole,
      exhibitsByCategory: fromAgg(exhibitsByCategoryAgg),
      ticketRequests: {
        byStatus: fromAgg(ticketByStatusAgg),
        byCategory: fromAgg(ticketByCategoryAgg),
        byAudience: fromAgg(ticketByAudienceAgg),
        topNationalities: fromAgg(ticketNationalityAgg)
      },
      assistance: {
        byType: fromAgg(assistanceByTypeAgg),
        byStatus: fromAgg(assistanceByStatusAgg)
      },
      testimonials: { avg: (testimonialAvgAgg[0] || {}).avg || 0, distribution: ratingDistribution },
      products: {
        totalStock: (productStockAgg[0] || {}).totalStock || 0,
        inventoryValue: (productStockAgg[0] || {}).inventoryValue || 0,
        lowStock: lowStockCount,
        outOfStock: outOfStockCount
      },
      topProducts: topProductsAgg.map((p) => ({ name: p._id || "—", qty: p.qty, revenue: p.revenue })),
      monthly: {
        labels: months.map((m) => m.label),
        users: mapMonthly(usersMonthlyAgg),
        subscribers: mapMonthly(subscribersMonthlyAgg),
        orders: mapMonthly(ordersMonthlyAgg),
        revenue: mapMonthly(ordersMonthlyAgg, "revenue")
      }
    }
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
  adminTicketRequests,
  adminOrders,
  adminAssistance,
  adminNewsletter,
  adminNewsletterExport,
  adminAnalytics
};

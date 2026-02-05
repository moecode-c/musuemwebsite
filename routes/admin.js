const express = require("express");
const adminController = require("../controllers/adminController");
const { requireAdmin } = require("../middleware/roles");

const router = express.Router();

router.get("/dashboard", requireAdmin, adminController.dashboard);
router.get("/exhibits", requireAdmin, adminController.adminExhibits);
router.get("/products", requireAdmin, adminController.adminProducts);
router.get("/map", requireAdmin, adminController.adminMap);
router.get("/tickets", requireAdmin, adminController.adminTickets);
router.get("/ticket-requests", requireAdmin, adminController.adminTicketRequests);
router.get("/users", requireAdmin, adminController.adminUsers);
router.get("/settings", requireAdmin, adminController.adminSettings);

module.exports = router;

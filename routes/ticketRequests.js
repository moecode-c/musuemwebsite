const express = require("express");
const ticketRequestsController = require("../controllers/ticketRequestsController");
const { requireAdmin } = require("../middleware/roles");
const { ticketRequestValidation, handleValidation } = require("../middleware/validation");

const router = express.Router();

router.get("/", requireAdmin, ticketRequestsController.list);
router.post("/", ticketRequestValidation, handleValidation, ticketRequestsController.create);

module.exports = router;
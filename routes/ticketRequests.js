const express = require("express");
const ticketRequestsController = require("../controllers/ticketRequestsController");
const { requireAdmin, requirePermission } = require("../middleware/roles");
const { requireAuth } = require("../middleware/auth");
const {
	ticketRequestValidation,
	ticketRequestToTaskValidation,
	handleValidation
} = require("../middleware/validation");

const router = express.Router();

router.get("/", requireAdmin, ticketRequestsController.list);
router.post("/", ticketRequestValidation, handleValidation, ticketRequestsController.create);
router.post(
	"/:id/convert-task",
	requireAuth,
	requirePermission("task:create"),
	ticketRequestToTaskValidation,
	handleValidation,
	ticketRequestsController.convertToTask
);

module.exports = router;
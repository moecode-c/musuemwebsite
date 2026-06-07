const express = require("express");
const ticketRequestsController = require("../controllers/ticketRequestsController");
const { requireAdmin, requirePermission } = require("../middleware/roles");
const { requireAuth, requireAuthApi } = require("../middleware/auth");
const {
	ticketRequestValidation,
	ticketRequestToTaskValidation,
	handleValidation
} = require("../middleware/validation");

const router = express.Router();

router.get("/summary", requireAdmin, ticketRequestsController.summary);
router.get("/", requireAdmin, ticketRequestsController.list);
router.post("/", requireAuthApi, ticketRequestValidation, handleValidation, ticketRequestsController.create);
router.post(
	"/:id/convert-task",
	requireAuth,
	requirePermission("task:create"),
	ticketRequestToTaskValidation,
	handleValidation,
	ticketRequestsController.convertToTask
);

module.exports = router;
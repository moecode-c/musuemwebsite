const express = require("express");
const assistanceController = require("../controllers/assistanceController");
const { requireAdmin } = require("../middleware/roles");
const { assistanceValidation, handleValidation } = require("../middleware/validation");

const router = express.Router();

// Public submission from the accessibility page
router.post("/", assistanceValidation, handleValidation, assistanceController.create);

// Admin management
router.get("/", requireAdmin, assistanceController.list);
router.put("/:id/status", requireAdmin, assistanceController.updateStatus);
router.delete("/:id", requireAdmin, assistanceController.remove);

module.exports = router;

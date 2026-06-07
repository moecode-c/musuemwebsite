const express = require("express");
const ordersController = require("../controllers/ordersController");
const { requireAdmin } = require("../middleware/roles");

const router = express.Router();

router.get("/", requireAdmin, ordersController.list);
router.put("/:id/status", requireAdmin, ordersController.updateStatus);
router.delete("/:id", requireAdmin, ordersController.remove);

module.exports = router;

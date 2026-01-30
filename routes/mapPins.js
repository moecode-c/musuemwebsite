const express = require("express");
const mapPinsController = require("../controllers/mapPinsController");
const { requireAdmin } = require("../middleware/roles");
const { mapPinValidation, handleValidation } = require("../middleware/validation");

const router = express.Router();

router.get("/", mapPinsController.list);
router.post("/", requireAdmin, mapPinValidation, handleValidation, mapPinsController.create);
router.put("/:id", requireAdmin, mapPinValidation, handleValidation, mapPinsController.update);
router.delete("/:id", requireAdmin, mapPinsController.remove);

module.exports = router;

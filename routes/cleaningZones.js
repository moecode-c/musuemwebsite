const express = require("express");
const cleaningZonesController = require("../controllers/cleaningZonesController");
const { requireAuth } = require("../middleware/auth");
const { requirePermission } = require("../middleware/roles");
const {
  cleaningZoneValidation,
  cleaningZoneAssignValidation,
  handleValidation
} = require("../middleware/validation");

const router = express.Router();

router.get("/", requireAuth, requirePermission("zone:view_assigned"), cleaningZonesController.list);
router.post(
  "/",
  requireAuth,
  requirePermission("zone:manage"),
  cleaningZoneValidation,
  handleValidation,
  cleaningZonesController.create
);
router.put(
  "/:id",
  requireAuth,
  requirePermission("zone:manage"),
  cleaningZoneValidation,
  handleValidation,
  cleaningZonesController.update
);
router.patch(
  "/:id/assign",
  requireAuth,
  requirePermission("zone:manage"),
  cleaningZoneAssignValidation,
  handleValidation,
  cleaningZonesController.assign
);
router.delete("/:id", requireAuth, requirePermission("zone:manage"), cleaningZonesController.remove);

module.exports = router;

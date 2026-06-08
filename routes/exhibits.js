const express = require("express");
const exhibitsController = require("../controllers/exhibitsController");
const { requireAdmin } = require("../middleware/roles");
const { exhibitValidation, handleValidation } = require("../middleware/validation");
const { memoryUpload } = require("../config/multer");

const router = express.Router();

router.get("/", exhibitsController.list);
router.post(
  "/",
  requireAdmin,
  memoryUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "model", maxCount: 1 }
  ]),
  exhibitValidation,
  handleValidation,
  exhibitsController.create
);
router.put(
  "/:id",
  requireAdmin,
  memoryUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "model", maxCount: 1 }
  ]),
  exhibitValidation,
  handleValidation,
  exhibitsController.update
);
router.delete("/:id", requireAdmin, exhibitsController.remove);

module.exports = router;

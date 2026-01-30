const express = require("express");
const exhibitsController = require("../controllers/exhibitsController");
const { requireAdmin } = require("../middleware/roles");
const { exhibitValidation, handleValidation } = require("../middleware/validation");
const { upload } = require("../config/multer");

const router = express.Router();

router.get("/", exhibitsController.list);
router.post(
  "/",
  requireAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "model", maxCount: 1 }
  ]),
  exhibitValidation,
  handleValidation,
  exhibitsController.createWithFiles
);
router.put(
  "/:id",
  requireAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "model", maxCount: 1 }
  ]),
  exhibitValidation,
  handleValidation,
  exhibitsController.update
);
router.delete("/:id", requireAdmin, exhibitsController.remove);

module.exports = router;

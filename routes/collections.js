const express = require("express");
const collectionsController = require("../controllers/collectionsController");
const { requireAdmin } = require("../middleware/roles");
const { collectionValidation, handleValidation } = require("../middleware/validation");
const { upload } = require("../config/multer");

const router = express.Router();

router.get("/", collectionsController.list);
router.post("/", requireAdmin, upload.single("image"), collectionValidation, handleValidation, collectionsController.create);
router.put("/:id", requireAdmin, upload.single("image"), collectionValidation, handleValidation, collectionsController.update);
router.delete("/:id", requireAdmin, collectionsController.remove);

module.exports = router;

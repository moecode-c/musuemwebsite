const express = require("express");
const productsController = require("../controllers/productsController");
const { requireAdmin } = require("../middleware/roles");
const { productValidation, handleValidation } = require("../middleware/validation");
const { memoryUpload } = require("../config/multer");

const router = express.Router();

router.get("/", productsController.list);
router.post("/", requireAdmin, memoryUpload.single("image"), productValidation, handleValidation, productsController.create);
router.put("/:id", requireAdmin, memoryUpload.single("image"), productValidation, handleValidation, productsController.update);
router.delete("/:id", requireAdmin, productsController.remove);

module.exports = router;

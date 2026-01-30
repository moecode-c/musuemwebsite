const express = require("express");
const productsController = require("../controllers/productsController");
const { requireAdmin } = require("../middleware/roles");
const { productValidation, handleValidation } = require("../middleware/validation");
const { upload } = require("../config/multer");

const router = express.Router();

router.get("/", productsController.list);
router.post("/", requireAdmin, upload.single("image"), productValidation, handleValidation, productsController.create);
router.put("/:id", requireAdmin, upload.single("image"), productValidation, handleValidation, productsController.update);
router.delete("/:id", requireAdmin, productsController.remove);

module.exports = router;

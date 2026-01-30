const express = require("express");
const testimonialsController = require("../controllers/testimonialsController");
const { requireAdmin } = require("../middleware/roles");
const { testimonialValidation, handleValidation } = require("../middleware/validation");

const router = express.Router();

router.get("/", testimonialsController.list);
router.post("/", testimonialValidation, handleValidation, testimonialsController.create);
router.put("/:id", requireAdmin, testimonialValidation, handleValidation, testimonialsController.update);
router.delete("/:id", requireAdmin, testimonialsController.remove);

module.exports = router;

const express = require("express");
const newsletterController = require("../controllers/newsletterController");
const { newsletterValidation, handleValidation } = require("../middleware/validation");

const router = express.Router();

router.post("/subscribe", newsletterValidation, handleValidation, newsletterController.subscribe);

module.exports = router;

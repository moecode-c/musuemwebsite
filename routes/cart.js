const express = require("express");
const cartController = require("../controllers/cartController");

const router = express.Router();

router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.put("/update", cartController.updateCart);
router.delete("/remove", cartController.removeFromCart);

module.exports = router;

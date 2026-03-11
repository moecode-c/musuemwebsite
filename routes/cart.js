const express = require("express");
const cartController = require("../controllers/cartController");

const router = express.Router();

router.get("/", cartController.getCart);
router.get("/checkout", cartController.renderCheckout);
router.get("/payment", cartController.renderPayment);
router.post("/payment", cartController.processPayment);
router.get("/confirmation", cartController.renderConfirmation);
router.post("/add", cartController.addToCart);
router.put("/update", cartController.updateCart);
router.delete("/remove", cartController.removeFromCart);

module.exports = router;

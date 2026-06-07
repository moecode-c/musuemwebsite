const express = require("express");
const cartController = require("../controllers/cartController");
const { requireAuth, requireAuthApi } = require("../middleware/auth");

const router = express.Router();

router.get("/", cartController.getCart);

// Buying requires a logged-in user. Page routes redirect to /login;
// AJAX routes return 401 JSON so the client can redirect.
router.get("/checkout", requireAuth, cartController.renderCheckout);
router.post("/checkout", requireAuth, cartController.submitCheckoutDetails);
router.get("/payment", requireAuth, cartController.renderPayment);
router.post("/payment", requireAuth, cartController.processPayment);
router.get("/confirmation", requireAuth, cartController.renderConfirmation);
router.post("/add", requireAuthApi, cartController.addToCart);
router.put("/update", requireAuthApi, cartController.updateCart);
router.delete("/remove", requireAuthApi, cartController.removeFromCart);

module.exports = router;

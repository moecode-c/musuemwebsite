const express = require("express");
const pageController = require("../controllers/pageController");

const router = express.Router();

router.get("/", pageController.home);
router.get("/about", pageController.about);
router.get("/accessibility", pageController.accessibility);
router.get("/newsletter", pageController.newsletter);
router.get("/location", pageController.location);
router.get("/exhibits", pageController.exhibits);
router.get("/exhibits/:id", pageController.exhibitDetails);
router.get("/collections", pageController.collections);
router.get("/virtual-tour", pageController.virtualTour);
router.get("/games", pageController.games);
router.get("/shop", pageController.shop);
router.get("/cart", pageController.cart);
router.get("/checkout", pageController.checkout);
router.get("/testimonials", pageController.testimonials);
router.get("/plan-trip", pageController.planTrip);

router.get("/login", (req, res) => res.redirect("/auth/login"));
router.get("/register", (req, res) => res.redirect("/auth/register"));

router.get("/lang/:lang", (req, res) => {
  const lang = req.params.lang === "ar" ? "ar" : "en";
  req.session.language = lang;
  res.redirect("back");
});

module.exports = router;

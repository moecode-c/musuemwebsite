const express = require("express");
const pageController = require("../controllers/pageController");

const router = express.Router();

router.get("/", pageController.home);
router.get("/about", pageController.about);
router.get("/accessibility", pageController.accessibility);
router.get("/newsletter", pageController.newsletter);
router.get("/location", pageController.location);
router.get("/exhibits", pageController.exhibits);
router.get("/exhibits/pharaoh", pageController.exhibitsPharaoh);
router.get("/exhibits/islamic", pageController.exhibitsIslamic);
router.get("/exhibits/christian", pageController.exhibitsChristian);
router.get("/exhibits/:id", pageController.exhibitDetails);
router.get("/virtual-tour", pageController.virtualTour);
router.get("/virtual-tour/pharaoh", pageController.virtualTourPharaoh);
router.get("/virtual-tour/islamic", pageController.virtualTourIslamic);
router.get("/virtual-tour/christian", pageController.virtualTourChristian);
router.get("/games", pageController.games);
router.get("/games/quiz", pageController.gameQuiz);
router.get("/games/explorer", pageController.gameExplorer);
router.get("/games/pyramid", pageController.gamePyramid);
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

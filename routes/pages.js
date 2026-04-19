const express = require("express");
const pageController = require("../controllers/pageController");
const { requireAuth } = require("../middleware/auth");
const { requireAnyRole, requirePermission, ROLES } = require("../middleware/roles");

const router = express.Router();

router.get("/", pageController.home);
router.get("/about", pageController.about);
router.get("/mission", pageController.mission);
router.get("/accessibility", pageController.accessibility);
router.get("/newsletter", pageController.newsletter);
router.get("/contact", pageController.contact);
router.get("/membership", pageController.membership);
router.get("/faqs", pageController.faqs);
router.get("/location", pageController.location);
router.get("/explore-ages", pageController.exploreAges);
router.get("/exhibits", pageController.exhibits);
router.get("/exhibits/pharaoh", pageController.exhibitsPharaoh);
router.get("/exhibits/islamic", pageController.exhibitsIslamic);
router.get("/exhibits/christian", pageController.exhibitsChristian);
router.get("/exhibits/artifactPopup", pageController.artifactPopup);
router.get("/exhibits/:id", pageController.exhibitDetails);
router.get("/virtual-tour", pageController.virtualTour);
router.get("/virtual-tour/pharaoh", pageController.virtualTourPharaoh);
router.get("/virtual-tour/islamic", pageController.virtualTourIslamic);
router.get("/virtual-tour/christian", pageController.virtualTourChristian);
router.get("/vr-experience", pageController.vrExperience);
router.get("/games", pageController.games);
router.get("/games/quiz", pageController.gameQuiz);
router.get("/games/explorer", pageController.gameExplorer);
router.get("/games/pyramid", pageController.gamePyramid);
router.get("/shop", pageController.shop);
router.get("/cart", pageController.cart);
router.get("/checkout", pageController.checkout);
router.get("/testimonials", pageController.testimonials);
router.get("/plan-trip", pageController.planTrip);
router.get("/employee/dashboard", requireAuth, requirePermission("dashboard:role"), pageController.employeeDashboard);
router.get(
  "/employee/manager/tasks",
  requireAuth,
  requireAnyRole([ROLES.MUSEUM_MANAGER]),
  pageController.managerTasksDashboard
);
router.get(
  "/employee/manager/zones",
  requireAuth,
  requireAnyRole([ROLES.MUSEUM_MANAGER]),
  pageController.managerZonesDashboard
);

router.get("/login", (req, res) => res.redirect("/auth/login"));
router.get("/register", (req, res) => res.redirect("/auth/register"));


module.exports = router;

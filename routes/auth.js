const express = require("express");
const authController = require("../controllers/authController");
const { requireGuest } = require("../middleware/auth");
const { userValidation, loginValidation, handleValidation } = require("../middleware/validation");

const router = express.Router();

router.get("/register", requireGuest, authController.showRegister);
router.post("/register", userValidation, handleValidation, authController.register);

router.get("/login", requireGuest, authController.showLogin);
router.post("/login", loginValidation, handleValidation, authController.login);

router.post("/logout", authController.logout);

module.exports = router;

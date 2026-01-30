const express = require("express");
const usersController = require("../controllers/usersController");
const { requireAdmin } = require("../middleware/roles");
const { userValidation, handleValidation } = require("../middleware/validation");

const router = express.Router();

router.get("/", requireAdmin, usersController.list);
router.post("/", requireAdmin, userValidation, handleValidation, usersController.create);
router.put("/:id", requireAdmin, usersController.update);
router.delete("/:id", requireAdmin, usersController.remove);

module.exports = router;

const express = require("express");
const ticketsController = require("../controllers/ticketsController");
const { requireAdmin } = require("../middleware/roles");
const { ticketValidation, handleValidation } = require("../middleware/validation");

const router = express.Router();

router.get("/", ticketsController.list);
router.post("/", requireAdmin, ticketValidation, handleValidation, ticketsController.create);
router.put("/:id", requireAdmin, ticketValidation, handleValidation, ticketsController.update);
router.delete("/:id", requireAdmin, ticketsController.remove);

module.exports = router;

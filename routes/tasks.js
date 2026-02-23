const express = require("express");
const tasksController = require("../controllers/tasksController");
const { requireAuth } = require("../middleware/auth");
const { requirePermission } = require("../middleware/roles");
const { taskValidation, taskStatusValidation, handleValidation } = require("../middleware/validation");

const router = express.Router();

router.get("/", requireAuth, requirePermission("task:view_own"), tasksController.list);
router.post("/", requireAuth, requirePermission("task:create"), taskValidation, handleValidation, tasksController.create);
router.put("/:id", requireAuth, requirePermission("task:assign"), taskValidation, handleValidation, tasksController.update);
router.patch("/:id/status", requireAuth, requirePermission("task:update_own_status"), taskStatusValidation, handleValidation, tasksController.updateStatus);
router.delete("/:id", requireAuth, requirePermission("task:assign"), tasksController.remove);

module.exports = router;

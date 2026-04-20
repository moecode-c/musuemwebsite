const { body, validationResult } = require("express-validator");

const allowedRoles = [
  "user",
  "admin",
  "museum_manager",
  "curator",
  "front_desk",
  "security_officer",
  "maintenance_technician",
  "janitor",
  "educator_guide"
];

const allowedExhibitCategories = ["Pharaoh", "Islamic", "Christian"];

const exhibitCategoryAliases = {
  pharaoh: "Pharaoh",
  pharaonic: "Pharaoh",
  islamic: "Islamic",
  christian: "Christian",
  coptic: "Christian"
};

const normalizeExhibitCategory = (value) => {
  if (typeof value !== "string") return "";
  const normalized = value.trim().toLowerCase();
  if (!normalized) return "";
  return exhibitCategoryAliases[normalized] || value.trim();
};

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return next();
};

const userValidation = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name is required"),
  body("email").isEmail({ require_tld: false }).withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be 6+ chars"),
  body("role").optional().isIn(allowedRoles).withMessage("Invalid role")
];

const loginValidation = [
  body("email").isEmail({ require_tld: false }).withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required")
];

const exhibitValidation = [
  body("title").trim().isLength({ min: 2 }).withMessage("Title required"),
  body("category")
    .customSanitizer((value) => normalizeExhibitCategory(value))
    .isIn(allowedExhibitCategories)
    .withMessage("Category must be Pharaoh, Islamic, or Christian"),
  body("description").trim().isLength({ min: 10 }).withMessage("Description required")
];


const productValidation = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name required"),
  body("price").isFloat({ min: 0 }).withMessage("Price required")
];

const mapPinValidation = [
  body("label").trim().isLength({ min: 2 }).withMessage("Label required"),
  body("x").isFloat({ min: 0, max: 100 }).withMessage("X coordinate 0-100"),
  body("y").isFloat({ min: 0, max: 100 }).withMessage("Y coordinate 0-100"),
  body("isCommon").optional().isBoolean().toBoolean()
];

const ticketValidation = [
  body("group").isIn(["egyptian", "arab", "foreigner"]).withMessage("Group required"),
  body("audience").isIn(["adult", "student", "child", "senior"]).withMessage("Audience required"),
  body("price").isFloat({ min: 0 }).withMessage("Price required")
];

const ticketRequestValidation = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name required"),
  body("age").isInt({ min: 1 }).withMessage("Valid age required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("nationality").trim().isLength({ min: 2 }).withMessage("Nationality required"),
  body("phone").trim().isLength({ min: 6 }).withMessage("Phone required"),
  body("category").isIn(["egyptian", "arab", "foreigner"]).withMessage("Category required"),
  body("audience").isIn(["adult", "student", "child", "senior"]).withMessage("Audience required"),
  body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be 1+"),
  body("date").trim().notEmpty().withMessage("Date required"),
  body("timeSlot").trim().notEmpty().withMessage("Time slot required")
];

const testimonialValidation = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name required"),
  body("message").trim().isLength({ min: 10 }).withMessage("Message required")
];

const newsletterValidation = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name required"),
  body("phone").trim().isLength({ min: 6 }).withMessage("Phone required"),
  body("email").isEmail().withMessage("Valid email required")
];

const taskValidation = [
  body("title").trim().isLength({ min: 2 }).withMessage("Title is required"),
  body("description").optional().isString().withMessage("Description must be text"),
  body("priority").optional().isIn(["low", "medium", "high", "urgent"]).withMessage("Invalid priority"),
  body("assignedTo").isMongoId().withMessage("Assigned user is required"),
  body("roleTarget").optional().isIn(allowedRoles).withMessage("Invalid role target"),
  body("zoneId").optional({ values: "falsy" }).isMongoId().withMessage("Invalid zone"),
  body("dueAt").optional({ values: "falsy" }).isISO8601().withMessage("Invalid due date")
];

const taskStatusValidation = [
  body("status")
    .isIn(["new", "assigned", "in_progress", "completed", "verified"])
    .withMessage("Invalid status"),
  body("completionNote").optional().isString().withMessage("Completion note must be text"),
  body("proofPhotos").optional().isArray().withMessage("Proof photos must be an array")
];

const cleaningZoneValidation = [
  body("zoneName").trim().isLength({ min: 2 }).withMessage("Zone name is required"),
  body("floor").optional().trim().isLength({ min: 1 }).withMessage("Floor is required"),
  body("description").optional().isString().withMessage("Description must be text"),
  body("color")
    .optional({ values: "falsy" })
    .matches(/^#([0-9a-fA-F]{6})$/)
    .withMessage("Color must be a valid hex color"),
  body("polygon")
    .custom((value) => {
      let parsed = value;
      if (typeof value === "string") {
        parsed = JSON.parse(value);
      }

      if (!Array.isArray(parsed) || parsed.length < 3) {
        throw new Error("Polygon must include at least 3 points");
      }

      const validPoints = parsed.every(
        (point) =>
          point &&
          Number.isFinite(Number(point.x)) &&
          Number(point.x) >= 0 &&
          Number(point.x) <= 100 &&
          Number.isFinite(Number(point.y)) &&
          Number(point.y) >= 0 &&
          Number(point.y) <= 100
      );

      if (!validPoints) {
        throw new Error("Invalid polygon points");
      }

      return true;
    })
    .withMessage("Invalid polygon")
];

const cleaningZoneAssignValidation = [
  body("assignedTo")
    .optional({ values: "falsy" })
    .isMongoId()
    .withMessage("Assigned user must be a valid user id")
];

const ticketRequestToTaskValidation = [
  body("assignedTo").isMongoId().withMessage("Assigned user is required"),
  body("priority").optional().isIn(["low", "medium", "high", "urgent"]).withMessage("Invalid priority"),
  body("dueAt").optional({ values: "falsy" }).isISO8601().withMessage("Invalid due date")
];

module.exports = {
  handleValidation,
  userValidation,
  loginValidation,
  exhibitValidation,
  productValidation,
  mapPinValidation,
  ticketValidation,
  ticketRequestValidation,
  testimonialValidation,
  newsletterValidation,
  taskValidation,
  taskStatusValidation,
  cleaningZoneValidation,
  cleaningZoneAssignValidation,
  ticketRequestToTaskValidation
};

const { body, validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return next();
};

const userValidation = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be 6+ chars")
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required")
];

const exhibitValidation = [
  body("title").trim().isLength({ min: 2 }).withMessage("Title required"),
  body("category").trim().isLength({ min: 2 }).withMessage("Category required"),
  body("description").trim().isLength({ min: 10 }).withMessage("Description required")
];


const productValidation = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name required"),
  body("price").isFloat({ min: 0 }).withMessage("Price required")
];

const mapPinValidation = [
  body("label").trim().isLength({ min: 2 }).withMessage("Label required"),
  body("x").isFloat({ min: 0, max: 100 }).withMessage("X coordinate 0-100"),
  body("y").isFloat({ min: 0, max: 100 }).withMessage("Y coordinate 0-100")
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
  body("email").isEmail().withMessage("Valid email required")
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
  newsletterValidation
};

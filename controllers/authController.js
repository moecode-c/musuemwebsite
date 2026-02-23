const bcrypt = require("bcrypt");
const User = require("../models/User");
const { asyncHandler } = require("../utils/asyncHandler");
const { getDashboardPathByRole } = require("../middleware/roles");

const showRegister = (req, res) => {
  res.render("auth/register", { pageTitle: "Register", pageCss: "register" });
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash, role: "user" });
  req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };
  return res.json({ message: "Registered", redirect: getDashboardPathByRole(user.role) });
});

const showLogin = (req, res) => {
  res.render("auth/login", { pageTitle: "Login", pageCss: "login" });
};

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };
  return res.json({ message: "Logged in", redirect: getDashboardPathByRole(user.role) });
});

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

module.exports = { showRegister, register, showLogin, login, logout };

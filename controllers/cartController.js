const Product = require("../models/Product");
const { asyncHandler } = require("../utils/asyncHandler");

const getCart = (req, res) => {
  const cart = req.session.cart || { items: [], total: 0 };
  res.json(cart);
};

const addToCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  const cart = req.session.cart || { items: [], total: 0 };
  const existing = cart.items.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.items.push({ id: productId, name: product.name, price: product.price, quantity: 1 });
  }
  cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  req.session.cart = cart;
  res.json(cart);
});

const updateCart = (req, res) => {
  const { productId, quantity } = req.body;
  const cart = req.session.cart || { items: [], total: 0 };
  const item = cart.items.find((entry) => entry.id === productId);
  if (item) {
    item.quantity = Math.max(1, parseInt(quantity, 10));
  }
  cart.total = cart.items.reduce((sum, entry) => sum + entry.price * entry.quantity, 0);
  req.session.cart = cart;
  res.json(cart);
};

const removeFromCart = (req, res) => {
  const { productId } = req.body;
  const cart = req.session.cart || { items: [], total: 0 };
  cart.items = cart.items.filter((entry) => entry.id !== productId);
  cart.total = cart.items.reduce((sum, entry) => sum + entry.price * entry.quantity, 0);
  req.session.cart = cart;
  res.json(cart);
};

module.exports = { getCart, addToCart, updateCart, removeFromCart };

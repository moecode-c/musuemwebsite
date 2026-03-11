const Product = require("../models/Product");
const { asyncHandler } = require("../utils/asyncHandler");

const getCart = (req, res) => {
  const cart = req.session.cart || { items: [], total: 0 };
  res.json(cart);
};

const renderCheckout = (req, res) => {
  const cart = req.session.cart || { items: [], total: 0 };
  res.render("shop/cart-checkout", {
    pageTitle: "Checkout",
    pageCss: "checkout",
    cart,
    items: cart.items || [],
    total: cart.total?.toFixed ? cart.total.toFixed(2) : Number(cart.total || 0).toFixed(2)
  });
};

const renderPayment = (req, res) => {
  const cart = req.session.cart || { items: [], total: 0 };
  res.render("shop/cart-payment", {
    pageTitle: "Payment & Delivery",
    pageCss: "checkout",
    cart,
    items: cart.items || [],
    total: cart.total?.toFixed ? cart.total.toFixed(2) : Number(cart.total || 0).toFixed(2)
  });
};

const processPayment = (req, res) => {
  const cart = req.session.cart || { items: [], total: 0 };
  if (!cart.items || cart.items.length === 0) {
    return res.redirect("/cart/checkout");
  }

  const {
    paymentMethod = "card",
    deliveryOption = "delivery",
    deliveryDate = "",
    deliveryWindow = "",
    pickupSpot = "",
    notes = "",
    cardName = "",
    cardNumber = "",
    expiry = "",
    cvc = ""
  } = req.body || {};

  const order = {
    id: Date.now().toString(),
    items: cart.items || [],
    total: cart.total || 0,
    paymentMethod,
    deliveryOption,
    deliveryDate,
    deliveryWindow,
    pickupSpot,
    notes,
    cardName,
    cardNumber,
    expiry,
    cvc,
    createdAt: new Date()
  };

  req.session.orders = req.session.orders || [];
  req.session.orders.push(order);
  req.session.lastOrder = order;

  // Clear cart after storing the order
  req.session.cart = { items: [], total: 0 };

  return res.redirect("/cart/confirmation");
};

const renderConfirmation = (req, res) => {
  const order = req.session.lastOrder;
  if (!order) {
    return res.redirect("/cart/checkout");
  }

  res.render("shop/cart-confirmation", {
    pageTitle: "Order Confirmed",
    pageCss: "checkout",
    order
  });
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

module.exports = {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  renderCheckout,
  renderPayment,
  processPayment,
  renderConfirmation
};

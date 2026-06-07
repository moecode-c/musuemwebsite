const Product = require("../models/Product");
const Order = require("../models/Order");
const { asyncHandler } = require("../utils/asyncHandler");

const formatTotal = (cart) =>
  cart.total?.toFixed ? cart.total.toFixed(2) : Number(cart.total || 0).toFixed(2);

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
    total: formatTotal(cart),
    details: req.session.checkout || {},
    error: req.query.error === "1"
  });
};

// Step 1 of checkout: capture the customer's delivery/contact details, then
// move on to payment. Previously this step was done only on the client and the
// details were thrown away — now they are validated and stored on the session.
const submitCheckoutDetails = (req, res) => {
  const cart = req.session.cart || { items: [], total: 0 };
  if (!cart.items || cart.items.length === 0) {
    return res.redirect("/cart");
  }

  const {
    name = "",
    email = "",
    phone = "",
    address = "",
    city = "",
    notes = ""
  } = req.body || {};

  // Backend validation (the form also enforces these client-side).
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  if (!name.trim() || !emailLooksValid || !address.trim()) {
    return res.redirect("/cart/checkout?error=1");
  }

  req.session.checkout = {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    address: address.trim(),
    city: city.trim(),
    notes: notes.trim()
  };

  return res.redirect("/cart/payment");
};

const renderPayment = (req, res) => {
  const cart = req.session.cart || { items: [], total: 0 };
  res.render("shop/cart-payment", {
    pageTitle: "Payment & Delivery",
    pageCss: "checkout",
    cart,
    items: cart.items || [],
    total: formatTotal(cart)
  });
};

// Step 2 of checkout: record payment/delivery choices, persist the order to the
// database (so it appears in the admin dashboard), then clear the cart.
const processPayment = asyncHandler(async (req, res) => {
  const cart = req.session.cart || { items: [], total: 0 };
  if (!cart.items || cart.items.length === 0) {
    return res.redirect("/cart/checkout");
  }

  const checkout = req.session.checkout || {};
  const {
    paymentMethod = "card",
    deliveryOption = "delivery",
    deliveryDate = "",
    deliveryWindow = "",
    pickupSpot = "",
    notes = ""
  } = req.body || {};

  const items = cart.items.map((item) => ({
    productId: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity
  }));

  const order = await Order.create({
    items,
    total: cart.total || 0,
    customer: {
      name: checkout.name || "",
      email: checkout.email || "",
      phone: checkout.phone || "",
      address: checkout.address || "",
      city: checkout.city || "",
      notes: checkout.notes || ""
    },
    payment: { method: paymentMethod },
    delivery: {
      option: deliveryOption,
      date: deliveryDate,
      window: deliveryWindow,
      pickupSpot,
      notes
    },
    status: "pending",
    user: req.session.user ? req.session.user.id : null
  });

  // Flat snapshot for the confirmation page (keeps that view unchanged).
  req.session.lastOrder = {
    id: order._id.toString(),
    items: order.items.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })),
    total: order.total,
    paymentMethod: order.payment.method,
    deliveryOption: order.delivery.option,
    deliveryDate: order.delivery.date,
    deliveryWindow: order.delivery.window,
    pickupSpot: order.delivery.pickupSpot,
    notes: order.delivery.notes,
    createdAt: order.createdAt
  };

  // Clear the cart and the saved checkout details after a successful order.
  req.session.cart = { items: [], total: 0 };
  req.session.checkout = null;

  return res.redirect("/cart/confirmation");
});

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
  submitCheckoutDetails,
  renderPayment,
  processPayment,
  renderConfirmation
};

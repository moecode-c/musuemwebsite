const updateCartUI = (cart) => {
  const totalEl = document.getElementById("cart-total");
  if (totalEl) {
    totalEl.textContent = cart.total.toFixed(2);
  }
  const itemsEl = document.getElementById("cart-items");
  if (itemsEl) {
    itemsEl.innerHTML = cart.items
      .map(
        (item) => `
        <div class="cart-item">
          <span>${item.name}</span>
          <span>EGP ${item.price.toFixed(2)}</span>
          <span>Qty: ${item.quantity}</span>
        </div>
      `
      )
      .join("");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const productId = btn.dataset.id;
      const response = await fetch("/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId })
      });
      if (response.ok) {
        const cart = await response.json();
        updateCartUI(cart);
      }
    });
  });
});

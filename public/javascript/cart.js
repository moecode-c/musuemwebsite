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

  const countEl = document.getElementById("cart-count");
  if (countEl) {
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    countEl.textContent = itemCount;
  }
};

const showCartToast = (message) => {
  const toast = document.getElementById("cart-toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  setTimeout(() => toast.classList.remove("is-visible"), 2000);
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const productId = btn.dataset.id;
      if (!productId) return;
      btn.disabled = true;
      try {
        const response = await fetch("/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId })
        });
        if (!response.ok) {
          const message = (await response.json().catch(() => null))?.message || "Could not add to cart";
          showCartToast(message);
          return;
        }
        const cart = await response.json();
        updateCartUI(cart);
        const productName = btn.dataset.name || "Item";
        showCartToast(`${productName} added to cart`);
      } catch (err) {
        showCartToast("Network issue. Please try again.");
      } finally {
        btn.disabled = false;
      }
    });
  });

  const checkoutForm = document.getElementById("product-checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
    window.location.href = "/cart/payment";
    });
  }

  const paymentForm = document.getElementById("payment-delivery-form");
  if (paymentForm) {
    // Let the form submit normally to process payment server-side
    paymentForm.addEventListener("submit", () => {
      const button = paymentForm.querySelector("button[type='submit']");
      if (button) button.disabled = true;
    });

    const paymentRadios = document.querySelectorAll("input[name='paymentMethod']");
    const cardFields = document.querySelector(".card-fields");
    const cardNote = document.querySelector(".card-fields-note");
    const cardInputs = cardFields ? cardFields.querySelectorAll("input") : [];

    const syncCardFields = () => {
      const isCard = document.querySelector("input[name='paymentMethod'][value='card']")?.checked;
      if (!cardFields) return;
      cardFields.classList.toggle("is-hidden", !isCard);
      if (cardNote) cardNote.classList.toggle("is-hidden", !isCard);
      cardInputs.forEach((input) => {
        input.disabled = !isCard;
      });
    };

    paymentRadios.forEach((radio) => {
      radio.addEventListener("change", syncCardFields);
    });

    syncCardFields();
  }
});

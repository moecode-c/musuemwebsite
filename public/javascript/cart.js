const cartLocale = document.documentElement.lang === "ar" ? "ar" : "en";
const cartI18n = cartLocale === "ar"
  ? {
    qty: "الكمية",
    couldNotAdd: "تعذر الإضافة إلى السلة",
    itemFallback: "منتج",
    addedToCart: "تمت إضافته إلى السلة",
    networkIssue: "مشكلة في الشبكة. حاول مرة أخرى."
  }
  : {
    qty: "Qty",
    couldNotAdd: "Could not add to cart",
    itemFallback: "Item",
    addedToCart: "added to cart",
    networkIssue: "Network issue. Please try again."
  };

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
          <span>${cartI18n.qty}: ${item.quantity}</span>
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
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (!response.ok) {
          const message = (await response.json().catch(() => null))?.message || cartI18n.couldNotAdd;
          showCartToast(message);
          return;
        }
        const cart = await response.json();
        updateCartUI(cart);
        const productName = btn.dataset.name || cartI18n.itemFallback;
        showCartToast(`${productName} ${cartI18n.addedToCart}`);
      } catch (err) {
        showCartToast(cartI18n.networkIssue);
      } finally {
        btn.disabled = false;
      }
    });
  });

  // Cart page: quantity steppers and remove buttons (use /cart/update and /cart/remove).
  document.querySelectorAll("#cart-items [data-cart-action]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const action = btn.dataset.cartAction; // inc | dec | remove
      const productId = btn.dataset.id;
      const currentQty = Number(btn.dataset.qty || 1);
      if (!productId) return;
      btn.disabled = true;
      try {
        if (action === "remove") {
          await fetch("/cart/remove", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId })
          });
        } else {
          const quantity = action === "inc" ? currentQty + 1 : Math.max(1, currentQty - 1);
          await fetch("/cart/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity })
          });
        }
        window.location.reload();
      } catch (err) {
        btn.disabled = false;
        showCartToast(cartI18n.networkIssue);
      }
    });
  });

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

// Admin Orders page: confirm / fulfil / cancel / delete orders via the API.
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".admin-orders");
  if (!container) return;

  const isArabic = document.documentElement.lang === "ar";
  const messageEl = document.getElementById("admin-order-message");
  const setMsg = (m) => {
    if (messageEl) messageEl.textContent = m || "";
  };

  container.querySelectorAll("[data-order-action]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const action = btn.dataset.orderAction; // confirmed | fulfilled | cancelled | delete
      if (!id) return;

      if (action === "delete" && !window.confirm(isArabic ? "حذف هذا الطلب؟" : "Delete this order permanently?")) {
        return;
      }

      // Disable all buttons in this card while the request runs (prevents double clicks).
      const card = btn.closest(".admin-order-card");
      const buttons = card ? card.querySelectorAll("button") : [btn];
      buttons.forEach((b) => (b.disabled = true));
      setMsg("");

      try {
        let response;
        if (action === "delete") {
          response = await fetch(`/api/orders/${id}`, { method: "DELETE" });
        } else {
          response = await fetch(`/api/orders/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: action })
          });
        }

        if (!response.ok) {
          setMsg(isArabic ? "تعذر تحديث الطلب." : "Could not update the order.");
          buttons.forEach((b) => (b.disabled = false));
          return;
        }

        window.location.reload();
      } catch (error) {
        setMsg(isArabic ? "مشكلة في الشبكة. حاول مرة أخرى." : "Network issue. Please try again.");
        buttons.forEach((b) => (b.disabled = false));
      }
    });
  });

  // Orders search + status filter
  const orderSearch = document.getElementById("order-search");
  const orderStatusFilter = document.getElementById("order-status-filter");
  const applyOrderFilter = () => {
    const q = ((orderSearch && orderSearch.value) || "").trim().toLowerCase();
    const status = (orderStatusFilter && orderStatusFilter.value) || "";
    document.querySelectorAll("#admin-order-list .admin-order-card").forEach((card) => {
      const matchesText = !q || card.textContent.toLowerCase().includes(q);
      const matchesStatus = !status || card.dataset.status === status;
      card.style.display = matchesText && matchesStatus ? "" : "none";
    });
  };
  if (orderSearch) orderSearch.addEventListener("input", applyOrderFilter);
  if (orderStatusFilter) orderStatusFilter.addEventListener("change", applyOrderFilter);
});

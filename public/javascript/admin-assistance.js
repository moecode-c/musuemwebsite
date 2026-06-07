// Admin Assistance Requests page: update status / delete via the API.
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("[data-assist-action]");
  if (!buttons.length) return;

  const isArabic = document.documentElement.lang === "ar";
  const messageEl = document.getElementById("admin-assist-message");
  const setMsg = (m) => {
    if (messageEl) messageEl.textContent = m || "";
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const action = btn.dataset.assistAction; // new | in_progress | resolved | delete
      if (!id) return;

      if (action === "delete" && !window.confirm(isArabic ? "حذف هذا الطلب؟" : "Delete this request?")) {
        return;
      }

      const card = btn.closest(".admin-order-card");
      const cardButtons = card ? card.querySelectorAll("button") : [btn];
      cardButtons.forEach((b) => (b.disabled = true));
      setMsg("");

      try {
        let response;
        if (action === "delete") {
          response = await fetch(`/api/assistance/${id}`, { method: "DELETE" });
        } else {
          response = await fetch(`/api/assistance/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: action })
          });
        }

        if (!response.ok) {
          setMsg(isArabic ? "تعذر تحديث الطلب." : "Could not update the request.");
          cardButtons.forEach((b) => (b.disabled = false));
          return;
        }

        window.location.reload();
      } catch (error) {
        setMsg(isArabic ? "مشكلة في الشبكة. حاول مرة أخرى." : "Network issue. Please try again.");
        cardButtons.forEach((b) => (b.disabled = false));
      }
    });
  });
});

// Admin Ticket Overview: accept / reject / reset ticket requests.
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("[data-ticketreq-action]");
  if (!buttons.length) return;

  const isArabic = document.documentElement.lang === "ar";
  const messageEl = document.getElementById("admin-ticketreq-message");
  const setMsg = (m) => {
    if (messageEl) messageEl.textContent = m || "";
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const status = btn.dataset.ticketreqAction; // accepted | rejected | pending
      if (!id) return;

      const card = btn.closest(".admin-order-card");
      const cardButtons = card ? card.querySelectorAll("button") : [btn];
      cardButtons.forEach((b) => (b.disabled = true));
      setMsg("");

      try {
        const response = await fetch(`/api/ticket-requests/${id}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status })
        });
        if (!response.ok) {
          setMsg(isArabic ? "تعذر تحديث التذكرة." : "Could not update the ticket.");
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

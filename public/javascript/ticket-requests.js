document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ticket-request-form");
  if (!form) return;

  const isArabic = document.documentElement.lang === "ar";
  const text = isArabic
    ? {
      success: "تم إرسال طلب التذكرة.",
      failure: "تعذر إرسال طلب التذكرة."
    }
    : {
      success: "Ticket request submitted.",
      failure: "Unable to submit ticket request."
    };

  const messageEl = document.getElementById("ticket-request-message");
  const categoryInput = document.getElementById("ticket-category");
  const audienceInput = document.getElementById("ticket-audience");

  document.querySelectorAll("input[name='ticketOption']").forEach((option) => {
    option.addEventListener("change", () => {
      categoryInput.value = option.dataset.group || "";
      audienceInput.value = option.dataset.audience || "";
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(form));
    const response = await fetch("/api/ticket-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (messageEl) {
      messageEl.textContent = response.ok ? text.success : text.failure;
    }
    if (response.ok) {
      form.reset();
    }
  });
});

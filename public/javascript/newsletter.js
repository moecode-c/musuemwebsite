document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = { email: formData.get("email") };
    const response = await fetch("/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    const messageEl = document.getElementById("newsletter-message");
    if (messageEl) {
      messageEl.textContent = data.message || "Subscription complete";
    }
    form.reset();
  });
});

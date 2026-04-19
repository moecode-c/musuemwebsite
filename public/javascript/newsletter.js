document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsletter-form");
  if (!form) return;
  const messageEl = document.getElementById("newsletter-message");
  const submitButton = form.querySelector(".btn-subscribe");

  const setMessage = (message, type = "") => {
    if (!messageEl) return;
    messageEl.textContent = message || "";
    messageEl.classList.remove("is-success", "is-error");
    if (type === "success") messageEl.classList.add("is-success");
    if (type === "error") messageEl.classList.add("is-error");
  };

  const setSubmittingState = (isSubmitting) => {
    if (!submitButton) return;
    const defaultText = submitButton.dataset.defaultText || submitButton.textContent.trim() || "Submit";
    submitButton.disabled = isSubmitting;
    submitButton.classList.toggle("is-loading", isSubmitting);
    submitButton.textContent = isSubmitting ? `${defaultText}...` : defaultText;
  };

  form.addEventListener("input", () => {
    setMessage("");
  });

  form.addEventListener("submit", async(event) => {
    event.preventDefault();
    setSubmittingState(true);
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim()
    };

    try {
      const response = await fetch("/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      let data = {};
      try {
        data = await response.json();
      } catch (_error) {
        data = {};
      }

      if (!response.ok) {
        const firstValidationError = Array.isArray(data.errors) && data.errors.length > 0
          ? data.errors[0].msg
          : "";
        throw new Error(firstValidationError || data.message || "Unable to subscribe right now. Please try again.");
      }

      setMessage(data.message || "Subscription complete", "success");
      form.reset();
    } catch (error) {
      setMessage(error.message || "Unable to subscribe right now. Please try again.", "error");
    } finally {
      setSubmittingState(false);
    }
  });
});

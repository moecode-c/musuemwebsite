document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("testimonial-form");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const payload = {
        name: formData.get("name"),
        message: formData.get("message"),
        rating: Number(formData.get("rating"))
      };
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      const messageEl = document.getElementById("testimonial-message");
      if (messageEl) {
        messageEl.textContent = response.ok ? "Thank you for your feedback!" : data.message || "Unable to submit";
      }
      if (response.ok) {
        form.reset();
        window.location.reload();
      }
    });
  }

});

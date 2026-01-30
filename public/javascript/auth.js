const handleAuthForm = (formId, endpoint, messageId) => {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(form));
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    const messageEl = document.getElementById(messageId);
    if (messageEl) {
      messageEl.textContent = data.message || "Success";
    }
    if (response.ok && data.redirect) {
      window.location.href = data.redirect;
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  handleAuthForm("register-form", "/auth/register", "register-message");
  handleAuthForm("login-form", "/auth/login", "login-message");
});

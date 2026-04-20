const setAuthMessage = (messageEl, message, isError = true) => {
  if (!messageEl) return;
  messageEl.textContent = message;
  messageEl.classList.toggle("is-error", isError);
  messageEl.classList.toggle("is-success", !isError);
  messageEl.style.color = isError ? "#b23b3b" : "#2f7f4f";
};

const isArabic = document.documentElement.lang === "ar";
const authText = isArabic
  ? {
    success: "تم بنجاح",
    requestFailed: "فشل الطلب",
    networkIssue: "مشكلة في الشبكة. حاول مرة أخرى."
  }
  : {
    success: "Success",
    requestFailed: "Request failed",
    networkIssue: "Network issue. Please try again."
  };

const handleAuthForm = (formId, endpoint, messageId) => {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (typeof window.validateMuseumForm === "function" && !window.validateMuseumForm(form)) {
      return;
    }

    const messageEl = document.getElementById(messageId);

    try {
      const payload = Object.fromEntries(new FormData(form));
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      const message = data.message || data.errors?.[0]?.msg || (response.ok ? authText.success : authText.requestFailed);

      setAuthMessage(messageEl, message, !response.ok);

      if (response.ok && data.redirect) {
        window.location.href = data.redirect;
      }
    } catch (error) {
      setAuthMessage(messageEl, authText.networkIssue, true);
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  handleAuthForm("register-form", "/auth/register", "register-message");
  handleAuthForm("login-form", "/auth/login", "login-message");
});

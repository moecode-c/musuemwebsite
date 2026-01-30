const showMessage = (form, message, isError = true) => {
  const messageEl = form.querySelector(".form-message");
  if (messageEl) {
    messageEl.textContent = message;
    messageEl.style.color = isError ? "#b23b3b" : "#3b7c3b";
  }
};

const validateForm = (form) => {
  const requiredFields = form.querySelectorAll("[required]");
  for (const field of requiredFields) {
    if (!field.value.trim()) {
      showMessage(form, "Please fill in all required fields.");
      field.focus();
      return false;
    }
  }

  const emailInput = form.querySelector("input[type='email']");
  if (emailInput && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailInput.value)) {
    showMessage(form, "Please enter a valid email.");
    emailInput.focus();
    return false;
  }

  const passwordInput = form.querySelector("input[type='password']");
  if (passwordInput && passwordInput.value.length < 6) {
    showMessage(form, "Password must be at least 6 characters.");
    passwordInput.focus();
    return false;
  }

  return true;
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!validateForm(form)) {
        event.preventDefault();
      }
    });
  });
});

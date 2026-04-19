document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".theme-toggle");
  const savedTheme = localStorage.getItem("museum-theme");
  const resolveThemeLabel = (toggle) => toggle.dataset.themeLabel || "Theme";

  const applyToggleMarkup = (isLight) => {
    toggles.forEach((toggle) => {
      if (toggle.dataset.compact === "true") {
        toggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      } else {
        const themeLabel = resolveThemeLabel(toggle);
        toggle.innerHTML = isLight
          ? `<i class="nav-icon fas fa-sun"></i>${themeLabel}`
          : `<i class="nav-icon fas fa-moon"></i>${themeLabel}`;
      }
    });
  };

  if (savedTheme === "light") {
    document.documentElement.classList.add("theme-light");
  }

  applyToggleMarkup(document.documentElement.classList.contains("theme-light"));

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      document.documentElement.classList.toggle("theme-light");
      const isLight = document.documentElement.classList.contains("theme-light");
      localStorage.setItem("museum-theme", isLight ? "light" : "dark");
      applyToggleMarkup(isLight);
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".theme-toggle");
  const savedTheme = localStorage.getItem("museum-theme");

  const applyToggleMarkup = (isLight) => {
    toggles.forEach((toggle) => {
      if (toggle.dataset.compact === "true") {
        toggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      } else {
        toggle.innerHTML = isLight
          ? '<i class="nav-icon fas fa-sun"></i>Theme'
          : '<i class="nav-icon fas fa-moon"></i>Theme';
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

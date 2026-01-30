document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mouseenter", () => btn.classList.add("btn-hover"));
    btn.addEventListener("mouseleave", () => btn.classList.remove("btn-hover"));
  });

  const header = document.querySelector(".site-header");

  const updateHeaderState = () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

});

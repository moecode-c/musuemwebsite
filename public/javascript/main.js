document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mouseenter", () => btn.classList.add("btn-hover"));
    btn.addEventListener("mouseleave", () => btn.classList.remove("btn-hover"));
  });
});

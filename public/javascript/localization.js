document.addEventListener("DOMContentLoaded", () => {
  const lang = document.documentElement.lang || "en";
  if (lang === "ar") {
    document.body.classList.add("rtl");
    document.documentElement.dir = "rtl";
  }
});

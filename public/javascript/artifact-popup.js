(function () {
  var popup = document.getElementById("artifact-popup");
  var openBtn = document.querySelector("[data-open-artifact-popup]");
  var closeBtn = document.querySelector("[data-close-artifact-popup]");

  if (!popup || !openBtn || !closeBtn) return;

  var dialog = popup.querySelector(".artifact-popup-dialog");
  var tabs = popup.querySelectorAll("[data-artifact-popup-tab]");
  var panels = popup.querySelectorAll("[data-artifact-popup-panel]");

  function openPopup() {
    popup.hidden = false;
    popup.setAttribute("aria-hidden", "false");
    document.body.classList.add("artifact-popup-open");
    dialog.focus();
  }

  function closePopup() {
    popup.hidden = true;
    popup.setAttribute("aria-hidden", "true");
    document.body.classList.remove("artifact-popup-open");
    openBtn.focus();
  }

  function setTab(name) {
    tabs.forEach(function (tab) {
      var active = tab.getAttribute("data-artifact-popup-tab") === name;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });

    panels.forEach(function (panel) {
      var active = panel.getAttribute("data-artifact-popup-panel") === name;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  }

  openBtn.addEventListener("click", openPopup);
  closeBtn.addEventListener("click", closePopup);

  popup.addEventListener("click", function (event) {
    if (event.target === popup) closePopup();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !popup.hidden) closePopup();
  });

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      setTab(tab.getAttribute("data-artifact-popup-tab"));
    });
  });
})();

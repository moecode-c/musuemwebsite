(function () {
  var closeBtn = document.querySelector("[data-close-artifact-popup]");
  var tabs = Array.prototype.slice.call(document.querySelectorAll("[data-tab]"));
  var panels = Array.prototype.slice.call(document.querySelectorAll("[data-panel]"));

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      if (window.history.length > 1) {
        window.history.back();
        return;
      }
      window.location.href = "/exhibits";
    });
  }

  if (!tabs.length || !panels.length) return;

  function activateTab(tabName, moveFocus) {
    tabs.forEach(function (tab) {
      var isActive = tab.getAttribute("data-tab") === tabName;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      tab.setAttribute("tabindex", isActive ? "0" : "-1");

      if (isActive && moveFocus) {
        tab.focus();
      }
    });

    panels.forEach(function (panel) {
      var isActive = panel.getAttribute("data-panel") === tabName;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      activateTab(tab.getAttribute("data-tab"), false);
    });

    tab.addEventListener("keydown", function (event) {
      var nextIndex = null;

      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % tabs.length;
      }

      if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      }

      if (event.key === "Home") {
        nextIndex = 0;
      }

      if (event.key === "End") {
        nextIndex = tabs.length - 1;
      }

      if (nextIndex !== null) {
        event.preventDefault();
        activateTab(tabs[nextIndex].getAttribute("data-tab"), true);
      }
    });
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  const tooltip = document.getElementById("map-tooltip");
  let activePop = null;
  const setPinPosition = (pin) => {
    const x = pin.dataset.x;
    const y = pin.dataset.y;
    if (x && y) {
      pin.style.left = `${x}%`;
      pin.style.top = `${y}%`;
    }
  };

  const showPinPop = (pin) => {
    if (!pin) return;
    if (activePop) {
      activePop.remove();
      activePop = null;
    }
    const pop = document.createElement("div");
    pop.className = "map-pin-pop";
    pop.textContent = `${pin.dataset.label || ""}${pin.dataset.description ? `: ${pin.dataset.description}` : ""}`;
    pin.appendChild(pop);
    activePop = pop;
  };

  document.querySelectorAll(".map-pin").forEach((pin) => {
    setPinPosition(pin);
    pin.addEventListener("mouseenter", () => {
      if (tooltip) {
        tooltip.textContent = `${pin.dataset.label}: ${pin.dataset.description}`;
      }
    });
    pin.addEventListener("click", (event) => {
      event.stopPropagation();
      if (tooltip) {
        tooltip.textContent = `${pin.dataset.label}: ${pin.dataset.description}`;
      }
      showPinPop(pin);
    });
  });

  const mapLayer = document.querySelector(".map-layer");
  const params = new URLSearchParams(window.location.search);
  const highlightX = params.get("x");
  const highlightY = params.get("y");
  if (mapLayer && highlightX && highlightY) {
    const highlightPin = document.createElement("div");
    highlightPin.className = "map-pin map-pin-highlight";
    highlightPin.dataset.x = highlightX;
    highlightPin.dataset.y = highlightY;
    highlightPin.dataset.label = params.get("label") || "Exhibit";
    highlightPin.dataset.description = params.get("description") || "";
    mapLayer.appendChild(highlightPin);
    setPinPosition(highlightPin);
    highlightPin.addEventListener("mouseenter", () => {
      if (tooltip) {
        tooltip.textContent = `${highlightPin.dataset.label}: ${highlightPin.dataset.description}`;
      }
    });
    highlightPin.addEventListener("click", (event) => {
      event.stopPropagation();
      if (tooltip) {
        tooltip.textContent = `${highlightPin.dataset.label}: ${highlightPin.dataset.description}`;
      }
      showPinPop(highlightPin);
    });
    if (tooltip) {
      tooltip.textContent = `${highlightPin.dataset.label}: ${highlightPin.dataset.description}`;
    }
  }

  document.addEventListener("click", () => {
    if (activePop) {
      activePop.remove();
      activePop = null;
    }
  });

  document.querySelectorAll(".common-pin-item").forEach((item) => {
    item.addEventListener("click", (event) => {
      event.stopPropagation();
      const x = item.dataset.x;
      const y = item.dataset.y;
      if (!mapLayer || !x || !y) return;
      const tempPin = mapLayer.querySelector(".map-pin-highlight") || document.createElement("div");
      if (!tempPin.classList.contains("map-pin-highlight")) {
        tempPin.className = "map-pin map-pin-highlight";
        mapLayer.appendChild(tempPin);
      }
      const label = item.querySelector("strong")?.textContent || "";
      const description = item.querySelector("span")?.textContent || "";
      tempPin.dataset.x = x;
      tempPin.dataset.y = y;
      tempPin.dataset.label = label;
      tempPin.dataset.description = description;
      setPinPosition(tempPin);
      if (tooltip) {
        tooltip.textContent = `${label}: ${description}`;
      }
      showPinPop(tempPin);
    });
  });

  const adminMap = document.getElementById("admin-map");
  const adminForm = document.getElementById("admin-map-form");
  const adminList = document.getElementById("admin-map-list");
  const adminCommonList = document.getElementById("admin-common-map-list");
  if (adminMap && adminForm) {
    const submitBtn = adminForm.querySelector(".admin-submit");
    const cancelBtn = adminForm.querySelector(".admin-cancel");

    const setEditing = (isEditing) => {
      if (!submitBtn) return;
      if (isEditing) {
        adminForm.classList.add("is-editing");
        submitBtn.textContent = "Update Pin";
      } else {
        adminForm.classList.remove("is-editing");
        submitBtn.textContent = "Create Pin";
        delete adminForm.dataset.editId;
        adminForm.reset();
      }
    };

    const renderPins = (container, items) => {
      if (!container) return;
      container.innerHTML = items
        .map(
          (pin) => `
          <div class="admin-item">
            <div class="admin-item-content">
              <strong>${pin.label}</strong>
              <span class="admin-item-meta">${pin.description || "No description"}</span>
              <span class="admin-item-meta">X: ${Number(pin.x).toFixed(2)}% • Y: ${Number(pin.y).toFixed(2)}%</span>
              ${pin.isCommon ? '<span class="admin-badge">Common</span>' : ""}
            </div>
            <div class="admin-actions">
              <button class="btn btn-secondary" data-action="edit" data-id="${pin._id}">Edit</button>
              <button class="btn" data-action="delete" data-id="${pin._id}">Delete</button>
            </div>
          </div>
        `
        )
        .join("");

      container.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const { action, id } = btn.dataset;
          if (action === "delete") {
            await fetch(`/api/map-pins/${id}`, { method: "DELETE" });
            loadPins();
            return;
          }
          if (action === "edit") {
            const pin = items.find((entry) => entry._id === id);
            if (!pin) return;
            adminForm.label.value = pin.label || "";
            adminForm.description.value = pin.description || "";
            adminForm.x.value = pin.x ?? "";
            adminForm.y.value = pin.y ?? "";
            adminForm.isCommon.checked = Boolean(pin.isCommon);
            adminForm.dataset.editId = pin._id;
            setEditing(true);
          }
        });
      });
    };

    const loadPins = async () => {
      const response = await fetch("/api/map-pins");
      const items = await response.json();
      const commonPins = items.filter((pin) => pin.isCommon);
      renderPins(adminCommonList, commonPins);
      renderPins(adminList, items);
      const adminLayer = adminMap.querySelector(".map-layer");
      if (adminLayer) {
        adminLayer.innerHTML = items
          .map(
            (pin) => `
            <div class="map-pin" data-x="${pin.x}" data-y="${pin.y}" data-label="${pin.label}" data-description="${pin.description}"></div>
          `
          )
          .join("");
        adminLayer.querySelectorAll(".map-pin").forEach((pin) => setPinPosition(pin));
      }
    };

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => setEditing(false));
    }

    adminMap.addEventListener("click", (event) => {
      const rect = adminMap.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      adminForm.querySelector("input[name='x']").value = x;
      adminForm.querySelector("input[name='y']").value = y;
    });

    adminForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(adminForm));
      payload.x = Number(payload.x);
      payload.y = Number(payload.y);
      payload.isCommon = adminForm.isCommon.checked;
      const editId = adminForm.dataset.editId;
      const response = await fetch(editId ? `/api/map-pins/${editId}` : "/api/map-pins", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const messageEl = document.getElementById("admin-map-message");
      messageEl.textContent = response.ok
        ? editId
          ? "Pin updated"
          : "Pin created"
        : "Error saving pin";
      if (response.ok) {
        setEditing(false);
        loadPins();
      }
    });

    loadPins();
  }
});

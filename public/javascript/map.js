document.addEventListener("DOMContentLoaded", () => {
  const tooltip = document.getElementById("map-tooltip");
  let activePop = null;
  const pointsToString = (points) => points.map((point) => `${point.x},${point.y}`).join(" ");

  const ensureZoneSvg = (container) => {
    if (!container) return null;
    let svg = container.querySelector(".map-zone-svg");
    if (!svg) {
      svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "map-zone-svg");
      svg.setAttribute("viewBox", "0 0 100 100");
      svg.setAttribute("preserveAspectRatio", "none");
      container.appendChild(svg);
    }
    return svg;
  };

  const drawZonePolygons = (svg, zones) => {
    if (!svg) return;
    svg.innerHTML = "";
    zones.forEach((zone) => {
      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      polygon.setAttribute("class", "map-zone-polygon");
      polygon.setAttribute("points", pointsToString(zone.polygon || []));
      polygon.setAttribute("title", zone.zoneName || "Cleaning Zone");
      svg.appendChild(polygon);
    });
  };
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
  const adminZoneForm = document.getElementById("admin-zone-form");
  const adminZoneList = document.getElementById("admin-zone-list");
  const adminZoneAssignUser = document.getElementById("admin-zone-assign-user");
  const adminZoneMessage = document.getElementById("admin-zone-message");
  if (adminMap && adminForm) {
    const zoneSvg = ensureZoneSvg(adminMap);
    const zoneClearPointsBtn = document.getElementById("admin-zone-clear-points");
    const submitBtn = adminForm.querySelector(".admin-submit");
    const cancelBtn = adminForm.querySelector(".admin-cancel");
    let currentZonePoints = [];

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
            <div class="map-pin" data-id="${pin._id}" data-x="${pin.x}" data-y="${pin.y}" data-label="${pin.label}" data-description="${pin.description}"></div>
          `
          )
          .join("");
        adminLayer.querySelectorAll(".map-pin").forEach((pinEl) => {
          setPinPosition(pinEl);
          // Click a pin on the map to load its full details into the form for editing.
          pinEl.addEventListener("click", (event) => {
            event.stopPropagation();
            const pin = items.find((entry) => entry._id === pinEl.dataset.id);
            if (!pin) return;
            adminForm.label.value = pin.label || "";
            adminForm.description.value = pin.description || "";
            adminForm.x.value = pin.x ?? "";
            adminForm.y.value = pin.y ?? "";
            adminForm.isCommon.checked = Boolean(pin.isCommon);
            adminForm.dataset.editId = pin._id;
            setEditing(true);
            const messageEl = document.getElementById("admin-map-message");
            if (messageEl) messageEl.textContent = `Editing pin: ${pin.label}`;
          });
        });
      }
    };

    const drawCurrentZonePreview = () => {
      if (!zoneSvg) return;
      const previewId = "admin-zone-preview";
      const existingPreview = document.getElementById(previewId);
      if (existingPreview) {
        existingPreview.remove();
      }

      if (currentZonePoints.length < 3) return;

      const preview = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      preview.setAttribute("id", previewId);
      preview.setAttribute("class", "map-zone-polygon map-zone-polygon-preview");
      preview.setAttribute("points", pointsToString(currentZonePoints));
      zoneSvg.appendChild(preview);
    };

    const formatRole = (role) =>
      String(role || "")
        .split("_")
        .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : part))
        .join(" ");

    const loadUsers = async () => {
      if (!adminZoneAssignUser) return;
      const response = await fetch("/api/users/assignable");
      const users = await response.json();
      adminZoneAssignUser.innerHTML = `<option value="">Select employee</option>${users
        .map((user) => `<option value="${user._id}">${user.name} (${formatRole(user.role)})</option>`)
        .join("")}`;
    };

    const loadZones = async () => {
      if (!adminZoneList) return;
      const response = await fetch("/api/cleaning-zones");
      const zones = await response.json();

      drawZonePolygons(zoneSvg, zones);
      drawCurrentZonePreview();

      adminZoneList.innerHTML = zones
        .map(
          (zone) => `
            <div class="admin-item">
              <div class="admin-item-content">
                <strong>${zone.zoneName}</strong>
                <span class="admin-item-meta">Floor: ${zone.floor || "Ground"}</span>
                ${zone.roleTarget ? `<span class="admin-item-meta">Type: ${formatRole(zone.roleTarget)}</span>` : ""}
                <span class="admin-item-meta">Assigned: ${zone.assignedTo ? `${zone.assignedTo.name} (${formatRole(zone.assignedTo.role)})` : "Unassigned"}</span>
              </div>
              <div class="admin-actions">
                <button class="btn btn-secondary" data-zone-action="assign" data-zone-id="${zone._id}">Assign</button>
                <button class="btn" data-zone-action="delete" data-zone-id="${zone._id}">Delete</button>
              </div>
            </div>
          `
        )
        .join("");

      adminZoneList.querySelectorAll("button[data-zone-action]").forEach((button) => {
        button.addEventListener("click", async () => {
          const action = button.dataset.zoneAction;
          const zoneId = button.dataset.zoneId;

          if (action === "delete") {
            await fetch(`/api/cleaning-zones/${zoneId}`, { method: "DELETE" });
            loadZones();
            return;
          }

          if (action === "assign") {
            if (!adminZoneAssignUser || !adminZoneAssignUser.value) {
              if (adminZoneMessage) adminZoneMessage.textContent = "Select an employee first.";
              return;
            }
            await fetch(`/api/cleaning-zones/${zoneId}/assign`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ assignedTo: adminZoneAssignUser.value })
            });
            if (adminZoneMessage) adminZoneMessage.textContent = "Zone assigned.";
            loadZones();
          }
        });
      });
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

      if (adminZoneForm) {
        currentZonePoints.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
        adminZoneForm.polygon.value = JSON.stringify(currentZonePoints);
        drawCurrentZonePreview();
      }
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

    if (zoneClearPointsBtn) {
      zoneClearPointsBtn.addEventListener("click", () => {
        currentZonePoints = [];
        if (adminZoneForm) {
          adminZoneForm.polygon.value = "";
        }
        drawCurrentZonePreview();
      });
    }

    if (adminZoneForm) {
      adminZoneForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (currentZonePoints.length < 3) {
          if (adminZoneMessage) adminZoneMessage.textContent = "Select at least 3 points for the zone.";
          return;
        }

        const payload = Object.fromEntries(new FormData(adminZoneForm));
        payload.polygon = JSON.stringify(currentZonePoints);

        const response = await fetch("/api/cleaning-zones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (adminZoneMessage) {
          adminZoneMessage.textContent = response.ok ? "Zone created" : "Error creating zone";
        }

        if (response.ok) {
          currentZonePoints = [];
          adminZoneForm.reset();
          drawCurrentZonePreview();
          loadZones();
        }
      });
    }

    loadPins();
    loadUsers();
    loadZones();
  }
});

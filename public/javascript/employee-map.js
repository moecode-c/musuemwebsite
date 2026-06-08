document.addEventListener("DOMContentLoaded", () => {
  const managerTasksPage = document.getElementById("manager-tasks-page");
  const managerZonesPage = document.getElementById("manager-zones-page");
  const janitorDashboard = document.getElementById("janitor-dashboard");

  const createZoneSvg = (container) => {
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

  const pointsToString = (points) => points.map((point) => `${point.x},${point.y}`).join(" ");

  const formatRole = (role) =>
    String(role || "")
      .split("_")
      .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : part))
      .join(" ");

  const zoneColorPalette = ["#b7842a", "#6c8a2b", "#2c6fb7", "#8a3bb7", "#b75a2c", "#2c9c8f", "#d56f2a"];

  const getZoneColor = (zone, index = 0) => {
    const color = typeof zone?.color === "string" ? zone.color.trim() : "";
    if (/^#([0-9a-fA-F]{6})$/.test(color)) {
      return color;
    }
    return zoneColorPalette[index % zoneColorPalette.length];
  };

  const drawZones = (svg, zones, { interactive = false, onSelect = null } = {}) => {
    svg.innerHTML = "";
    zones.forEach((zone, index) => {
      const zoneColor = getZoneColor(zone, index);
      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      polygon.setAttribute("points", pointsToString(zone.polygon || []));
      polygon.setAttribute("class", "map-zone-polygon");
      polygon.style.fill = `${zoneColor}66`;
      polygon.style.stroke = zoneColor;
      polygon.dataset.zoneId = zone._id;
      polygon.dataset.zoneName = zone.zoneName;
      if (interactive && typeof onSelect === "function") {
        polygon.addEventListener("click", () => onSelect(zone));
      }
      svg.appendChild(polygon);
    });
  };

  const fetchJson = async (url, options = {}) => {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }
    return data;
  };

  const openCompletionNoteModal = ({ required = false } = {}) =>
    new Promise((resolve) => {
      const existingModal = document.getElementById("completion-note-modal");
      if (existingModal) {
        existingModal.remove();
      }

      const modal = document.createElement("div");
      modal.id = "completion-note-modal";
      modal.className = "task-note-modal";
      modal.innerHTML = `
        <div class="task-note-modal-backdrop"></div>
        <div class="task-note-modal-card" role="dialog" aria-modal="true" aria-labelledby="task-note-title">
          <h3 id="task-note-title"><i class="fas fa-note-sticky"></i> Completion Note</h3>
          <p>${required ? "This note is required before marking task as completed." : "Add a completion note (optional)."}</p>
          <textarea id="task-note-input" rows="4" placeholder="Write completion details..."></textarea>
          <div class="task-note-modal-actions">
            <button type="button" class="btn btn-secondary" id="task-note-cancel">Cancel</button>
            <button type="button" class="btn" id="task-note-save">Save</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const input = modal.querySelector("#task-note-input");
      const cancelButton = modal.querySelector("#task-note-cancel");
      const saveButton = modal.querySelector("#task-note-save");
      const backdrop = modal.querySelector(".task-note-modal-backdrop");

      const closeModal = (value) => {
        modal.remove();
        resolve(value);
      };

      cancelButton.addEventListener("click", () => closeModal(null));
      backdrop.addEventListener("click", () => closeModal(null));
      saveButton.addEventListener("click", () => {
        const note = input.value.trim();
        if (required && !note) {
          input.focus();
          return;
        }
        closeModal(note || "");
      });

      input.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeModal(null);
        }
      });

      input.focus();
    });

  const renderTaskList = (container, tasks, options = {}) => {
    const { canManage = false, reload = null, requireCompletionNote = false } = options;
    if (!container) return;

    const statusOptions = canManage
      ? ["new", "assigned", "in_progress", "completed", "verified"]
      : ["assigned", "in_progress", "completed"];

    if (!tasks.length) {
      container.innerHTML = `
        <div class="admin-item">
          <div class="admin-item-content">No tasks assigned yet.</div>
        </div>
      `;
      return;
    }

    container.innerHTML = tasks
      .map(
        (task) => `
          <div class="admin-item">
            <div class="admin-item-content">
              <strong>${task.title}</strong>
              ${task.description ? `<span class="admin-item-meta"><strong>Description:</strong> ${task.description}</span>` : ""}
              ${task.zoneId ? `<span class="admin-item-meta"><strong>Zone:</strong> ${task.zoneId.zoneName}${task.zoneId.floor ? ` (${task.zoneId.floor})` : ""}</span>` : ""}
              ${Array.isArray(task.checklist) && task.checklist.length
                ? `<ul class="task-checklist">${task.checklist.map((item) => `<li>${item}</li>`).join("")}</ul>`
                : ""}
              <span class="admin-item-meta task-status-badge task-status-${task.status}">Status: ${task.status}</span>
              <span class="admin-item-meta task-priority-badge task-priority-${task.priority}">Priority: ${task.priority}</span>
              ${task.dueAt ? `<span class="admin-item-meta">Due: ${new Date(task.dueAt).toLocaleString()}</span>` : ""}
            </div>
            <div class="admin-actions">
              <select class="task-status-select" data-task-id="${task._id}">
                ${statusOptions
                  .map(
                    (status) =>
                      `<option value="${status}" ${task.status === status ? "selected" : ""}>${status}</option>`
                  )
                  .join("")}
              </select>
              <button class="btn btn-secondary task-status-save" data-task-id="${task._id}">Update</button>
            </div>
          </div>
        `
      )
      .join("");

    container.querySelectorAll(".task-status-save").forEach((button) => {
      button.addEventListener("click", async () => {
        const taskId = button.dataset.taskId;
        const select = container.querySelector(`.task-status-select[data-task-id="${taskId}"]`);
        if (!select) return;

        const payload = { status: select.value };

        if (select.value === "completed") {
          const completionNote = await openCompletionNoteModal({ required: requireCompletionNote });
          if (completionNote === null) {
            return;
          }
          if (requireCompletionNote && !completionNote.trim()) {
            return;
          }
          if (completionNote.trim()) {
            payload.completionNote = completionNote.trim();
          }
        }

        try {
          await fetchJson(`/api/tasks/${taskId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });

          if (typeof reload === "function") {
            await reload();
          }
        } catch (error) {
          window.alert(error.message || "Failed to update task status.");
        }
      });
    });
  };

  if (managerTasksPage) {
    const taskForm = document.getElementById("manager-task-form");
    const taskList = document.getElementById("manager-task-list");
    const taskMessage = document.getElementById("manager-task-message");
    const employeeSelect = document.getElementById("task-assigned-to");
    const zoneSelect = document.getElementById("task-zone-id");

    const loadManagerTasks = async () => {
      const [tasks, users, zones] = await Promise.all([
        fetchJson("/api/tasks"),
        fetchJson("/api/users/assignable"),
        fetchJson("/api/cleaning-zones")
      ]);

      if (employeeSelect) {
        employeeSelect.innerHTML = `<option value="">Select employee</option>${users
          .map((user) => `<option value="${user._id}">${user.name} (${user.role})</option>`)
          .join("")}`;
      }

      if (zoneSelect) {
        zoneSelect.innerHTML = `<option value="">No zone</option>${zones
          .map((zone) => `<option value="${zone._id}">${zone.zoneName}</option>`)
          .join("")}`;
      }

      renderTaskList(taskList, tasks, { canManage: true, reload: loadManagerTasks });
    };

    if (taskForm) {
      taskForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const payload = Object.fromEntries(new FormData(taskForm));
        payload.checklist = (payload.checklist || "")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        try {
          await fetchJson("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });

          taskForm.reset();
          taskMessage.textContent = "Task assigned.";
          await loadManagerTasks();
        } catch (error) {
          taskMessage.textContent = error.message;
        }
      });
    }

    loadManagerTasks().catch((error) => {
      if (taskMessage) {
        taskMessage.textContent = error.message;
      }
    });
  }

  if (managerZonesPage) {
    const zoneMap = document.getElementById("manager-zone-map");
    const zoneForm = document.getElementById("manager-zone-form");
    const zoneList = document.getElementById("manager-zone-list");
    const zoneMessage = document.getElementById("manager-zone-message");
    const zoneAssignSelect = document.getElementById("zone-assign-user");
    const drawModeSelect = document.getElementById("manager-zone-draw-mode");
    const zoneHitArea = document.getElementById("manager-zone-hit-area");
    const editingZoneIdInput = document.getElementById("manager-zone-editing-id");
    const zoneSubmitButton = document.getElementById("manager-zone-submit");
    const cancelZoneEditButton = document.getElementById("manager-zone-cancel-edit");

    if (zoneMap && zoneForm && zoneList && zoneHitArea) {
      const svg = createZoneSvg(zoneMap);
      let currentPoints = [];
      let zonesCache = [];
      let usersCache = [];
      let drawMode = drawModeSelect?.value || "rectangle";
      let rectangleStartPoint = null;

      const clearFormEditingState = () => {
        if (zoneForm) {
          zoneForm.classList.remove("is-editing");
        }
        if (editingZoneIdInput) {
          editingZoneIdInput.value = "";
        }
        if (zoneSubmitButton) {
          zoneSubmitButton.textContent = "Create Zone";
        }
      };

      const fillZoneFormForEditing = (zone) => {
        if (!zoneForm || !zone) return;
        zoneForm.classList.add("is-editing");
        if (editingZoneIdInput) {
          editingZoneIdInput.value = zone._id;
        }
        if (zoneSubmitButton) {
          zoneSubmitButton.textContent = "Update Zone";
        }
        zoneForm.zoneName.value = zone.zoneName || "";
        zoneForm.floor.value = zone.floor || "Ground";
        zoneForm.description.value = zone.description || "";
        if (zoneForm.roleTarget) zoneForm.roleTarget.value = zone.roleTarget || "";
        zoneForm.color.value = /^#([0-9a-fA-F]{6})$/.test(zone.color || "") ? zone.color : "#b7842a";
        currentPoints = Array.isArray(zone.polygon) ? [...zone.polygon] : [];
        zoneForm.polygon.value = JSON.stringify(currentPoints);
        drawCurrentPoints();
      };

      const refreshZoneAssignSelect = () => {
        if (!zoneAssignSelect) return;
        zoneAssignSelect.innerHTML = `<option value="">Select employee</option>${usersCache
          .map((user) => `<option value="${user._id}">${user.name} (${formatRole(user.role)})</option>`)
          .join("")}`;
      };

      const drawCurrentPoints = () => {
        const previewId = "zone-preview-polygon";
        const existing = document.getElementById(previewId);
        if (existing) {
          existing.remove();
        }

        if (currentPoints.length < 3) {
          return;
        }

        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("id", previewId);
        polygon.setAttribute("points", pointsToString(currentPoints));
        polygon.setAttribute("class", "map-zone-polygon map-zone-polygon-preview");
        svg.appendChild(polygon);
      };

      const getRelativePoint = (event) => {
        const rect = zoneMap.getBoundingClientRect();
        const x = Number((((event.clientX - rect.left) / rect.width) * 100).toFixed(2));
        const y = Number((((event.clientY - rect.top) / rect.height) * 100).toFixed(2));
        return {
          x: Math.min(100, Math.max(0, x)),
          y: Math.min(100, Math.max(0, y))
        };
      };

      const buildRectanglePolygon = (start, end) => {
        const minX = Number(Math.min(start.x, end.x).toFixed(2));
        const maxX = Number(Math.max(start.x, end.x).toFixed(2));
        const minY = Number(Math.min(start.y, end.y).toFixed(2));
        const maxY = Number(Math.max(start.y, end.y).toFixed(2));

        return [
          { x: minX, y: minY },
          { x: maxX, y: minY },
          { x: maxX, y: maxY },
          { x: minX, y: maxY }
        ];
      };

      const renderZoneList = (zones) => {
        zoneList.innerHTML = zones
          .map((zone, index) => {
            const zoneColor = getZoneColor(zone, index);
            return `
              <div class="admin-item">
                <div class="admin-item-content">
                  <strong><span class="zone-color-dot" style="background:${zoneColor}"></span>${zone.zoneName}</strong>
                  <span class="admin-item-meta">Floor: ${zone.floor}</span>
                  ${zone.roleTarget ? `<span class="admin-item-meta">Type: ${formatRole(zone.roleTarget)}</span>` : ""}
                  ${zone.description ? `<span class="admin-item-meta">Description: ${zone.description}</span>` : ""}
                  <span class="admin-item-meta">Assigned: ${zone.assignedTo ? `${zone.assignedTo.name} (${formatRole(zone.assignedTo.role)})` : "Unassigned"}</span>
                </div>
                <div class="admin-actions">
                  <button class="btn btn-secondary" data-action="edit" data-id="${zone._id}">Edit</button>
                  <button class="btn btn-secondary" data-action="assign" data-id="${zone._id}">Assign</button>
                  <button class="btn" data-action="delete" data-id="${zone._id}">Delete</button>
                </div>
              </div>
            `;
          })
          .join("");

        zoneList.querySelectorAll("button").forEach((button) => {
          button.addEventListener("click", async () => {
            const zoneId = button.dataset.id;

            try {
              if (button.dataset.action === "delete") {
                await fetchJson(`/api/cleaning-zones/${zoneId}`, { method: "DELETE" });
                await loadManagerZones();
                return;
              }

              if (button.dataset.action === "edit") {
                const selectedZone = zonesCache.find((zone) => zone._id === zoneId);
                if (!selectedZone) {
                  zoneMessage.textContent = "Zone not found.";
                  return;
                }
                fillZoneFormForEditing(selectedZone);
                zoneMessage.textContent = `Editing ${selectedZone.zoneName}.`;
                return;
              }

              if (button.dataset.action === "assign") {
                if (!zoneAssignSelect || !zoneAssignSelect.value) {
                  zoneMessage.textContent = "Select an employee first.";
                  return;
                }

                await fetchJson(`/api/cleaning-zones/${zoneId}/assign`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ assignedTo: zoneAssignSelect.value })
                });
                zoneMessage.textContent = "Zone assigned.";
                await loadManagerZones();
              }
            } catch (error) {
              zoneMessage.textContent = error.message;
            }
          });
        });
      };

      const loadManagerZones = async () => {
        const [zones, users] = await Promise.all([
          fetchJson("/api/cleaning-zones"),
          fetchJson("/api/users/assignable")
        ]);

        zonesCache = zones;
        usersCache = users;
        drawZones(svg, zonesCache);
        drawCurrentPoints();
        refreshZoneAssignSelect();
        renderZoneList(zonesCache);
      };

      zoneHitArea.addEventListener("click", (event) => {
        if (drawMode !== "polygon") {
          return;
        }
        event.preventDefault();
        const point = getRelativePoint(event);
        currentPoints.push(point);
        zoneForm.polygon.value = JSON.stringify(currentPoints);
        drawCurrentPoints();
      });

      zoneHitArea.addEventListener("pointerdown", (event) => {
        if (drawMode !== "rectangle") {
          return;
        }
        event.preventDefault();
        zoneHitArea.setPointerCapture(event.pointerId);
        rectangleStartPoint = getRelativePoint(event);
        currentPoints = [rectangleStartPoint, rectangleStartPoint, rectangleStartPoint, rectangleStartPoint];
        zoneForm.polygon.value = JSON.stringify(currentPoints);
        drawCurrentPoints();
      });

      zoneHitArea.addEventListener("pointermove", (event) => {
        if (drawMode !== "rectangle" || !rectangleStartPoint) {
          return;
        }
        event.preventDefault();
        const currentPoint = getRelativePoint(event);
        currentPoints = buildRectanglePolygon(rectangleStartPoint, currentPoint);
        zoneForm.polygon.value = JSON.stringify(currentPoints);
        drawCurrentPoints();
      });

      zoneHitArea.addEventListener("pointerup", (event) => {
        if (drawMode !== "rectangle" || !rectangleStartPoint) {
          return;
        }
        event.preventDefault();
        if (zoneHitArea.hasPointerCapture(event.pointerId)) {
          zoneHitArea.releasePointerCapture(event.pointerId);
        }
        const endPoint = getRelativePoint(event);
        currentPoints = buildRectanglePolygon(rectangleStartPoint, endPoint);
        rectangleStartPoint = null;
        zoneForm.polygon.value = JSON.stringify(currentPoints);
        drawCurrentPoints();
      });

      zoneHitArea.addEventListener("pointercancel", () => {
        if (drawMode !== "rectangle" || !rectangleStartPoint) {
          return;
        }
        rectangleStartPoint = null;
      });

      if (drawModeSelect) {
        drawModeSelect.addEventListener("change", () => {
          drawMode = drawModeSelect.value;
          currentPoints = [];
          rectangleStartPoint = null;
          zoneForm.polygon.value = "";
          drawCurrentPoints();
          zoneMessage.textContent = drawMode === "rectangle"
            ? "Rectangle mode enabled: click and drag on map."
            : "Polygon mode enabled: click map to add points.";
        });
      }

      zoneForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (currentPoints.length < 3) {
          zoneMessage.textContent = drawMode === "rectangle"
            ? "Draw a rectangle on the map before creating zone."
            : "Select at least 3 points on the map.";
          return;
        }

        const payload = Object.fromEntries(new FormData(zoneForm));
        payload.polygon = JSON.stringify(currentPoints);
        const editingZoneId = payload.editingZoneId || "";
        delete payload.editingZoneId;

        const requestUrl = editingZoneId ? `/api/cleaning-zones/${editingZoneId}` : "/api/cleaning-zones";
        const requestMethod = editingZoneId ? "PUT" : "POST";

        try {
          await fetchJson(requestUrl, {
            method: requestMethod,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });

          currentPoints = [];
          zoneForm.reset();
          clearFormEditingState();
          zoneMessage.textContent = editingZoneId ? "Zone updated." : "Zone created.";
          await loadManagerZones();
        } catch (error) {
          zoneMessage.textContent = error.message;
        }
      });

      if (cancelZoneEditButton) {
        cancelZoneEditButton.addEventListener("click", () => {
          currentPoints = [];
          rectangleStartPoint = null;
          zoneForm.reset();
          zoneForm.polygon.value = "";
          clearFormEditingState();
          drawCurrentPoints();
          zoneMessage.textContent = "Edit cancelled.";
        });
      }

      const clearPointsBtn = document.getElementById("manager-zone-clear-points");
      if (clearPointsBtn) {
        clearPointsBtn.addEventListener("click", () => {
          currentPoints = [];
          rectangleStartPoint = null;
          zoneForm.polygon.value = "";
          drawCurrentPoints();
          zoneMessage.textContent = "Drawing cleared.";
        });
      }

      clearFormEditingState();

      loadManagerZones().catch((error) => {
        zoneMessage.textContent = error.message;
      });
    }
  }

  if (janitorDashboard) {
    const map = document.getElementById("janitor-zone-map");
    const zonesMessage = document.getElementById("janitor-zone-message");
    const zonesList = document.getElementById("janitor-zone-list");
    const tasksContainer = document.getElementById("janitor-task-list");

    if (map) {
      const svg = createZoneSvg(map);

      const loadJanitorTasks = async () => {
        const tasks = await fetchJson("/api/tasks");
        renderTaskList(tasksContainer, tasks, {
          canManage: false,
          reload: loadJanitorTasks,
          requireCompletionNote: true
        });
      };

      const renderJanitorZones = (zones) => {
        if (!zonesList) return;
        if (!zones.length) {
          zonesList.innerHTML = `
            <div class="admin-item">
              <div class="admin-item-content">No assigned cleaning zones yet.</div>
            </div>
          `;
          return;
        }

        zonesList.innerHTML = zones
          .map((zone, index) => {
            const zoneColor = getZoneColor(zone, index);
            return `
              <div class="admin-item">
                <div class="admin-item-content">
                  <strong><span class="zone-color-dot" style="background:${zoneColor}"></span>${zone.zoneName}</strong>
                  <span class="admin-item-meta">Floor: ${zone.floor}</span>
                  ${zone.description ? `<span class="admin-item-meta">Description: ${zone.description}</span>` : ""}
                </div>
              </div>
            `;
          })
          .join("");
      };

      const loadJanitorData = () => Promise.all([fetchJson("/api/cleaning-zones?mine=true"), fetchJson("/api/tasks")])
        .then(([zones, tasks]) => {
          drawZones(svg, zones);
          renderJanitorZones(zones);
          renderTaskList(tasksContainer, tasks, {
            canManage: false,
            reload: loadJanitorTasks,
            requireCompletionNote: true
          });
          zonesMessage.textContent = zones.length
            ? `You have ${zones.length} assigned cleaning zone(s).`
            : "No assigned cleaning zones yet.";
        })
        .catch((error) => {
          zonesMessage.textContent = error.message;
        });

      loadJanitorData();
    }
  }

  const genericTaskContainer = document.querySelector("[data-employee-task-list]");
  if (genericTaskContainer && !managerTasksPage && !managerZonesPage && !janitorDashboard) {
    const loadEmployeeTasks = async () => {
      const tasks = await fetchJson("/api/tasks");
      renderTaskList(genericTaskContainer, tasks, { canManage: false, reload: loadEmployeeTasks });
    };

    loadEmployeeTasks()
      .catch((error) => {
        genericTaskContainer.innerHTML = `<div class="admin-item"><div class="admin-item-content">${error.message}</div></div>`;
      });
  }

  // Generic "My Assigned Zones" (list + map) for any employee dashboard (not manager/janitor).
  const genericZoneContainer = document.querySelector("[data-employee-zone-list]");
  const genericZoneMaps = document.querySelectorAll("[data-employee-zone-map]");
  if ((genericZoneContainer || genericZoneMaps.length) && !managerTasksPage && !managerZonesPage && !janitorDashboard) {
    const renderGenericZones = (zones) => {
      if (genericZoneContainer) {
        genericZoneContainer.innerHTML = zones.length
          ? zones
              .map((zone, index) => {
                const zoneColor = getZoneColor(zone, index);
                return `
            <div class="admin-item">
              <div class="admin-item-content">
                <strong><span class="zone-color-dot" style="background:${zoneColor}"></span>${zone.zoneName}</strong>
                <span class="admin-item-meta">Floor: ${zone.floor}</span>
                ${zone.description ? `<span class="admin-item-meta">Description: ${zone.description}</span>` : ""}
              </div>
            </div>
          `;
              })
              .join("")
          : `<div class="admin-item"><div class="admin-item-content">No zones assigned to you yet.</div></div>`;
      }
      // Draw the assigned zone polygons on every map on the page.
      genericZoneMaps.forEach((mapEl) => {
        const svg = createZoneSvg(mapEl);
        drawZones(svg, zones);
      });
    };

    fetchJson("/api/cleaning-zones?mine=true")
      .then(renderGenericZones)
      .catch((error) => {
        if (genericZoneContainer) {
          genericZoneContainer.innerHTML = `<div class="admin-item"><div class="admin-item-content">${error.message}</div></div>`;
        }
      });
  }
});

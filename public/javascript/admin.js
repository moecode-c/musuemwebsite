const renderAdminList = (container, items, labelField, onDelete, onEdit) => {
  if (!container) return;
  container.innerHTML = items
    .map(
      (item) => `
      <div class="admin-item">
        <div class="admin-item-content">${typeof labelField === "function" ? labelField(item) : item[labelField]}</div>
        <div class="admin-actions">
          <button class="btn btn-secondary" data-action="edit" data-id="${item._id}">Edit</button>
          <button class="btn" data-action="delete" data-id="${item._id}">Delete</button>
        </div>
      </div>
    `
    )
    .join("");

  container.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const { action, id } = btn.dataset;
      if (action === "edit" && onEdit) {
        const item = items.find((entry) => entry._id === id);
        if (item) onEdit(item);
        return;
      }
      if (action === "delete") {
        onDelete(id);
      }
    });
  });
};

const adminFetchList = async (endpoint, container, labelField, onEdit) => {
  const response = await fetch(endpoint);
  const items = await response.json();
  renderAdminList(container, items, labelField, async (id) => {
    await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    adminFetchList(endpoint, container, labelField, onEdit);
  }, onEdit);
};

const parseApiError = async (response, fallbackMessage) => {
  let body = null;
  try {
    body = await response.json();
  } catch (error) {
    body = null;
  }

  if (body) {
    if (Array.isArray(body.errors) && body.errors.length) {
      return body.errors[0].msg || fallbackMessage;
    }
    if (body.message) return body.message;
    if (body.error) return body.error;
  }

  return fallbackMessage;
};

const initEditableForm = (form, submitLabel) => {
  if (!form) return {};
  const submitBtn = form.querySelector(".admin-submit");
  const cancelBtn = form.querySelector(".admin-cancel");
  if (submitBtn && !submitBtn.dataset.defaultText) {
    submitBtn.dataset.defaultText = submitBtn.textContent;
  }

  const setEditing = (isEditing, label) => {
    if (!submitBtn || !cancelBtn) return;
    if (isEditing) {
      form.classList.add("is-editing");
      submitBtn.textContent = label || submitLabel;
    } else {
      form.classList.remove("is-editing");
      submitBtn.textContent = submitBtn.dataset.defaultText || submitLabel;
      delete form.dataset.editId;
      form.reset();
    }
  };

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => setEditing(false));
  }

  return { setEditing };
};

document.addEventListener("DOMContentLoaded", () => {
  const exhibitForm = document.getElementById("admin-exhibit-form");
  const exhibitList = document.getElementById("admin-exhibit-list");
  const exhibitMap = document.getElementById("admin-exhibit-map");
  const exhibitPin = document.getElementById("admin-exhibit-pin");
  const setExhibitPin = (x, y) => {
    if (!exhibitPin) return;
    if (x === "" || y === "" || x === null || y === null || x === undefined || y === undefined) {
      exhibitPin.style.display = "none";
      return;
    }
    exhibitPin.style.left = `${Number(x)}%`;
    exhibitPin.style.top = `${Number(y)}%`;
    exhibitPin.style.display = "block";
  };

  if (exhibitMap && exhibitForm) {
    exhibitMap.addEventListener("click", (event) => {
      const rect = exhibitMap.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      exhibitForm.querySelector("input[name='x']").value = x;
      exhibitForm.querySelector("input[name='y']").value = y;
      setExhibitPin(x, y);
    });

    exhibitForm.querySelectorAll("input[name='x'], input[name='y']").forEach((input) => {
      input.addEventListener("input", () => {
        setExhibitPin(exhibitForm.x.value, exhibitForm.y.value);
      });
    });
  }
  if (exhibitForm) {
    const { setEditing } = initEditableForm(exhibitForm, "Update Exhibit");
    const imageInput = exhibitForm.querySelector("input[name='image']");
    const modelInput = exhibitForm.querySelector("input[name='model']");
    const setExhibitFileRequirements = (isEditing) => {
      if (imageInput) imageInput.required = !isEditing;
      if (modelInput) modelInput.required = !isEditing;
    };

    setExhibitFileRequirements(false);

    const exhibitCancel = exhibitForm.querySelector(".admin-cancel");
    if (exhibitCancel) {
      exhibitCancel.addEventListener("click", () => {
        setExhibitPin("", "");
        setExhibitFileRequirements(false);
      });
    }
    adminFetchList("/api/exhibits", exhibitList, "title", (item) => {
      exhibitForm.title.value = item.title || "";
      exhibitForm.category.value = item.category || "";
      exhibitForm.description.value = item.description || "";
      exhibitForm.era.value = item.era || "";
      exhibitForm.period.value = item.period || "";
      exhibitForm.location.value = item.location || "";
      exhibitForm.x.value = item.x ?? "";
      exhibitForm.y.value = item.y ?? "";
      exhibitForm.dataset.editId = item._id;
      setEditing(true, "Update Exhibit");
      setExhibitFileRequirements(true);
      setExhibitPin(item.x, item.y);
    });
    exhibitForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(exhibitForm);
      if (imageInput && imageInput.files.length === 0) formData.delete("image");
      if (modelInput && modelInput.files.length === 0) formData.delete("model");
      const editId = exhibitForm.dataset.editId;
      const response = await fetch(editId ? `/api/exhibits/${editId}` : "/api/exhibits", {
        method: editId ? "PUT" : "POST",
        body: formData
      });

      const messageEl = document.getElementById("admin-exhibit-message");

      if (!response.ok) {
        messageEl.textContent = await parseApiError(response, "Error saving exhibit");
        return;
      }

      messageEl.textContent = editId
        ? "Exhibit updated"
        : "Exhibit created";

      if (editId) {
        setEditing(false);
        setExhibitFileRequirements(false);
      } else {
        exhibitForm.reset();
        setExhibitFileRequirements(false);
      }

      adminFetchList("/api/exhibits", exhibitList, "title", (item) => {
        exhibitForm.title.value = item.title || "";
        exhibitForm.category.value = item.category || "";
        exhibitForm.description.value = item.description || "";
        exhibitForm.era.value = item.era || "";
        exhibitForm.period.value = item.period || "";
        exhibitForm.location.value = item.location || "";
        exhibitForm.x.value = item.x ?? "";
        exhibitForm.y.value = item.y ?? "";
        exhibitForm.dataset.editId = item._id;
        setEditing(true, "Update Exhibit");
        setExhibitFileRequirements(true);
        setExhibitPin(item.x, item.y);
      });
    });
  }

  const productForm = document.getElementById("admin-product-form");
  const productList = document.getElementById("admin-product-list");
  if (productForm) {
    const { setEditing } = initEditableForm(productForm, "Update Product");
    adminFetchList("/api/products", productList, "name", (item) => {
      productForm.name.value = item.name || "";
      productForm.description.value = item.description || "";
      productForm.price.value = item.price || 0;
      productForm.stock.value = item.stock || 0;
      productForm.dataset.editId = item._id;
      setEditing(true, "Update Product");
    });
    productForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(productForm);
      const imageInput = productForm.querySelector("input[name='image']");
      if (imageInput && imageInput.files.length === 0) formData.delete("image");
      const editId = productForm.dataset.editId;
      const response = await fetch(editId ? `/api/products/${editId}` : "/api/products", {
        method: editId ? "PUT" : "POST",
        body: formData
      });
      const messageEl = document.getElementById("admin-product-message");
      if (!response.ok) {
        messageEl.textContent = await parseApiError(response, "Error saving product");
        return;
      }

      messageEl.textContent = editId
        ? "Product updated"
        : "Product created";

      if (editId) {
        setEditing(false);
      } else {
        productForm.reset();
      }

      adminFetchList("/api/products", productList, "name", (item) => {
        productForm.name.value = item.name || "";
        productForm.description.value = item.description || "";
        productForm.price.value = item.price || 0;
        productForm.stock.value = item.stock || 0;
        productForm.dataset.editId = item._id;
        setEditing(true, "Update Product");
      });
    });
  }

  const ticketForm = document.getElementById("admin-ticket-form");
  const ticketList = document.getElementById("admin-ticket-list");
  if (ticketForm) {
    const { setEditing } = initEditableForm(ticketForm, "Update Ticket");
    const ticketLabel = (item) => {
      const updatedAt = item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "";
      return `
        <div><strong>${item.group ? item.group.toUpperCase() : ""} - ${item.audience || ""}</strong></div>
        <div class="admin-item-meta">Price: EGP ${Number(item.price || 0).toFixed(2)}</div>
        ${item.description ? `<div class="admin-item-meta">${item.description}</div>` : ""}
        ${updatedAt ? `<div class=\"admin-item-meta\">Updated: ${updatedAt}</div>` : ""}
      `;
    };
    adminFetchList("/api/tickets", ticketList, ticketLabel, (item) => {
      ticketForm.group.value = item.group || "egyptian";
      ticketForm.audience.value = item.audience || "adult";
      ticketForm.price.value = item.price || 0;
      ticketForm.description.value = item.description || "";
      ticketForm.dataset.editId = item._id;
      setEditing(true, "Update Ticket");
    });
    ticketForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(ticketForm));
      const editId = ticketForm.dataset.editId;
      const response = await fetch(editId ? `/api/tickets/${editId}` : "/api/tickets", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const messageEl = document.getElementById("admin-ticket-message");
      messageEl.textContent = response.ok
        ? editId
          ? "Ticket updated"
          : "Ticket created"
        : "Error saving ticket";
      if (response.ok) {
        if (editId) {
          setEditing(false);
        } else {
          ticketForm.reset();
        }
        adminFetchList("/api/tickets", ticketList, ticketLabel, (item) => {
          ticketForm.group.value = item.group || "egyptian";
          ticketForm.audience.value = item.audience || "adult";
          ticketForm.price.value = item.price || 0;
          ticketForm.description.value = item.description || "";
          ticketForm.dataset.editId = item._id;
          setEditing(true, "Update Ticket");
        });
      }
    });
  }

  const userForm = document.getElementById("admin-user-form");
  const userList = document.getElementById("admin-user-list");
  if (userForm) {
    const { setEditing } = initEditableForm(userForm, "Update User");
    adminFetchList("/api/users", userList, "name", (item) => {
      userForm.name.value = item.name || "";
      userForm.email.value = item.email || "";
      userForm.password.value = "";
      userForm.role.value = item.role || "user";
      userForm.dataset.editId = item._id;
      setEditing(true, "Update User");
    });
    userForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(userForm));
      if (!payload.password) {
        delete payload.password;
      }
      const editId = userForm.dataset.editId;
      const response = await fetch(editId ? `/api/users/${editId}` : "/api/users", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      let responseBody = null;
      try {
        responseBody = await response.json();
      } catch (error) {
        responseBody = null;
      }

      const extractErrorMessage = (body) => {
        if (!body) return "Error saving user";
        if (Array.isArray(body.errors) && body.errors.length) {
          return body.errors[0].msg || "Error saving user";
        }
        if (body.message) return body.message;
        if (body.error) return body.error;
        return "Error saving user";
      };

      const messageEl = document.getElementById("admin-user-message");
      messageEl.textContent = response.ok
        ? editId
          ? "User updated"
          : "User created"
        : extractErrorMessage(responseBody);
      if (response.ok) {
        if (editId) {
          setEditing(false);
        } else {
          userForm.reset();
        }
        adminFetchList("/api/users", userList, "name", (item) => {
          userForm.name.value = item.name || "";
          userForm.email.value = item.email || "";
          userForm.password.value = "";
          userForm.role.value = item.role || "user";
          userForm.dataset.editId = item._id;
          setEditing(true, "Update User");
        });
      }
    });
  }

  const isDashboardPage = window.location.pathname === "/admin/dashboard";
  if (isDashboardPage) {
    const isArabic = document.documentElement.lang === "ar";
    const dashboardText = isArabic
      ? {
        visitor: "زائر",
        toastTitle: "التذكرة جاهزة",
        newRequestSuffix: "أرسل طلب تذكرة جديدا."
      }
      : {
        visitor: "Visitor",
        toastTitle: "Ticket ready",
        newRequestSuffix: "submitted a new ticket request."
      };

    const toastStack = document.createElement("div");
    toastStack.className = "admin-toast-stack";
    document.body.appendChild(toastStack);

    const showAdminToast = (title, message) => {
      const toast = document.createElement("div");
      toast.className = "admin-toast";
      toast.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
      toastStack.appendChild(toast);

      requestAnimationFrame(() => {
        toast.classList.add("is-visible");
      });

      window.setTimeout(() => {
        toast.classList.remove("is-visible");
        window.setTimeout(() => toast.remove(), 250);
      }, 5000);
    };

    let hasInitialSnapshot = false;
    let lastKnownCount = 0;
    let lastKnownLatestId = "";

    const pollTicketRequestSummary = async () => {
      try {
        const response = await fetch("/api/ticket-requests/summary", {
          headers: { Accept: "application/json" }
        });
        if (!response.ok) return;

        const snapshot = await response.json();
        const count = Number(snapshot?.count || 0);
        const latestId = snapshot?.latest?._id || "";
        const latestName = snapshot?.latest?.name || dashboardText.visitor;

        if (!hasInitialSnapshot) {
          hasInitialSnapshot = true;
          lastKnownCount = count;
          lastKnownLatestId = latestId;
          return;
        }

        const hasNewRequest = Boolean(latestId) && latestId !== lastKnownLatestId && count >= lastKnownCount;
        if (hasNewRequest) {
          showAdminToast(dashboardText.toastTitle, `${latestName} ${dashboardText.newRequestSuffix}`);
        }

        lastKnownCount = count;
        lastKnownLatestId = latestId;
      } catch (error) {
        // Ignore polling failures and retry on next interval.
      }
    };

    pollTicketRequestSummary();
    window.setInterval(pollTicketRequestSummary, 15000);
  }
});

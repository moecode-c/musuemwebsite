const renderAdminList = (container, items, labelField, onDelete, onEdit) => {
  if (!container) return;
  container.innerHTML = items
    .map(
      (item) => `
      <div class="admin-item">
        <span>${typeof labelField === "function" ? labelField(item) : item[labelField]}</span>
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
  if (exhibitForm) {
    const { setEditing } = initEditableForm(exhibitForm, "Update Exhibit");
    adminFetchList("/api/exhibits", exhibitList, "title", (item) => {
      exhibitForm.title.value = item.title || "";
      exhibitForm.category.value = item.category || "";
      exhibitForm.description.value = item.description || "";
      exhibitForm.era.value = item.era || "";
      exhibitForm.dataset.editId = item._id;
      setEditing(true, "Update Exhibit");
    });
    exhibitForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(exhibitForm);
      const imageInput = exhibitForm.querySelector("input[name='image']");
      const modelInput = exhibitForm.querySelector("input[name='model']");
      if (imageInput && imageInput.files.length === 0) formData.delete("image");
      if (modelInput && modelInput.files.length === 0) formData.delete("model");
      const editId = exhibitForm.dataset.editId;
      const response = await fetch(editId ? `/api/exhibits/${editId}` : "/api/exhibits", {
        method: editId ? "PUT" : "POST",
        body: formData
      });
      const messageEl = document.getElementById("admin-exhibit-message");
      messageEl.textContent = response.ok
        ? editId
          ? "Exhibit updated"
          : "Exhibit created"
        : "Error saving exhibit";
      if (response.ok) {
        if (editId) {
          setEditing(false);
        } else {
          exhibitForm.reset();
        }
        adminFetchList("/api/exhibits", exhibitList, "title", (item) => {
          exhibitForm.title.value = item.title || "";
          exhibitForm.category.value = item.category || "";
          exhibitForm.description.value = item.description || "";
          exhibitForm.era.value = item.era || "";
          exhibitForm.dataset.editId = item._id;
          setEditing(true, "Update Exhibit");
        });
      }
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
      messageEl.textContent = response.ok
        ? editId
          ? "Product updated"
          : "Product created"
        : "Error saving product";
      if (response.ok) {
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
      }
    });
  }

  const ticketForm = document.getElementById("admin-ticket-form");
  const ticketList = document.getElementById("admin-ticket-list");
  if (ticketForm) {
    const { setEditing } = initEditableForm(ticketForm, "Update Ticket");
    const ticketLabel = (item) =>
      `${item.group ? item.group.toUpperCase() : ""} - ${item.audience || ""} (EGP ${Number(item.price || 0).toFixed(2)})`;
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
      const messageEl = document.getElementById("admin-user-message");
      messageEl.textContent = response.ok
        ? editId
          ? "User updated"
          : "User created"
        : "Error saving user";
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
});

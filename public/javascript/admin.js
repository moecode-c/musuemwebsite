const renderAdminList = (container, items, labelField, onDelete) => {
  if (!container) return;
  container.innerHTML = items
    .map(
      (item) => `
      <div class="admin-item">
        <span>${item[labelField]}</span>
        <button class="btn" data-id="${item._id}">Delete</button>
      </div>
    `
    )
    .join("");

  container.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => onDelete(btn.dataset.id));
  });
};

const adminFetchList = async (endpoint, container, labelField) => {
  const response = await fetch(endpoint);
  const items = await response.json();
  renderAdminList(container, items, labelField, async (id) => {
    await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    adminFetchList(endpoint, container, labelField);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const exhibitForm = document.getElementById("admin-exhibit-form");
  const exhibitList = document.getElementById("admin-exhibit-list");
  if (exhibitForm) {
    adminFetchList("/api/exhibits", exhibitList, "title");
    exhibitForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(exhibitForm);
      const response = await fetch("/api/exhibits", { method: "POST", body: formData });
      const messageEl = document.getElementById("admin-exhibit-message");
      messageEl.textContent = response.ok ? "Exhibit created" : "Error creating exhibit";
      if (response.ok) {
        exhibitForm.reset();
        adminFetchList("/api/exhibits", exhibitList, "title");
      }
    });
  }

  const collectionForm = document.getElementById("admin-collection-form");
  const collectionList = document.getElementById("admin-collection-list");
  if (collectionForm) {
    adminFetchList("/api/collections", collectionList, "title");
    collectionForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(collectionForm);
      const response = await fetch("/api/collections", { method: "POST", body: formData });
      const messageEl = document.getElementById("admin-collection-message");
      messageEl.textContent = response.ok ? "Collection created" : "Error creating collection";
      if (response.ok) {
        collectionForm.reset();
        adminFetchList("/api/collections", collectionList, "title");
      }
    });
  }

  const productForm = document.getElementById("admin-product-form");
  const productList = document.getElementById("admin-product-list");
  if (productForm) {
    adminFetchList("/api/products", productList, "name");
    productForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(productForm);
      const response = await fetch("/api/products", { method: "POST", body: formData });
      const messageEl = document.getElementById("admin-product-message");
      messageEl.textContent = response.ok ? "Product created" : "Error creating product";
      if (response.ok) {
        productForm.reset();
        adminFetchList("/api/products", productList, "name");
      }
    });
  }

  const ticketForm = document.getElementById("admin-ticket-form");
  const ticketList = document.getElementById("admin-ticket-list");
  if (ticketForm) {
    adminFetchList("/api/tickets", ticketList, "type");
    ticketForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(ticketForm));
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const messageEl = document.getElementById("admin-ticket-message");
      messageEl.textContent = response.ok ? "Ticket created" : "Error creating ticket";
      if (response.ok) {
        ticketForm.reset();
        adminFetchList("/api/tickets", ticketList, "type");
      }
    });
  }

  const userForm = document.getElementById("admin-user-form");
  const userList = document.getElementById("admin-user-list");
  if (userForm) {
    adminFetchList("/api/users", userList, "name");
    userForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(userForm));
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const messageEl = document.getElementById("admin-user-message");
      messageEl.textContent = response.ok ? "User created" : "Error creating user";
      if (response.ok) {
        userForm.reset();
        adminFetchList("/api/users", userList, "name");
      }
    });
  }
});

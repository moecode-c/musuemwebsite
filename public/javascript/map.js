document.addEventListener("DOMContentLoaded", () => {
  const tooltip = document.getElementById("map-tooltip");
  document.querySelectorAll(".map-pin").forEach((pin) => {
    const x = pin.dataset.x;
    const y = pin.dataset.y;
    if (x && y) {
      pin.style.left = `${x}%`;
      pin.style.top = `${y}%`;
    }
    pin.addEventListener("mouseenter", () => {
      if (tooltip) {
        tooltip.textContent = `${pin.dataset.label}: ${pin.dataset.description}`;
      }
    });
  });

  const adminMap = document.getElementById("admin-map");
  const adminForm = document.getElementById("admin-map-form");
  if (adminMap && adminForm) {
    adminMap.addEventListener("click", (event) => {
      const rect = adminMap.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      adminForm.querySelector("input[name='x']").value = x.toFixed(2);
      adminForm.querySelector("input[name='y']").value = y.toFixed(2);
    });

    adminForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = Object.fromEntries(new FormData(adminForm));
      const response = await fetch("/api/map-pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const messageEl = document.getElementById("admin-map-message");
      messageEl.textContent = response.ok ? "Pin created" : "Error creating pin";
      if (response.ok) {
        window.location.reload();
      }
    });
  }
});

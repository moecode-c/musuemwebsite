document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("[data-shop-grid]");
  if (!grid) return;

  const searchInput = document.getElementById("shop-search");
  const sortSelect = document.getElementById("shop-sort");
  const toggles = Array.from(document.querySelectorAll(".pill-toggle"));
  const resetButton = document.getElementById("reset-filters");
  const emptyState = document.querySelector("[data-empty-state]");
  const priceRange = document.getElementById("price-max");
  const priceLabel = document.getElementById("price-max-value");
  const activeFiltersBox = document.querySelector("[data-active-filters]");
  const featuredRow = document.querySelector("[data-featured-row]");
  const recentRow = document.querySelector("[data-recent-row]");
  const zipInput = document.getElementById("zip-check");
  const zipButton = document.getElementById("zip-check-btn");
  const zipResult = document.getElementById("zip-result");
  const cutoffTimer = document.querySelector("[data-cutoff-timer]");
  const quickViewModal = document.getElementById("quickview-modal");
  const quickViewImage = document.getElementById("quickview-image");
  const quickViewTitle = document.getElementById("quickview-title");
  const quickViewPrice = document.getElementById("quickview-price");
  const quickViewStock = document.getElementById("quickview-stock");
  const quickViewDesc = document.getElementById("quickview-desc");
  const quickViewBadge = document.getElementById("quickview-badge");
  const quickViewAdd = document.getElementById("quickview-add");
  const quickViewDialog = quickViewModal?.querySelector(".modal-dialog");
  const quickViewEta = document.getElementById("quickview-eta");
  const quickViewSizes = document.getElementById("quickview-sizes");
  const quickViewCutoff = document.getElementById("quickview-cutoff");

  const cards = Array.from(grid.querySelectorAll(".product-card")).map((card, index) => ({ card, index }));
  let lastFiltered = [...cards];
  let lastFocusedTrigger = null;
  let activeModalIndex = null;
  let debounceTimer = null;
  let currentZip = "";

  const ZIP_STORAGE_KEY = "shop-zip";
  const storedZip = localStorage.getItem(ZIP_STORAGE_KEY);
  if (storedZip) {
    currentZip = storedZip;
    if (zipInput) zipInput.value = storedZip;
  }

  const priceValues = cards.map(({ card }) => parseFloat(card.dataset.price || "0"));
  const minPrice = Math.min(...priceValues, 0);
  const maxPrice = Math.max(...priceValues, 0, 2000);
  if (priceRange) {
    priceRange.min = Math.max(0, Math.floor(minPrice / 10) * 10).toString();
    priceRange.max = Math.ceil(maxPrice / 10) * 10;
    priceRange.value = priceRange.max;
  }

  const formatPriceLabel = (value) => `Up to EGP ${Number(value).toLocaleString()}`;
  if (priceLabel && priceRange) priceLabel.textContent = formatPriceLabel(priceRange.value);

  const isNewItem = (card) => {
    const created = card.dataset.created ? new Date(card.dataset.created).getTime() : 0;
    return created && Date.now() - created < 1000 * 60 * 60 * 24 * 30;
  };

  const summarizeFilters = (term, priceCap, activeFilters) => {
    if (!activeFiltersBox) return;
    const chips = [];
    if (term) chips.push({ label: `Search: ${term}`, key: "search" });
    if (priceCap && priceCap !== Infinity && priceRange) chips.push({ label: `≤ EGP ${Number(priceCap).toLocaleString()}`, key: "price" });
    activeFilters.forEach((filter) => {
      if (filter === "available") chips.push({ label: "In stock", key: "available" });
      if (filter === "low") chips.push({ label: "Low stock", key: "low" });
      if (filter === "new") chips.push({ label: "New", key: "new" });
      if (filter === "premium") chips.push({ label: "Premium", key: "premium" });
    });
    activeFiltersBox.innerHTML = chips
      .map(
        (chip) => `
        <span class="chip" data-chip="${chip.key}">
          ${chip.label}
          <button type="button" aria-label="Remove ${chip.label}" data-chip-remove="${chip.key}">×</button>
        </span>
      `
      )
      .join("");
    activeFiltersBox.querySelectorAll("[data-chip-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.chipRemove;
        if (key === "search" && searchInput) searchInput.value = "";
        if (key === "price" && priceRange) {
          priceRange.value = priceRange.max;
          if (priceLabel) priceLabel.textContent = formatPriceLabel(priceRange.value);
        }
        if (key === "available" || key === "low" || key === "new" || key === "premium") {
          toggles.forEach((toggle) => {
            if (toggle.dataset.filter === key) toggle.classList.remove("is-active");
          });
        }
        applyFilters();
      });
    });
    activeFiltersBox.style.display = chips.length ? "flex" : "none";
  };

  const syncUrl = (term, priceCap, activeFilters, sortValue) => {
    const params = new URLSearchParams(window.location.search);
    term ? params.set("q", term) : params.delete("q");
    if (priceRange && priceCap && priceCap !== Infinity && priceCap < Number(priceRange.max)) {
      params.set("priceMax", String(priceCap));
    } else {
      params.delete("priceMax");
    }
    params.set("sort", sortValue || "featured");
    params.delete("filters");
    if (activeFilters.size) params.set("filters", Array.from(activeFilters).join(","));
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  };

  const applyFilters = () => {
    const term = (searchInput?.value || "").trim().toLowerCase();
    const activeFilters = new Set(
      toggles.filter((toggle) => toggle.classList.contains("is-active")).map((toggle) => toggle.dataset.filter)
    );

    const priceCap = priceRange ? parseFloat(priceRange.value || "0") : Infinity;

    let filtered = cards.filter(({ card }) => {
      const name = card.dataset.name || "";
      const desc = card.dataset.description || "";
      const price = parseFloat(card.dataset.price || "0");
      const stock = parseInt(card.dataset.stock || "0", 10);
      const matchesSearch = term ? name.includes(term) || desc.includes(term) : true;
      const matchesPrice = price <= priceCap;
      const matchesAvailable = !activeFilters.has("available") || stock > 0;
      const matchesLow = !activeFilters.has("low") || (stock > 0 && stock < 5);
      const matchesNew = !activeFilters.has("new") || isNewItem(card);
      const matchesPriceRange = !activeFilters.has("premium") || price >= 800; // optional hook for future use
      return matchesSearch && matchesPrice && matchesAvailable && matchesLow && matchesNew && matchesPriceRange;
    });

    const sortValue = sortSelect?.value || "featured";
    filtered.sort((a, b) => {
      const priceA = parseFloat(a.card.dataset.price || "0");
      const priceB = parseFloat(b.card.dataset.price || "0");
      const stockA = parseInt(a.card.dataset.stock || "0", 10);
      const stockB = parseInt(b.card.dataset.stock || "0", 10);
      const createdA = a.card.dataset.created ? new Date(a.card.dataset.created).getTime() : 0;
      const createdB = b.card.dataset.created ? new Date(b.card.dataset.created).getTime() : 0;

      if (sortValue === "price-asc") return priceA - priceB;
      if (sortValue === "price-desc") return priceB - priceA;
      if (sortValue === "newest") return createdB - createdA;
      if (sortValue === "stock") return stockB - stockA;
      return a.index - b.index; // featured/original order
    });

    cards.forEach(({ card }) => {
      card.style.display = "none";
    });

    filtered.forEach(({ card }) => {
      card.style.display = "";
      grid.appendChild(card);
    });

    lastFiltered = filtered;

    if (emptyState) {
      emptyState.style.display = filtered.length ? "none" : "grid";
      const copy = emptyState.querySelector("[data-empty-copy]");
      if (copy)
        copy.textContent = term ? `No results for "${term}". Try different keywords.` : "Adjust filters or search terms to see more of the collection.";
    }

    summarizeFilters(term, priceCap, activeFilters);
    syncUrl(term, priceCap, activeFilters, sortValue);
  };

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("is-active");
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => applyFilters(), 200);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", () => applyFilters());
  }

  if (priceRange) {
    priceRange.addEventListener("input", () => {
      if (priceLabel) priceLabel.textContent = formatPriceLabel(priceRange.value);
      applyFilters();
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      toggles.forEach((toggle) => toggle.classList.remove("is-active"));
      if (sortSelect) sortSelect.value = "featured";
      if (priceRange) {
        priceRange.value = priceRange.max;
        if (priceLabel) priceLabel.textContent = formatPriceLabel(priceRange.value);
      }
      applyFilters();
    });
  }

  const closeModal = () => {
    if (!quickViewModal) return;
    quickViewModal.classList.remove("is-open");
    quickViewModal.setAttribute("aria-hidden", "true");
  };

  const resolveZone = (zip) => {
    if (!zip) return { label: "nationwide", etaInStock: "3-5 days", etaPreorder: "Ships when restocked", cutoffHour: 17 };
    const zones = [
      { pattern: /^11/, label: "Cairo", etaInStock: "1-2 days", etaPreorder: "Ships on release", cutoffHour: 17 },
      { pattern: /^12|^13/, label: "Giza/Alex", etaInStock: "2-3 days", etaPreorder: "Ships on release", cutoffHour: 17 },
      { pattern: /^2/, label: "Delta", etaInStock: "2-4 days", etaPreorder: "Ships on release", cutoffHour: 16 },
      { pattern: /^4|^5|^6/, label: "Upper Egypt", etaInStock: "3-5 days", etaPreorder: "Ships on release", cutoffHour: 15 }
    ];
    const match = zones.find((z) => z.pattern.test(zip));
    return match || { label: "nationwide", etaInStock: "3-5 days", etaPreorder: "Ships when restocked", cutoffHour: 17 };
  };

  const formatDate = (date) =>
    date instanceof Date && !Number.isNaN(date)
      ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "soon";

  const updateCutoffTimer = () => {
    if (!cutoffTimer) return;
    const now = new Date();
    const target = new Date();
    target.setHours(17, 0, 0, 0);
    if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1);
    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    cutoffTimer.textContent = `Order within ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} for dispatch today`;
  };

  if (cutoffTimer) {
    updateCutoffTimer();
    setInterval(updateCutoffTimer, 60 * 1000);
  }

  const renderSizes = (sizes, isPreorder) => {
    if (!quickViewSizes) return;
    if (!sizes || !sizes.length) {
      quickViewSizes.innerHTML = isPreorder ? "<p class=\"muted small\">Preorder allocations by size</p>" : "";
      return;
    }
    quickViewSizes.innerHTML = sizes
      .map((s) => {
        const low = s.qty > 0 && s.qty < 3;
        const label = s.qty > 0 ? `${s.qty} left` : "Preorder";
        return `<span class="size-pill ${low ? "is-low" : ""}">${s.size} · ${label}</span>`;
      })
      .join("");
  };

  const updateEtaDisplays = (stock, preorderDate) => {
    const zip = (zipInput?.value || currentZip || "").trim();
    const zone = resolveZone(zip);
    const preorderText = preorderDate ? `Preorder · ships ${formatDate(preorderDate)}` : null;
    const etaText = preorderText || `Delivery to ${zone.label}: ${stock > 0 ? zone.etaInStock : zone.etaPreorder}`;
    if (zipResult) zipResult.textContent = zip ? etaText : "Enter ZIP to see delivery window.";
    if (quickViewEta) quickViewEta.textContent = etaText;
    if (quickViewCutoff && !preorderDate) {
      const cutoffHour = zone.cutoffHour || 17;
      quickViewCutoff.textContent = `Order before ${cutoffHour}:00 for fastest dispatch`;
    }
    if (quickViewCutoff && preorderDate) {
      quickViewCutoff.textContent = preorderText;
    }
  };

  const openModal = (card) => {
    if (!quickViewModal || !card) return;
    const name = card.dataset.name || "";
    const price = card.dataset.price ? Number(card.dataset.price) : 0;
    const stock = parseInt(card.dataset.stock || "0", 10);
    const descFull = card.dataset.descriptionFull || card.dataset.description || "";
    const image = card.dataset.image || "";
    const preorderDateRaw = card.dataset.preorder ? new Date(card.dataset.preorder) : null;
    const isPreorder = preorderDateRaw instanceof Date && !Number.isNaN(preorderDateRaw);
    const preorderDate = isPreorder ? preorderDateRaw : null;
    let sizes = [];
    try {
      sizes = card.dataset.sizes ? JSON.parse(card.dataset.sizes) : [];
    } catch (e) {
      sizes = [];
    }

    if (quickViewImage) quickViewImage.src = image;
    if (quickViewImage) quickViewImage.alt = name;
    if (quickViewTitle) quickViewTitle.textContent = name;
    if (quickViewPrice) quickViewPrice.textContent = `EGP ${price.toFixed(2)}`;
    if (quickViewStock) quickViewStock.textContent = stock > 0 ? `${stock} in stock` : "Unavailable";
    if (quickViewDesc) quickViewDesc.textContent = descFull;
    renderSizes(sizes, Boolean(preorderDate));
    updateEtaDisplays(stock, preorderDate);

    if (quickViewBadge) {
      quickViewBadge.textContent = preorderDate ? "Preorder" : stock <= 0 ? "Sold out" : stock < 5 ? "Low stock" : "In stock";
      quickViewBadge.className = `status-badge ${preorderDate ? "is-preorder" : stock <= 0 ? "is-soldout" : stock < 5 ? "is-low" : "is-available"}`;
    }

    if (quickViewAdd) {
      quickViewAdd.disabled = preorderDate ? false : stock <= 0;
      quickViewAdd.textContent = preorderDate ? "Preorder" : "Add to Cart";
      quickViewAdd.dataset.id = card.querySelector(".add-to-cart")?.dataset.id || "";
      quickViewAdd.dataset.name = name;
    }

    quickViewModal.classList.add("is-open");
    quickViewModal.setAttribute("aria-hidden", "false");
  };

  grid.querySelectorAll(".quick-view").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const card = event.currentTarget.closest(".product-card");
      lastFocusedTrigger = event.currentTarget;
      activeModalIndex = lastFiltered.findIndex((entry) => entry.card === card);
      openModal(card);
      if (quickViewDialog) quickViewDialog.focus();
    });
  });

  const focusableInModal = () =>
    quickViewModal
      ? Array.from(
          quickViewModal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled"))
      : [];

  const trapFocus = (event) => {
    if (!quickViewModal?.classList.contains("is-open")) return;
    const focusables = focusableInModal();
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.key === "Tab") {
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    if (event.key === "Escape") {
      closeModal();
      if (lastFocusedTrigger) lastFocusedTrigger.focus();
    }
    if (event.key === "ArrowRight" && activeModalIndex !== null) {
      const next = lastFiltered[activeModalIndex + 1]?.card;
      if (next) {
        activeModalIndex += 1;
        openModal(next);
        if (quickViewDialog) quickViewDialog.focus();
      }
    }
    if (event.key === "ArrowLeft" && activeModalIndex !== null) {
      const prev = lastFiltered[activeModalIndex - 1]?.card;
      if (prev) {
        activeModalIndex -= 1;
        openModal(prev);
        if (quickViewDialog) quickViewDialog.focus();
      }
    }
  };

  if (quickViewAdd) {
    quickViewAdd.addEventListener("click", async () => {
      const productId = quickViewAdd.dataset.id;
      const productName = quickViewAdd.dataset.name || "Item";
      if (!productId) return;
      const response = await fetch("/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId })
      });
      if (response.ok) {
        const cart = await response.json();
        updateCartUI(cart);
        showCartToast(`${productName} added to cart`);
        closeModal();
      }
    });
  }

  if (quickViewModal) {
    quickViewModal.querySelectorAll("[data-modal-close]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });
    quickViewModal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
    document.addEventListener("keydown", trapFocus);
  }

  // Lazy load with skeleton removal
  cards.forEach(({ card }) => {
    const img = card.querySelector("img");
    if (!img) return;
    card.classList.add("is-loading");
    img.loading = "lazy";
    const clear = () => card.classList.remove("is-loading");
    if (img.complete) {
      clear();
    } else {
      img.addEventListener("load", clear, { once: true });
      img.addEventListener("error", clear, { once: true });
    }
  });

  // Animate on load for a subtle reveal
  cards.forEach(({ card }, idx) => {
    card.style.transition = "transform 220ms ease, opacity 220ms ease";
    card.style.opacity = "0";
    card.style.transform = "translateY(10px)";
    requestAnimationFrame(() => {
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, idx * 40);
    });
  });

  const addToCart = async (productId, productName, btn) => {
    if (!productId) return;
    const button = btn;
    if (button) button.disabled = true;
    try {
      const response = await fetch("/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId })
      });
      if (!response.ok) {
        const message = (await response.json().catch(() => null))?.message || "Could not add to cart";
        showCartToast(message);
        return;
      }
      const cart = await response.json();
      updateCartUI(cart);
      showCartToast(`${productName || "Item"} added to cart`);
    } catch (err) {
      showCartToast("Network issue. Please try again.");
    } finally {
      if (button) button.disabled = false;
    }
  };

  const renderRowCards = (container, entries) => {
    if (!container) return;
    container.innerHTML = entries
      .map(({ card }) => {
        const price = Number(card.dataset.price || 0).toFixed(2);
        const name = card.dataset.name || "";
        const img = card.dataset.image || card.querySelector("img")?.src || "";
        const id = card.dataset.id || "";
        return `
          <div class="mini-card">
            <img src="${img}" alt="${name}">
            <p class="eyebrow">EGP ${price}
            </p>
            <h4>${name}</h4>
            <button class="btn add-to-cart mini-add" type="button" data-id="${id}" data-name="${name}">Add to Cart</button>
          </div>
        `;
      })
      .join("");

    container.querySelectorAll(".mini-add").forEach((btn) => {
      btn.addEventListener("click", () => addToCart(btn.dataset.id, btn.dataset.name, btn));
    });
  };

  const buildFeatured = () => {
    const sorted = [...cards].sort((a, b) => parseFloat(b.card.dataset.price) - parseFloat(a.card.dataset.price));
    renderRowCards(featuredRow, sorted.slice(0, 4));
  };

  const RECENT_KEY = "shop-recent";
  const pushRecent = (id) => {
    const recent = new Set(JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"));
    recent.delete(id);
    recent.add(id);
    const trimmed = Array.from(recent).slice(-6);
    localStorage.setItem(RECENT_KEY, JSON.stringify(trimmed));
  };

  const renderRecent = () => {
    if (!recentRow) return;
    const ids = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    const matched = ids
      .map((id) => cards.find(({ card }) => card.dataset.id === id))
      .filter(Boolean)
      .reverse();
    if (!matched.length) {
      recentRow.innerHTML = '<div class="muted">Browse an item to see it appear here.</div>';
      return;
    }
    renderRowCards(recentRow, matched);
  };

  grid.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      pushRecent(card.dataset.id);
      renderRecent();
    });
  });

  grid.querySelectorAll(".quick-view").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (id) {
        pushRecent(id);
        renderRecent();
      }
    });
  });

  renderRecent();
  buildFeatured();

  applyFilters();

  if (zipButton) {
    zipButton.addEventListener("click", () => {
      const zip = (zipInput?.value || "").trim();
      if (!zip) {
        if (zipResult) zipResult.textContent = "Add a ZIP to check delivery.";
        return;
      }
      currentZip = zip;
      localStorage.setItem(ZIP_STORAGE_KEY, zip);
      const activeCard = activeModalIndex !== null ? lastFiltered[activeModalIndex]?.card : null;
      const stock = activeCard ? parseInt(activeCard.dataset.stock || "0", 10) : 0;
      const preorderDate = activeCard?.dataset.preorder ? new Date(activeCard.dataset.preorder) : null;
      updateEtaDisplays(stock, preorderDate);
    });
  }

  if (zipInput) {
    zipInput.addEventListener("input", () => {
      const zip = zipInput.value.trim();
      if (!zip) return;
      currentZip = zip;
    });
  }

  // Initialize state from URL params
  const params = new URLSearchParams(window.location.search);
  const initialTerm = params.get("q");
  const initialSort = params.get("sort");
  const initialPriceMax = params.get("priceMax");
  const initialFilters = (params.get("filters") || "")
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);

  if (initialTerm && searchInput) searchInput.value = initialTerm;
  if (initialSort && sortSelect) sortSelect.value = initialSort;
  if (initialPriceMax && priceRange) {
    priceRange.value = initialPriceMax;
    if (priceLabel) priceLabel.textContent = formatPriceLabel(priceRange.value);
  }
  if (initialFilters.length) {
    toggles.forEach((toggle) => {
      if (initialFilters.includes(toggle.dataset.filter)) toggle.classList.add("is-active");
    });
  }

  applyFilters();
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mouseenter", () => btn.classList.add("btn-hover"));
    btn.addEventListener("mouseleave", () => btn.classList.remove("btn-hover"));
  });

  const header = document.querySelector(".site-header");

  const updateHeaderState = () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  const navToggle = document.querySelector("#nav-toggle");
  const navLinks = document.querySelector("#nav-links");
  const navBackdrop = document.querySelector("#nav-backdrop");
  const navTitle = document.querySelector(".nav-title");
  const navTopLinks = document.querySelector(".nav-top-links");
  const navTopActions = document.querySelector(".nav-top-actions");

  const navTitleHome = navTitle ? navTitle.parentElement : null;
  const navTopLinksHome = navTopLinks ? navTopLinks.parentElement : null;
  const navTopLinksNext = navTopLinks ? navTopLinks.nextSibling : null;
  const navTitleNext = navTitle ? navTitle.nextSibling : null;

  const updateMobileNavPlacement = () => {
    if (!navLinks || !navTitle || !navTopLinks || !navTopActions) return;
    if (window.matchMedia("(max-width: 900px)").matches) {
      if (navLinks.contains(navTitle) === false) {
        navLinks.prepend(navTopLinks);
        navLinks.prepend(navTitle);
      }
    } else {
      if (navTitleHome && navTitleHome.contains(navTitle) === false) {
        if (navTitleNext) {
          navTitleHome.insertBefore(navTitle, navTitleNext);
        } else {
          navTitleHome.appendChild(navTitle);
        }
      }
      if (navTopLinksHome && navTopLinksHome.contains(navTopLinks) === false) {
        if (navTopLinksNext) {
          navTopLinksHome.insertBefore(navTopLinks, navTopLinksNext);
        } else {
          navTopLinksHome.appendChild(navTopLinks);
        }
      }
    }
  };

  const setNavOpen = (isOpen) => {
    if (!navLinks || !navToggle || !navBackdrop) return;
    navLinks.classList.toggle("is-open", isOpen);
    navBackdrop.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (!isOpen) {
      document.querySelectorAll(".nav-item.is-open").forEach((item) => item.classList.remove("is-open"));
    }
  };

  if (navToggle && navLinks && navBackdrop) {
    updateMobileNavPlacement();
    window.addEventListener("resize", updateMobileNavPlacement);

    const navTriggers = navLinks.querySelectorAll(".nav-trigger");
    navTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        if (!window.matchMedia("(max-width: 900px)").matches) return;
        event.preventDefault();
        const navItem = trigger.closest(".nav-item");
        if (!navItem) return;
        const isOpen = navItem.classList.contains("is-open");
        document.querySelectorAll(".nav-item.is-open").forEach((item) => item.classList.remove("is-open"));
        if (!isOpen) {
          navItem.classList.add("is-open");
          const dropdown = navItem.querySelector(".dropdown");
          if (dropdown) {
            const navRect = navLinks.getBoundingClientRect();
            const itemRect = navItem.getBoundingClientRect();
            const dropdownRect = dropdown.getBoundingClientRect();
            const maxLeft = window.innerWidth - dropdownRect.width - 12;
            const desiredLeft = navRect.right + 12;
            const left = Math.max(12, Math.min(desiredLeft, maxLeft));
            const maxTop = window.innerHeight - dropdownRect.height - 12;
            const top = Math.max(12, Math.min(itemRect.top, maxTop));
            dropdown.style.left = `${left}px`;
            dropdown.style.top = `${top}px`;
          }
        }
      });
    });

    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.contains("is-open");
      setNavOpen(!isOpen);
    });

    navBackdrop.addEventListener("click", () => setNavOpen(false));

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setNavOpen(false));
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setNavOpen(false);
      }
    });
  }

});

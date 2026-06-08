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
  const navClose = document.querySelector("#nav-close");
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
    // One delegated handler on the drawer: tapping a parent (.nav-trigger)
    // expands/collapses its sub-pages (accordion); tapping a real link navigates
    // and closes the menu. The mobile drawer is now self-contained in the HTML
    // (.nav-mobile-head) — no runtime DOM re-parenting, which was fragile.
    navLinks.addEventListener("click", (event) => {
      const trigger = event.target.closest(".nav-trigger");
      if (trigger && navLinks.contains(trigger)) {
        if (!window.matchMedia("(max-width: 900px)").matches) return;
        event.preventDefault();
        event.stopPropagation();
        const navItem = trigger.closest(".nav-item");
        if (!navItem) return;
        const willOpen = !navItem.classList.contains("is-open");
        navLinks.querySelectorAll(".nav-item.is-open").forEach((item) => {
          if (item !== navItem) item.classList.remove("is-open");
        });
        navItem.classList.toggle("is-open", willOpen);
        // Drop focus from the trigger so a lingering :focus-within state can
        // never keep a just-closed sub-menu visible.
        if (typeof trigger.blur === "function") {
          trigger.blur();
        }
        if (willOpen) {
          // Bring the freshly opened sub-menu fully into view inside the
          // scrollable drawer so it can never end up hidden below the fold.
          window.requestAnimationFrame(() => {
            const dropdown = navItem.querySelector(".dropdown");
            (dropdown || navItem).scrollIntoView({ behavior: "smooth", block: "nearest" });
          });
        }
        return;
      }
      // A real navigation link closes the menu (and lets the navigation proceed).
      if (event.target.closest("a")) {
        setNavOpen(false);
      }
    });

    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.contains("is-open");
      setNavOpen(!isOpen);
    });

    navBackdrop.addEventListener("click", () => setNavOpen(false));

    if (navClose) {
      navClose.addEventListener("click", () => setNavOpen(false));
    }

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setNavOpen(false);
      }
    });
  }

});

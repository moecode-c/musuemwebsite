(() => {
  const pageBody = document.body;
  if (!pageBody || !pageBody.classList.contains("page-about")) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = Array.from(document.querySelectorAll(".about-reveal"));
  const counterItems = Array.from(document.querySelectorAll(".metric-value[data-counter]"));
  const interactiveItems = Array.from(document.querySelectorAll(".about-interactive"));
  const progressFill = document.querySelector(".about-scroll-progress span");
  const hero = document.querySelector(".about-hero");

  pageBody.classList.add("about-motion-ready");

  const locale = document.documentElement.lang === "ar" ? "ar-EG" : "en-US";
  const numberFormatter = new Intl.NumberFormat(locale);

  const setCounterValue = (node, value) => {
    const suffix = node.dataset.suffix || "";
    node.textContent = `${numberFormatter.format(value)}${suffix}`;
  };

  const updateScrollProgress = () => {
    if (!progressFill) {
      return;
    }

    const root = document.documentElement;
    const scrollable = root.scrollHeight - root.clientHeight;
    const progress = scrollable <= 0 ? 0 : Math.min(Math.max(root.scrollTop / scrollable, 0), 1);
    progressFill.style.transform = `scaleX(${progress.toFixed(4)})`;
  };

  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });

  if (reduceMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    counterItems.forEach((item) => {
      const target = Number.parseInt(item.dataset.counter || "0", 10);
      setCounterValue(item, Number.isFinite(target) ? target : 0);
    });
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (node) => {
    const target = Number.parseInt(node.dataset.counter || "0", 10);
    if (!Number.isFinite(target) || target <= 0) {
      setCounterValue(node, 0);
      return;
    }

    const duration = 1300;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const currentValue = Math.round(target * eased);

      setCounterValue(node, currentValue);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.55
    }
  );

  counterItems.forEach((item) => counterObserver.observe(item));

  interactiveItems.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") {
        return;
      }

      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      const tiltY = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
      const tiltX = -((event.clientY - rect.top) / rect.height - 0.5) * 8;

      card.style.setProperty("--pointer-x", `${x}%`);
      card.style.setProperty("--pointer-y", `${y}%`);
      card.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--pointer-x");
      card.style.removeProperty("--pointer-y");
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });

  if (hero) {
    window.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch" || window.innerWidth < 900) {
        return;
      }

      const xShift = (event.clientX / window.innerWidth - 0.5) * 16;
      const yShift = (event.clientY / window.innerHeight - 0.5) * 12;

      hero.style.setProperty("--hero-parallax-x", `${xShift.toFixed(2)}px`);
      hero.style.setProperty("--hero-parallax-y", `${yShift.toFixed(2)}px`);
    });
  }
})();

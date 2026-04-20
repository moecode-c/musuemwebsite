const getHomeI18n = () => {
  const fallback = {
    destinations: [
      {
        name: "Pyramids of Giza",
        title: "PYRAMIDS",
        eyebrow: "Old Kingdom - 2580 BC",
        desc: "Rising from the desert sands of Giza, the Great Pyramid stood as the tallest human-made structure for nearly 4,000 years. A monumental tomb of Pharaoh Khufu, it remains the last surviving wonder of the ancient world.",
        img: "/assets/images/pyramidsbg.png"
      },
      {
        name: "Tutankhamun's Mask",
        title: "TUT'S MASK",
        eyebrow: "New Kingdom - 1323 BC",
        desc: "Crafted from 11kg of solid gold and inlaid with lapis lazuli, the funerary mask of the boy king is one of the most iconic artifacts of antiquity. Discovered by Howard Carter in 1922, it now rests in the Egyptian Museum.",
        img: "/assets/images/tut1.png"
      },
      {
        name: "Great Sphinx",
        title: "SPHINX",
        eyebrow: "Old Kingdom - 2500 BC",
        desc: "A colossal limestone guardian with the body of a lion and the face of a pharaoh. The Great Sphinx of Giza watches eternally over the Nile, holding secrets that have puzzled archaeologists for millennia.",
        img: "/assets/images/sph1.png"
      },
      {
        name: "Karnak Temple",
        title: "KARNAK",
        eyebrow: "Middle Kingdom - 2000 BC",
        desc: "The vast religious complex at Karnak is a city of temples dedicated to Amun-Ra. Its Hypostyle Hall - a forest of 134 towering stone columns - remains one of the most awe-inspiring spaces ever built by human hands.",
        img: "/assets/images/karnak.png"
      },
      {
        name: "Abu Simbel",
        title: "ABU SIMBEL",
        eyebrow: "New Kingdom - 1264 BC",
        desc: "Carved directly into a sandstone cliff, the twin temples of Ramesses II were relocated stone by stone in the 1960s to escape rising waters. Four colossal statues guard their entrance to this day.",
        img: "/assets/images/abu1.png"
      },
      {
        name: "Valley of the Kings",
        title: "THE VALLEY",
        eyebrow: "New Kingdom - 1500 BC",
        desc: "Hidden in the cliffs of Luxor's west bank lie the royal tombs of Egypt's most powerful pharaohs. Sixty-three chambers carved into living rock - painted with vivid scenes of the journey to the afterlife.",
        img: "/assets/images/valley.png"
      }
    ],
    viewLabelPrefix: "View",
    goToLabelPrefix: "Go to",
    galleryPageLabel: "Go to gallery page",
    readMore: "Read more",
    readLess: "Read less",
    pauseHintDefault: "Click to pause - Click again to resume",
    pauseHintPaused: "Paused - Click to resume"
  };

  let source = window.HOME_PAGE_I18N || {};
  if (!Object.keys(source).length) {
    const jsonNode = document.getElementById("home-page-i18n");
    const rawJson = jsonNode?.textContent?.trim();
    if (rawJson) {
      try {
        source = JSON.parse(rawJson);
      } catch (error) {
        source = {};
      }
    }
  }

  return {
    ...fallback,
    ...source,
    destinations: Array.isArray(source.destinations) && source.destinations.length ? source.destinations : fallback.destinations
  };
};

document.addEventListener("DOMContentLoaded", () => {
  const bgStage = document.getElementById("bgStage");
  const cardsWrap = document.getElementById("cardsWrap");
  const timeline = document.getElementById("timeline");

  if (!bgStage || !cardsWrap || !timeline) return;

  const homeI18n = getHomeI18n();
  const DESTINATIONS = homeI18n.destinations;

  let activeIndex = 0;
  let isAnimating = false;
  let autoTimer = null;
  const total = DESTINATIONS.length;

  DESTINATIONS.forEach((item, index) => {
    const slide = document.createElement("div");
    slide.className = `bg-slide${index === 0 ? " active" : ""}`;
    slide.style.backgroundImage = `url('${item.img}')`;
    bgStage.appendChild(slide);
  });

  DESTINATIONS.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.index = String(index);
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${homeI18n.viewLabelPrefix} ${item.name}`);
    card.innerHTML = `
      <div class="card-img" style="background-image:url('${item.img}')"></div>
      <div class="card-shade"></div>
      <div class="bookmark" aria-hidden="true">✦</div>
      <div class="card-body">
        <div class="card-name">${item.name}</div>
        <div class="card-stars" aria-label="5 stars">★★★★★</div>
      </div>`;
    card.addEventListener("click", () => goTo(index));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        goTo(index);
      }
    });
    cardsWrap.appendChild(card);
  });

  DESTINATIONS.forEach((item, index) => {
    const dot = document.createElement("div");
    dot.className = `dot${index === 0 ? " active" : ""}`;
    dot.dataset.index = String(index);
    dot.setAttribute("tabindex", "0");
    dot.setAttribute("role", "button");
    dot.setAttribute("aria-label", `${homeI18n.goToLabelPrefix} ${item.name}`);
    dot.addEventListener("click", () => goTo(index));
    dot.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        goTo(index);
      }
    });
    timeline.appendChild(dot);
  });

  const counterTotal = document.getElementById("counterTotal");
  if (counterTotal) {
    counterTotal.textContent = String(total).padStart(2, "0");
  }

  const renderPositions = () => {
    cardsWrap.querySelectorAll(".card").forEach((card, index) => {
      const offset = (index - activeIndex + total) % total;
      card.classList.remove("pos-0", "pos-1", "pos-2", "pos-3", "leaving", "entering");
      if (offset === 0) card.classList.add("pos-0");
      else if (offset === 1) card.classList.add("pos-1");
      else if (offset === 2) card.classList.add("pos-2");
      else if (offset === 3) card.classList.add("pos-3");
      else {
        card.style.opacity = "0";
        card.style.zIndex = "0";
        return;
      }
      card.style.opacity = "";
      card.style.zIndex = "";
    });
  };

  const updateBackground = (index) => {
    bgStage.querySelectorAll(".bg-slide").forEach((slide, idx) => {
      slide.classList.toggle("active", idx === index);
    });
  };

  const updateText = (index) => {
    const content = document.getElementById("content");
    if (!content) return;
    const item = DESTINATIONS[index];
    content.classList.remove("swap-in");
    content.classList.add("swap-out");
    setTimeout(() => {
      const eyebrow = document.getElementById("eyebrow");
      const title = document.getElementById("title");
      const desc = document.getElementById("desc");
      if (eyebrow) eyebrow.textContent = item.eyebrow;
      if (title) title.textContent = item.title;
      if (desc) desc.textContent = item.desc;
      content.classList.remove("swap-out");
      content.classList.add("swap-in");
    }, 350);
  };

  const updateTimeline = (index) => {
    timeline.querySelectorAll(".dot").forEach((dot, idx) => {
      dot.classList.toggle("active", idx === index);
    });
  };

  const updateCounter = (index) => {
    const counterCur = document.getElementById("counterCur");
    if (counterCur) {
      counterCur.textContent = String(index + 1).padStart(2, "0");
    }
  };

  const goTo = (newIndex) => {
    if (isAnimating || newIndex === activeIndex) return;
    isAnimating = true;
    const cards = cardsWrap.querySelectorAll(".card");
    if (cards[activeIndex]) cards[activeIndex].classList.add("leaving");
    activeIndex = newIndex;
    updateBackground(activeIndex);
    updateText(activeIndex);
    updateTimeline(activeIndex);
    updateCounter(activeIndex);
    setTimeout(() => {
      renderPositions();
      isAnimating = false;
    }, 700);
  };

  const next = () => goTo((activeIndex + 1) % total);
  const prev = () => goTo((activeIndex - 1 + total) % total);

  const startAuto = () => {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(next, 2500);
  };

  const stopAuto = () => {
    if (autoTimer) clearInterval(autoTimer);
  };

  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  if (nextBtn) nextBtn.addEventListener("click", () => {
    next();
    startAuto();
  });
  if (prevBtn) prevBtn.addEventListener("click", () => {
    prev();
    startAuto();
  });

  cardsWrap.addEventListener("mouseenter", stopAuto);
  cardsWrap.addEventListener("mouseleave", startAuto);

  const sliderTrack = document.getElementById("sliderTrack");
  const sliderPrev = document.getElementById("sliderPrev");
  const sliderNext = document.getElementById("sliderNext");
  const galleryDots = document.getElementById("galleryDots");

  let currentGalleryPage = 0;
  const pageCount = sliderTrack ? sliderTrack.children.length : 0;

  const buildGalleryDots = () => {
    if (!galleryDots || pageCount === 0) return;
    for (let i = 0; i < pageCount; i += 1) {
      const dot = document.createElement("button");
      dot.className = `gallery-dot${i === 0 ? " active" : ""}`;
      dot.setAttribute("aria-label", `${homeI18n.galleryPageLabel} ${i + 1}`);
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
      dot.addEventListener("click", () => slideGalleryTo(i));
      galleryDots.appendChild(dot);
    }
  };

  const updateGalleryDots = (index) => {
    if (!galleryDots) return;
    galleryDots.querySelectorAll(".gallery-dot").forEach((dot, idx) => {
      dot.classList.toggle("active", idx === index);
      dot.setAttribute("aria-selected", idx === index ? "true" : "false");
    });
  };

  const slideGalleryTo = (targetIndex) => {
    if (!sliderTrack || pageCount === 0) return;
    const pageWidth = sliderTrack.clientWidth;
    currentGalleryPage = (targetIndex + pageCount) % pageCount;
    sliderTrack.scrollTo({ left: currentGalleryPage * pageWidth, behavior: "smooth" });
    updateGalleryDots(currentGalleryPage);
  };

  const slideGallery = (direction) => {
    slideGalleryTo(currentGalleryPage + direction);
  };

  if (sliderTrack && sliderPrev && sliderNext) {
    sliderPrev.addEventListener("click", () => slideGallery(-1));
    sliderNext.addEventListener("click", () => slideGallery(1));
    buildGalleryDots();
  }

  const reviewsTrack = document.getElementById("reviewsTrack");
  const reviewsSlider = document.getElementById("reviewsSlider");
  const pauseHint = document.getElementById("pauseHint");

  if (reviewsTrack && reviewsSlider) {
    reviewsTrack.innerHTML += reviewsTrack.innerHTML;

    reviewsTrack.querySelectorAll(".review-card").forEach((card) => {
      const btn = card.querySelector(".review-link");
      if (!btn) return;
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        const isExpanded = card.classList.toggle("expanded");
        btn.textContent = isExpanded ? homeI18n.readLess : homeI18n.readMore;
        btn.setAttribute("aria-expanded", String(isExpanded));
      });
    });

    let isPaused = false;
    reviewsSlider.addEventListener("click", (event) => {
      if (event.target.closest(".review-link")) return;
      isPaused = !isPaused;
      reviewsSlider.classList.toggle("paused", isPaused);
      if (pauseHint) {
        pauseHint.textContent = isPaused ? homeI18n.pauseHintPaused : homeI18n.pauseHintDefault;
      }
    });

    reviewsSlider.addEventListener("mouseenter", () => {
      if (!isPaused) reviewsTrack.style.animationPlayState = "paused";
    });

    reviewsSlider.addEventListener("mouseleave", () => {
      if (!isPaused) reviewsTrack.style.animationPlayState = "running";
    });
  }

  renderPositions();
  updateText(0);
  const content = document.getElementById("content");
  if (content) {
    setTimeout(() => {
      content.classList.add("swap-in");
    }, 50);
  }
  startAuto();
});

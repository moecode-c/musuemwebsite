document.addEventListener("DOMContentLoaded", () => {
  const audioBtn = document.getElementById("tour-audio-btn");
  const audio = document.getElementById("tour-audio");
  const fullscreenBtn = document.getElementById("tour-fullscreen-btn");
  const mapFrame = document.querySelector(".map-frame");
  const iframe = mapFrame ? mapFrame.querySelector("iframe") : null;
  const defaultAudioLabel = audioBtn ? audioBtn.textContent.trim() : "Audio Guide";

  const requestElementFullscreen = (element) => {
    if (!element) return Promise.reject(new Error("No fullscreen target"));

    if (typeof element.requestFullscreen === "function") {
      return element.requestFullscreen();
    }
    if (typeof element.webkitRequestFullscreen === "function") {
      element.webkitRequestFullscreen();
      return Promise.resolve();
    }
    if (typeof element.mozRequestFullScreen === "function") {
      element.mozRequestFullScreen();
      return Promise.resolve();
    }
    if (typeof element.msRequestFullscreen === "function") {
      element.msRequestFullscreen();
      return Promise.resolve();
    }

    return Promise.reject(new Error("Fullscreen API unavailable"));
  };

  const exitAnyFullscreen = () => {
    if (typeof document.exitFullscreen === "function") {
      return document.exitFullscreen();
    }
    if (typeof document.webkitExitFullscreen === "function") {
      document.webkitExitFullscreen();
      return Promise.resolve();
    }
    if (typeof document.mozCancelFullScreen === "function") {
      document.mozCancelFullScreen();
      return Promise.resolve();
    }
    if (typeof document.msExitFullscreen === "function") {
      document.msExitFullscreen();
      return Promise.resolve();
    }

    return Promise.resolve();
  };

  const setAudioButtonState = (isPlaying) => {
    if (!audioBtn) return;

    audioBtn.innerHTML = isPlaying
      ? '<i class="fas fa-pause"></i>Pause Audio'
      : `<i class="fas fa-volume-up"></i>${defaultAudioLabel}`;
    audioBtn.setAttribute("aria-pressed", String(isPlaying));
    audioBtn.classList.toggle("is-playing", isPlaying);
  };

  const setFullscreenButtonState = (isExpanded) => {
    if (!fullscreenBtn) return;

    fullscreenBtn.innerHTML = isExpanded
      ? '<i class="fas fa-compress"></i>Exit Fullscreen'
      : '<i class="fas fa-expand"></i>Fullscreen';
    fullscreenBtn.setAttribute("aria-pressed", String(isExpanded));
  };

  if (audioBtn && audio) {
    audio.preload = "auto";
    setAudioButtonState(false);

    audioBtn.addEventListener("click", () => {
      if (audio.paused) {
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {
            setAudioButtonState(false);
          });
        }
        setAudioButtonState(true);
      } else {
        audio.pause();
        setAudioButtonState(false);
      }
    });

    audio.addEventListener("ended", () => setAudioButtonState(false));
    audio.addEventListener("play", () => setAudioButtonState(true));
    audio.addEventListener("pause", () => {
      if (!audio.ended) {
        setAudioButtonState(false);
      }
    });

    audio.addEventListener("error", () => {
      audioBtn.innerHTML = '<i class="fas fa-triangle-exclamation"></i>Audio unavailable';
      audioBtn.setAttribute("disabled", "true");
      audioBtn.classList.remove("is-playing");
    });
  }

  if (mapFrame) {
    const fullscreenTarget = mapFrame;
    const fallbackFullscreenClass = "is-fallback-fullscreen";
    const fallbackBodyClass = "tour-fallback-fullscreen-active";
    const fullscreenSettleDelayMs = 320;

    // Defensive reset in case a stale mobile nav backdrop is left open.
    const navBackdrop = document.getElementById("nav-backdrop");
    const navLinks = document.getElementById("nav-links");
    if (navBackdrop) navBackdrop.classList.remove("is-open");
    if (navLinks) navLinks.classList.remove("is-open");
    document.body.style.overflow = "";

    if (iframe) {
      const requiredAllowTokens = ["fullscreen", "geolocation"];
      const currentAllow = iframe.getAttribute("allow") || "";
      const allowSet = new Set(
        currentAllow
          .split(";")
          .map((token) => token.trim().toLowerCase())
          .filter(Boolean)
      );
      requiredAllowTokens.forEach((token) => allowSet.add(token));
      iframe.setAttribute("allow", Array.from(allowSet).join("; "));

      if (!iframe.hasAttribute("allowfullscreen")) {
        iframe.setAttribute("allowfullscreen", "");
      }

      if (!iframe.hasAttribute("webkitallowfullscreen")) {
        iframe.setAttribute("webkitallowfullscreen", "");
      }

      if (!iframe.hasAttribute("mozallowfullscreen")) {
        iframe.setAttribute("mozallowfullscreen", "");
      }
    }

    const getActiveFullscreenElement = () => (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );

    const isFallbackFullscreen = () => mapFrame.classList.contains(fallbackFullscreenClass);

    const enterFallbackFullscreen = () => {
      mapFrame.classList.add(fallbackFullscreenClass);
      document.body.classList.add(fallbackBodyClass);
      setFullscreenButtonState(true);
    };

    const exitFallbackFullscreen = () => {
      mapFrame.classList.remove(fallbackFullscreenClass);
      document.body.classList.remove(fallbackBodyClass);
      setFullscreenButtonState(false);
    };

    const syncFullscreenButton = () => {
      const hasNativeFullscreen = Boolean(getActiveFullscreenElement());

      // If native fullscreen succeeded, remove fallback state.
      if (hasNativeFullscreen && isFallbackFullscreen()) {
        mapFrame.classList.remove(fallbackFullscreenClass);
        document.body.classList.remove(fallbackBodyClass);
      }

      setFullscreenButtonState(hasNativeFullscreen || isFallbackFullscreen());
    };

    document.addEventListener("fullscreenchange", syncFullscreenButton);
    document.addEventListener("webkitfullscreenchange", syncFullscreenButton);
    document.addEventListener("mozfullscreenchange", syncFullscreenButton);
    document.addEventListener("MSFullscreenChange", syncFullscreenButton);

    setFullscreenButtonState(false);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isFallbackFullscreen()) {
        exitFallbackFullscreen();
      }
    });

    const toggleFullscreen = () => {
      const activeFullscreenElement = getActiveFullscreenElement();

      if (isFallbackFullscreen()) {
        exitFallbackFullscreen();
        return;
      }

      if (activeFullscreenElement) {
        exitAnyFullscreen().catch(() => {
          // Ignore exit errors to keep the button responsive.
        });
        return;
      }

      requestElementFullscreen(fullscreenTarget)
        .then(() => {
          window.setTimeout(() => {
            const hasNativeFullscreen = Boolean(getActiveFullscreenElement());
            if (hasNativeFullscreen) {
              setFullscreenButtonState(true);
              return;
            }

            enterFallbackFullscreen();
          }, fullscreenSettleDelayMs);
        })
        .catch(() => {
          // Fallback for mobile browsers where Fullscreen API is blocked.
          enterFallbackFullscreen();
        });
    };

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener("click", toggleFullscreen);
    }
  }
});

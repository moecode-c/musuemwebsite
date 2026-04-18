document.addEventListener("DOMContentLoaded", () => {
  const audioBtn = document.getElementById("tour-audio-btn");
  const audio = document.getElementById("tour-audio");
  const fullscreenBtn = document.getElementById("tour-fullscreen-btn");
  const iframe = document.querySelector(".map-frame iframe");
  const defaultAudioLabel = audioBtn ? audioBtn.textContent.trim() : "Audio Guide";

  const setAudioButtonState = (isPlaying) => {
    if (!audioBtn) return;

    audioBtn.innerHTML = isPlaying
      ? '<i class="fas fa-pause"></i>Pause Audio'
      : `<i class="fas fa-volume-up"></i>${defaultAudioLabel}`;
    audioBtn.setAttribute("aria-pressed", String(isPlaying));
    audioBtn.classList.toggle("is-playing", isPlaying);
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

  if (fullscreenBtn && iframe) {
    fullscreenBtn.addEventListener("click", () => {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const audioBtn = document.getElementById("tour-audio-btn");
  const audio = document.getElementById("tour-audio");
  const fullscreenBtn = document.getElementById("tour-fullscreen-btn");
  const iframe = document.querySelector(".map-frame iframe");

  if (audioBtn && audio) {
    audioBtn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
        audioBtn.innerHTML = '<i class="fas fa-pause"></i>Pause Audio';
      } else {
        audio.pause();
        audioBtn.innerHTML = '<i class="fas fa-volume-up"></i>Audio Guide';
      }
    });

    audio.addEventListener("ended", () => {
      audioBtn.innerHTML = '<i class="fas fa-volume-up"></i>Audio Guide';
    });
  }

  if (fullscreenBtn && iframe) {
    fullscreenBtn.addEventListener("click", () => {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      }
    });
  }
});

import * as THREE from "/vendor/three/build/three.module.js";

document.addEventListener("DOMContentLoaded", () => {
  const viewerTarget = document.getElementById("vrx-viewer");
  const hotspotLayer = document.getElementById("vrx-hotspot-layer");
  const captionElement = document.getElementById("vrx-scene-caption");
  const viewerShell = document.querySelector(".vrx-viewer-shell");
  const motionBtn = document.getElementById("vr-motion-btn");
  const fullscreenBtn = document.getElementById("vr-fullscreen-btn");
  const cardboardBtn = document.getElementById("vr-cardboard-btn");
  const cardboardBar = document.getElementById("vrx-cardboard-bar");
  const cardboardExit = document.getElementById("vrx-cardboard-exit");
  const loaderEl = document.getElementById("vrx-loader");
  const sceneButtons = Array.from(document.querySelectorAll(".vrx-scene-btn"));
  const SPHERE_RADIUS = 500;
  const CARDBOARD_IPD = 0.035; // inter-pupillary offset in world units fraction
  const EQUIRECT_RATIO_TARGET = 2;
  const EQUIRECT_RATIO_TOLERANCE = 0.14;
  const DEFAULT_CANVAS_FILTER = "brightness(1.25) contrast(1.08) saturate(1.12)";
  const LOW_LIGHT_CANVAS_FILTER = "brightness(1.65) contrast(1.14) saturate(1.2)";
  const INVALID_PANORAMA_HORIZONTAL_OFFSET = 0.5;
  const FALLBACK_FULLSCREEN_SHELL_CLASS = "vrx-viewer-shell--fallback-fullscreen";
  const FALLBACK_FULLSCREEN_BODY_CLASS = "vrx-body-fullscreen-lock";
  const FALLBACK_FULLSCREEN_HTML_CLASS = "vrx-html-fullscreen-lock";
  const FORCE_LANDSCAPE_SHELL_CLASS = "vrx-viewer-shell--force-landscape";

  // ---------------------------------------------------------------------------
  // SCENES — equirectangular panoramas (2:1 ratio, freely licensed images).
  // Each imageUrl must be a publicly accessible equirectangular JPEG/PNG.
  // The Grand Egyptian Museum panoramas below use Poly Haven's free HDR
  // panoramas re-hosted as equirectangular JPEGs (CC0 license).
  //
  // To use your own panorama: replace any imageUrl with your own hosted image.
  // For 360cities: purchase a "Hosted Embed" license, download the equirect
  // image, upload it to your /public/assets/images/ folder, and point here.
  // ---------------------------------------------------------------------------
  const SCENES = {
    royal_hall: {
      imageUrl: "/assets/images/vr-panoramas/pharaoh-panorama.png",
      startLon: 20,
      startLat: 0,
      caption: "Grand Atrium: Soaring entrance hall with monumental royal statuary.",
      hotspots: [
        {
          label: "Colossi of Ramesses",
          detail: "The twin colossi stand 11 metres tall — among the largest statues moved to a modern museum.",
          yaw: -55,
          pitch: 8,
        },
        {
          label: "Entrance Frieze",
          detail: "Carved relief friezes narrate the jubilee festivals (Sed festivals) of Egypt's kings.",
          yaw: 40,
          pitch: 3,
        },
        {
          label: "Skylight Vault",
          detail: "The glass and steel roof washes the stone in natural light, echoing the desert sun.",
          yaw: 10,
          pitch: 28,
        },
      ],
    },
    sanctuary_gallery: {
      imageUrl: "/assets/images/vr-panoramas/islamic-panorama.png",
      startLon: 5,
      startLat: 0,
      caption: "Islamic Arts Wing: Manuscripts, geometric tiles, and Quranic calligraphy.",
      hotspots: [
        {
          label: "Arabesque Tilework",
          detail: "Intricate geometric patterns in blue and gold — a hallmark of Mamluk and Ottoman craftsmanship.",
          yaw: -14,
          pitch: 6,
        },
        {
          label: "Illuminated Manuscripts",
          detail: "Gilded Quranic pages from the 12th–15th centuries, preserved in climate-controlled cases.",
          yaw: 88,
          pitch: 4,
        },
        {
          label: "Carved Mashrabiya",
          detail: "Ornate latticed wooden screens that filtered light and ensured privacy in Islamic interiors.",
          yaw: -100,
          pitch: 2,
        },
      ],
    },
    heritage_chamber: {
      imageUrl: "/assets/images/vr-panoramas/christian-panorama.png",
      startLon: -60,
      startLat: 0,
      caption: "Coptic Heritage Gallery: Icons, textiles, and the legacy of Christian Egypt.",
      hotspots: [
        {
          label: "Byzantine Icons",
          detail: "Encaustic and tempera panels from the 4th–7th centuries — among the world's oldest Christian icons.",
          yaw: 82,
          pitch: 5,
        },
        {
          label: "Coptic Textiles",
          detail: "Linen and wool tapestry fragments with figural and ornamental motifs, woven in the Nile Delta.",
          yaw: -135,
          pitch: 3,
        },
        {
          label: "Ancient Manuscripts",
          detail: "Papyrus and parchment codices containing early Christian scripture in Coptic and Greek.",
          yaw: 155,
          pitch: 2,
        },
      ],
    },
  };

  if (!viewerTarget || !viewerShell || !hotspotLayer) return;

  let renderer = null;
  let panoramaScene = null;
  let camera = null;
  let sphereMesh = null;
  let textureLoader = null;
  let animationFrameId = null;

  let activeSceneKey = "royal_hall";
  let activeHotspotElements = [];
  let textureRequestId = 0;

  let lon = 0;
  let lat = 0;

  let isPointerDown = false;
  let pointerDownX = 0;
  let pointerDownY = 0;
  let pointerDownLon = 0;
  let pointerDownLat = 0;
  let fallbackFullscreenActive = false;

  let motionPermissionGranted = false;
  let motionPermissionInFlight = false;
  let motionEnabled = false;
  const deviceOrientation = { alpha: null, beta: null, gamma: null };
  let alphaOffsetAngle = 0;

  const zee = new THREE.Vector3(0, 0, 1);
  const euler = new THREE.Euler();
  const q0 = new THREE.Quaternion();
  const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
  const cameraDirection = new THREE.Vector3();

  const setActiveSceneButton = (sceneKey) => {
    sceneButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.scene === sceneKey);
    });
  };

  const setCaption = (text) => {
    if (!captionElement) return;
    captionElement.textContent = text;
  };

  const setCanvasFilter = (filterValue) => {
    if (!renderer || !renderer.domElement) return;
    renderer.domElement.style.filter = filterValue;
  };

  const getTextureImageMetadata = (texture) => {
    const image = texture?.image;
    const width = Number(image?.naturalWidth || image?.videoWidth || image?.width || 0);
    const height = Number(image?.naturalHeight || image?.videoHeight || image?.height || 0);
    const ratio = height > 0 ? width / height : 0;
    return { width, height, ratio };
  };

  const isLikelyEquirectangular = (ratio) => {
    if (!Number.isFinite(ratio) || ratio <= 0) return false;
    return Math.abs(ratio - EQUIRECT_RATIO_TARGET) <= EQUIRECT_RATIO_TOLERANCE;
  };

  const showViewerError = (message) => {
    viewerTarget.innerHTML = `<div class="vrx-error">${message}</div>`;
    hotspotLayer.innerHTML = "";
    setCaption(message.replace(/<br\s*\/?>/gi, " "));
  };

  const getMotionLabelMap = () => {
    const defaultLabel = motionBtn?.dataset.labelDefault || "Enable Phone Motion";
    const enabledLabel = motionBtn?.dataset.labelEnabled || "Motion Enabled";
    const blockedLabel = motionBtn?.dataset.labelBlocked || "Motion Blocked";
    return { defaultLabel, enabledLabel, blockedLabel };
  };

  const setMotionLabel = (state) => {
    if (!motionBtn) return;

    const label = motionBtn.querySelector("span");
    if (!label) return;

    const { defaultLabel, enabledLabel, blockedLabel } = getMotionLabelMap();

    if (state === "enabled") {
      label.textContent = enabledLabel;
      motionBtn.classList.add("is-enabled");
      return;
    }

    if (state === "blocked") {
      label.textContent = blockedLabel;
      motionBtn.classList.remove("is-enabled");
      return;
    }

    label.textContent = defaultLabel;
    motionBtn.classList.remove("is-enabled");
  };

  const getMotionBlockedMessage = () => {
    const ua = navigator.userAgent || "";
    const isIOS = /iPad|iPhone|iPod/i.test(ua);

    if (!window.isSecureContext) {
      return "Phone motion is blocked because this page is not in a secure context. Open the site over HTTPS and try again.";
    }

    if (isIOS) {
      return "Phone motion was denied. Enable 'Motion & Orientation Access' in Safari settings, then tap the motion button again.";
    }

    return "Phone motion permission was denied. Allow sensor access in your browser settings, then tap again.";
  };

  const createHotspotElement = (hotspot) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "vrx-hotspot";
    button.textContent = hotspot.label;
    button.dataset.yaw = String(hotspot.yaw);
    button.dataset.pitch = String(hotspot.pitch);
    button.dataset.detail = hotspot.detail;
    button.setAttribute("aria-label", hotspot.detail);

    button.addEventListener("click", () => {
      activeHotspotElements.forEach((item) => item.button.classList.remove("is-active"));
      button.classList.add("is-active");
      setCaption(hotspot.detail);
    });

    hotspotLayer.appendChild(button);
    return { button, yaw: hotspot.yaw, pitch: hotspot.pitch };
  };

  const buildHotspots = (sceneData) => {
    hotspotLayer.innerHTML = "";
    activeHotspotElements = sceneData.hotspots.map((hotspot) => createHotspotElement(hotspot));
  };

  const sphericalToVector3 = (yawDeg, pitchDeg, radius) => {
    const yaw = THREE.MathUtils.degToRad(yawDeg);
    const pitch = THREE.MathUtils.degToRad(pitchDeg);
    const cosPitch = Math.cos(pitch);

    return new THREE.Vector3(
      radius * cosPitch * Math.sin(yaw),
      radius * Math.sin(pitch),
      radius * cosPitch * Math.cos(yaw)
    );
  };

  const positionHotspots = () => {
    if (!camera || activeHotspotElements.length === 0) return;

    const width = viewerTarget.clientWidth;
    const height = viewerTarget.clientHeight;
    camera.getWorldDirection(cameraDirection);

    activeHotspotElements.forEach((item) => {
      const worldPosition = sphericalToVector3(item.yaw, item.pitch, SPHERE_RADIUS);
      const facing = cameraDirection.dot(worldPosition.clone().normalize());

      if (facing <= 0.12) {
        item.button.style.display = "none";
        return;
      }

      const projected = worldPosition.clone().project(camera);
      if (projected.z < -1 || projected.z > 1) {
        item.button.style.display = "none";
        return;
      }

      item.button.style.display = "inline-flex";
      item.button.style.left = `${(projected.x * 0.5 + 0.5) * width}px`;
      item.button.style.top = `${(-projected.y * 0.5 + 0.5) * height}px`;
    });
  };

  const applyPointerView = () => {
    lat = Math.max(-85, Math.min(85, lat));

    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon);

    const target = new THREE.Vector3(
      SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta),
      SPHERE_RADIUS * Math.cos(phi),
      SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta)
    );

    camera.lookAt(target);
  };

  const setObjectQuaternion = (quaternion, alpha, beta, gamma, orient) => {
    // Reconstruct camera quaternion from sensor axes for in-view motion tracking.
    euler.set(beta, alpha, -gamma, "YXZ");
    quaternion.setFromEuler(euler);
    quaternion.multiply(q1);
    quaternion.multiply(q0.setFromAxisAngle(zee, -orient));
  };

  const applyDeviceOrientation = () => {
    if (
      deviceOrientation.alpha === null ||
      deviceOrientation.beta === null ||
      deviceOrientation.gamma === null
    ) {
      return false;
    }

    const alpha = THREE.MathUtils.degToRad(deviceOrientation.alpha) + alphaOffsetAngle;
    const beta = THREE.MathUtils.degToRad(deviceOrientation.beta);
    const gamma = THREE.MathUtils.degToRad(deviceOrientation.gamma);
    const orient = THREE.MathUtils.degToRad(
      window.screen?.orientation?.angle || (typeof window.orientation === "number" ? window.orientation : 0)
    );

    setObjectQuaternion(camera.quaternion, alpha, beta, gamma, orient);
    return true;
  };

  const renderLoop = () => {
    if (!renderer || !panoramaScene || !camera) return;

    if (motionEnabled) {
      const applied = applyDeviceOrientation();
      if (!applied) {
        applyPointerView();
      }
    } else {
      applyPointerView();
    }

    renderer.render(panoramaScene, camera);
    positionHotspots();
    animationFrameId = window.requestAnimationFrame(renderLoop);
  };

  const hideLoader = () => {
    if (loaderEl) loaderEl.classList.add("vrx-loader--hidden");
  };

  const showLoader = () => {
    if (loaderEl) loaderEl.classList.remove("vrx-loader--hidden");
  };

  const applySceneTexture = (sceneData) => {
    const requestId = ++textureRequestId;
    const isRemoteUrl = /^https?:\/\//i.test(sceneData.imageUrl || "");
    const looksLikeDirectImage = /\.(jpg|jpeg|png|webp|avif)(\?|#|$)/i.test(sceneData.imageUrl || "");

    showLoader();

    if (isRemoteUrl && !looksLikeDirectImage) {
      console.warn("Panorama URL may be an embed page, not a direct image:", sceneData.imageUrl);
    }

    textureLoader.load(
      sceneData.imageUrl,
      (texture) => {
        if (requestId !== textureRequestId) {
          texture.dispose();
          return;
        }

        if ("colorSpace" in texture && THREE.SRGBColorSpace) {
          texture.colorSpace = THREE.SRGBColorSpace;
        } else if ("encoding" in texture) {
          // THREE r152 and below use .encoding
          texture.encoding = 3001; // THREE.sRGBEncoding
        }

        texture.minFilter = THREE.LinearFilter;
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.x = 1;
        const { width, height, ratio } = getTextureImageMetadata(texture);

        sphereMesh.material.map = texture;
        sphereMesh.material.needsUpdate = true;
        hideLoader();

        if (!isLikelyEquirectangular(ratio)) {
          const ratioLabel = ratio > 0 ? ratio.toFixed(2) : "unknown";
          texture.offset.x = INVALID_PANORAMA_HORIZONTAL_OFFSET;
          setCanvasFilter(LOW_LIGHT_CANVAS_FILTER);
          setCaption(
            `${sceneData.caption} Warning: source image is ${width}x${height} (${ratioLabel}:1). Use a 2:1 equirectangular panorama for proper 360 rendering.`
          );
          console.warn("Panorama is not equirectangular (expected ~2:1).", {
            url: sceneData.imageUrl,
            width,
            height,
            ratio,
          });
          return;
        }

        texture.offset.x = 0;
        setCanvasFilter(DEFAULT_CANVAS_FILTER);
        setCaption(sceneData.caption);
      },
      undefined,
      (error) => {
        hideLoader();
        setCanvasFilter(LOW_LIGHT_CANVAS_FILTER);
        const failureHint = isRemoteUrl
          ? " The host may block cross-origin image requests (CORS), or the URL is not a direct image file."
          : " Check the image path under /public and make sure the file exists.";
        setCaption(`Unable to load this panorama image.${failureHint}`);
        console.error("Panorama texture load failed.", {
          url: sceneData.imageUrl,
          error,
        });
      }
    );
  };

  const switchScene = (sceneKey) => {
    const sceneData = SCENES[sceneKey];
    if (!sceneData) return;

    activeSceneKey = sceneKey;
    lon = sceneData.startLon;
    lat = sceneData.startLat;
    setActiveSceneButton(sceneKey);
    setCaption(sceneData.caption);
    buildHotspots(sceneData);
    applySceneTexture(sceneData);
  };

  const requestMotionPermissionIfNeeded = () => {
    if (motionPermissionGranted) {
      return Promise.resolve(motionPermissionGranted);
    }

    if (motionPermissionInFlight) {
      return Promise.resolve(false);
    }

    motionPermissionInFlight = true;

    if (typeof window.DeviceOrientationEvent === "undefined") {
      motionPermissionGranted = false;
      motionPermissionInFlight = false;
      return Promise.resolve(false);
    }

    if (typeof window.DeviceOrientationEvent.requestPermission !== "function") {
      // On non-iOS browsers, permission prompts are not required. Secure context is still required.
      motionPermissionGranted = Boolean(window.isSecureContext);
      motionPermissionInFlight = false;
      return Promise.resolve(motionPermissionGranted);
    }

    return window.DeviceOrientationEvent.requestPermission()
      .then((state) => {
        motionPermissionGranted = state === "granted";
        motionPermissionInFlight = false;
        return motionPermissionGranted;
      })
      .catch(() => {
        motionPermissionGranted = false;
        motionPermissionInFlight = false;
        return false;
      });
  };

  const onPointerDown = (event) => {
    if (motionEnabled) return;

    isPointerDown = true;
    pointerDownX = event.clientX;
    pointerDownY = event.clientY;
    pointerDownLon = lon;
    pointerDownLat = lat;
  };

  const onPointerMove = (event) => {
    if (!isPointerDown || motionEnabled) return;

    lon = (pointerDownX - event.clientX) * 0.12 + pointerDownLon;
    lat = (event.clientY - pointerDownY) * 0.12 + pointerDownLat;
  };

  const onPointerUp = () => {
    isPointerDown = false;
  };

  const onMouseWheel = (event) => {
    if (!camera) return;

    event.preventDefault();
    camera.fov = THREE.MathUtils.clamp(camera.fov + event.deltaY * 0.04, 40, 100);
    camera.updateProjectionMatrix();
  };

  const handleResize = () => {
    if (!renderer || !camera) return;

    const width = viewerTarget.clientWidth;
    const height = viewerTarget.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const isPortraitViewport = () => {
    return Boolean(window.matchMedia && window.matchMedia("(orientation: portrait)").matches);
  };

  const hideMobileBrowserChrome = () => {
    // Best-effort URL bar collapse on browsers that still show chrome in fallback mode.
    window.scrollTo(0, 1);
    window.setTimeout(() => window.scrollTo(0, 1), 120);
    window.setTimeout(() => window.scrollTo(0, 1), 320);
  };

  const isNativeFullscreenActive = () => {
    return Boolean(document.fullscreenElement || document.webkitFullscreenElement);
  };

  const syncForceLandscapeFallback = () => {
    const shouldForceLandscape = fallbackFullscreenActive && isPortraitViewport();
    viewerShell.classList.toggle(FORCE_LANDSCAPE_SHELL_CLASS, shouldForceLandscape);
  };

  const lockLandscape = () => {
    if (!window.screen?.orientation || typeof window.screen.orientation.lock !== "function") {
      syncForceLandscapeFallback();
      return Promise.resolve(false);
    }

    return window.screen.orientation
      .lock("landscape")
      .then(() => {
        viewerShell.classList.remove(FORCE_LANDSCAPE_SHELL_CLASS);
        return true;
      })
      .catch(() => {
        syncForceLandscapeFallback();
        return false;
      });
  };

  const unlockLandscape = () => {
    if (window.screen?.orientation && typeof window.screen.orientation.unlock === "function") {
      window.screen.orientation.unlock();
    }
    viewerShell.classList.remove(FORCE_LANDSCAPE_SHELL_CLASS);
  };

  const setFallbackFullscreen = (isActive) => {
    fallbackFullscreenActive = isActive;
    viewerShell.classList.toggle(FALLBACK_FULLSCREEN_SHELL_CLASS, isActive);
    document.body.classList.toggle(FALLBACK_FULLSCREEN_BODY_CLASS, isActive);
    document.documentElement.classList.toggle(FALLBACK_FULLSCREEN_HTML_CLASS, isActive);

    if (isActive) {
      hideMobileBrowserChrome();
    }

    syncForceLandscapeFallback();
    handleResize();
  };

  const exitNativeFullscreen = () => {
    if (!isNativeFullscreenActive()) return;

    const exitFn = document.exitFullscreen || document.webkitExitFullscreen;
    if (typeof exitFn !== "function") return;

    const exitResult = exitFn.call(document);
    if (exitResult && typeof exitResult.catch === "function") {
      exitResult.catch(() => {});
    }
  };

  const enterImmersivePresentation = () => {
    hideMobileBrowserChrome();
    lockLandscape();
    syncForceLandscapeFallback();
  };

  const enterViewerFullscreen = (targetElement = viewerShell) => {
    if (isNativeFullscreenActive() || fallbackFullscreenActive) return;

    const requestTarget = targetElement || viewerShell;
    const requestFn = requestTarget.requestFullscreen || requestTarget.webkitRequestFullscreen;
    if (typeof requestFn !== "function") {
      setFallbackFullscreen(true);
      enterImmersivePresentation();
      return;
    }

    try {
      const requestResult = requestFn.call(requestTarget);

      if (requestResult && typeof requestResult.catch === "function") {
        requestResult.then(() => {
          enterImmersivePresentation();
        });
        requestResult.catch(() => {
          setFallbackFullscreen(true);
          enterImmersivePresentation();
        });
      } else {
        window.setTimeout(() => {
          if (!isNativeFullscreenActive()) {
            setFallbackFullscreen(true);
          }
          enterImmersivePresentation();
        }, 220);
      }
    } catch {
      setFallbackFullscreen(true);
      enterImmersivePresentation();
    }
  };

  const exitViewerFullscreen = () => {
    if (fallbackFullscreenActive) {
      setFallbackFullscreen(false);
    }

    exitNativeFullscreen();
    unlockLandscape();
  };

  const requestViewerFullscreen = () => {
    if (isNativeFullscreenActive() || fallbackFullscreenActive) {
      exitViewerFullscreen();
      return;
    }

    enterViewerFullscreen();
  };

  viewerTarget.innerHTML = "";
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  } else if ("outputEncoding" in renderer) {
    renderer.outputEncoding = 3001; // THREE.sRGBEncoding
  }
  // MeshBasicMaterial bypasses scene lighting, so visibility is managed via CSS canvas filters.
  setCanvasFilter(DEFAULT_CANVAS_FILTER);
  viewerTarget.appendChild(renderer.domElement);

  panoramaScene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, 1, 1, 1100);
  textureLoader = new THREE.TextureLoader();
  textureLoader.setCrossOrigin("anonymous");

  const sphereGeometry = new THREE.SphereGeometry(SPHERE_RADIUS, 60, 40);
  sphereGeometry.scale(-1, 1, 1);
  // Keep material color white so panorama texture is not unintentionally darkened.
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  panoramaScene.add(sphereMesh);

  handleResize();
  switchScene(activeSceneKey);
  renderLoop();

  viewerTarget.addEventListener("pointerdown", onPointerDown);
  viewerTarget.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  viewerTarget.addEventListener("wheel", onMouseWheel, { passive: false });
  const onViewportMetricsChange = () => {
    if (fallbackFullscreenActive || isNativeFullscreenActive()) {
      hideMobileBrowserChrome();
      syncForceLandscapeFallback();
    }
    handleResize();
  };
  window.addEventListener("resize", onViewportMetricsChange);
  window.addEventListener("orientationchange", onViewportMetricsChange);
  window.addEventListener(
    "deviceorientation",
    (event) => {
      deviceOrientation.alpha = event.alpha;
      deviceOrientation.beta = event.beta;
      deviceOrientation.gamma = event.gamma;
    },
    true
  );

  sceneButtons.forEach((button) => {
    button.addEventListener("click", () => {
      switchScene(button.dataset.scene);
    });
  });

  if (motionBtn) {
    motionBtn.addEventListener("click", () => {
      if (motionEnabled) {
        motionEnabled = false;
        setMotionLabel("default");
        return;
      }

      requestMotionPermissionIfNeeded().then((granted) => {
        if (!granted) {
          setMotionLabel("blocked");
          setCaption(getMotionBlockedMessage());
          return;
        }

        motionEnabled = true;
        setMotionLabel("enabled");

        if (typeof deviceOrientation.alpha === "number") {
          alphaOffsetAngle = THREE.MathUtils.degToRad(lon) - THREE.MathUtils.degToRad(deviceOrientation.alpha);
        }

        // If no sensor event arrives shortly after enabling, provide actionable feedback.
        window.setTimeout(() => {
          if (motionEnabled && typeof deviceOrientation.alpha !== "number") {
            motionEnabled = false;
            motionPermissionGranted = false;
            setMotionLabel("blocked");
            setCaption(getMotionBlockedMessage());
          }
        }, 1200);
      });
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", () => {
      requestViewerFullscreen();
    });
  }

  /* ── Google Cardboard stereoscopic VR mode ───────────────────────
   * Strategy: when activated we enter fullscreen + landscape, show
   * the centre black divider bar, and render the Three.js scene twice
   * per frame — once for each eye — using scissor/viewport splitting.
   * The camera is nudged left/right by half the IPD between eyes.
   * ────────────────────────────────────────────────────────────────*/

  let cardboardActive = false;

  const enterCardboard = () => {
    if (cardboardActive) return;
    cardboardActive = true;

    // Auto-enable gyroscope when entering Cardboard
    if (!motionEnabled) {
      requestMotionPermissionIfNeeded().then((granted) => {
        if (granted) {
          motionEnabled = true;
          setMotionLabel("enabled");
          if (typeof deviceOrientation.alpha === "number") {
            alphaOffsetAngle =
              THREE.MathUtils.degToRad(lon) -
              THREE.MathUtils.degToRad(deviceOrientation.alpha);
          }
        }
      });
    }

    // Show divider + exit overlay
    if (cardboardBar) cardboardBar.hidden = false;
    if (viewerShell) viewerShell.classList.add("vrx-cardboard-active");
    if (cardboardBtn) cardboardBtn.classList.add("is-active");

    // Enter fullscreen on the document root for maximum browser UI suppression.
    enterViewerFullscreen(document.documentElement);

    lockLandscape();
  };

  const exitCardboard = () => {
    if (!cardboardActive) return;
    cardboardActive = false;

    if (cardboardBar) cardboardBar.hidden = true;
    if (viewerShell) viewerShell.classList.remove("vrx-cardboard-active");
    if (cardboardBtn) cardboardBtn.classList.remove("is-active");

    // Restore normal single-viewport rendering
    if (renderer) {
      renderer.setScissorTest(false);
    }

    exitViewerFullscreen();

    handleResize();
  };

  // Stereo render loop for Cardboard mode — draws left-eye + right-eye viewports
  const cardboardRenderLoop = () => {
    if (!renderer || !panoramaScene || !camera) return;

    // Apply motion or pointer view the same way
    if (motionEnabled) {
      const applied = applyDeviceOrientation();
      if (!applied) applyPointerView();
    } else {
      applyPointerView();
    }

    const w = viewerTarget.clientWidth;
    const h = viewerTarget.clientHeight;
    const halfW = Math.floor(w / 2);

    renderer.setScissorTest(true);

    // --- Left eye ---
    renderer.setViewport(0, 0, halfW, h);
    renderer.setScissor(0, 0, halfW, h);
    camera.setViewOffset(w, h, 0, 0, halfW, h);
    renderer.render(panoramaScene, camera);

    // --- Right eye ---
    renderer.setViewport(halfW, 0, halfW, h);
    renderer.setScissor(halfW, 0, halfW, h);
    camera.setViewOffset(w, h, halfW, 0, halfW, h);
    renderer.render(panoramaScene, camera);

    // Reset view offset so non-cardboard renders stay correct
    camera.clearViewOffset();

    positionHotspots();
    animationFrameId = window.requestAnimationFrame(cardboardActive ? cardboardRenderLoop : renderLoop);
  };

  if (cardboardBtn) {
    cardboardBtn.addEventListener("click", () => {
      if (cardboardActive) {
        exitCardboard();
        // Resume normal render
        if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
        renderLoop();
      } else {
        enterCardboard();
        // Switch to stereo render
        if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
        cardboardRenderLoop();
      }
    });
  }

  if (cardboardExit) {
    cardboardExit.addEventListener("click", () => {
      exitCardboard();
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
      renderLoop();
    });
  }

  // Exit cardboard on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") {
      return;
    }

    if (cardboardActive) {
      exitCardboard();
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
      renderLoop();
      return;
    }

    if (fallbackFullscreenActive) {
      setFallbackFullscreen(false);
    }
  });

  // Exit cardboard when leaving fullscreen via browser UI
  const onFullscreenChange = () => {
    const nativeFullscreen = isNativeFullscreenActive();

    if (nativeFullscreen && fallbackFullscreenActive) {
      setFallbackFullscreen(false);
    }

    if (nativeFullscreen) {
      enterImmersivePresentation();
      return;
    }

    if (!nativeFullscreen && cardboardActive) {
      exitCardboard();
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
      renderLoop();
    }

    if (!nativeFullscreen && !fallbackFullscreenActive) {
      unlockLandscape();
    }
  };

  document.addEventListener("fullscreenchange", onFullscreenChange);
  document.addEventListener("webkitfullscreenchange", onFullscreenChange);

  window.addEventListener("beforeunload", () => {
    if (fallbackFullscreenActive) {
      setFallbackFullscreen(false);
    }

    unlockLandscape();

    if (animationFrameId) {
      window.cancelAnimationFrame(animationFrameId);
    }
  });
});

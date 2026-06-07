import * as THREE from "/javascript/vendor/three.module.min.js";

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
  const threeStage = document.getElementById("about-three-stage");

  pageBody.classList.add("about-motion-ready");

  const locale = document.documentElement.lang === "ar" ? "ar-EG" : "en-US";
  const numberFormatter = new Intl.NumberFormat(locale);

  const setCounterValue = (node, value) => {
    const suffix = node.dataset.suffix || "";
    node.textContent = `${numberFormatter.format(value)}${suffix}`;
  };

  const throttlePointerMove = (update) => {
    let frameId = 0;
    let lastEvent = null;

    return (event) => {
      if (event.pointerType === "touch") {
        return;
      }

      lastEvent = event;

      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;

        if (lastEvent) {
          update(lastEvent);
        }
      });
    };
  };

  const initThreeScene = () => {
    if (!threeStage) {
      return;
    }

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
      camera.position.set(0, 1.25, 7.35);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.className = "about-three-canvas";

      const hintNode = threeStage.querySelector(".about-three-hint");
      if (hintNode) {
        threeStage.insertBefore(renderer.domElement, hintNode);
      } else {
        threeStage.appendChild(renderer.domElement);
      }

      const setSize = () => {
        const width = Math.max(threeStage.clientWidth, 1);
        const height = Math.max(threeStage.clientHeight, 1);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      setSize();

      const rootGroup = new THREE.Group();
      rootGroup.position.y = -0.08;
      scene.add(rootGroup);

      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(1.55, 1.72, 0.44, 48),
        new THREE.MeshStandardMaterial({
          color: 0x5b4427,
          roughness: 0.9,
          metalness: 0.05
        })
      );
      pedestal.position.y = -1.18;
      rootGroup.add(pedestal);

      const pedestalTop = new THREE.Mesh(
        new THREE.CylinderGeometry(1.28, 1.45, 0.12, 48),
        new THREE.MeshStandardMaterial({
          color: 0x8d6a3e,
          roughness: 0.84,
          metalness: 0.06
        })
      );
      pedestalTop.position.y = -0.9;
      rootGroup.add(pedestalTop);

      const pyramid = new THREE.Mesh(
        new THREE.ConeGeometry(1.03, 1.38, 4),
        new THREE.MeshStandardMaterial({
          color: 0xc8a369,
          roughness: 0.62,
          metalness: 0.08,
          emissive: 0x3d2c14,
          emissiveIntensity: 0.1,
          flatShading: true
        })
      );
      pyramid.rotation.y = Math.PI / 4;
      pyramid.position.y = -0.1;
      rootGroup.add(pyramid);

      const obeliskGroup = new THREE.Group();
      obeliskGroup.position.set(0.04, -0.05, 0.04);
      rootGroup.add(obeliskGroup);

      const obelisk = new THREE.Mesh(
        new THREE.BoxGeometry(0.33, 1.28, 0.33),
        new THREE.MeshStandardMaterial({
          color: 0xd5b67e,
          roughness: 0.54,
          metalness: 0.12
        })
      );
      obelisk.position.y = 0.55;
      obeliskGroup.add(obelisk);

      const obeliskTip = new THREE.Mesh(
        new THREE.ConeGeometry(0.19, 0.28, 4),
        new THREE.MeshStandardMaterial({
          color: 0xe0c386,
          roughness: 0.46,
          metalness: 0.2,
          emissive: 0x5d3e1d,
          emissiveIntensity: 0.15
        })
      );
      obeliskTip.position.y = 1.33;
      obeliskTip.rotation.y = Math.PI / 4;
      obeliskGroup.add(obeliskTip);

      const sunRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.75, 0.055, 24, 144),
        new THREE.MeshStandardMaterial({
          color: 0xb78331,
          roughness: 0.32,
          metalness: 0.82,
          emissive: 0x5d390f,
          emissiveIntensity: 0.2
        })
      );
      sunRing.position.y = 0.45;
      sunRing.rotation.x = Math.PI / 2.8;
      rootGroup.add(sunRing);

      const outerHalo = new THREE.Mesh(
        new THREE.TorusGeometry(1.7, 0.032, 14, 128),
        new THREE.MeshBasicMaterial({
          color: 0xe0be82,
          transparent: true,
          opacity: 0.38
        })
      );
      outerHalo.position.y = 0.45;
      outerHalo.rotation.x = Math.PI / 2.85;
      rootGroup.add(outerHalo);

      const columnGeometry = new THREE.CylinderGeometry(0.11, 0.13, 1.05, 22);
      const columnMaterial = new THREE.MeshStandardMaterial({
        color: 0x7f5e37,
        roughness: 0.86,
        metalness: 0.05
      });

      [
        [-1.1, -0.42, -1.1],
        [1.1, -0.42, -1.1],
        [-1.1, -0.42, 1.1],
        [1.1, -0.42, 1.1]
      ].forEach((position) => {
        const column = new THREE.Mesh(columnGeometry, columnMaterial);
        column.position.set(position[0], position[1], position[2]);
        rootGroup.add(column);
      });

      const glyphGroup = new THREE.Group();
      rootGroup.add(glyphGroup);

      for (let i = 0; i < 14; i += 1) {
        const glyph = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.2, 0.03),
          new THREE.MeshStandardMaterial({
            color: 0xd7b173,
            roughness: 0.4,
            metalness: 0.75,
            emissive: 0x5f4015,
            emissiveIntensity: 0.18
          })
        );

        const angle = (i / 14) * Math.PI * 2;
        const radius = 2.05 + Math.sin(i * 0.7) * 0.08;
        glyph.position.set(Math.cos(angle) * radius, 0.32 + Math.sin(i * 0.5) * 0.25, Math.sin(angle) * radius);
        glyph.rotation.y = angle + Math.PI / 2;
        glyph.userData.baseY = glyph.position.y;
        glyphGroup.add(glyph);
      }

      const pointCount = 170;
      const pointsData = new Float32Array(pointCount * 3);
      for (let i = 0; i < pointCount; i += 1) {
        const radius = 2.35 + Math.random() * 1.25;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pointsData[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        pointsData[i * 3 + 1] = radius * Math.cos(phi);
        pointsData[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      }

      const pointsGeometry = new THREE.BufferGeometry();
      pointsGeometry.setAttribute("position", new THREE.BufferAttribute(pointsData, 3));
      const starField = new THREE.Points(
        pointsGeometry,
        new THREE.PointsMaterial({
          color: 0x8ab4ff,
          size: 0.03,
          transparent: true,
          opacity: 0.56
        })
      );
      rootGroup.add(starField);

      scene.add(new THREE.AmbientLight(0xffffff, 0.43));

      const keyLight = new THREE.DirectionalLight(0xffe4ba, 1.25);
      keyLight.position.set(3, 3.2, 3.8);
      scene.add(keyLight);

      const coolRim = new THREE.PointLight(0x7faeff, 0.95, 20);
      coolRim.position.set(-2.8, 1.2, -2.2);
      scene.add(coolRim);

      const warmFill = new THREE.PointLight(0xd59649, 0.72, 18);
      warmFill.position.set(1.4, -1.2, 2.4);
      scene.add(warmFill);

      let targetRotX = 0;
      let targetRotY = 0;

      threeStage.addEventListener(
        "pointermove",
        throttlePointerMove((event) => {
          const rect = threeStage.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
          targetRotY = x * 0.48;
          targetRotX = -y * 0.28;
        })
      );

      threeStage.addEventListener("pointerleave", () => {
        targetRotX = 0;
        targetRotY = 0;
      });

      const resizeObserver = new ResizeObserver(setSize);
      resizeObserver.observe(threeStage);

      const startTime = performance.now();
      const autoMotion = reduceMotion ? 0 : 1;

      const animate = () => {
        const elapsed = (performance.now() - startTime) / 1000;

        rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.06;
        rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.06;

        pyramid.position.y = -0.1 + Math.sin(elapsed * 0.9) * 0.05 * autoMotion;
        pyramid.rotation.y = Math.PI / 4 + elapsed * 0.18 * autoMotion;

        obeliskGroup.rotation.y = elapsed * 0.22 * autoMotion;

        sunRing.rotation.z = elapsed * 0.3 * autoMotion;
        sunRing.rotation.y = Math.sin(elapsed * 0.55) * 0.36 * autoMotion;
        outerHalo.rotation.z = -elapsed * 0.24 * autoMotion;

        glyphGroup.rotation.y = -elapsed * 0.14 * autoMotion;
        glyphGroup.children.forEach((glyph, index) => {
          glyph.position.y = glyph.userData.baseY + Math.sin(elapsed * 1.2 + index * 0.35) * 0.035 * autoMotion;
          glyph.rotation.y += 0.005 * autoMotion;
        });

        starField.rotation.y = -elapsed * 0.05 * autoMotion;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };

      animate();
    } catch (error) {
      if (threeStage) {
        threeStage.setAttribute("data-three-failed", "true");
      }
      console.error("Three.js scene failed to initialize", error);
    }
  };

  initThreeScene();

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
    card.addEventListener(
      "pointermove",
      throttlePointerMove((event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        const tiltY = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
        const tiltX = -((event.clientY - rect.top) / rect.height - 0.5) * 8;

        card.style.setProperty("--pointer-x", `${x}%`);
        card.style.setProperty("--pointer-y", `${y}%`);
        card.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
      })
    );

    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--pointer-x");
      card.style.removeProperty("--pointer-y");
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });

  if (hero) {
    hero.addEventListener(
      "pointermove",
      throttlePointerMove((event) => {
        if (window.innerWidth < 900) {
          return;
        }

        const xShift = (event.clientX / window.innerWidth - 0.5) * 16;
        const yShift = (event.clientY / window.innerHeight - 0.5) * 12;

        hero.style.setProperty("--hero-parallax-x", `${xShift.toFixed(2)}px`);
        hero.style.setProperty("--hero-parallax-y", `${yShift.toFixed(2)}px`);
      })
    );
  }
})();

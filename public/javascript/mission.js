document.addEventListener("DOMContentLoaded", () => {
	const counters = Array.from(
		document.querySelectorAll(".mission-stat-number[data-target], .stat-value[data-target]")
	);

	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	const formatValue = (value, { format, suffix }) => {
		if (format === "short") {
			const displayValue = Math.floor(value / 1000000);
			return `${displayValue}M${suffix}`;
		}

		return `${value.toLocaleString()}${suffix}`;
	};

	const animateCounter = (counter) => {
		const target = Number(counter.dataset.target || 0);
		const suffix = counter.dataset.suffix || "";
		const format = counter.dataset.format || "";

		if (!Number.isFinite(target) || target <= 0) {
			counter.textContent = formatValue(0, { format, suffix });
			return;
		}

		if (prefersReducedMotion) {
			counter.textContent = formatValue(target, { format, suffix });
			return;
		}

		const duration = 1600;
		const startTime = performance.now();

		const step = (now) => {
			const progress = Math.min((now - startTime) / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			const currentValue = Math.round(target * eased);
			counter.textContent = formatValue(currentValue, { format, suffix });

			if (progress < 1) {
				requestAnimationFrame(step);
			} else {
				counter.textContent = formatValue(target, { format, suffix });
			}
		};

		requestAnimationFrame(step);
	};

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				const counter = entry.target;
				if (counter.dataset.animated === "true") return;
				counter.dataset.animated = "true";
				animateCounter(counter);
			});
		},
		{ threshold: 0.35 }
	);

	if (counters.length > 0) {
		counters.forEach((counter) => observer.observe(counter));
	}

	const animatedElements = document.querySelectorAll(".animate-fade-up, .animate-scale-in");
	const animationObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				entry.target.style.animationPlayState = "running";
				animationObserver.unobserve(entry.target);
			});
		},
		{ threshold: 0.1 }
	);

	animatedElements.forEach((element) => {
		element.style.animationPlayState = "paused";
		animationObserver.observe(element);
	});

	const pillarCards = document.querySelectorAll(".pillars-grid .pillar-card");
	pillarCards.forEach((card) => {
		card.addEventListener("click", () => {
			const isActive = card.classList.contains("active");
			pillarCards.forEach((item) => item.classList.remove("active"));
			if (!isActive) {
				card.classList.add("active");
			}
		});
	});
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const REGISTER_PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
const LOGIN_PASSWORD_MIN_LENGTH = 6;
const FULL_NAME_HAS_DIGIT_REGEX = /\d/;
const FIELD_ERROR_CLASS = "field-error-message";
const isArabicLang = document.documentElement.lang === "ar";
const VALIDATION_TEXT = isArabicLang
	? {
		thisField: "هذا الحقل",
		requiredSuffix: "مطلوب.",
		validEmailSuffix: "يجب أن يكون بريدا إلكترونيا صحيحا.",
		fullNameMin: "الاسم الكامل يجب أن يكون حرفين على الأقل.",
		fullNameNoNumbers: "الاسم الكامل لا يمكن أن يحتوي على أرقام.",
		registerPasswordRule: "كلمة المرور يجب أن تكون 6 أحرف على الأقل وتحتوي على حرف كبير ورقم.",
		loginPasswordRule: "كلمة المرور يجب أن تكون 6 أحرف على الأقل.",
		visitDatePast: "تاريخ الزيارة لا يمكن أن يكون في الماضي.",
		selectValidTicket: "يرجى اختيار نوع تذكرة صحيح.",
		submitFailed: "تعذر إرسال طلب الرحلة حاليا.",
		submitSuccess: "تم إرسال التذكرة! تابعها الآن من لوحة التحكم الخاصة بك.",
		networkIssue: "مشكلة في الشبكة. حاول مرة أخرى.",
		clientOnlySuccess: "ممتاز. تفاصيل رحلتك جاهزة."
	}
	: {
		thisField: "This field",
		requiredSuffix: "is required.",
		validEmailSuffix: "must be a valid email address.",
		fullNameMin: "Full Name must be at least 2 characters.",
		fullNameNoNumbers: "Full Name cannot contain numbers.",
		registerPasswordRule: "Password must be at least 6 characters and include 1 uppercase letter and 1 number.",
		loginPasswordRule: "Password must be at least 6 characters.",
		visitDatePast: "Visit Date cannot be in the past.",
		selectValidTicket: "Please select a valid ticket type.",
		submitFailed: "Unable to submit your trip request right now.",
		submitSuccess: "Ticket submitted! Track it now in your dashboard.",
		networkIssue: "Network issue. Please try again.",
		clientOnlySuccess: "Looks good. Your trip details are ready."
	};

const setFormMessage = (form, message, isError = true) => {
	const messageEl = form.querySelector(".form-message");
	if (!messageEl) return;

	messageEl.textContent = message || "";
	messageEl.classList.toggle("is-error", Boolean(message) && isError);
	messageEl.classList.toggle("is-success", Boolean(message) && !isError);
	messageEl.style.color = message ? (isError ? "#b23b3b" : "#2f7f4f") : "";
};

const getFieldLabel = (form, field) => {
	if (!field) return VALIDATION_TEXT.thisField;

	if (field.id) {
		const label = form.querySelector(`label[for="${field.id}"]`) || document.querySelector(`label[for="${field.id}"]`);
		const labelText = label?.textContent?.trim();
		if (labelText) return labelText;
	}

	if (field.name) {
		const name = field.name.replace(/[-_]/g, " ").trim();
		if (name) return name.charAt(0).toUpperCase() + name.slice(1);
	}

	return VALIDATION_TEXT.thisField;
};

const getFieldErrorNode = (field) => {
	const container =
		field.closest(".trip-field-group") ||
		field.closest(".input-group") ||
		field.closest(".form-group") ||
		field.closest(".field-group") ||
		field.parentElement;

	if (!container) return null;

	let errorEl = container.querySelector(`.${FIELD_ERROR_CLASS}`);
	if (!errorEl) {
		errorEl = document.createElement("p");
		errorEl.className = FIELD_ERROR_CLASS;
		errorEl.setAttribute("role", "alert");
		errorEl.style.margin = "6px 0 0";
		errorEl.style.fontSize = "0.82rem";
		errorEl.style.lineHeight = "1.35";
		errorEl.style.color = "#d13f3f";
		container.appendChild(errorEl);
	}

	return errorEl;
};

const setFieldError = (field, message) => {
	const errorEl = getFieldErrorNode(field);
	if (errorEl) {
		errorEl.textContent = message;
	}

	field.setAttribute("aria-invalid", "true");
	field.style.borderColor = "#d13f3f";
	field.style.borderBottomColor = "#d13f3f";
	field.style.boxShadow = "0 0 0 2px rgba(209, 63, 63, 0.16)";
	field.style.backgroundColor = "rgba(209, 63, 63, 0.06)";
};

const clearFieldError = (field) => {
	if (!field) return;

	const container =
		field.closest(".trip-field-group") ||
		field.closest(".input-group") ||
		field.closest(".form-group") ||
		field.closest(".field-group") ||
		field.parentElement;

	if (container) {
		const errorEl = container.querySelector(`.${FIELD_ERROR_CLASS}`);
		if (errorEl) errorEl.remove();
	}

	field.removeAttribute("aria-invalid");
	field.style.borderColor = "";
	field.style.borderBottomColor = "";
	field.style.boxShadow = "";
	field.style.backgroundColor = "";
};

const clearAllFieldErrors = (form) => {
	form.querySelectorAll(`.${FIELD_ERROR_CLASS}`).forEach((node) => node.remove());
	form.querySelectorAll("input, select, textarea").forEach((field) => clearFieldError(field));
};

const addError = (errors, field, message) => {
	if (!field || errors.some((entry) => entry.field === field)) return;
	errors.push({ field, message });
};

const validateForm = (form) => {
	if (!form) return false;

	clearAllFieldErrors(form);
	setFormMessage(form, "", false);

	const errors = [];
	const requiredFields = Array.from(form.querySelectorAll("[required]")).filter((field) => !field.disabled);
	const processedRadioNames = new Set();

	for (const field of requiredFields) {
		const type = String(field.type || "").toLowerCase();

		if (type === "radio") {
			if (processedRadioNames.has(field.name)) continue;
			processedRadioNames.add(field.name);

			const hasChecked = requiredFields.some(
				(candidate) => candidate.type === "radio" && candidate.name === field.name && candidate.checked
			);
			if (!hasChecked) {
				addError(errors, field, `${getFieldLabel(form, field)} ${VALIDATION_TEXT.requiredSuffix}`);
			}
			continue;
		}

		if (type === "checkbox") {
			if (!field.checked) {
				addError(errors, field, `${getFieldLabel(form, field)} ${VALIDATION_TEXT.requiredSuffix}`);
			}
			continue;
		}

		if (!String(field.value || "").trim()) {
			addError(errors, field, `${getFieldLabel(form, field)} ${VALIDATION_TEXT.requiredSuffix}`);
		}
	}

	form.querySelectorAll("input[type='email']").forEach((emailInput) => {
		const emailValue = emailInput.value.trim();
		if (emailValue && !EMAIL_REGEX.test(emailValue)) {
			addError(errors, emailInput, `${getFieldLabel(form, emailInput)} ${VALIDATION_TEXT.validEmailSuffix}`);
		}
	});

	const nameInput = form.querySelector("input[name='name']");
	const passwordInput = form.querySelector("input[type='password']");

	if (form.id === "register-form") {
		const nameValue = nameInput?.value.trim() || "";
		if (nameValue && nameValue.length < 2) {
			addError(errors, nameInput, VALIDATION_TEXT.fullNameMin);
		}
		if (nameValue && FULL_NAME_HAS_DIGIT_REGEX.test(nameValue)) {
			addError(errors, nameInput, VALIDATION_TEXT.fullNameNoNumbers);
		}

		const passwordValue = passwordInput?.value.trim() || "";
		if (passwordValue && !REGISTER_PASSWORD_REGEX.test(passwordValue)) {
			addError(errors, passwordInput, VALIDATION_TEXT.registerPasswordRule);
		}
	}

	if (form.id === "login-form") {
		const passwordValue = passwordInput?.value.trim() || "";
		if (passwordValue && passwordValue.length < LOGIN_PASSWORD_MIN_LENGTH) {
			addError(errors, passwordInput, VALIDATION_TEXT.loginPasswordRule);
		}
	}

	if (form.id === "trip-form") {
		const nameValue = nameInput?.value.trim() || "";
		if (nameValue && nameValue.length < 2) {
			addError(errors, nameInput, VALIDATION_TEXT.fullNameMin);
		}
		if (nameValue && FULL_NAME_HAS_DIGIT_REGEX.test(nameValue)) {
			addError(errors, nameInput, VALIDATION_TEXT.fullNameNoNumbers);
		}

		const dateInput = form.querySelector("input[name='date']");
		if (dateInput?.value) {
			const selectedDate = new Date(`${dateInput.value}T00:00:00`);
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			if (Number.isNaN(selectedDate.getTime()) || selectedDate < today) {
				addError(errors, dateInput, VALIDATION_TEXT.visitDatePast);
			}
		}
	}

	if (errors.length) {
		errors.forEach(({ field, message }) => setFieldError(field, message));
		errors[0].field.focus();
		return false;
	}

	return true;
};

const parseApiErrorMessage = async (response, fallbackMessage) => {
	try {
		const body = await response.json();
		if (Array.isArray(body?.errors) && body.errors.length) {
			return body.errors[0].msg || fallbackMessage;
		}
		if (typeof body?.message === "string" && body.message.trim()) {
			return body.message;
		}
	} catch (error) {
		// Ignore invalid JSON responses and use fallback message.
	}

	return fallbackMessage;
};

const submitPlanTripRequest = async (form) => {
	const ticketSelect = form.querySelector("select[name='ticketId']");
	const selectedOption = ticketSelect?.selectedOptions?.[0];
	const category = selectedOption?.dataset.group || "";
	const audience = selectedOption?.dataset.audience || "";

	if (!category || !audience) {
		if (ticketSelect) {
			clearFieldError(ticketSelect);
			setFieldError(ticketSelect, VALIDATION_TEXT.selectValidTicket);
			ticketSelect.focus();
		}
		setFormMessage(form, VALIDATION_TEXT.selectValidTicket);
		return false;
	}

	const formData = new FormData(form);
	const payload = {
		name: String(formData.get("name") || "").trim(),
		email: String(formData.get("email") || "").trim(),
		date: String(formData.get("date") || "").trim(),
		category,
		audience,
		quantity: 1,
		age: 18,
		nationality: String(formData.get("nationality") || "").trim() || "Unknown",
		phone: "N/A000",
		timeSlot: "Flexible"
	};

	const submitButton = form.querySelector("button[type='submit']");
	if (submitButton) submitButton.disabled = true;

	try {
		const response = await fetch("/api/ticket-requests", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			if (response.status === 401) { window.location.href = "/login"; return false; }
			const message = await parseApiErrorMessage(response, VALIDATION_TEXT.submitFailed);
			setFormMessage(form, message);
			return false;
		}

		clearAllFieldErrors(form);
		form.reset();
		const tripDateInput = form.querySelector("input[name='date']");
		if (tripDateInput) {
			tripDateInput.min = new Date().toISOString().split("T")[0];
		}
		setFormMessage(form, VALIDATION_TEXT.submitSuccess, false);
		window.setTimeout(() => { window.location.href = "/dashboard"; }, 1200);
		return true;
	} catch (error) {
		setFormMessage(form, VALIDATION_TEXT.networkIssue);
		return false;
	} finally {
		if (submitButton) submitButton.disabled = false;
	}
};

window.validateMuseumForm = validateForm;

document.addEventListener("DOMContentLoaded", () => {
	const tripDateInput = document.querySelector("#trip-form input[name='date']");
	if (tripDateInput) {
		tripDateInput.min = new Date().toISOString().split("T")[0];
	}

	document.querySelectorAll("form[data-validate='true']").forEach((form) => {
		const clearOnInteraction = (event) => {
			const field = event.target;
			if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) {
				return;
			}

			if (field.type === "radio" && field.name) {
				form.querySelectorAll("input[type='radio']").forEach((radio) => {
					if (radio.name === field.name) clearFieldError(radio);
				});
			} else {
				clearFieldError(field);
			}

			setFormMessage(form, "", false);
		};

		form.addEventListener("input", clearOnInteraction);
		form.addEventListener("change", clearOnInteraction);

		form.addEventListener("submit", async (event) => {
			if (!validateForm(form)) {
				event.preventDefault();
				return;
			}

			if (form.id === "trip-form") {
				event.preventDefault();
				await submitPlanTripRequest(form);
				return;
			}

			if (form.dataset.clientOnly === "true") {
				event.preventDefault();
				setFormMessage(form, VALIDATION_TEXT.clientOnlySuccess, false);
			}
		});
	});
});

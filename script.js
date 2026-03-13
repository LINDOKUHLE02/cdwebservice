const estimateForm = document.querySelector("#estimate-form");
const estimateRange = document.querySelector("#estimateRange");
const estimateNote = document.querySelector("#estimateNote");
const contactForm = document.querySelector("#contact-form");
const feedback = document.querySelector("#form-feedback");
const year = document.querySelector("#year");
const estimateRangeField = document.querySelector("#estimateRangeField");
const estimateSummaryField = document.querySelector("#estimateSummaryField");
const requestIdField = document.querySelector("#requestIdField");
const submittedAtField = document.querySelector("#submittedAtField");
const scopeHint = document.querySelector("#scopeHint");
const cookieBanner = document.querySelector("#cookie-banner");
const cookieAccept = document.querySelector("#cookie-accept");
const cookieReject = document.querySelector("#cookie-reject");
const trackedContactLinks = document.querySelectorAll(".js-track-contact");

const LAST_SUBMISSION_KEY = "crafted-digital-last-submission";
const COOKIE_CONSENT_KEY = "crafted-digital-cookie-consent";
const CONTACT_FORM_MIN_FILL_MS = 4000;
const CONTACT_FORM_COOLDOWN_MS = 30000;
const formLoadedAt = Date.now();

const basePriceByType = {
  website: 18000,
  webapp: 42000,
  erp: 95000,
  cloud: 38000,
  integration: 52000,
};

const complexityFactor = {
  starter: 1,
  standard: 1.4,
  advanced: 1.9,
};

const addonCosts = {
  ui: 7000,
  auth: 9000,
  api: 11000,
  analytics: 8000,
  support: 6000,
};

const scopeHintByType = {
  website: "Typical scope: up to 6 core pages, responsive layout, and lead form integration.",
  webapp: "Typical scope: custom workflows, secure auth, and dashboard-style experience.",
  erp: "Typical scope: multi-module operations, role controls, reporting, and integration planning.",
  cloud: "Typical scope: AWS setup, deployment pipeline, monitoring, and backup strategy.",
  integration: "Typical scope: automation logic, API bridges, and operational data synchronization.",
};

function hasAnalyticsConsent() {
  return localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
}

function trackEvent(eventName, eventData = {}) {
  if (!hasAnalyticsConsent()) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...eventData,
  });

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, eventData);
  }
}

function formatZAR(value) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateEstimate() {
  const formData = new FormData(estimateForm);
  const projectType = formData.get("projectType");
  const complexity = formData.get("complexity");
  const selectedAddons = formData.getAll("addons");

  const base = basePriceByType[projectType] || 0;
  const complexityMultiplier = complexityFactor[complexity] || 1;
  const addonsTotal = selectedAddons.reduce((total, addon) => total + (addonCosts[addon] || 0), 0);

  const subtotal = base * complexityMultiplier + addonsTotal;
  const low = Math.round(subtotal * 0.9);
  const high = Math.round(subtotal * 1.2);

  const estimateText = `${formatZAR(low)} - ${formatZAR(high)}`;

  estimateRange.textContent = estimateText;
  estimateNote.textContent =
    "This is a non-binding estimate only, not a final quote. Final pricing may be lower or higher depending on full scope.";

  if (estimateRangeField) {
    estimateRangeField.value = estimateText;
  }

  if (estimateSummaryField) {
    const addonSummary = selectedAddons.length ? selectedAddons.join(", ") : "None";
    estimateSummaryField.value = `Project: ${projectType}; Complexity: ${complexity}; Addons: ${addonSummary}`;
  }

  if (scopeHint) {
    scopeHint.textContent = scopeHintByType[projectType] || "Typical scope is aligned after discovery.";
  }
}

function generateRequestId() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  if (window.crypto && window.crypto.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    const randomPart = (values[0] % 1000000).toString().padStart(6, "0");
    return `CD-${datePart}-${randomPart}`;
  }

  const fallbackPart = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
  return `CD-${datePart}-${fallbackPart}`;
}

function canSubmitByCooldown() {
  const lastSubmittedAt = Number(localStorage.getItem(LAST_SUBMISSION_KEY) || "0");
  return Date.now() - lastSubmittedAt > CONTACT_FORM_COOLDOWN_MS;
}

async function forwardToCrmWebhook(crmWebhook, payload) {
  if (!crmWebhook) {
    return;
  }

  await fetch(crmWebhook, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

if (estimateForm) {
  estimateForm.addEventListener("change", calculateEstimate);
  estimateForm.addEventListener("change", () => {
    const currentProjectType = new FormData(estimateForm).get("projectType");
    trackEvent("budget_guide_used", {
      project_type: currentProjectType,
    });
  });
  calculateEstimate();
}

trackedContactLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const channel = link.dataset.channel || "unknown";
    trackEvent("contact_channel_clicked", { channel });
  });
});

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const endpoint = contactForm.dataset.endpoint || "";
    const crmWebhook = contactForm.dataset.crmWebhook || "";
    const submitButton = contactForm.querySelector('button[type="submit"]');

    if (!endpoint || endpoint.includes("your_form_id")) {
      feedback.textContent = "Set a valid admin endpoint in data-endpoint before submitting live requests.";
      feedback.classList.add("is-error");
      return;
    }

    const formData = new FormData(contactForm);
    const honeypotValue = (formData.get("website") || "").toString().trim();

    if (honeypotValue) {
      feedback.textContent = "Submission blocked. Please refresh and try again.";
      feedback.classList.add("is-error");
      return;
    }

    if (Date.now() - formLoadedAt < CONTACT_FORM_MIN_FILL_MS) {
      feedback.textContent = "Please complete the form naturally before submitting.";
      feedback.classList.add("is-error");
      return;
    }

    if (!canSubmitByCooldown()) {
      feedback.textContent = "Please wait a moment before sending another request.";
      feedback.classList.add("is-error");
      return;
    }

    const requestId = generateRequestId();
    const submittedAt = new Date().toISOString();

    if (requestIdField) {
      requestIdField.value = requestId;
    }

    if (submittedAtField) {
      submittedAtField.value = submittedAt;
    }

    formData.set("requestId", requestId);
    formData.set("submittedAt", submittedAt);

    feedback.textContent = "Submitting request...";
    feedback.classList.remove("is-error");
    submitButton.disabled = true;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      localStorage.setItem(LAST_SUBMISSION_KEY, Date.now().toString());

      const crmPayload = {
        requestId,
        submittedAt,
        company: formData.get("company"),
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        clientProjectType: formData.get("clientProjectType"),
        budgetComfort: formData.get("budgetComfort"),
        message: formData.get("message"),
        estimateRange: formData.get("estimateRange"),
        estimateSummary: formData.get("estimateSummary"),
      };

      try {
        await forwardToCrmWebhook(crmWebhook, crmPayload);
      } catch (webhookError) {
        // Formspree succeeded; keep the user success state even if CRM forward fails.
      }

      feedback.textContent = `Quote request sent successfully. Reference ID: ${requestId}.`;
      trackEvent("quote_submitted", {
        request_id: requestId,
        project_type: formData.get("clientProjectType"),
      });
      contactForm.reset();
      calculateEstimate();
    } catch (error) {
      feedback.textContent = "Could not send request right now. Please try again shortly.";
      feedback.classList.add("is-error");
    } finally {
      submitButton.disabled = false;
    }
  });
}

if (cookieBanner) {
  const consentState = localStorage.getItem(COOKIE_CONSENT_KEY);

  if (!consentState) {
    cookieBanner.hidden = false;
  }
}

if (cookieAccept) {
  cookieAccept.addEventListener("click", () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    cookieBanner.hidden = true;
    trackEvent("cookie_consent_updated", { status: "accepted" });
  });
}

if (cookieReject) {
  cookieReject.addEventListener("click", () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    cookieBanner.hidden = true;
  });
}

if (year) {
  year.textContent = new Date().getFullYear();
}

function initRobotScene() {
  if (typeof THREE === "undefined") {
    return;
  }

  const container = document.querySelector(".hero-visual");
  const canvas = document.querySelector("#robot-canvas");

  if (!container || !canvas) {
    return;
  }

  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 1.5, 5);
  camera.lookAt(0, 0.5, 0);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0x00f5ff, 2.5);
  directionalLight.position.set(3, 5, 3);
  scene.add(directionalLight);

  const fillLight = new THREE.DirectionalLight(0xff7a18, 1.2);
  fillLight.position.set(-3, 2, 2);
  scene.add(fillLight);

  const pointLight = new THREE.PointLight(0xff7a18, 1.5, 14);
  pointLight.position.set(-2, 2, 2);
  scene.add(pointLight);

  const robot = new THREE.Group();
  scene.add(robot);

  const darkMetalMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a5f8a,
    metalness: 0.9,
    roughness: 0.15,
  });
  const cyanPanelMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a6080,
    emissive: 0x00f5ff,
    emissiveIntensity: 0.8,
    metalness: 0.8,
    roughness: 0.2,
  });
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0x2b1608,
    emissive: 0xff7a18,
    emissiveIntensity: 1.5,
    metalness: 0.8,
    roughness: 0.2,
  });
  const chestMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a2440,
    emissive: 0x0f58a8,
    emissiveIntensity: 0.9,
    metalness: 0.8,
    roughness: 0.2,
  });

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), cyanPanelMaterial);
  head.position.set(0, 1.65, 0);
  robot.add(head);

  const leftEye = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.05), eyeMaterial.clone());
  leftEye.position.set(-0.16, 0.05, 0.37);
  head.add(leftEye);

  const rightEye = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.05), eyeMaterial.clone());
  rightEye.position.set(0.16, 0.05, 0.37);
  head.add(rightEye);

  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 12), darkMetalMaterial);
  antenna.position.set(0, 0.55, 0);
  head.add(antenna);

  const antennaTip = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 12, 12),
    new THREE.MeshStandardMaterial({
      color: 0x00f5ff,
      emissive: 0x00f5ff,
      emissiveIntensity: 1,
      metalness: 0.8,
      roughness: 0.2,
    }),
  );
  antennaTip.position.set(0, 0.25, 0);
  antenna.add(antennaTip);

  const torso = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.2, 0.6), darkMetalMaterial);
  torso.position.set(0, 0.7, 0);
  robot.add(torso);

  const chestPanel = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.05), chestMaterial);
  chestPanel.position.set(0, 0, 0.33);
  torso.add(chestPanel);

  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.68, 1.06, 0);
  robot.add(leftArmPivot);

  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 1.0, 16), darkMetalMaterial);
  leftArm.position.set(0, -0.5, 0);
  leftArmPivot.add(leftArm);

  const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.2), darkMetalMaterial);
  leftHand.position.set(0, -1.05, 0);
  leftArmPivot.add(leftHand);

  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.68, 1.06, 0);
  robot.add(rightArmPivot);

  const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 1.0, 16), darkMetalMaterial);
  rightArm.position.set(0, -0.5, 0);
  rightArmPivot.add(rightArm);

  const rightHand = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.2), darkMetalMaterial);
  rightHand.position.set(0, -1.05, 0);
  rightArmPivot.add(rightHand);

  const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 0.3), darkMetalMaterial);
  leftLeg.position.set(-0.22, -0.15, 0);
  robot.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 0.3), darkMetalMaterial);
  rightLeg.position.set(0.22, -0.15, 0);
  robot.add(rightLeg);

  const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.45), darkMetalMaterial);
  leftFoot.position.set(-0.22, -0.63, 0.08);
  robot.add(leftFoot);

  const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.45), darkMetalMaterial);
  rightFoot.position.set(0.22, -0.63, 0.08);
  robot.add(rightFoot);

  const groundGlow = new THREE.Mesh(
    new THREE.CircleGeometry(0.8, 36),
    new THREE.MeshStandardMaterial({
      color: 0x221106,
      emissive: 0xff7a18,
      emissiveIntensity: 0.65,
      metalness: 0.3,
      roughness: 0.7,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
    }),
  );
  groundGlow.rotation.x = -Math.PI / 2;
  groundGlow.position.y = -0.76;
  scene.add(groundGlow);

  const randomBetween = (min, max) => Math.random() * (max - min) + min;

  const PARTICLE_COUNT = 60;
  const pPositions = new Float32Array(PARTICLE_COUNT * 3);
  const pSpeeds = new Float32Array(PARTICLE_COUNT);
  const pOffsets = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pPositions[i * 3]     = randomBetween(-3, 3);
    pPositions[i * 3 + 1] = randomBetween(-2, 4);
    pPositions[i * 3 + 2] = randomBetween(-3, 1);
    pSpeeds[i]  = randomBetween(0.002, 0.006);
    pOffsets[i] = Math.random() * Math.PI * 2;
  }

  const particleBufGeo = new THREE.BufferGeometry();
  particleBufGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
  const particleSystem = new THREE.Points(
    particleBufGeo,
    new THREE.PointsMaterial({ color: 0x00f5ff, size: 0.07, transparent: true, opacity: 0.75, sizeAttenuation: true }),
  );
  scene.add(particleSystem);

  function resizeRenderer() {
    const bounds = container.getBoundingClientRect();
    const width = Math.max(1, Math.floor(bounds.width - 2));
    const height = Math.max(240, Math.floor(bounds.height - 64));

    canvas.style.height = `${height}px`;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  const resizeObserver = new ResizeObserver(resizeRenderer);
  resizeObserver.observe(container);
  resizeRenderer();

  let animationId = 0;

  function animate() {
    const now = Date.now();

    robot.position.y = Math.sin(now * 0.001) * 0.15;
    robot.rotation.y = Math.sin(now * 0.0005) * 0.3;
    leftArmPivot.rotation.z = Math.sin(now * 0.002) * 0.25;
    rightArmPivot.rotation.z = -Math.sin(now * 0.002) * 0.25;
    head.rotation.z = Math.sin(now * 0.0015) * 0.08;

    const pulseScale = 0.8 + Math.sin(now * 0.005) * 0.2;
    antennaTip.scale.set(pulseScale, pulseScale, pulseScale);

    const eyePulse = 1.5 + Math.sin(now * 0.004) * 0.5;
    leftEye.material.emissiveIntensity = eyePulse;
    rightEye.material.emissiveIntensity = eyePulse;

    const posArr = particleBufGeo.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      posArr[i * 3 + 1] += pSpeeds[i];
      posArr[i * 3]     += Math.sin(now * 0.00022 + pOffsets[i]) * 0.0007;
      if (posArr[i * 3 + 1] > 4) {
        posArr[i * 3 + 1] = -2;
        posArr[i * 3]     = randomBetween(-3, 3);
        posArr[i * 3 + 2] = randomBetween(-3, 1);
      }
    }
    particleBufGeo.attributes.position.needsUpdate = true;

    groundGlow.material.opacity = 0.22 + Math.sin(now * 0.003) * 0.06;
    renderer.render(scene, camera);
    animationId = window.requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("beforeunload", () => {
    window.cancelAnimationFrame(animationId);
    resizeObserver.disconnect();
    renderer.dispose();
  });
}

function initProcessStepReveal() {
  const processSteps = document.querySelectorAll(".process-step");

  if (!processSteps.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  processSteps.forEach((step) => observer.observe(step));
}

function initHeroParallax() {
  const heroVisual = document.querySelector(".hero-visual");

  if (!heroVisual) {
    return;
  }

  const maxShiftPx = 12;

  window.addEventListener(
    "mousemove",
    (event) => {
      const xRatio = event.clientX / window.innerWidth - 0.5;
      const yRatio = event.clientY / window.innerHeight - 0.5;
      const x = (-xRatio * maxShiftPx).toFixed(2);
      const y = (-yRatio * maxShiftPx).toFixed(2);
      heroVisual.style.transform = `translate(${x}px, ${y}px)`;
    },
    { passive: true },
  );

  window.addEventListener("mouseleave", () => {
    heroVisual.style.transform = "translate(0px, 0px)";
  });
}

function initCyberpunkEnhancements() {
  initRobotScene();
  initProcessStepReveal();
  initHeroParallax();
}

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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCyberpunkEnhancements, { once: true });
} else {
  initCyberpunkEnhancements();
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCyberpunkEnhancements, { once: true });
} else {
  initCyberpunkEnhancements();
}
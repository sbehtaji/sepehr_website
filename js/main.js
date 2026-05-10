document.getElementById("year").textContent = new Date().getFullYear();

// Portfolio filter chips
const filterButtons = document.querySelectorAll(".filter-chip");
const cards = document.querySelectorAll(".portfolio-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    cards.forEach((card) => {
      const match = target === "all" || card.dataset.category === target;
      card.style.display = match ? "" : "none";
    });
  });
});

// Endorsement slider
const initEndorsementSlider = () => {
  const slider = document.querySelector('[data-slider="endorsements"]');
  if (!slider) return;

  const track = slider.querySelector(".endorsement-track");
  const slides = [...slider.querySelectorAll(".endorsement-card")];
  const dotsContainer = slider.querySelector(".endorsement-dots");
  const prevButton = slider.querySelector('[data-action="prev"]');
  const nextButton = slider.querySelector('[data-action="next"]');
  if (!track || slides.length === 0 || !dotsContainer) return;

  let currentIndex = 0;
  let pageCount = 1;
  let autoTimer = null;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let hasMoved = false;

  const getSlidesPerView = () =>
    window.matchMedia("(max-width: 960px)").matches ? 1 : 2;

  const render = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dotsContainer.querySelectorAll("button").forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  };

  const buildDots = () => {
    const slidesPerView = getSlidesPerView();
    pageCount = Math.max(1, Math.ceil(slides.length / slidesPerView));
    if (currentIndex >= pageCount) currentIndex = pageCount - 1;

    dotsContainer.innerHTML = "";
    for (let i = 0; i < pageCount; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "endorsement-dot";
      dot.setAttribute("aria-label", `Go to endorsement page ${i + 1}`);
      dot.addEventListener("click", () => { currentIndex = i; render(); });
      dotsContainer.appendChild(dot);
    }
  };

  prevButton?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + pageCount) % pageCount;
    render();
  });

  nextButton?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % pageCount;
    render();
  });

  const startAutoRotate = () => {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      currentIndex = (currentIndex + 1) % pageCount;
      render();
    }, 8000);
  };

  const stopAutoRotate = () => {
    if (!autoTimer) return;
    clearInterval(autoTimer);
    autoTimer = null;
  };

  const pointerDown = (e) => {
    isDragging = true;
    hasMoved = false;
    startX = e.clientX;
    currentX = e.clientX;
    stopAutoRotate();
    track.style.transition = "none";
    track.setPointerCapture?.(e.pointerId);
  };

  const pointerMove = (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
    const deltaX = currentX - startX;
    if (Math.abs(deltaX) > 6) hasMoved = true;
    track.style.transform = `translateX(calc(-${currentIndex * 100}% + ${deltaX}px))`;
  };

  const pointerUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = "";
    track.releasePointerCapture?.(e.pointerId);
    const deltaX = currentX - startX;
    if (deltaX <= -60) currentIndex = (currentIndex + 1) % pageCount;
    else if (deltaX >= 60) currentIndex = (currentIndex - 1 + pageCount) % pageCount;
    render();
    startAutoRotate();
  };

  const preventClickWhileDragging = (e) => {
    if (!hasMoved) return;
    e.preventDefault();
    e.stopPropagation();
    hasMoved = false;
  };

  buildDots();
  startAutoRotate();
  render();

  track.addEventListener("pointerdown", pointerDown);
  track.addEventListener("pointermove", pointerMove);
  track.addEventListener("pointerup", pointerUp);
  track.addEventListener("pointercancel", pointerUp);
  track.addEventListener("click", preventClickWhileDragging, true);
  slider.addEventListener("mouseenter", stopAutoRotate);
  slider.addEventListener("mouseleave", startAutoRotate);
  slider.addEventListener("focusin", stopAutoRotate);
  slider.addEventListener("focusout", startAutoRotate);
  window.addEventListener("resize", () => { buildDots(); render(); });
};

initEndorsementSlider();

// Contact form — Formspree submission
const form = document.getElementById("contact-form");
const status = document.getElementById("contact-form-status");

if (form && status) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Honeypot check
    if (form.elements["website"]?.value) return;

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    try {
      const res = await fetch("https://formspree.io/f/mbdwpbaa", {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form),
      });

      if (res.ok) {
        status.textContent = "Thanks for your message! I'll get back to you soon.";
        status.className = "form-status is-success";
        form.reset();
      } else {
        status.textContent = "Something went wrong — please email me directly.";
        status.className = "form-status is-error";
      }
    } catch {
      status.textContent = "Network error — please email me directly.";
      status.className = "form-status is-error";
    }

    status.hidden = false;
    submitBtn.disabled = false;
    submitBtn.textContent = "Send message";
    setTimeout(() => { status.hidden = true; }, 8000);
  });
}

// ===== PROJECT MODALS =====
const MODAL_CONTENT = {

  "goodmind": {
    tag: "Medical Imaging · GoodFolio LTD",
    title: "GoodMind CT/MRI Neurodiagnostic Platform",
    meta: "May 2025 – Present",
    body: `<p><em>Content coming soon.</em></p>`,
    pills: ["PyTorch","ResNet50","VGG16","Grad-CAM","DICOM","U-Net"],
    links: []
  },

  "ct-stroke": {
    tag: "Medical Imaging · GoodFolio LTD",
    title: "CT-Stroke Classification Workflow",
    meta: "2025 – Present",
    body: `<p><em>Content coming soon.</em></p>`,
    pills: ["CNN","Xception","Python","DICOM","Triage AI"],
    links: []
  },

  "oxytocin": {
    tag: "Bioinformatics · Published",
    title: "Oxytocin lncRNA — Breast Cancer Diagnostics",
    meta: "Scientific Reports, Mar 2021 · 26+ citations",
    body: `<p><em>Content coming soon.</em></p>`,
    pills: ["R","ROC/AUC","Bayesian GLM","LDA","RT-qPCR","10-fold CV"],
    links: [{ label: "View on GitHub", url: "https://github.com/sbehtaji/oxytocin-lncrna-breast-cancer-2021" }]
  },

  "rbp": {
    tag: "Bioinformatics · Research Project",
    title: "RBP Disease Prediction Pipeline",
    meta: "MSc Dissertation · Teesside University",
    body: `<p><em>Content coming soon.</em></p>`,
    pills: ["Python","XGBoost","AdaBoost","Random Forest","KNN","Naive Bayes","SGD","SHAP","Ribo-seq","ENCODE","eCLIP"],
    links: [{ label: "View on GitHub", url: "https://github.com/sbehtaji/rbp-disease-prediction" }]
  },

  "ai-agents": {
    tag: "AI Agents & FinTech · GoodFolio LTD",
    title: "AI Agent Platform — Automated Outreach",
    meta: "2025 – Present",
    body: `<p><em>Content coming soon.</em></p>`,
    pills: ["Google ADK","Gemini","Vertex AI","Cloud Run"],
    links: []
  },

  "fintech": {
    tag: "AI Agents & FinTech · Published",
    title: "AI-Powered Adaptive Engagement Framework",
    meta: "Scientific Reports, Apr 2026",
    body: `<p><em>Content coming soon.</em></p>`,
    pills: ["AI","NLP","FinTech","Adaptive Systems"],
    links: [{ label: "View Publication", url: "https://scholar.google.com/citations?user=qUR4MQMAAAAJ&hl=en" }]
  }

};

function buildModalHTML(id) {
  const d = MODAL_CONTENT[id];
  if (!d) return "";
  const pills = d.pills.map(p => `<span>${p}</span>`).join("");
  const links = d.links.map(l =>
    `<a class="btn primary" href="${l.url}" target="_blank" rel="noopener noreferrer">${l.label}</a>`
  ).join("");
  return `
    <p class="modal-tag">${d.tag}</p>
    <h2 id="modal-title">${d.title}</h2>
    <p class="modal-meta">${d.meta}</p>
    <div class="modal-body">${d.body}</div>
    ${d.pills.length ? `<div class="modal-tech-pills">${pills}</div>` : ""}
    ${links ? `<div class="modal-links">${links}</div>` : ""}
  `;
}

(function initModals() {
  const overlay = document.getElementById("project-modal");
  const body    = document.getElementById("modal-body");
  const closeBtn = document.getElementById("modal-close-btn");
  if (!overlay || !body) return;

  function openModal(id) {
    body.innerHTML = buildModalHTML(id);
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeModal() {
    overlay.hidden = true;
    document.body.style.overflow = "";
  }

  // Card clicks
  document.querySelectorAll(".portfolio-card[data-modal]").forEach(card => {
    card.addEventListener("click", e => {
      // Don't open if user clicked a link inside the card
      if (e.target.closest("a")) return;
      openModal(card.dataset.modal);
    });
  });

  // Close button
  closeBtn.addEventListener("click", closeModal);

  // Click outside modal card
  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeModal();
  });

  // ESC key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !overlay.hidden) closeModal();
  });
})();

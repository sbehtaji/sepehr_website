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
    body: `
<img class="modal-hero-img" src="projects/img/oxytocin-lncrna.png" alt="Oxytocin lncRNA breast cancer study diagram" />

<h4>Background</h4>
<p>Oxytocin (OXT) is a neuropeptide hormone with roles extending beyond reproduction — it influences cell proliferation, immune modulation, and tumour suppression. <strong>Long non-coding RNAs (lncRNAs)</strong> are RNA transcripts &gt;200 nucleotides with no protein-coding function; they regulate gene expression via chromatin remodelling, transcription factor interactions, and post-transcriptional control. lncRNA dysregulation is increasingly implicated in cancer, yet no prior study had characterised lncRNAs associated with the oxytocin signalling pathway in breast cancer — the gap this work addresses.</p>

<h4>Objective</h4>
<p>Identify lncRNAs co-expressed with OXT signalling pathway genes, measure their expression in invasive ductal carcinoma (IDC) versus matched normal breast tissue by RT-qPCR, and evaluate their combined utility as diagnostic biomarkers using machine learning classifiers.</p>

<h4>A &nbsp;·&nbsp; lncRNA Identification — Computational Analysis</h4>
<p>Candidate lncRNAs were identified by querying FANTOM5 and GENCODE for transcripts co-located or co-expressed with OXT pathway genes. GEO microarray dataset <strong>GSE54002</strong> was used for quality control and differential expression analysis (limma, R). KEGG 2019 enrichment analysis ranked the <strong>Oxytocin Signalling Pathway</strong> as the top enriched pathway — confirming biological relevance before wet-lab validation.</p>

<div class="modal-fig-row">
  <figure class="modal-figure">
    <img src="projects/img/oxytocin-fig1-network.jpg"
         alt="Co-expression network of OXT pathway genes and candidate lncRNAs" loading="lazy" />
    <figcaption><strong>Fig. 1</strong> — Co-expression network of OXT pathway target genes (blue) and candidate lncRNAs (coloured nodes), built from GSE54002 microarray data.</figcaption>
  </figure>
  <figure class="modal-figure">
    <img src="projects/img/oxytocin-fig2-pathway.jpg"
         alt="KEGG 2019 pathway enrichment — Oxytocin Signalling Pathway top hit" loading="lazy" />
    <figcaption><strong>Fig. 2</strong> — KEGG 2019 enrichment ranked by p-value. Oxytocin Signalling Pathway is the most significantly enriched pathway among differentially expressed genes.</figcaption>
  </figure>
</div>

<h4>B &nbsp;·&nbsp; Data Collection — RT-qPCR Cohort</h4>
<p>Patient breast tissue samples (IDC tumour + matched normal adjacent tissue) were profiled for <strong>6 OXT pathway target genes</strong> (OXTR, FOS, ITPR1, RCAN1, CAMK2D, CACNA2D) and <strong>4 candidate lncRNAs</strong> (lnc_TNS1, lnc_FOXF1, lnc_MTX2, lnc_ZFP161) using RT-qPCR with gene-specific primers and ΔΔCt normalisation. The figure below shows expression distributions across all 10 targets, comparing normal and tumour groups.</p>

<figure class="modal-figure">
  <img src="projects/img/oxytocin-fig3-boxplot.jpg"
       alt="RT-qPCR boxplots: normal vs tumour expression for 10 OXT pathway genes and lncRNAs" loading="lazy" />
  <figcaption><strong>Fig. 3</strong> — RT-qPCR expression distributions (normal: red, tumour: teal) for OXTR (A), FOS (B), RFPN (C), RCAN1 (D), CAMCE5 (E), CACNA2D (F), lnc_TNS1 (G), lnc_FOXF1 (H), lnc_MTX2 (I), lnc_ZFP161 (J). Multiple targets show clear separation between groups.</figcaption>
</figure>

<h4>C &nbsp;·&nbsp; Correlation Analysis</h4>
<p>Pearson correlation matrices were computed separately for tumour and normal tissue to map co-expression relationships among all 10 targets. The lncRNAs displayed markedly different co-expression patterns in tumour versus normal context — indicating cancer-specific transcriptional rewiring within the OXT pathway and supporting a regulatory (rather than incidental) role for these lncRNAs in IDC.</p>

<figure class="modal-figure">
  <img src="projects/img/oxytocin-fig5-corr.jpg"
       alt="Pearson correlation matrices for tumour (A) and normal (B) breast tissue" loading="lazy" />
  <figcaption><strong>Fig. 5</strong> — Pearson correlation scatterplot matrices for tumour tissue (A) and normal tissue (B). Co-expression structure differs substantially between conditions, revealing cancer-specific lncRNA–gene regulatory interactions.</figcaption>
</figure>

<h4>D &nbsp;·&nbsp; Diagnostic ML Models &amp; Results</h4>
<p>Three classifiers were trained in R on the combined lncRNA + OXT gene expression profiles and evaluated with <strong>10-fold cross-validation</strong>:</p>
<ul>
  <li><strong>Bayesian GLM</strong> — Bayesian generalised linear model with probabilistic inference</li>
  <li><strong>GLM</strong> — standard logistic regression (generalised linear model)</li>
  <li><strong>LDA</strong> — linear discriminant analysis</li>
</ul>

<figure class="modal-figure">
  <img src="projects/img/oxytocin-fig4-roc.jpg"
       alt="ROC curves: combined diagnostic models (A) and individual gene markers (B)" loading="lazy" />
  <figcaption><strong>Fig. 4</strong> — ROC analysis. <em>Panel A:</em> combined models — BayesGLM AUC = 0.75, GLM AUC = 0.74, LDA AUC = 0.75. <em>Panel B:</em> individual markers — FOS (0.78), ITPR1 (0.73), CAMK2D (0.67), CACNA2D (0.66), RCAN1 (0.65), OXTR (0.63), lnc_TNS1 (0.61), lnc_MTX2 (0.61), lnc_ZFP161 (0.59), lnc_FOXF1 (0.55).</figcaption>
</figure>

<div class="modal-results-grid">
  <div class="result-item"><strong>Bayesian GLM</strong><br/>AUC = 0.75</div>
  <div class="result-item"><strong>GLM</strong><br/>AUC = 0.74</div>
  <div class="result-item"><strong>LDA</strong><br/>AUC = 0.75</div>
  <div class="result-item"><strong>Best single marker</strong><br/>FOS &nbsp;·&nbsp; AUC = 0.78</div>
</div>

<h4>Conclusions &amp; Impact</h4>
<p>This was the <strong>first study to identify and characterise oxytocin-pathway lncRNAs in breast cancer</strong>. Four novel lncRNAs — lnc_TNS1, lnc_FOXF1, lnc_MTX2, and lnc_ZFP161 — showed significant differential expression in IDC versus normal tissue, and the combined multi-marker diagnostic model achieved AUC ≈ 0.75, demonstrating clinically relevant discriminative signal. Published in <em>Scientific Reports</em> (Nature Portfolio), March 2021 — <strong>26+ citations</strong>. A fully reproducible R pipeline covering data download, QC, differential expression, correlation, and ML modelling is available on GitHub.</p>
`,
    pills: ["R","ROC/AUC","Bayesian GLM","LDA","RT-qPCR","10-fold CV"],
    links: [
      { label: "View on GitHub", url: "https://github.com/sbehtaji/oxytocin-lncrna-breast-cancer-2021" },
      { label: "Read Paper", url: "https://www.nature.com/articles/s41598-021-86097-2" }
    ]
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

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
<img class="modal-hero-img" src="projects/img/oxytocin-hero.png" alt="Oxytocin Pathway · lncRNA Expression in Breast Cancer — study overview" />

<h4>Background</h4>
<p>Oxytocin (OXT) is a neuropeptide hormone with roles extending beyond reproduction — it influences cell proliferation, immune modulation, and tumour suppression. <strong>Long non-coding RNAs (lncRNAs)</strong> are RNA transcripts &gt;200 nucleotides with no protein-coding function; they regulate gene expression via chromatin remodelling, transcription factor interactions, and post-transcriptional control. lncRNA dysregulation is increasingly implicated in cancer, yet no prior study had characterised lncRNAs associated with the oxytocin signalling pathway in breast cancer — the gap this work addresses.</p>

<h4>Objective</h4>
<p>Identify lncRNAs co-expressed with OXT signalling pathway genes, measure their expression in invasive ductal carcinoma (IDC) versus matched normal breast tissue by RT-qPCR, and evaluate their combined utility as diagnostic biomarkers using machine learning classifiers.</p>

<h4>A &nbsp;·&nbsp; lncRNA Identification — Computational Analysis</h4>
<p>Candidate lncRNAs were identified by querying lncRNA databases for transcripts co-located or co-expressed with OXT pathway genes. Their biological relevance was then confirmed via differential expression analysis on a large public microarray dataset before wet-lab validation.</p>
<p><strong>Dataset:</strong> GEO <strong>GSE54002</strong> · platform GPL570 (Affymetrix HG-U133 Plus 2.0 Array) · <strong>n = 433</strong> (417 tumour, 16 normal breast tissue samples).</p>
<p><strong>Pipeline (R / Bioconductor):</strong></p>
<ul>
  <li><strong>Download &amp; QC</strong> — dataset retrieved via <code>GEOquery</code>; sample labels validated against GEO metadata titles to prevent silent mis-labelling errors.</li>
  <li><strong>Normalisation</strong> — quantile normalisation across all arrays (<code>limma::normalizeBetweenArrays</code>) to remove technical variation.</li>
  <li><strong>QC visualisations</strong> — expression boxplot, sample-correlation heatmap (<code>pheatmap</code>), and PCA coloured by tumour/normal group.</li>
  <li><strong>Differential expression</strong> — linear model with effects-coded design matrix (<code>~ group + 0</code>), explicit contrast <em>tumour − normal</em>, empirical Bayes moderation (<code>eBayes</code>), results ranked by B-statistic (log-odds of differential expression).</li>
  <li><strong>Multiple testing correction</strong> — Benjamini-Hochberg FDR; DEG lists exported at two thresholds: |logFC| &gt; 2 (primary) and |logFC| &gt; 1 (secondary), both at adj.P &lt; 0.05.</li>
</ul>
<p>KEGG 2019 enrichment of the DEG list ranked the <strong>Oxytocin Signalling Pathway</strong> as the top hit, validating the pathway selection and guiding the subsequent lncRNA–gene panel for RT-qPCR.</p>

<div class="modal-fig-row">
  <figure class="modal-figure">
    <img src="projects/img/oxytocin-fig1-network.png"
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
  <img src="projects/img/oxytocin-fig3-boxplot.png"
       alt="RT-qPCR boxplots: normal vs tumour expression for 10 OXT pathway genes and lncRNAs" loading="lazy" />
  <figcaption><strong>Fig. 3</strong> — RT-qPCR expression distributions (normal: red, tumour: teal) for OXTR (A), FOS (B), RFPN (C), RCAN1 (D), CAMCE5 (E), CACNA2D (F), lnc_TNS1 (G), lnc_FOXF1 (H), lnc_MTX2 (I), lnc_ZFP161 (J). Multiple targets show clear separation between groups.</figcaption>
</figure>

<h4>C &nbsp;·&nbsp; Correlation Analysis</h4>
<p>Pearson correlation matrices were computed separately for tumour and normal tissue to map co-expression relationships among all 10 targets. The lncRNAs displayed markedly different co-expression patterns in tumour versus normal context — indicating cancer-specific transcriptional rewiring within the OXT pathway and supporting a regulatory (rather than incidental) role for these lncRNAs in IDC.</p>

<div class="modal-fig-row">
  <figure class="modal-figure">
    <img src="projects/img/oxytocin-fig5-corr-tumor.png"
         alt="Pearson correlation matrix — tumour tissue" loading="lazy" />
    <figcaption><strong>Fig. 5A — Tumour Tissue.</strong> Strong inter-gene correlations emerge in IDC, reflecting cancer-driven co-regulatory rewiring across OXT pathway targets and lncRNAs.</figcaption>
  </figure>
  <figure class="modal-figure">
    <img src="projects/img/oxytocin-fig6-corr-normal.png"
         alt="Pearson correlation matrix — normal tissue" loading="lazy" />
    <figcaption><strong>Fig. 5B — Normal Tissue.</strong> Correlation structure in normal breast tissue is notably different, highlighting lncRNA co-expression patterns specific to the tumour context.</figcaption>
  </figure>
</div>

<h4>D &nbsp;·&nbsp; ML Diagnostic Modelling — Big Picture</h4>

<div class="ml-pipeline">
  <div class="ml-step">
    <span class="ml-step-label">Input</span>
    <span class="ml-step-text">RT-qPCR expression<br/>n = 70 IDC patients<br/>log₂ transcript values</span>
  </div>
  <span class="ml-arrow">→</span>
  <div class="ml-step">
    <span class="ml-step-label">Features</span>
    <span class="ml-step-text">10 variables<br/>6 OXT pathway genes<br/>4 lncRNAs</span>
  </div>
  <span class="ml-arrow">→</span>
  <div class="ml-step">
    <span class="ml-step-label">Models ×3</span>
    <span class="ml-step-text">Bayesian GLM<br/>GLM (logistic)<br/>LDA</span>
  </div>
  <span class="ml-arrow">→</span>
  <div class="ml-step">
    <span class="ml-step-label">Validation</span>
    <span class="ml-step-text">10-fold<br/>cross-validation<br/>ROC / AUC</span>
  </div>
  <span class="ml-arrow">→</span>
  <div class="ml-step ml-step--result">
    <span class="ml-step-label">Result</span>
    <span class="ml-step-text">Combined AUC 0.75<br/>Sensitivity 0.72<br/>Specificity 0.71</span>
  </div>
</div>

<p>The ML task was a <strong>binary classification</strong> of IDC tumour vs. normal breast tissue. The feature matrix comprised log₂-transformed RT-qPCR expression values for all 10 targets measured in the same patient cohort (n = 70). Three distinct classifiers were selected to capture different modelling assumptions:</p>

<ul>
  <li><strong>Bayesian GLM</strong> — logistic regression with Bayesian inference; places a prior over model coefficients, producing probability estimates with uncertainty quantification. Suited to small clinical cohorts where regularisation matters.</li>
  <li><strong>GLM (logistic regression)</strong> — standard maximum-likelihood logistic regression; provides interpretable odds-ratio coefficients per gene, serving as a transparent clinical baseline.</li>
  <li><strong>LDA (Linear Discriminant Analysis)</strong> — assumes Gaussian class distributions with shared covariance; finds the linear combination of features maximising class separation. Computationally efficient and robust on small, correlated datasets.</li>
</ul>

<p>All three models were evaluated under <strong>10-fold cross-validation</strong> to obtain unbiased performance estimates and reduce overfitting risk on the limited cohort. ROC curves and AUC were computed for each fold and averaged. Single-gene ROC analysis was also run on each marker independently, separating the diagnostic contribution of the lncRNAs from the protein-coding targets.</p>

<figure class="modal-figure">
  <img src="projects/img/oxytocin-fig4-roc.png"
       alt="ROC curves: combined diagnostic models (A) and individual gene markers (B)" loading="lazy" />
  <figcaption><strong>Fig. 4 — ROC / AUC Analysis.</strong> <em>Panel A (left):</em> all three combined models perform similarly — BayesGLM AUC = 0.75, GLM AUC = 0.74, LDA AUC = 0.75 — confirming result stability across modelling approaches. <em>Panel B (right):</em> single-gene AUCs — FOS (0.78), ITPR1 (0.73), CAMK2D (0.67), CACNA2D (0.66), RCAN1 (0.65), OXTR (0.63), lnc_TNS1 (0.61), lnc_MTX2 (0.61), lnc_ZFP161 (0.59), lnc_FOXF1 (0.55). The combined model outperforms every individual marker except FOS, demonstrating the additive value of the lncRNA panel.</figcaption>
</figure>

<div class="modal-results-grid modal-results-grid--5">
  <div class="result-item"><strong>Combined AUC</strong><br/>0.75</div>
  <div class="result-item"><strong>Sensitivity</strong><br/>0.72</div>
  <div class="result-item"><strong>Specificity</strong><br/>0.71</div>
  <div class="result-item"><strong>Cohort</strong><br/>n = 70 IDC</div>
  <div class="result-item result-item--highlight"><strong>Best single marker</strong><br/>FOS · AUC 0.78</div>
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

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
    tag: "Bioinformatics · MSc Dissertation · Teesside University",
    title: "RBP Disease Prediction Pipeline",
    meta: "Deciphering Translational Regulation in Leukaemia via eCLIP + Ribo-seq + ML · 2024",
    body: `
<img class="modal-hero-img" src="projects/img/rbp-eclip.png" alt="RBP Binding Prediction — eCLIP-seq + Ribo-seq + ML pipeline overview" />

<h4>Background</h4>
<p><strong>RNA-Binding Proteins (RBPs)</strong> are a family of >1,542 human proteins that regulate gene expression post-transcriptionally — controlling mRNA splicing, stability, localisation, and translation. Their dysregulation is increasingly linked to cancer, including chronic myeloid leukaemia (CML). This study used <strong>K562 cells</strong>, the canonical CML model carrying the Philadelphia chromosome (BCR-ABL fusion), to investigate whether RBP binding patterns can predict how individual genes respond translationally to two distinct molecular perturbations.</p>

<h4>Objective</h4>
<p>Build supervised ML classifiers that predict the translational response (up- or down-regulated) of <strong>20,049 protein-coding genes</strong> in K562 cells under two treatment conditions, using the binding signals of <strong>139 RBPs</strong> from ENCODE eCLIP as features and Ribo-seq translation data as labels. Six classifiers were systematically evaluated: <strong>XGBoost, Random Forest, AdaBoost, SGD (Stochastic Gradient Descent), K-Nearest Neighbours (KNN), and Gaussian Naïve Bayes (GNB)</strong>.</p>

<h4>A &nbsp;·&nbsp; Datasets</h4>
<ul>
  <li><strong>Gene annotations:</strong> GENCODE Release 45 (GRCh38.p14) — 20,049 protein-coding genes, ~1.4 million exon regions</li>
  <li><strong>eCLIP features (ENCODE):</strong> 139 unique RBPs profiled in K562 cells via eCLIP-seq — 90 paired-end + 49 single-end libraries, each with 2 biological replicates. BED narrowPeak files intersected with exon regions using a chromosome-sorted binary search algorithm.</li>
  <li><strong>Ribo-seq labels (BioProject PRJDB15060):</strong> Ribosome footprint counts quantified via FeatureCounts on Galaxy, averaged across replicates, TPM-normalised. Two conditions:
    <ul>
      <li><strong>Condition 1:</strong> shDDX41 (DDX41 knockdown) vs shScramble control</li>
      <li><strong>Condition 2:</strong> CX5461 (ribosome biogenesis inhibitor) vs DMSO control</li>
    </ul>
  </li>
</ul>
<p><strong>Final dataset:</strong> 20,049 rows × 144 columns — 1 gene ID, 140 RBP signal columns, 4 TPM outcome columns. After filtering genes with no translational change: ~1,818 genes (Cond 1) and ~1,790 genes (Cond 2) used for modelling.</p>

<figure class="modal-figure">
  <img src="projects/img/rbp-fig2-dataset.png" alt="Final merged dataset: gene IDs, RBP signals, TPM values per condition" loading="lazy" />
  <figcaption><strong>Dataset structure</strong> — each row is a protein-coding gene; columns include RBP signal values (DDX1, XRCC6, GEMIN5…) and TPM expression under each condition (shScramble, shDDX41, DMSO, CX5461).</figcaption>
</figure>

<h4>B &nbsp;·&nbsp; Feature Engineering</h4>
<p>Two parallel feature representations were tested throughout all experiments to assess the value of signal quantification vs. simple presence/absence:</p>
<ul>
  <li><strong>Binary (0/1):</strong> 1 if any eCLIP peak overlaps the gene's exon regions, 0 otherwise.</li>
  <li><strong>Actual signal values:</strong> summed eCLIP signal strength per RBP per gene; for RBPs with two experiments, the mean signal across consensus overlaps was used.</li>
</ul>
<p><strong>Labels:</strong> <code>sign(Treatment TPM − Control TPM)</code> → class 0 (decreased translation) or class 1 (increased translation). Genes with zero difference discarded.</p>

<h4>C &nbsp;·&nbsp; ML Pipeline — Big Picture</h4>

<figure class="modal-figure">
  <img src="projects/img/rbp-fig1-pipeline.png" alt="Full ML pipeline: Gene Annotations + RBP Signal Strength + Treatment Data → Merge → Preprocess → Binary/Actual → Model Construction → Evaluation" loading="lazy" />
  <figcaption><strong>Fig. 1 — End-to-end pipeline.</strong> Three data sources merged into a single feature matrix, preprocessed in two parallel representations, then fed into model construction and evaluation.</figcaption>
</figure>

<p><strong>Input matrix (post-preprocessing):</strong> After one-hot encoding the Geneid column, the working dataset expands to <strong>9,521 rows × 9,661 columns</strong> — 139 RBP signal features plus ~9,500 binary gene-ID indicator columns. An 80/20 train/test split (<code>random_state=42</code>) was applied, yielding ~7,616 training and ~1,905 test samples. Labels were computed as:</p>
<ul>
  <li><strong>Condition 1:</strong> <code>sign(shScramble TPM − shDDX41 TPM)</code> → binary: class 0 / class 1</li>
  <li><strong>Condition 2:</strong> <code>sign(DMSO TPM − CX5461 TPM)</code> → binary: class 0 / class 1</li>
</ul>
<p>Genes with zero differential (no change) were excluded, leaving ~9,521 informative genes. A <strong>3-class variant</strong> was also tested (retaining the neutral class as class 2), yielding 51–56% accuracy — lower than binary, confirming that the neutral class adds ambiguity without gain.</p>

<div class="ml-pipeline">
  <div class="ml-step">
    <span class="ml-step-label">Matrix</span>
    <span class="ml-step-text">9,521 × 9,661<br/>RBP signals +<br/>gene-ID OHE</span>
  </div>
  <span class="ml-arrow">→</span>
  <div class="ml-step">
    <span class="ml-step-label">Split</span>
    <span class="ml-step-text">80 / 20<br/>train / test<br/>random_state=42</span>
  </div>
  <span class="ml-arrow">→</span>
  <div class="ml-step">
    <span class="ml-step-label">6 Classifiers</span>
    <span class="ml-step-text">XGBoost · Random Forest<br/>AdaBoost · SGD<br/>KNN · Gaussian NB</span>
  </div>
  <span class="ml-arrow">→</span>
  <div class="ml-step">
    <span class="ml-step-label">Tuning</span>
    <span class="ml-step-text">RandomizedSearchCV<br/>cv=3 · accuracy<br/>10 → 100 iters</span>
  </div>
  <span class="ml-arrow">→</span>
  <div class="ml-step ml-step--result">
    <span class="ml-step-label">Best</span>
    <span class="ml-step-text">AdaBoost<br/>Cond 1 · actual<br/>61.05%</span>
  </div>
</div>

<p>Three iterative experiments were conducted for both conditions and both feature types (binary and actual):</p>
<ul>
  <li><strong>Exp 1 — Baseline:</strong> XGBoost with default parameters. Established reference performance (~59% binary, ~57% actual for Cond 2).</li>
  <li><strong>Exp 2 — Breadth comparison:</strong> All six classifiers with default parameters:
    <ul>
      <li><strong>XGBoost</strong> — gradient boosting on decision trees; strong baseline (~59–60%)</li>
      <li><strong>Random Forest</strong> — bagging ensemble; comparable to XGBoost with less sensitivity to tuning</li>
      <li><strong>AdaBoost</strong> — adaptive boosting; emerged as the overall strongest classifier</li>
      <li><strong>SGD</strong> (Stochastic Gradient Descent with log-loss) — linear model; moderate performance, fast convergence</li>
      <li><strong>KNN</strong> (K-Nearest Neighbours) — instance-based; reasonable accuracy on actual features, slow on high-dimensional space</li>
      <li><strong>GaussianNB</strong> — probabilistic Naive Bayes; immediately identified as unsuitable — extreme class bias (~45–46%) that hyperparameter tuning could not correct</li>
    </ul>
  </li>
  <li><strong>Exp 3 — Hyperparameter optimisation:</strong> <code>RandomizedSearchCV</code> in two phases — 10 iterations (range exploration) then 100 iterations (fine search) — with 3-fold CV scored on accuracy. Applied to all six classifiers. Best AdaBoost params: <code>learning_rate=0.193, n_estimators=121</code>.</li>
</ul>

<h4>D &nbsp;·&nbsp; Results</h4>
<p><strong>AdaBoost with actual RBP signal values on Condition 1 achieved the highest accuracy of 61.05%</strong> — the overall best across all models, conditions, and feature types. Actual signal values consistently outperformed binary encoding. Condition 1 (DDX41-KD) was systematically easier to predict than Condition 2 (CX5461), suggesting that CX5461's translational effects are more diffuse and less RBP-mediated.</p>

<div class="modal-fig-row">
  <figure class="modal-figure">
    <img src="projects/img/rbp-fig4-adaboost-best.png" alt="AdaBoost best result: Condition 1, actual values — accuracy 61.05%" loading="lazy" />
    <figcaption><strong>Best — AdaBoost · Cond 1 · actual values · n_iter=10</strong><br/>Acc = 61.05% · macro avg F1 = 0.57<br/>Class 0: P=0.61, R=0.83, F1=0.70 (n=1051)<br/>Class 1: P=0.62, R=0.34, F1=0.44 (n=854)</figcaption>
  </figure>
  <figure class="modal-figure">
    <img src="projects/img/rbp-fig5-adaboost-cond2.png" alt="AdaBoost Condition 2 — accuracy 55.81%" loading="lazy" />
    <figcaption><strong>AdaBoost · Cond 2 · binary · default</strong><br/>Acc = 55.81% · macro avg F1 = 0.54<br/>Class 0: P=0.59, R=0.68, F1=0.63 (n=995)<br/>Class 1: P=0.50, R=0.41, F1=0.45 (n=795)</figcaption>
  </figure>
</div>

<p>All models shared a consistent pattern: <strong>class 0 recall was always substantially higher than class 1 recall</strong>, meaning down-regulation events were easier to detect than up-regulation events. GaussianNB showed extreme failure — on binary features it predicted 100% of instances as class 1 (0% recall for class 0); on actual values the bias reversed completely. Both failure modes persisted through 100 iterations of tuning, confirming GNB is fundamentally unsuited to this high-dimensional sparse dataset.</p>

<div class="modal-results-grid modal-results-grid--5">
  <div class="result-item result-item--highlight"><strong>Best accuracy</strong><br/>AdaBoost · 61.05%</div>
  <div class="result-item"><strong>Runner-up</strong><br/>XGBoost · 60.47%</div>
  <div class="result-item"><strong>Best features</strong><br/>Actual signal values</div>
  <div class="result-item"><strong>Best condition</strong><br/>Cond 1 · DDX41-KD</div>
  <div class="result-item"><strong>Worst model</strong><br/>GNB · ~45–46%</div>
</div>

<h4>Key Findings &amp; Conclusions</h4>
<ul>
  <li><strong>Actual RBP signal strengths outperform binary encoding</strong> — quantitative signal values carry more predictive information than simple presence/absence, particularly for Condition 1.</li>
  <li><strong>All models showed class imbalance bias</strong> — down-regulated genes (class 0) were consistently detected with higher recall than up-regulated genes (class 1). The positive class was systematically underdetected across every model and condition.</li>
  <li><strong>Hyperparameter tuning provided modest but not dramatic gains</strong> — AdaBoost and XGBoost improved with tuning; Random Forest and GNB were largely unresponsive.</li>
  <li><strong>~61% accuracy ceiling reflects biological complexity</strong> — RBP binding alone does not fully explain translational regulation; miRNA activity, codon availability, mRNA secondary structure, and ribosome availability contribute but were not included as features.</li>
  <li><strong>Future directions:</strong> multi-omics integration (transcriptomics, proteomics), expanded feature sets, and deep learning architectures to improve both accuracy and class-balance in leukaemia translational prediction.</li>
</ul>
`,
    pills: ["Python","scikit-learn","XGBoost","AdaBoost","Random Forest","SGD","KNN","Naive Bayes","RandomizedSearchCV","Ribo-seq","ENCODE","eCLIP","TPM","GENCODE"],
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

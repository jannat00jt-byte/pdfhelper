/* ============================================
   PDFHelper Tool - Application Logic
   Dark Mode, Particles, i18n, Conversions
   ============================================ */

(function() {
  'use strict';

  const tools = [
    { id: 'combine', icon: '📄', title: { fr: 'Fusionner PDF', en: 'Merge PDF' }, desc: { fr: 'Combinez plusieurs PDF en un seul fichier', en: 'Combine multiple PDFs into one' }, accept: '.pdf', multiple: true, mode: 'combine', format: 'PDF' },
    { id: 'jpg-to-pdf', icon: '🖼️', title: { fr: 'JPG en PDF', en: 'JPG to PDF' }, desc: { fr: 'Convertissez vos images JPG en PDF', en: 'Convert JPG images to PDF' }, accept: '.jpg,.jpeg,.png,.tiff,.tif,.svg', multiple: true, mode: 'images', format: 'JPG' },
    { id: 'png-to-pdf', icon: '🖼️', title: { fr: 'PNG en PDF', en: 'PNG to PDF' }, desc: { fr: 'Convertissez vos images PNG en PDF', en: 'Convert PNG images to PDF' }, accept: '.png,.jpg,.jpeg,.tiff,.tif,.svg', multiple: true, mode: 'images', format: 'PNG' },
    { id: 'tiff-to-pdf', icon: '📷', title: { fr: 'TIFF en PDF', en: 'TIFF to PDF' }, desc: { fr: 'Convertissez vos fichiers TIFF en PDF', en: 'Convert TIFF files to PDF' }, accept: '.tiff,.tif,.jpg,.jpeg,.png,.svg', multiple: true, mode: 'images', format: 'TIFF' },
    { id: 'svg-to-pdf', icon: '🎨', title: { fr: 'SVG en PDF', en: 'SVG to PDF' }, desc: { fr: 'Convertissez vos fichiers SVG en PDF', en: 'Convert SVG files to PDF' }, accept: '.svg,.png,.jpg,.jpeg,.tiff,.tif', multiple: true, mode: 'images', format: 'SVG' }
  ];

  let currentLang = document.documentElement.lang === 'en' ? 'en' : 'fr';
  let currentTool = tools[0];
  let selectedFiles = [];
  let isConverting = false;

  const $ = id => document.getElementById(id);
  const el = {
    toolCards: $('toolCards'), dropzone: $('dropzone'), fileInput: $('fileInput'),
    fileList: $('fileList'), convertBtn: $('convertBtn'), resetBtn: $('resetBtn'),
    progressWrap: $('progressWrap'), progressFill: $('progressFill'), progressText: $('progressText'),
    resultWrap: $('resultWrap'), downloadBtn: $('downloadBtn'),
    workspaceTitle: $('workspaceTitle'), workspaceInfo: $('workspaceInfo'),
    toolTitle: $('toolTitle'), toolDesc: $('toolDesc'),
    dropzoneTitle: $('dropzoneTitle'), dropzoneDesc: $('dropzoneDesc'),
    hamburger: $('hamburger'), nav: $('nav'), header: $('header'),
    langToggle: $('langToggle'), langText: $('langText'),
    convertBtnText: $('convertBtnText'),
    resultTitle: $('resultTitle'), resultDesc: $('resultDesc'),
    themeToggle: $('themeToggle'), themeIcon: $('themeIcon')
  };

  // ===== i18n =====
  const i18n = {
    fr: {
      siteName: 'PDFHelper Tool', tagline: 'Convertissez et fusionnez vos documents PDF en ligne',
      seoTitle: 'Convertissez vos fichiers en PDF gratuitement',
      seoDesc: 'Convertissez et fusionnez vos PDF en ligne gratuitement. Outils : fusion PDF, JPG en PDF, PNG en PDF, TIFF en PDF, SVG en PDF. 100% sécurisé, sans inscription.',
      heroTitle: 'Convertissez vos fichiers en <span class="highlight">PDF</span>',
      heroSub: ' gratuitement en ligne',
      heroDesc: 'Fusionnez vos PDF, convertissez JPG, PNG, TIFF et SVG en PDF. 100% gratuit, sécurisé et directement depuis votre navigateur.',
      heroStat1: '<strong>50K+</strong><span>Conversions</span>',
      heroStat2: '<strong>100%</strong><span>Sécurisé</span>',
      heroStat3: '<strong>Gratuit</strong><span>Sans inscription</span>',
      workspaceTitle: 'Espace de travail',
      infoSecure: '100% sécurisé - vos fichiers restent sur votre appareil',
      dropzoneTitle: 'Déposez vos fichiers ici',
      dropzoneDesc: 'ou cliquez pour parcourir',
      browse: 'Parcourir', convert: 'Convertir en PDF', converting: 'Conversion en cours...',
      reset: 'Réinitialiser',
      resultTitle: 'Conversion réussie !',
      resultDesc: 'Votre fichier PDF est prêt à être téléchargé.',
      download: 'Télécharger le PDF',
      howTitle: 'Comment ça <span class="highlight">marche</span>',
      howDesc: 'Convertissez vos fichiers en PDF en 3 étapes simples',
      step1Title: 'Sélectionnez un outil', step1Desc: 'Choisissez l\'outil adapté à votre besoin parmi nos 5 options.',
      step2Title: 'Ajoutez vos fichiers', step2Desc: 'Déposez vos fichiers ou cliquez pour les sélectionner.',
      step3Title: 'Convertissez & téléchargez', step3Desc: 'Obtenez votre PDF en quelques secondes, directement dans votre navigateur.',
      featuresTitle: 'Pourquoi choisir <span class="highlight">PDFHelper Tool</span>',
      feat1Title: '100% Gratuit', feat1Desc: 'Tous nos outils sont totalement gratuits, sans limite de fichiers ni d\'utilisation.',
      feat2Title: 'Sécurité maximale', feat2Desc: 'Vos fichiers sont traités localement dans votre navigateur. Rien n\'est envoyé sur nos serveurs.',
      feat3Title: 'Aucune inscription', feat3Desc: 'Pas besoin de créer un compte. Utilisez nos outils immédiatement.',
      feat4Title: 'Multi-format', feat4Desc: 'Supporte PDF, JPG, PNG, TIFF et SVG. Convertissez depuis et vers plusieurs formats.',
      feat5Title: 'Rapidité', feat5Desc: 'Conversion instantanée directement dans votre navigateur. Résultats en quelques secondes.',
      feat6Title: 'Aucune limite', feat6Desc: 'Convertissez autant de fichiers que vous voulez, sans limite de taille ni de nombre.',
      faqTitle: 'Questions fréquentes',
      faq1q: 'Puis-je fusionner plusieurs PDF en un seul fichier ?',
      faq1a: 'Oui, absolument ! Sélectionnez l\'outil "Fusionner PDF", ajoutez tous les fichiers PDF que vous souhaitez combiner, puis cliquez sur "Convertir en PDF". Tous vos fichiers seront fusionnés en un seul document PDF.',
      faq2q: 'Est-ce que mes fichiers sont en sécurité ?',
      faq2a: 'Totalement. Vos fichiers sont traités localement dans votre navigateur. Aucune donnée n\'est envoyée vers un serveur. Une fois la conversion terminée, vos fichiers originaux sont supprimés de la mémoire.',
      faq3q: 'Y a-t-il une limite de taille ou de nombre de fichiers ?',
      faq3a: 'Non, il n\'y a aucune limite. Vous pouvez convertir autant de fichiers que vous le souhaitez, quelle que soit leur taille. La seule limite est la mémoire de votre navigateur.',
      faq4q: 'Puis-je convertir des images en PDF ?',
      faq4a: 'Oui, vous pouvez convertir JPG, PNG, TIFF et SVG en PDF. Sélectionnez simplement l\'outil correspondant, ajoutez vos images, et obtenez un PDF parfait.',
      faq5q: 'L\'outil est-il vraiment gratuit ?',
      faq5a: 'Oui, 100% gratuit. Aucun paiement, aucune inscription, aucune limite. Utilisez nos outils autant que vous le souhaitez.',
      footerDesc: 'Solutions de conversion PDF en ligne, rapides et sécurisées. Aucune inscription requise.',
      lang: 'English', noFiles: 'Aucun fichier sélectionné', filesSelected: 'fichier(s) sélectionné(s)',
      errorTitle: 'Erreur de conversion', errorDesc: 'Une erreur est survenue lors de la conversion. Veuillez réessayer.',
      seoH2: 'Convertissez tous vos documents en PDF',
      seoP1: 'PDFHelper Tool est votre solution complète pour la conversion et la fusion de documents PDF. Que vous ayez besoin de fusionner plusieurs PDF en un seul fichier ou de convertir des images JPG, PNG, TIFF ou SVG en PDF, notre outil en ligne gratuit vous offre une solution rapide et fiable.',
      seoP2: 'Contrairement à d\'autres services, PDFHelper Tool traite tous vos fichiers directement dans votre navigateur. Cela signifie que vos documents restent confidentiels et ne sont jamais téléchargés sur un serveur externe.',
      seoH3: 'Fusion de PDF professionnelle',
      seoP3: 'Notre outil de fusion PDF vous permet de combiner plusieurs documents en un seul fichier PDF. Idéal pour regrouper des contrats, des rapports, des présentations ou tout autre document professionnel.',
      seoH4: 'Conversion d\'images en PDF de haute qualité',
      seoP4: 'Convertissez vos images JPG, PNG, TIFF et SVG en PDF avec une qualité optimale. Chaque image est convertie en une page PDF distincte, conservant la résolution et les couleurs originales.',
      dark: 'Mode sombre', light: 'Mode clair'
    },
    en: {
      siteName: 'PDFHelper Tool', tagline: 'Convert and merge your PDF documents online',
      seoTitle: 'Convert your files to PDF for free online',
      seoDesc: 'Convert and merge your PDFs online for free. Tools: merge PDF, JPG to PDF, PNG to PDF, TIFF to PDF, SVG to PDF. 100% secure, no signup.',
      heroTitle: 'Convert your files to <span class="highlight">PDF</span>',
      heroSub: ' for free online',
      heroDesc: 'Merge PDFs, convert JPG, PNG, TIFF and SVG to PDF. 100% free, secure, and directly from your browser.',
      heroStat1: '<strong>50K+</strong><span>Conversions</span>',
      heroStat2: '<strong>100%</strong><span>Secure</span>',
      heroStat3: '<strong>Free</strong><span>No signup</span>',
      workspaceTitle: 'Workspace', infoSecure: '100% secure - your files stay on your device',
      dropzoneTitle: 'Drop your files here', dropzoneDesc: 'or click to browse',
      browse: 'Browse', convert: 'Convert to PDF', converting: 'Converting...',
      reset: 'Reset', resultTitle: 'Conversion successful!',
      resultDesc: 'Your PDF file is ready to download.', download: 'Download PDF',
      howTitle: 'How it <span class="highlight">works</span>', howDesc: 'Convert your files to PDF in 3 simple steps',
      step1Title: 'Select a tool', step1Desc: 'Choose the right tool for your needs from our 5 options.',
      step2Title: 'Add your files', step2Desc: 'Drop your files or click to browse and select them.',
      step3Title: 'Convert & download', step3Desc: 'Get your PDF in seconds, right in your browser.',
      featuresTitle: 'Why choose <span class="highlight">PDFHelper Tool</span>',
      feat1Title: '100% Free', feat1Desc: 'All our tools are completely free, no file or usage limits.',
      feat2Title: 'Maximum security', feat2Desc: 'Your files are processed locally in your browser. Nothing is sent to our servers.',
      feat3Title: 'No registration', feat3Desc: 'No account needed. Use our tools immediately with no signup.',
      feat4Title: 'Multi-format', feat4Desc: 'Supports PDF, JPG, PNG, TIFF and SVG. Convert from and to multiple formats.',
      feat5Title: 'Speed', feat5Desc: 'Instant conversion directly in your browser. Results in seconds.',
      feat6Title: 'No limits', feat6Desc: 'Convert as many files as you want with no size or quantity limits.',
      faqTitle: 'Frequently asked questions',
      faq1q: 'Can I merge multiple PDFs into one file?',
      faq1a: 'Yes, absolutely! Select the "Merge PDF" tool, add all the PDF files you want to combine, then click "Convert to PDF". All your files will be merged into a single PDF document.',
      faq2q: 'Are my files secure?', faq2a: 'Completely. Your files are processed locally in your browser. No data is sent to any server.',
      faq3q: 'Is there a file size or quantity limit?', faq3a: 'No, there are no limits. You can convert as many files as you want.',
      faq4q: 'Can I convert images to PDF?', faq4a: 'Yes, you can convert JPG, PNG, TIFF and SVG to PDF.',
      faq5q: 'Is the tool really free?', faq5a: 'Yes, 100% free. No payment, no registration, no limits.',
      footerDesc: 'Fast and secure online PDF conversion solutions. No registration required.',
      lang: 'Français', noFiles: 'No files selected', filesSelected: 'file(s) selected',
      errorTitle: 'Conversion error', errorDesc: 'An error occurred during conversion. Please try again.',
      seoH2: 'Convert all your documents to PDF',
      seoP1: 'PDFHelper Tool is your complete solution for PDF conversion and merging. Whether you need to merge multiple PDFs into one file or convert JPG, PNG, TIFF or SVG images to PDF, our free online tool provides a fast and reliable solution.',
      seoP2: 'Unlike other services, PDFHelper Tool processes all your files directly in your browser. Your documents remain confidential and are never uploaded to an external server.',
      seoH3: 'Professional PDF merging',
      seoP3: 'Our PDF merging tool lets you combine multiple documents into a single PDF file. Ideal for consolidating contracts, reports, presentations or any professional document.',
      seoH4: 'High-quality image to PDF conversion',
      seoP4: 'Convert your JPG, PNG, TIFF and SVG images to PDF with optimal quality. Each image is converted to a separate PDF page, preserving original resolution and colors.',
      dark: 'Dark mode', light: 'Light mode'
    }
  };

  function t(key) { return i18n[currentLang][key] || key; }

  // ===== PARTICLES =====
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];

    function resize() {
      const hero = canvas.parentElement;
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
        ctx.fill();
      }
    }

    function init() {
      resize();
      particles = Array.from({ length: 60 }, () => new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => { p.update(); p.draw(); });
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${0.05 * (1 - dist / 150)})`;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }

    init();
    animate();
    window.addEventListener('resize', resize);
  }

  // ===== DARK MODE =====
  function initTheme() {
    const saved = localStorage.getItem('pdf-tools-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    setTheme(theme);
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pdf-tools-theme', theme);
    if (el.themeIcon) el.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    if (el.themeToggle) el.themeToggle.title = theme === 'dark' ? t('light') : t('dark');
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  // ===== INIT UI =====
  function init() {
    initTheme();
    renderTools();
    setupBrowseButton();
    setupDropzone();
    setupFileInput();
    setupConvertButton();
    setupResetButton();
    setupHamburger();
    setupScrollHeader();
    setupLangToggle();
    setupFaq();
    setupToolSelection();
    setupToolLinks();
    setupThemeToggle();
    selectTool(tools[0].id);
    updateUI();
    setTimeout(initParticles, 100);
  }

  function renderTools() {
    el.toolCards.innerHTML = tools.map(t => `
      <div class="tool-card" data-tool="${t.id}">
        <div class="tool-icon">${t.icon}</div>
        <h3>${t.title[currentLang]}</h3>
        <p>${t.desc[currentLang]}</p>
        <span class="format-badge">${t.format}</span>
      </div>
    `).join('');
  }

  function setupThemeToggle() {
    if (el.themeToggle) el.themeToggle.addEventListener('click', toggleTheme);
  }

  function setupToolSelection() {
    el.toolCards.addEventListener('click', e => {
      const card = e.target.closest('.tool-card');
      if (card) selectTool(card.dataset.tool);
    });
  }

  function selectTool(id) {
    currentTool = tools.find(t => t.id === id) || tools[0];
    document.querySelectorAll('.tool-card').forEach(c => c.classList.toggle('active', c.dataset.tool === id));
    resetWorkspace();
    updateUI();
  }

  function updateUI() {
    document.documentElement.lang = currentLang;
    const title = currentTool.title[currentLang];
    document.title = `${title} - ${t('siteName')} | ${t('tagline')}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = t('seoDesc');

    el.workspaceTitle.textContent = t('workspaceTitle');
    el.workspaceInfo.innerHTML = `<span class="dot"></span> ${t('infoSecure')}`;
    el.toolTitle.innerHTML = `<span style="font-size:1.1rem;font-weight:700;color:var(--text)">${title}</span>`;
    el.toolDesc.textContent = t(currentTool.id === 'combine' ? 'dropzoneDesc' : 'dropzoneDesc') || t('dropzoneDesc');
    el.dropzoneTitle.innerHTML = `<strong>${t('dropzoneTitle')}</strong>`;
    el.dropzoneDesc.textContent = t('dropzoneDesc');
    el.fileInput.accept = currentTool.accept;
    el.fileInput.multiple = currentTool.multiple;
    el.convertBtnText.textContent = t('convert');
    el.convertBtn.disabled = selectedFiles.length === 0 || isConverting;
    if (el.themeToggle) el.themeToggle.title = document.documentElement.getAttribute('data-theme') === 'dark' ? t('light') : t('dark');

    setHtml('heroTitle', t('heroTitle'));
    setText('heroDesc', t('heroDesc'));
    setHtml('heroStat1', t('heroStat1'));
    setHtml('heroStat2', t('heroStat2'));
    setHtml('heroStat3', t('heroStat3'));
    setHtml('howTitle', t('howTitle')); setText('howDesc', t('howDesc'));
    setText('step1Title', t('step1Title')); setText('step1Desc', t('step1Desc'));
    setText('step2Title', t('step2Title')); setText('step2Desc', t('step2Desc'));
    setText('step3Title', t('step3Title')); setText('step3Desc', t('step3Desc'));
    setHtml('featuresTitle', t('featuresTitle'));
    for (let i = 1; i <= 6; i++) {
      setText('feat' + i + 'Title', t('feat' + i + 'Title'));
      setText('feat' + i + 'Desc', t('feat' + i + 'Desc'));
    }
    setHtml('faqTitle', t('faqTitle'));
    for (let i = 1; i <= 5; i++) {
      setText('faq' + i + 'q', t('faq' + i + 'q'));
      setText('faq' + i + 'a', t('faq' + i + 'a'));
    }
    setText('seoTitle', t('seoH2')); setText('seoP1', t('seoP1')); setText('seoP2', t('seoP2'));
    setText('seoH3', t('seoH3')); setText('seoP3', t('seoP3'));
    setText('seoH4', t('seoH4')); setText('seoP4', t('seoP4'));
    setText('footerDesc', t('footerDesc'));
    el.langText.textContent = t('lang');
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (i18n[currentLang][key]) el.textContent = i18n[currentLang][key];
    });

    document.querySelectorAll('.tool-card').forEach((c, i) => {
      c.querySelector('h3').textContent = tools[i].title[currentLang];
      c.querySelector('p').textContent = tools[i].desc[currentLang];
    });

    updateFileList();
  }

  function setText(id, val) { const e = $(id); if (e) e.textContent = val; }
  function setHtml(id, val) { const e = $(id); if (e) e.innerHTML = val; }

  function updateFileList() {
    if (selectedFiles.length === 0) {
      el.fileList.innerHTML = `<p style="color:var(--text-muted);font-size:.9rem;text-align:center;padding:16px;">${t('noFiles')}</p>`;
      el.convertBtn.disabled = true;
      return;
    }
    el.convertBtn.disabled = false;
    el.fileList.innerHTML = selectedFiles.map((f, i) => {
      const size = formatSize(f.size);
      return `<div class="file-item fade-in">
        <div class="file-info">
          <span class="file-icon">📄</span>
          <span class="file-name">${f.name}</span>
          <span class="file-size">(${size})</span>
        </div>
        <button class="file-remove" data-index="${i}" aria-label="Remove">✕</button>
      </div>`;
    }).join('');
    document.querySelectorAll('.file-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedFiles.splice(parseInt(btn.dataset.index), 1);
        updateFileList();
      });
    });
  }

  function formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function resetWorkspace() {
    selectedFiles = [];
    el.fileInput.value = '';
    el.progressWrap.classList.remove('active');
    el.resultWrap.classList.remove('active');
    el.progressFill.style.width = '0%';
    isConverting = false;
    updateFileList();
  }

  // ===== DROPZONE & FILES =====
  function setupBrowseButton() {
    const btn = $('browseBtn');
    if (btn) btn.addEventListener('click', e => { e.stopPropagation(); el.fileInput.click(); });
  }

  function setupDropzone() {
    ['dragenter', 'dragover'].forEach(evt => {
      el.dropzone.addEventListener(evt, e => { e.preventDefault(); el.dropzone.classList.add('dragover'); });
    });
    ['dragleave', 'drop'].forEach(evt => {
      el.dropzone.addEventListener(evt, e => { e.preventDefault(); el.dropzone.classList.remove('dragover'); });
    });
    el.dropzone.addEventListener('drop', e => handleFiles(e.dataTransfer.files));
  }

  function setupFileInput() {
    el.fileInput.addEventListener('change', () => { if (el.fileInput.files.length) handleFiles(el.fileInput.files); });
  }

  function handleFiles(fileList) {
    const files = Array.from(fileList);
    files.forEach(f => {
      const exists = selectedFiles.some(sf => sf.name === f.name && sf.size === f.size);
      if (!exists) selectedFiles.push(f);
    });
    el.fileInput.value = '';
    updateFileList();
  }

  // ===== CONVERSION =====
  function setupConvertButton() {
    el.convertBtn.addEventListener('click', startConversion);
  }

  async function startConversion() {
    if (selectedFiles.length === 0 || isConverting) return;
    isConverting = true;
    el.convertBtnText.textContent = t('converting');
    el.convertBtn.disabled = true;
    el.resultWrap.classList.remove('active');
    el.progressWrap.classList.add('active');

    try {
      const steps = selectedFiles.length + 1;
      let step = 0;
      const update = () => { step++; const p = Math.round((step / steps) * 100); el.progressFill.style.width = p + '%'; el.progressText.textContent = p + '%'; };
      update();
      const pdfBytes = await PDFConverter.convert(selectedFiles, currentTool.mode);
      update();

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      el.downloadBtn.href = url;
      el.downloadBtn.download = currentTool.id === 'combine' ? 'fusion.pdf' : (selectedFiles[0]?.name.replace(/\.[^.]+$/, '') || 'converted') + '.pdf';

      el.progressFill.style.width = '100%';
      el.progressText.textContent = '100%';
      setTimeout(() => { el.progressWrap.classList.remove('active'); el.resultWrap.classList.add('active'); }, 400);
      el.resultTitle.textContent = t('resultTitle');
      el.resultDesc.textContent = t('resultDesc');
      el.downloadBtn.innerHTML = `⬇ ${t('download')}`;
      el.downloadBtn.style.display = 'inline-flex';
    } catch (err) {
      console.error(err);
      el.progressWrap.classList.remove('active');
      el.resultWrap.classList.add('active');
      el.resultTitle.textContent = t('errorTitle');
      el.resultDesc.textContent = t('errorDesc');
      el.downloadBtn.style.display = 'none';
    }
    isConverting = false;
    el.convertBtnText.textContent = t('convert');
    el.convertBtn.disabled = false;
  }

  function setupResetButton() { el.resetBtn.addEventListener('click', resetWorkspace); }

  // ===== UI =====
  function setupHamburger() {
    el.hamburger.addEventListener('click', () => {
      el.hamburger.classList.toggle('active');
      el.nav.classList.toggle('open');
    });
    document.querySelectorAll('.nav-link').forEach(l => {
      l.addEventListener('click', () => { el.hamburger.classList.remove('active'); el.nav.classList.remove('open'); });
    });
  }

  function setupScrollHeader() {
    window.addEventListener('scroll', () => el.header.classList.toggle('scrolled', window.scrollY > 20));
  }

  function setupLangToggle() {
    el.langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'fr' ? 'en' : 'fr';
      updateUI();
    });
  }

  function setupFaq() {
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  function setupToolLinks() {
    document.querySelectorAll('[data-tool-link]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        selectTool(link.dataset.toolLink);
        document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // ===== START =====
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

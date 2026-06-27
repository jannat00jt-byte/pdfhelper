/* ============================================
   PDF-Tools - Application Logic
   ============================================ */

(function() {
  'use strict';

  const tools = [
    { id: 'combine', icon: '📄', title: { fr: 'Fusionner PDF', en: 'Merge PDF' }, desc: { fr: 'Combinez plusieurs PDF en un seul fichier', en: 'Combine multiple PDFs into one' }, accept: '.pdf', multiple: true, mode: 'combine', format: 'PDF' },
    { id: 'jpg-to-pdf', icon: '🖼️', title: { fr: 'JPG en PDF', en: 'JPG to PDF' }, desc: { fr: 'Convertissez vos images JPG en PDF', en: 'Convert JPG images to PDF' }, accept: '.jpg,.jpeg,.png,.tiff,.tif,.svg', multiple: true, mode: 'images', format: 'JPG, PNG, TIFF, SVG' },
    { id: 'png-to-pdf', icon: '🖼️', title: { fr: 'PNG en PDF', en: 'PNG to PDF' }, desc: { fr: 'Convertissez vos images PNG en PDF', en: 'Convert PNG images to PDF' }, accept: '.png,.jpg,.jpeg,.tiff,.tif,.svg', multiple: true, mode: 'images', format: 'PNG, JPG, TIFF, SVG' },
    { id: 'tiff-to-pdf', icon: '📷', title: { fr: 'TIFF en PDF', en: 'TIFF to PDF' }, desc: { fr: 'Convertissez vos fichiers TIFF en PDF', en: 'Convert TIFF files to PDF' }, accept: '.tiff,.tif,.jpg,.jpeg,.png,.svg', multiple: true, mode: 'images', format: 'TIFF, JPG, PNG, SVG' },
    { id: 'svg-to-pdf', icon: '🎨', title: { fr: 'SVG en PDF', en: 'SVG to PDF' }, desc: { fr: 'Convertissez vos fichiers SVG en PDF', en: 'Convert SVG files to PDF' }, accept: '.svg,.png,.jpg,.jpeg,.tiff,.tif', multiple: true, mode: 'images', format: 'SVG, PNG, JPG, TIFF' }
  ];

  let currentLang = document.documentElement.lang === 'en' ? 'en' : 'fr';
  let currentTool = tools[0];
  let selectedFiles = [];
  let isConverting = false;

  const elements = {
    toolCards: document.getElementById('toolCards'),
    dropzone: document.querySelector('.dropzone'),
    fileInput: document.getElementById('fileInput'),
    fileList: document.getElementById('fileList'),
    convertBtn: document.getElementById('convertBtn'),
    resetBtn: document.getElementById('resetBtn'),
    progressWrap: document.getElementById('progressWrap'),
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),
    resultWrap: document.getElementById('resultWrap'),
    downloadBtn: document.getElementById('downloadBtn'),
    workspaceTitle: document.getElementById('workspaceTitle'),
    workspaceInfo: document.getElementById('workspaceInfo'),
    toolTitle: document.getElementById('toolTitle'),
    toolDesc: document.getElementById('toolDesc'),
    dropzoneTitle: document.getElementById('dropzoneTitle'),
    dropzoneDesc: document.getElementById('dropzoneDesc'),
    hamburger: document.getElementById('hamburger'),
    nav: document.getElementById('nav'),
    header: document.getElementById('header'),
    langToggle: document.getElementById('langToggle'),
    langText: document.getElementById('langText'),
    convertBtnText: document.getElementById('convertBtnText'),
    fileName: document.getElementById('fileName'),
    fileSize: document.getElementById('fileSize'),
    resultTitle: document.getElementById('resultTitle'),
    resultDesc: document.getElementById('resultDesc')
  };

  // ===== i18n =====
  const i18n = {
    fr: {
      siteName: 'PDF Tools',
      tagline: 'Convertissez et fusionnez vos documents PDF en ligne',
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
      browse: 'Parcourir',
      convert: 'Convertir en PDF',
      converting: 'Conversion en cours...',
      reset: 'Réinitialiser',
      resultTitle: 'Conversion réussie !',
      resultDesc: 'Votre fichier PDF est prêt à être téléchargé.',
      download: 'Télécharger le PDF',
      howTitle: 'Comment ça <span class="highlight">marche</span>',
      howDesc: 'Convertissez vos fichiers en PDF en 3 étapes simples',
      step1Title: 'Sélectionnez un outil',
      step1Desc: 'Choisissez l\'outil adapté à votre besoin parmi nos 5 options.',
      step2Title: 'Ajoutez vos fichiers',
      step2Desc: 'Déposez vos fichiers ou cliquez pour les sélectionner.',
      step3Title: 'Convertissez & téléchargez',
      step3Desc: 'Obtenez votre PDF en quelques secondes, directement dans votre navigateur.',
      featuresTitle: 'Pourquoi choisir <span class="highlight">PDF Tools</span>',
      feat1Title: '100% Gratuit',
      feat1Desc: 'Tous nos outils sont totalement gratuits, sans limite de fichiers ni d\'utilisation.',
      feat2Title: 'Sécurité maximale',
      feat2Desc: 'Vos fichiers sont traités localement dans votre navigateur. Rien n\'est envoyé sur nos serveurs.',
      feat3Title: 'Aucune inscription',
      feat3Desc: 'Pas besoin de créer un compte. Utilisez nos outils immédiatement, sans aucune démarche.',
      feat4Title: 'Multi-format',
      feat4Desc: 'Supporte PDF, JPG, PNG, TIFF et SVG. Convertissez depuis et vers plusieurs formats.',
      feat5Title: 'Rapidité',
      feat5Desc: 'Conversion instantanée directement dans votre navigateur. Résultats en quelques secondes.',
      feat6Title: 'Aucune limite',
      feat6Desc: 'Convertissez autant de fichiers que vous voulez, sans limite de taille ni de nombre.',
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
      quickLinks: 'Liens rapides',
      tools: 'Outils',
      legal: 'Informations légales',
      copyright: 'Tous droits réservés.',
      privacy: 'Politique de confidentialité',
      terms: 'Conditions d\'utilisation',
      contact: 'Contact',
      lang: 'English',
      langCode: 'en',
      filesSelected: 'fichier(s) sélectionné(s)',
      noFiles: 'Aucun fichier sélectionné',
      errorTitle: 'Erreur de conversion',
      errorDesc: 'Une erreur est survenue lors de la conversion. Veuillez réessayer.',
      ad1: 'Publicité',
      seoTitle: 'Convertissez et fusionnez vos PDF en ligne - Gratuit',
      seoDesc: 'Outils PDF gratuits en ligne : fusionnez PDF, convertissez JPG, PNG, TIFF et SVG en PDF. 100% sécurisé, sans inscription, directement depuis votre navigateur.',
      seoH2: 'Convertissez tous vos documents en PDF',
      seoP1: 'PDF Tools est votre solution complète pour la conversion et la fusion de documents PDF. Que vous ayez besoin de fusionner plusieurs PDF en un seul fichier ou de convertir des images JPG, PNG, TIFF ou SVG en PDF, notre outil en ligne gratuit vous offre une solution rapide et fiable.',
      seoP2: 'Contrairement à d\'autres services, PDF Tools traite tous vos fichiers directement dans votre navigateur. Cela signifie que vos documents restent confidentiels et ne sont jamais téléchargés sur un serveur externe. La sécurité de vos données est notre priorité absolue.',
      seoH3: 'Fusion de PDF professionnelle',
      seoP3: 'Notre outil de fusion PDF vous permet de combiner plusieurs documents en un seul fichier PDF. Idéal pour regrouper des contrats, des rapports, des présentations ou tout autre document professionnel. L\'interface simple et intuitive vous permet de réorganiser vos fichiers avant la fusion.',
      seoH4: 'Conversion d\'images en PDF de haute qualité',
      seoP4: 'Convertissez vos images JPG, PNG, TIFF et SVG en PDF avec une qualité optimale. Chaque image est convertie en une page PDF distincte, conservant la résolution et les couleurs originales. Parfait pour créer des portfolios, des archives ou des présentations à partir de vos images.'
    },
    en: {
      siteName: 'PDF Tools',
      tagline: 'Convert and merge your PDF documents online',
      heroTitle: 'Convert your files to <span class="highlight">PDF</span>',
      heroSub: ' for free online',
      heroDesc: 'Merge PDFs, convert JPG, PNG, TIFF and SVG to PDF. 100% free, secure, and directly from your browser.',
      heroStat1: '<strong>50K+</strong><span>Conversions</span>',
      heroStat2: '<strong>100%</strong><span>Secure</span>',
      heroStat3: '<strong>Free</strong><span>No signup</span>',
      workspaceTitle: 'Workspace',
      infoSecure: '100% secure - your files stay on your device',
      dropzoneTitle: 'Drop your files here',
      dropzoneDesc: 'or click to browse',
      browse: 'Browse',
      convert: 'Convert to PDF',
      converting: 'Converting...',
      reset: 'Reset',
      resultTitle: 'Conversion successful!',
      resultDesc: 'Your PDF file is ready to download.',
      download: 'Download PDF',
      howTitle: 'How it <span class="highlight">works</span>',
      howDesc: 'Convert your files to PDF in 3 simple steps',
      step1Title: 'Select a tool',
      step1Desc: 'Choose the right tool for your needs from our 5 options.',
      step2Title: 'Add your files',
      step2Desc: 'Drop your files or click to browse and select them.',
      step3Title: 'Convert & download',
      step3Desc: 'Get your PDF in seconds, right in your browser.',
      featuresTitle: 'Why choose <span class="highlight">PDF Tools</span>',
      feat1Title: '100% Free',
      feat1Desc: 'All our tools are completely free, no file or usage limits.',
      feat2Title: 'Maximum security',
      feat2Desc: 'Your files are processed locally in your browser. Nothing is sent to our servers.',
      feat3Title: 'No registration',
      feat3Desc: 'No account needed. Use our tools immediately with no signup.',
      feat4Title: 'Multi-format',
      feat4Desc: 'Supports PDF, JPG, PNG, TIFF and SVG. Convert from and to multiple formats.',
      feat5Title: 'Speed',
      feat5Desc: 'Instant conversion directly in your browser. Results in seconds.',
      feat6Title: 'No limits',
      feat6Desc: 'Convert as many files as you want with no size or quantity limits.',
      faqTitle: 'Frequently asked questions',
      faq1q: 'Can I merge multiple PDFs into one file?',
      faq1a: 'Yes, absolutely! Select the "Merge PDF" tool, add all the PDF files you want to combine, then click "Convert to PDF". All your files will be merged into a single PDF document.',
      faq2q: 'Are my files secure?',
      faq2a: 'Completely. Your files are processed locally in your browser. No data is sent to any server. Once the conversion is done, your original files are removed from memory.',
      faq3q: 'Is there a file size or quantity limit?',
      faq3a: 'No, there are no limits. You can convert as many files as you want, regardless of their size. The only limit is your browser\'s memory.',
      faq4q: 'Can I convert images to PDF?',
      faq4a: 'Yes, you can convert JPG, PNG, TIFF and SVG to PDF. Simply select the corresponding tool, add your images, and get a perfect PDF.',
      faq5q: 'Is the tool really free?',
      faq5a: 'Yes, 100% free. No payment, no registration, no limits. Use our tools as much as you want.',
      footerDesc: 'Fast and secure online PDF conversion solutions. No registration required.',
      quickLinks: 'Quick Links',
      tools: 'Tools',
      legal: 'Legal',
      copyright: 'All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      contact: 'Contact',
      lang: 'Français',
      langCode: 'fr',
      filesSelected: 'file(s) selected',
      noFiles: 'No files selected',
      errorTitle: 'Conversion error',
      errorDesc: 'An error occurred during conversion. Please try again.',
      ad1: 'Advertisement',
      seoTitle: 'Convert and merge PDFs online - Free',
      seoDesc: 'Free online PDF tools: merge PDFs, convert JPG, PNG, TIFF and SVG to PDF. 100% secure, no signup, directly from your browser.',
      seoH2: 'Convert all your documents to PDF',
      seoP1: 'PDF Tools is your complete solution for PDF conversion and merging. Whether you need to merge multiple PDFs into one file or convert JPG, PNG, TIFF or SVG images to PDF, our free online tool provides a fast and reliable solution.',
      seoP2: 'Unlike other services, PDF Tools processes all your files directly in your browser. This means your documents remain confidential and are never uploaded to an external server. Your data security is our top priority.',
      seoH3: 'Professional PDF merging',
      seoP3: 'Our PDF merging tool lets you combine multiple documents into a single PDF file. Ideal for consolidating contracts, reports, presentations or any professional document. The simple and intuitive interface allows you to reorder files before merging.',
      seoH4: 'High-quality image to PDF conversion',
      seoP4: 'Convert your JPG, PNG, TIFF and SVG images to PDF with optimal quality. Each image is converted to a separate PDF page, preserving original resolution and colors. Perfect for creating portfolios, archives or image-based presentations.'
    }
  };

  function t(key) { return i18n[currentLang][key] || key; }

  function lang() { return currentLang === 'fr' ? i18n.fr : i18n.en; }

  // ===== INIT =====
  function init() {
    renderTools();
    setupToolSelection();
    setupBrowseButton();
    setupDropzone();
    setupFileInput();
    setupConvertButton();
    setupResetButton();
    setupHamburger();
    setupScrollHeader();
    setupLangToggle();
    setupFaq();
    setupToolLinks();
    setupDownload();
    selectTool(tools[0].id);
    updateUI();
  }

  function renderTools() {
    elements.toolCards.innerHTML = tools.map(t => `
      <div class="tool-card" data-tool="${t.id}">
        <div class="tool-icon">${t.icon}</div>
        <h3>${t.title[currentLang]}</h3>
        <p>${t.desc[currentLang]}</p>
        <span class="format-badge">${t.format}</span>
      </div>
    `).join('');
  }

  function setupToolSelection() {
    elements.toolCards.addEventListener('click', e => {
      const card = e.target.closest('.tool-card');
      if (!card) return;
      selectTool(card.dataset.tool);
    });
  }

  function selectTool(id) {
    currentTool = tools.find(t => t.id === id) || tools[0];
    document.querySelectorAll('.tool-card').forEach(c => c.classList.toggle('active', c.dataset.tool === id));
    resetWorkspace();
    updateUI();
  }

  function updateUI() {
    const dirs = { fr: 'ltr', en: 'ltr' };
    document.documentElement.lang = currentLang;
    document.documentElement.dir = dirs[currentLang];

    const title = currentTool.title[currentLang];
    const desc = currentTool.desc[currentLang];

    document.title = `${title} - ${t('siteName')} | ${t('tagline')}`;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = t('seoDesc');

    elements.workspaceTitle.textContent = t('workspaceTitle');
    elements.workspaceInfo.innerHTML = `<span class="dot"></span> ${t('infoSecure')}`;
    elements.toolTitle.innerHTML = title;
    elements.toolDesc.textContent = desc;
    elements.dropzoneTitle.innerHTML = `<strong>${t('dropzoneTitle')}</strong>`;
    elements.dropzoneDesc.textContent = t('dropzoneDesc');

    elements.fileInput.accept = currentTool.accept;
    elements.fileInput.multiple = currentTool.multiple;

    elements.convertBtnText.textContent = t('convert');
    elements.convertBtn.disabled = selectedFiles.length === 0 || isConverting;

    document.getElementById('heroTitle').innerHTML = t('heroTitle');
    document.getElementById('heroSub').textContent = t('heroSub');
    document.getElementById('heroDesc').innerHTML = t('heroDesc');
    document.getElementById('heroStat1').innerHTML = t('heroStat1');
    document.getElementById('heroStat2').innerHTML = t('heroStat2');
    document.getElementById('heroStat3').innerHTML = t('heroStat3');

    document.getElementById('howTitle').innerHTML = t('howTitle');
    document.getElementById('howDesc').textContent = t('howDesc');
    document.getElementById('step1Title').textContent = t('step1Title');
    document.getElementById('step1Desc').textContent = t('step1Desc');
    document.getElementById('step2Title').textContent = t('step2Title');
    document.getElementById('step2Desc').textContent = t('step2Desc');
    document.getElementById('step3Title').textContent = t('step3Title');
    document.getElementById('step3Desc').textContent = t('step3Desc');

    document.getElementById('featuresTitle').innerHTML = t('featuresTitle');
    document.getElementById('feat1Title').textContent = t('feat1Title');
    document.getElementById('feat1Desc').textContent = t('feat1Desc');
    document.getElementById('feat2Title').textContent = t('feat2Title');
    document.getElementById('feat2Desc').textContent = t('feat2Desc');
    document.getElementById('feat3Title').textContent = t('feat3Title');
    document.getElementById('feat3Desc').textContent = t('feat3Desc');
    document.getElementById('feat4Title').textContent = t('feat4Title');
    document.getElementById('feat4Desc').textContent = t('feat4Desc');
    document.getElementById('feat5Title').textContent = t('feat5Title');
    document.getElementById('feat5Desc').textContent = t('feat5Desc');
    document.getElementById('feat6Title').textContent = t('feat6Title');
    document.getElementById('feat6Desc').textContent = t('feat6Desc');

    document.getElementById('faqTitle').innerHTML = t('faqTitle');
    document.getElementById('faq1q').textContent = t('faq1q');
    document.getElementById('faq1a').textContent = t('faq1a');
    document.getElementById('faq2q').textContent = t('faq2q');
    document.getElementById('faq2a').textContent = t('faq2a');
    document.getElementById('faq3q').textContent = t('faq3q');
    document.getElementById('faq3a').textContent = t('faq3a');
    document.getElementById('faq4q').textContent = t('faq4q');
    document.getElementById('faq4a').textContent = t('faq4a');
    document.getElementById('faq5q').textContent = t('faq5q');
    document.getElementById('faq5a').textContent = t('faq5a');

    document.getElementById('seoTitle').textContent = t('seoH2');
    document.getElementById('seoP1').textContent = t('seoP1');
    document.getElementById('seoP2').textContent = t('seoP2');
    document.getElementById('seoH3').textContent = t('seoH3');
    document.getElementById('seoP3').textContent = t('seoP3');
    document.getElementById('seoH4').textContent = t('seoH4');
    document.getElementById('seoP4').textContent = t('seoP4');

    document.getElementById('footerDesc').textContent = t('footerDesc');
    document.querySelectorAll('[data-i18n="quickLinks"]').forEach(el => el.textContent = t('quickLinks'));
    document.querySelectorAll('[data-i18n="tools"]').forEach(el => el.textContent = t('tools'));
    document.querySelectorAll('[data-i18n="legal"]').forEach(el => el.textContent = t('legal'));
    document.querySelectorAll('[data-i18n="copyright"]').forEach(el => { if (!el.querySelector('span')) el.textContent = `© 2026 PDF Tools. ${t('copyright')}`; });
    document.querySelectorAll('[data-i18n="privacy"]').forEach(el => el.textContent = t('privacy'));
    document.querySelectorAll('[data-i18n="terms"]').forEach(el => el.textContent = t('terms'));
    document.querySelectorAll('[data-i18n="contact"]').forEach(el => el.textContent = t('contact'));

    elements.langText.textContent = t('lang');
    updateFileList();
  }

  function updateFileList() {
    if (selectedFiles.length === 0) {
      elements.fileList.innerHTML = `<p style="color:var(--gray-400);font-size:.9rem;text-align:center;padding:16px;">${t('noFiles')}</p>`;
      elements.convertBtn.disabled = true;
      return;
    }
    elements.convertBtn.disabled = false;
    elements.fileList.innerHTML = selectedFiles.map((f, i) => {
      const ext = f.name.split('.').pop().toUpperCase();
      const size = formatSize(f.size);
      return `
        <div class="file-item fade-in">
          <div class="file-info">
            <span class="file-icon">📄</span>
            <span class="file-name">${f.name}</span>
            <span class="file-size">(${size})</span>
          </div>
          <button class="file-remove" data-index="${i}" aria-label="Remove">✕</button>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.file-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        selectedFiles.splice(idx, 1);
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
    elements.fileInput.value = '';
    elements.progressWrap.classList.remove('active');
    elements.resultWrap.classList.remove('active');
    elements.progressFill.style.width = '0%';
    isConverting = false;
    updateFileList();
  }

  // ===== BROWSE BUTTON =====
  function setupBrowseButton() {
    const browseBtn = document.getElementById('browseBtn');
    if (browseBtn) {
      browseBtn.addEventListener('click', e => {
        e.stopPropagation();
        elements.fileInput.click();
      });
    }
  }

  // ===== DROPZONE =====
  function setupDropzone() {
    ['dragenter', 'dragover'].forEach(evt => {
      elements.dropzone.addEventListener(evt, e => {
        e.preventDefault();
        elements.dropzone.classList.add('dragover');
      });
    });
    ['dragleave', 'drop'].forEach(evt => {
      elements.dropzone.addEventListener(evt, e => {
        e.preventDefault();
        elements.dropzone.classList.remove('dragover');
      });
    });
    elements.dropzone.addEventListener('drop', e => {
      handleFiles(e.dataTransfer.files);
    });
  }

  function setupFileInput() {
    elements.fileInput.addEventListener('change', () => {
      if (elements.fileInput.files.length) {
        handleFiles(elements.fileInput.files);
      }
    });
  }

  function handleFiles(fileList) {
    const files = Array.from(fileList);
    const newFiles = [];
    files.forEach(f => {
      const exists = selectedFiles.some(sf => sf.name === f.name && sf.size === f.size);
      if (!exists) newFiles.push(f);
    });
    if (newFiles.length) {
      selectedFiles = [...selectedFiles, ...newFiles];
      updateFileList();
    }
    elements.fileInput.value = '';
  }

  // ===== CONVERT =====
  function setupConvertButton() {
    elements.convertBtn.addEventListener('click', startConversion);
  }

  async function startConversion() {
    if (selectedFiles.length === 0 || isConverting) return;

    isConverting = true;
    elements.convertBtnText.textContent = t('converting');
    elements.convertBtn.disabled = true;
    elements.resultWrap.classList.remove('active');
    elements.progressWrap.classList.add('active');

    try {
      const progressSteps = selectedFiles.length + 1;
      let currentStep = 0;

      const updateProgress = () => {
        currentStep++;
        const pct = Math.round((currentStep / progressSteps) * 100);
        elements.progressFill.style.width = pct + '%';
        elements.progressText.textContent = `${pct}%`;
      };

      updateProgress();
      const pdfBytes = await PDFConverter.convert(selectedFiles, currentTool.mode);
      updateProgress();

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      elements.downloadBtn.href = url;
      elements.downloadBtn.download = getOutputName();

      elements.progressFill.style.width = '100%';
      elements.progressText.textContent = '100%';
      setTimeout(() => {
        elements.progressWrap.classList.remove('active');
        elements.resultWrap.classList.add('active');
      }, 400);

      elements.resultTitle.textContent = t('resultTitle');
      elements.resultDesc.textContent = t('resultDesc');
      elements.downloadBtn.innerHTML = `⬇ ${t('download')}`;

    } catch (err) {
      console.error('Conversion error:', err);
      elements.progressWrap.classList.remove('active');
      elements.resultWrap.classList.add('active');
      elements.resultTitle.textContent = t('errorTitle');
      elements.resultDesc.textContent = t('errorDesc');
      elements.downloadBtn.style.display = 'none';
      setTimeout(() => {
        elements.downloadBtn.style.display = '';
      }, 100);
    }

    isConverting = false;
    elements.convertBtnText.textContent = t('convert');
    elements.convertBtn.disabled = false;
  }

  function getOutputName() {
    if (currentTool.id === 'combine') return 'fusion.pdf';
    const base = selectedFiles[0]?.name.replace(/\.[^.]+$/, '') || 'converted';
    return `${base}.pdf`;
  }

  function setupResetButton() {
    elements.resetBtn.addEventListener('click', resetWorkspace);
  }

  function setupDownload() {
    elements.downloadBtn.addEventListener('click', function() {
      setTimeout(() => {
        if (!elements.downloadBtn.href || elements.downloadBtn.href === '#') return;
        URL.revokeObjectURL(elements.downloadBtn.href);
      }, 10000);
    });
  }

  // ===== UI HELPERS =====
  function setupHamburger() {
    elements.hamburger.addEventListener('click', () => {
      elements.hamburger.classList.toggle('active');
      elements.nav.classList.toggle('open');
    });
    document.querySelectorAll('.nav-link').forEach(l => {
      l.addEventListener('click', () => {
        elements.hamburger.classList.remove('active');
        elements.nav.classList.remove('open');
      });
    });
  }

  function setupScrollHeader() {
    window.addEventListener('scroll', () => {
      elements.header.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  function setupLangToggle() {
    elements.langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'fr' ? 'en' : 'fr';
      elements.langToggle.hreflang = currentLang === 'fr' ? 'fr' : 'en';
      updateUI();
      document.querySelectorAll('.tool-card').forEach((c, i) => {
        c.querySelector('h3').textContent = tools[i].title[currentLang];
        c.querySelector('p').textContent = tools[i].desc[currentLang];
      });
      document.querySelectorAll('.tool-card').forEach((c, i) => {
        c.querySelector('h3').textContent = tools[i].title[currentLang];
        c.querySelector('p').textContent = tools[i].desc[currentLang];
      });
      elements.langToggle.setAttribute('aria-label', currentLang === 'fr' ? 'Switch to English' : 'Passer en français');
    });
  }

  function setupToolLinks() {
    document.querySelectorAll('[data-tool-link]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const toolId = link.dataset.toolLink;
        selectTool(toolId);
        document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
      });
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

  // ===== START =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

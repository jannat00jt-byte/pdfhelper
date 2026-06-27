/* ============================================
   PDF-Tools - Conversion Engine
   Client-side PDF manipulation with pdf-lib
   ============================================ */

const PDFConverter = (() => {
  let pdfLib;

  async function init() {
    if (typeof PDFLib !== 'undefined') {
      pdfLib = PDFLib;
      return;
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
      script.onload = () => { pdfLib = PDFLib; resolve(); };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function combinePDFs(files) {
    await init();
    const mergedPdf = await pdfLib.PDFDocument.create();
    for (let i = 0; i < files.length; i++) {
      const arrayBuffer = await files[i].arrayBuffer();
      const pdf = await pdfLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pageIndices = pdf.getPageIndices();
      const pages = await mergedPdf.copyPages(pdf, pageIndices);
      pages.forEach(page => mergedPdf.addPage(page));
    }
    const pdfBytes = await mergedPdf.save();
    return pdfBytes;
  }

  async function imageToPDF(file) {
    await init();
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await pdfLib.PDFDocument.create();
    let image;

    if (file.type === 'image/png' || file.name.match(/\.png$/i)) {
      image = await pdfDoc.embedPng(arrayBuffer);
    } else if (file.type === 'image/svg+xml' || file.name.match(/\.svg$/i)) {
      const pngBuffer = await svgToPngBuffer(file);
      image = await pdfDoc.embedPng(pngBuffer);
    } else {
      image = await pdfDoc.embedJpg(arrayBuffer);
    }

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }

  async function svgToPngBuffer(file) {
    const text = await file.text();
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const blob = new Blob([text], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      img.onload = () => {
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 600;
        if (canvas.width === 0) canvas.width = 800;
        if (canvas.height === 0) canvas.height = 600;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(b => {
          URL.revokeObjectURL(url);
          if (b) {
            b.arrayBuffer().then(resolve).catch(reject);
          } else {
            reject(new Error('Canvas empty'));
          }
        }, 'image/png');
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG load failed')); };
      img.src = url;
    });
  }

  async function imagesToPDF(files) {
    await init();
    const pdfDoc = await pdfLib.PDFDocument.create();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const arrayBuffer = await file.arrayBuffer();
      let image;
      if (file.type === 'image/png' || file.name.match(/\.png$/i)) {
        image = await pdfDoc.embedPng(arrayBuffer);
      } else if (file.name.match(/\.svg$/i)) {
        const pngBuffer = await svgToPngBuffer(file);
        image = await pdfDoc.embedPng(pngBuffer);
      } else {
        image = await pdfDoc.embedJpg(arrayBuffer);
      }
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }

  async function convert(files, mode) {
    switch (mode) {
      case 'combine':
        return await combinePDFs(files);
      case 'images':
        if (files.length === 1) {
          return await imageToPDF(files[0]);
        }
        return await imagesToPDF(files);
      default:
        throw new Error('Unknown mode');
    }
  }

  return { init, convert, combinePDFs, imageToPDF, imagesToPDF };
})();

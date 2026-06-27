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
      script.onerror = () => reject(new Error('Failed to load pdf-lib'));
      document.head.appendChild(script);
    });
  }

  async function combinePDFs(files) {
    await init();
    const mergedPdf = await pdfLib.PDFDocument.create();
    for (let i = 0; i < files.length; i++) {
      const arrayBuffer = await files[i].arrayBuffer();
      const pdf = await pdfLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
    }
    return await mergedPdf.save();
  }

  async function imageToPDF(file) {
    await init();
    const pdfDoc = await pdfLib.PDFDocument.create();
    let image;
    if (file.type === 'image/png' || file.name.match(/\.png$/i)) {
      image = await pdfDoc.embedPng(await file.arrayBuffer());
    } else if (file.name.match(/\.svg$/i)) {
      image = await pdfDoc.embedPng(await svgToPngBuffer(file));
    } else {
      image = await pdfDoc.embedJpg(await file.arrayBuffer());
    }
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    return await pdfDoc.save();
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
          b ? b.arrayBuffer().then(resolve).catch(reject) : reject(new Error('Canvas empty'));
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
      const f = files[i];
      let image;
      if (f.type === 'image/png' || f.name.match(/\.png$/i)) {
        image = await pdfDoc.embedPng(await f.arrayBuffer());
      } else if (f.name.match(/\.svg$/i)) {
        image = await pdfDoc.embedPng(await svgToPngBuffer(f));
      } else {
        image = await pdfDoc.embedJpg(await f.arrayBuffer());
      }
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }
    return await pdfDoc.save();
  }

  async function convert(files, mode) {
    switch (mode) {
      case 'combine': return await combinePDFs(files);
      case 'images': return files.length === 1 ? await imageToPDF(files[0]) : await imagesToPDF(files);
      default: throw new Error('Unknown mode');
    }
  }

  return { init, convert, combinePDFs, imageToPDF, imagesToPDF };
})();

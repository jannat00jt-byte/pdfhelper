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

  function isImageType(file, exts) {
    return exts.some(ext => file.name.toLowerCase().endsWith(ext));
  }

  async function fileToPngBuffer(file) {
    if (isImageType(file, ['.tif', '.tiff'])) {
      return await tiffToPngBuffer(file);
    }
    if (isImageType(file, ['.svg'])) {
      return await svgToPngBuffer(file);
    }
    return await imageFileToPngBuffer(file);
  }

  async function tiffToPngBuffer(file) {
    if (typeof UTIF === 'undefined') {
      throw new Error('TIFF decoder not loaded');
    }
    const buffer = await file.arrayBuffer();
    const ifds = UTIF.decode(new Uint8Array(buffer));
    if (!ifds || ifds.length === 0) throw new Error('Invalid TIFF file');
    UTIF.decodeImage(new Uint8Array(buffer), ifds[0]);
    const rgba = UTIF.toRGBA8(ifds[0]);
    const w = ifds[0].width;
    const h = ifds[0].height;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(w, h);
    imageData.data.set(rgba);
    ctx.putImageData(imageData, 0, 0);
    return new Promise((resolve, reject) => {
      canvas.toBlob(b => {
        if (b) resolve(b.arrayBuffer());
        else reject(new Error('TIFF canvas conversion failed'));
      }, 'image/png');
    });
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
        canvas.width = Math.max(img.naturalWidth, 1) || 800;
        canvas.height = Math.max(img.naturalHeight, 1) || 600;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(b => {
          URL.revokeObjectURL(url);
          if (b) resolve(b.arrayBuffer());
          else reject(new Error('SVG canvas empty'));
        }, 'image/png');
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG load failed')); };
      img.src = url;
    });
  }

  async function imageFileToPngBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(b => {
            if (b) resolve(b.arrayBuffer());
            else reject(new Error('Image canvas conversion failed'));
          }, 'image/png');
        };
        img.onerror = () => reject(new Error('Image load failed'));
        img.src = reader.result;
      };
      reader.onerror = () => reject(new Error('File read failed'));
      reader.readAsDataURL(file);
    });
  }

  async function imageToPDF(file) {
    await init();
    const pngBuffer = await fileToPngBuffer(file);
    const pdfDoc = await pdfLib.PDFDocument.create();
    const image = await pdfDoc.embedPng(pngBuffer);
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    return await pdfDoc.save();
  }

  async function imagesToPDF(files) {
    await init();
    const pdfDoc = await pdfLib.PDFDocument.create();
    for (let i = 0; i < files.length; i++) {
      const pngBuffer = await fileToPngBuffer(files[i]);
      const image = await pdfDoc.embedPng(pngBuffer);
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

const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const { createCanvas } = require('canvas');
const fs = require('fs');

// Node.js doesn't need workerSrc when using disableWorker: true

/**
 * Converts a PDF file into an array of base64 encoded images.
 * @param {string} filePath - Path to the PDF file.
 * @returns {Promise<string[]>} Array of base64 strings.
 */
exports.convertPdfToImages = async (filePath) => {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const loadingTask = pdfjsLib.getDocument({
    data,
    disableWorker: true,
    useSystemFonts: true,
    disableFontFace: true,
  });

  const pdf = await loadingTask.promise;
  const images = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d');

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
    
    // Use JPEG to reduce request payload size for vision models.
    const buffer = await canvas.toBuffer('image/jpeg', 75);
    images.push(buffer.toString('base64'));
  }

  return images;
};

/**
 * Converts a single image file to base64.
 * @param {string} filePath - Path to the image file.
 * @returns {string} Base64 string.
 */
exports.convertImageToBase64 = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  return fileBuffer.toString('base64');
};

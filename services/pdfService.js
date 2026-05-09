const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');
const fs = require('fs');

/**
 * Extracts text content from a PDF file using pdfjs-dist.
 */
exports.extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const uint8Array = new Uint8Array(dataBuffer);
    
    const loadingTask = pdfjs.getDocument({
      data: uint8Array,
      useSystemFonts: true,
      disableFontFace: true 
    });
    
    const pdfDocument = await loadingTask.promise;
    let fullText = '';
    const numpages = pdfDocument.numPages;

    for (let i = 1; i <= numpages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    console.info(`[pdfService] Extracted ${fullText.length} chars from ${numpages} pages.`);

    return {
      text: fullText.trim(),
      numpages
    };
  } catch (error) {
    console.error('[pdfService] Extraction Error:', error.message);
    throw new Error(`Failed to extract text: ${error.message}`);
  }
};

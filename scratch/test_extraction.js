const ocrService = require('../services/ocrService');
const fs = require('fs');

async function test() {
    try {
        console.log('Testing PDF to Image conversion...');
        const pdfFile = 'uploads/1776374901488-full-length-mock-test-04-beginners-(1).pdf';
        
        if (!fs.existsSync(pdfFile)) {
            console.log(`File not found: ${pdfFile}`);
            return;
        }

        console.log(`Using file: ${pdfFile}`);
        const images = await ocrService.convertPdfToImages(pdfFile);
        console.log(`Successfully converted. Pages extracted: ${images.length}`);
    } catch (err) {
        console.error('❌ Extraction failed in test script:', err);
    }
}

test();

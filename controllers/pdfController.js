const fs = require('fs');
const Document = require('../models/Document');
const Question = require('../models/Question');
const pdfService = require('../services/pdfService');
const aiService = require('../services/aiService');
const ocrService = require('../services/ocrService');
const promptBuilder = require('../utils/promptBuilder');

// ─── Step 1: Upload & Parse PDF ───────────────────────────────────────────────
exports.uploadPDF = async (req, res) => {
  let filePath = req.file?.path;
  const { mode } = req.body;
  const isImage = req.file?.mimetype?.startsWith('image/');
  const forceOCR = mode === 'scanned' || isImage;

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded. Ensure field name is "pdf".' });
    }

    const { originalname, mimetype } = req.file;
    let text = '';
    let numpages = 1;
    let requiresOCR = forceOCR;

    console.info(`[uploadPDF] Processing: ${originalname}, mode=${mode || 'auto'}`);

    // If not forced OCR, try standard parsing first
    if (!forceOCR && mimetype === 'application/pdf') {
      try {
        const result = await pdfService.extractTextFromPDF(filePath);
        text = result.text;
        numpages = result.numpages;
        if (!text || text.trim().length < 50) {
          requiresOCR = true;
          console.info(`[uploadPDF] Text too short, flagging for OCR.`);
        }
      } catch (err) {
        console.warn(`[uploadPDF] Standard parse failed, falling back to OCR flag: ${err.message}`);
        requiresOCR = true;
      }
    }

    // Save document record
    const document = new Document({
      userId: req.user.id,
      originalName: originalname,
      pageCount: numpages,
      extractedText: text,
      status: 'uploaded',
      requiresOCR,
      filePath: requiresOCR ? filePath : null, // Keep file only if OCR needed
      mimeType: mimetype
    });
    await document.save();

    // Clean up temp file ONLY if standard parsing was sufficient
    if (!requiresOCR && filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.status(200).json({
      success: true,
      documentId: document._id.toString(),
      pageCount: numpages,
      charCount: text.length,
      requiresOCR,
      message: requiresOCR 
        ? 'File uploaded. This appears to be a scanned document or image; AI OCR will be used during extraction.'
        : 'File uploaded and text extracted successfully.',
    });

  } catch (error) {
    console.error('[uploadPDF] Error:', error.message);
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return res.status(500).json({ success: false, message: `Upload failed: ${error.message}` });
  }
};

// ─── Debug Parse: Upload PDF and return parse preview only ─────────────────────
exports.debugParsePDF = async (req, res) => {
  let filePath = req.file?.path;
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded. Ensure field name is "pdf".' });
    }

    const { originalname } = req.file;
    console.info(`[debugParsePDF] Parsing started: ${originalname}`);
    const { text, numpages } = await pdfService.extractTextFromPDF(filePath);
    const safeText = (text || '').trim();
    const preview = safeText.substring(0, 1000);

    console.info(`[debugParsePDF] Parsing done: pages=${numpages}, chars=${safeText.length}`);

    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      fileName: originalname,
      pageCount: numpages,
      charCount: safeText.length,
      looksScanned: safeText.length < 50,
      preview,
      message: safeText.length < 50
        ? 'Very little text extracted. This file may be scanned/image-based.'
        : 'Text extraction looks healthy.'
    });
  } catch (error) {
    console.error('[debugParsePDF] Error:', error.message);
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return res.status(500).json({ success: false, message: `Debug parse failed: ${error.message}` });
  }
};


//
exports.extractQuestions = async (req, res) => {
  const { documentId, isBankQuestion = false } = req.body;

  if (!documentId) {
    return res.status(400).json({ success: false, message: 'documentId is required.' });
  }

  try {
    console.info(`[extractQuestions] Started for documentId=${documentId} (isBankQuestion=${isBankQuestion})`);
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found.' });
    }

    // Check if we have content to process
    if (!document.requiresOCR && (!document.extractedText || document.extractedText.trim().length < 50)) {
      return res.status(400).json({ success: false, message: 'Document has no text content to process.' });
    }

    if (document.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    document.status = 'processing';
    await document.save();

    let rawQuestions = [];

    // ─── Case A: AI Vision Extraction (OCR) ──────────────────────────────────
    if (document.requiresOCR && document.filePath && fs.existsSync(document.filePath)) {
      console.info(`[extractQuestions] Starting Vision extraction for ${document.originalName}`);
      let imageBase64s = [];

      if (document.mimeType === 'application/pdf') {
        imageBase64s = await ocrService.convertPdfToImages(document.filePath);
      } else {
        imageBase64s = [ocrService.convertImageToBase64(document.filePath)];
      }

      // Keep vision payloads small to avoid provider size/token limits.
      const BATCH_SIZE = 2;
      for (let i = 0; i < imageBase64s.length; i += BATCH_SIZE) {
        const batch = imageBase64s.slice(i, i + BATCH_SIZE);
        console.info(`[extractQuestions] Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(imageBase64s.length / BATCH_SIZE)}`);

        try {
          const visionMessages = promptBuilder.buildVisionExtractionPrompt(batch);
          const batchQuestions = await aiService.generateQuestionsFromVision(visionMessages);
          rawQuestions = [...rawQuestions, ...batchQuestions];
        } catch (batchError) {
          console.warn(`[extractQuestions] Batch failed, retrying page-by-page: ${batchError.message}`);
          for (const imageBase64 of batch) {
            const singleMessages = promptBuilder.buildVisionExtractionPrompt([imageBase64]);
            const singleQuestions = await aiService.generateQuestionsFromVision(singleMessages);
            rawQuestions = [...rawQuestions, ...singleQuestions];
          }
        }
      }

      // Cleanup file after successful OCR
      fs.unlinkSync(document.filePath);
      document.filePath = null;
    } 
    // ─── Case B: Standard Text Extraction ────────────────────────────────────
    else {
      console.info(`[extractQuestions] Starting standard text extraction`);
      const MAX_CHARS = 25000;
      const textChunk = document.extractedText.substring(0, MAX_CHARS);
      const messages = promptBuilder.buildExtractionPrompt(textChunk);
      rawQuestions = await aiService.generateQuestions(messages);
    }

    console.info(`[extractQuestions] AI returned ${rawQuestions.length} total question candidates`);

    if (rawQuestions.length === 0) {
      document.status = 'failed';
      await document.save();
      return res.status(400).json({ success: false, message: 'AI could not extract any questions from the provided content.' });
    }

    const questionDocs = rawQuestions.map(q => ({
      userId: req.user.id,
      documentId: document._id,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
      difficulty: ['Easy', 'Medium', 'Hard'].includes(q.difficulty) ? q.difficulty : 'Medium',
      subject: q.subject || 'General',
      topic: q.topic || 'General',
      isBankQuestion: !!isBankQuestion,
      source: document.requiresOCR ? 'AI Vision Extracted' : 'AI Text Extracted',
    }));

    const savedQuestions = await Question.insertMany(questionDocs);
    document.status = 'completed';
    await document.save();

    return res.status(200).json({
      success: true,
      count: savedQuestions.length,
      questions: savedQuestions,
      message: `Successfully extracted ${savedQuestions.length} questions.`,
    });

  } catch (error) {
    console.error('[extractQuestions] Error:', error.message);
    try {
      const doc = await Document.findById(documentId);
      if (doc) { doc.status = 'failed'; await doc.save(); }
    } catch (_) {}
    return res.status(500).json({ success: false, message: `Extraction failed: ${error.message}` });
  }
};

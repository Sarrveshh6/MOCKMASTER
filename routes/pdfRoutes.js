const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const pdfController = require('../controllers/pdfController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/upload', protect, upload.single('pdf'), pdfController.uploadPDF);
router.post('/debug-parse', protect, admin, upload.single('pdf'), pdfController.debugParsePDF);
router.post('/extract', protect, pdfController.extractQuestions);

module.exports = router;

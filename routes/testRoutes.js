const express = require('express');
const router = express.Router();
const { generateTest, generateTestByDocument, submitTest, getResult, translateQuestions } = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/generate', generateTest);
router.post('/generate-by-document', generateTestByDocument);
router.post('/submit', submitTest);
router.get('/result/:id', getResult);
router.post('/translate', translateQuestions);

module.exports = router;

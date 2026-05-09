const express = require('express');
const router = express.Router();
const { saveQuestions, getQuestions, deleteQuestion, uploadToBank } = require('../controllers/questionController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getQuestions);

router.post('/save', admin, saveQuestions);
router.post('/bank', admin, uploadToBank);

router.route('/:id')
  .delete(deleteQuestion);

module.exports = router;

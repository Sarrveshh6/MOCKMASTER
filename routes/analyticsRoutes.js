const express = require('express');
const router = express.Router();
const { getSummary, getTopics, getHistory } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/summary', getSummary);
router.get('/topics', getTopics);
router.get('/history', getHistory);

module.exports = router;

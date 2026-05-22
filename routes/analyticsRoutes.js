const express = require('express');
const router = express.Router();
const { getSummary, getTopics, getHistory, getAdminStats } = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/summary', getSummary);
router.get('/topics', getTopics);
router.get('/history', getHistory);
router.get('/admin/stats', admin, getAdminStats);

module.exports = router;

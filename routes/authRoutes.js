const express = require('express');
const { 
  register, 
  login, 
  getMe, 
  guestLogin, 
  adminLogin,
  forgotPassword,
  resetPassword 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/guest-login', guestLogin);
router.post('/admin-login', adminLogin);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;

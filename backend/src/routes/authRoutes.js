const express = require('express');
const router = express.Router();

const { login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

/**
 * Public Authentication Routes
 */
router.post('/login', login);

/**
 * Protected User Profile Routes
 */
router.get('/me', protect, getMe);

/**
 * RBAC Verification Test Routes (Used to verify role protection)
 */
router.get('/verify-admin', protect, authorize('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authorized as Admin',
    role: req.user.role
  });
});

router.get('/verify-faculty', protect, authorize('faculty', 'admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authorized as Faculty/Admin',
    role: req.user.role
  });
});

router.get('/verify-student', protect, authorize('student'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authorized as Student',
    role: req.user.role
  });
});

module.exports = router;

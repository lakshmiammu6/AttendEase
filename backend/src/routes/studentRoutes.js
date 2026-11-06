
const express = require('express');
const router = express.Router();

const {
  getStudentAnalytics,
  getMyAttendance,
  submitCorrectionRequest
} = require('../controllers/studentController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('student'));

router.get('/analytics', getStudentAnalytics);
router.get('/attendance', getMyAttendance);
router.post('/corrections', submitCorrectionRequest);

module.exports = router;

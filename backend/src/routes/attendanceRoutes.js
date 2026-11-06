
const express = require('express');
const router = express.Router();

console.log('✅ Attendance routes loaded');

const {
  getFacultyAssignments,
  getAttendanceStudents,
  markAttendance,
  getAttendanceHistory,
  getCorrectionRequests,
  reviewCorrectionRequest
} = require('../controllers/attendanceController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('faculty'));

// Faculty attendance routes
router.get('/assignments', getFacultyAssignments);
router.get('/history', getAttendanceHistory);
router.get('/corrections', getCorrectionRequests);
router.get('/students/:sectionId', getAttendanceStudents);

// Mark attendance
router.post('/mark', markAttendance);

// Approve or reject correction requests
router.patch('/corrections/:requestId/review', reviewCorrectionRequest);

module.exports = router;

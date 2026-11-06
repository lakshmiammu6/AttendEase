
const express = require('express');
const router = express.Router();

const {
  getAllFaculty,
  getAllSubjects,
  createSubject,
  createFaculty,
  getDepartments,
  getFacultyAssignmentOptions,
  assignFaculty
} = require('../controllers/adminController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Admin-only routes
router.use(protect);
router.use(authorize('admin'));

// Faculty management
router.get('/faculty', getAllFaculty);
router.post('/faculty', createFaculty);

// Subject management
router.get('/subjects', getAllSubjects);
router.post('/subjects', createSubject);

// Department management
router.get('/departments', getDepartments);

// Faculty assignment
router.get(
  '/faculty/:facultyId/assignment-options',
  getFacultyAssignmentOptions
);

router.post(
  '/faculty/:facultyId/assignments',
  assignFaculty
);

module.exports = router;

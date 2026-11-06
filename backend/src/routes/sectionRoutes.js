const express = require('express');
const router = express.Router();

const {
  getSections,
  getSectionStudents,
  getSectionStudentsByName
} = require('../controllers/sectionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All section routes are protected and accessible to Admins & Faculty
router.use(protect);
router.use(authorize('admin', 'faculty'));

router.get('/', getSections);
router.get('/:id/students', getSectionStudents);
router.get('/by-name/:name/students', getSectionStudentsByName);

module.exports = router;


const mongoose = require('mongoose');

const {
  User,
  Department,
  Subject,
  Section,
  FacultyAssignment
} = require('../models');

// ==========================================
// GET ALL FACULTY WITH ASSIGNED SUBJECTS
// ==========================================
const getAllFaculty = async (req, res, next) => {
  try {
    const facultyMembers = await User.find({
      role: 'faculty'
    })
      .select('name email isActive facultyProfile')
      .populate('facultyProfile.department', 'name code')
      .sort({ name: 1 });

    const facultyWithAssignments = await Promise.all(
      facultyMembers.map(async (faculty) => {
        const assignments = await FacultyAssignment.find({
          faculty: faculty._id,
          isActive: true
        })
          .populate('subject', 'name code')
          .populate('section', 'name semester academicYear');

        return {
          _id: faculty._id,
          name: faculty.name,
          email: faculty.email,
          isActive: faculty.isActive,
          employeeId: faculty.facultyProfile?.employeeId || '',
          designation:
            faculty.facultyProfile?.designation || 'Assistant Professor',
          department:
            faculty.facultyProfile?.department?.name || 'AIML',

          subjects: assignments
            .filter(a => a.subject)
            .map(a => ({
              name: a.subject.name,
              code: a.subject.code
            })),

          sections: [
            ...new Set(
              assignments
                .filter(a => a.section)
                .map(a => a.section.name)
            )
          ],

          assignments: assignments.map(a => ({
            _id: a._id,
            subject: a.subject,
            section: a.section,
            academicYear: a.academicYear
          }))
        };
      })
    );

    res.status(200).json({
      success: true,
      count: facultyWithAssignments.length,
      faculty: facultyWithAssignments
    });
  } catch (error) {
    next(error);
  }
};


// ==========================================
// GET ALL SUBJECTS WITH FACULTY ASSIGNMENTS
// ==========================================
const getAllSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find()
      .populate('department', 'name code')
      .sort({ semester: 1, name: 1 });

    const assignments = await FacultyAssignment.find({
      isActive: true
    })
      .populate('faculty', 'name email')
      .populate('subject', 'name code')
      .populate('section', 'name academicYear');

    const subjectsWithAssignments = subjects.map((subject) => {
      const subjectAssignments = assignments.filter(
        assignment =>
          assignment.subject &&
          assignment.subject._id.toString() === subject._id.toString()
      );

      return {
        _id: subject._id,
        name: subject.name,
        code: subject.code,
        semester: subject.semester,
        credits: subject.credits,
        department: subject.department?.name || 'AIML',
        isActive: subject.isActive,

        faculty: [
          ...new Set(
            subjectAssignments
              .filter(a => a.faculty)
              .map(a => a.faculty.name)
          )
        ].join(', ') || 'Not Assigned',

        enrolledSections: [
          ...new Set(
            subjectAssignments
              .filter(a => a.section)
              .map(a => a.section.name)
          )
        ].join(', ') || 'Not Assigned'
      };
    });

    res.status(200).json({
      success: true,
      count: subjectsWithAssignments.length,
      subjects: subjectsWithAssignments
    });
  } catch (error) {
    next(error);
  }
};


// ==========================================
// ADD NEW SUBJECT
// ==========================================
const createSubject = async (req, res, next) => {
  try {
    const {
      name,
      code,
      departmentId,
      semester,
      credits
    } = req.body;

    if (
      !name?.trim() ||
      !code?.trim() ||
      !departmentId ||
      semester === undefined ||
      semester === null ||
      semester === ''
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject name, code, department and semester.'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid department ID.'
      });
    }

    const semesterNumber = Number(semester);
    const creditsNumber =
      credits === undefined || credits === '' ? 3 : Number(credits);

    if (
      !Number.isInteger(semesterNumber) ||
      semesterNumber < 1 ||
      semesterNumber > 8
    ) {
      return res.status(400).json({
        success: false,
        message: 'Semester must be a number between 1 and 8.'
      });
    }

    if (
      !Number.isInteger(creditsNumber) ||
      creditsNumber < 1
    ) {
      return res.status(400).json({
        success: false,
        message: 'Credits must be a positive whole number.'
      });
    }

    const department = await Department.findOne({
      _id: departmentId,
      isActive: true
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found or inactive.'
      });
    }

    const normalizedCode = code.trim().toUpperCase();

    const existingSubject = await Subject.findOne({
      code: normalizedCode
    });

    if (existingSubject) {
      return res.status(409).json({
        success: false,
        message: 'Subject code already exists.'
      });
    }

    const subject = await Subject.create({
      name: name.trim(),
      code: normalizedCode,
      department: department._id,
      semester: semesterNumber,
      credits: creditsNumber,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Subject added successfully.',
      subject
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Subject code already exists.'
      });
    }

    next(error);
  }
};


// ==========================================
// ADD NEW FACULTY
// ==========================================
const createFaculty = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      employeeId,
      departmentId,
      designation
    } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !password ||
      !employeeId?.trim() ||
      !departmentId
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide name, email, password, employee ID and department.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 6 characters.'
      });
    }

    const existingEmail = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists.'
      });
    }

    const existingEmployee = await User.findOne({
      'facultyProfile.employeeId': employeeId.trim().toUpperCase()
    });

    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: 'This employee ID is already registered.'
      });
    }

    const department = await Department.findOne({
      _id: departmentId,
      isActive: true
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Selected department was not found or is inactive.'
      });
    }

    const faculty = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: 'faculty',
      isActive: true,
      facultyProfile: {
        employeeId: employeeId.trim().toUpperCase(),
        department: department._id,
        designation: designation?.trim() || 'Assistant Professor'
      }
    });

    await faculty.populate('facultyProfile.department', 'name code');

    res.status(201).json({
      success: true,
      message: 'Faculty member added successfully.',
      faculty: {
        _id: faculty._id,
        name: faculty.name,
        email: faculty.email,
        isActive: faculty.isActive,
        employeeId: faculty.facultyProfile.employeeId,
        designation: faculty.facultyProfile.designation,
        department: faculty.facultyProfile.department?.name || ''
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email or employee ID already exists.'
      });
    }

    next(error);
  }
};


// ==========================================
// GET ACTIVE DEPARTMENTS
// ==========================================
const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({
      isActive: true
    })
      .select('name code')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      departments
    });
  } catch (error) {
    next(error);
  }
};


// ==========================================
// GET FACULTY ASSIGNMENT OPTIONS
// ==========================================
const getFacultyAssignmentOptions = async (req, res, next) => {
  try {
    const { facultyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(facultyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid faculty ID.'
      });
    }

    const faculty = await User.findOne({
      _id: facultyId,
      role: 'faculty'
    });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty member not found.'
      });
    }

    const departmentId = faculty.facultyProfile?.department;

    if (!departmentId) {
      return res.status(400).json({
        success: false,
        message: 'Faculty member does not have a department assigned.'
      });
    }

    const [subjects, sections] = await Promise.all([
      Subject.find({
        department: departmentId,
        isActive: true
      })
        .select('name code semester')
        .sort({ semester: 1, name: 1 }),

      Section.find({
        department: departmentId,
        isActive: true
      })
        .select('name semester academicYear')
        .sort({ semester: 1, name: 1 })
    ]);

    res.status(200).json({
      success: true,
      subjects,
      sections
    });
  } catch (error) {
    next(error);
  }
};


// ==========================================
// ASSIGN SUBJECT AND SECTION TO FACULTY
// ==========================================
const assignFaculty = async (req, res, next) => {
  try {
    const { facultyId } = req.params;
    const { subjectId, sectionId, academicYear } = req.body;

    if (!mongoose.Types.ObjectId.isValid(facultyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid faculty ID.'
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(subjectId) ||
      !mongoose.Types.ObjectId.isValid(sectionId) ||
      !academicYear?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Please select a valid subject, section and academic year.'
      });
    }

    const faculty = await User.findOne({
      _id: facultyId,
      role: 'faculty',
      isActive: true
    });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Active faculty member not found.'
      });
    }

    const departmentId = faculty.facultyProfile?.department;

    const [subject, section] = await Promise.all([
      Subject.findOne({
        _id: subjectId,
        department: departmentId,
        isActive: true
      }),

      Section.findOne({
        _id: sectionId,
        department: departmentId,
        isActive: true
      })
    ]);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message:
          'Selected subject was not found in the faculty department.'
      });
    }

    if (!section) {
      return res.status(404).json({
        success: false,
        message:
          'Selected section was not found in the faculty department.'
      });
    }

    if (section.academicYear !== academicYear.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Academic year does not match the selected section.'
      });
    }

    const assignment = await FacultyAssignment.create({
      faculty: faculty._id,
      subject: subject._id,
      section: section._id,
      academicYear: academicYear.trim(),
      isActive: true
    });

    await assignment.populate([
      { path: 'subject', select: 'name code semester' },
      { path: 'section', select: 'name semester academicYear' },
      { path: 'faculty', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Subject and section assigned successfully.',
      assignment
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This faculty assignment already exists.'
      });
    }

    next(error);
  }
};


// ==========================================
// EXPORT FUNCTIONS
// ==========================================
module.exports = {
  getAllFaculty,
  getAllSubjects,
  createSubject,
  createFaculty,
  getDepartments,
  getFacultyAssignmentOptions,
  assignFaculty
};

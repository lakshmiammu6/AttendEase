
const {
  AttendanceSession,
  AttendanceRecord,
  FacultyAssignment,
  User,
  CorrectionRequest
} = require('../models');

// Get subjects and sections assigned to the logged-in faculty
const getFacultyAssignments = async (req, res, next) => {
  try {
    const assignments = await FacultyAssignment.find({
      faculty: req.user._id,
      isActive: true
    })
      .populate('subject', 'name code')
      .populate('section', 'name semester');

    res.status(200).json({
      success: true,
      assignments
    });
  } catch (error) {
    next(error);
  }
};

// Get students in an assigned section
const getAttendanceStudents = async (req, res, next) => {
  try {
    const { sectionId } = req.params;

    const assignment = await FacultyAssignment.findOne({
      faculty: req.user._id,
      section: sectionId,
      isActive: true
    });

    if (!assignment) {
      return res.status(403).json({
        success: false,
        message: 'You are not assigned to this section.'
      });
    }

    const students = await User.find({
      role: 'student',
      isActive: true,
      'studentProfile.section': sectionId
    })
      .select('name email studentProfile.rollNumber')
      .sort({ 'studentProfile.rollNumber': 1 });

    res.status(200).json({
      success: true,
      students
    });
  } catch (error) {
    next(error);
  }
};

// Save attendance for a class session
const markAttendance = async (req, res, next) => {
  try {
    const {
      subjectId,
      sectionId,
      date,
      timeSlot,
      attendance
    } = req.body;

    if (
      !subjectId ||
      !sectionId ||
      !date ||
      !timeSlot ||
      !Array.isArray(attendance) ||
      attendance.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject, section, date, time and attendance records.'
      });
    }

    const assignment = await FacultyAssignment.findOne({
      faculty: req.user._id,
      subject: subjectId,
      section: sectionId,
      isActive: true
    });

    if (!assignment) {
      return res.status(403).json({
        success: false,
        message: 'You are not assigned to this subject and section.'
      });
    }

    const studentIds = attendance.map(record =>
      String(record.studentId)
    );

    if (new Set(studentIds).size !== studentIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate students found in attendance.'
      });
    }

    const students = await User.find({
      _id: { $in: studentIds },
      role: 'student',
      isActive: true,
      'studentProfile.section': sectionId
    }).select('_id');

    if (students.length !== studentIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more students do not belong to this section.'
      });
    }

    const allowedStatuses = ['Present', 'Absent', 'Late'];

    for (const record of attendance) {
      if (!allowedStatuses.includes(record.status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid attendance status.'
        });
      }
    }

    const session = await AttendanceSession.create({
      faculty: req.user._id,
      subject: subjectId,
      section: sectionId,
      date: new Date(date),
      timeSlot,
      totalStudents: students.length,
      totalPresent: attendance.filter(
        r => r.status === 'Present'
      ).length,
      totalAbsent: attendance.filter(
        r => r.status === 'Absent'
      ).length,
      totalLate: attendance.filter(
        r => r.status === 'Late'
      ).length
    });

    try {
      await AttendanceRecord.insertMany(
        attendance.map(record => ({
          session: session._id,
          student: record.studentId,
          subject: subjectId,
          section: sectionId,
          date: new Date(date),
          status: record.status,
          markedBy: req.user._id,
          remarks: record.remarks || ''
        }))
      );
    } catch (error) {
      await AttendanceSession.findByIdAndDelete(session._id);
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Attendance saved successfully.',
      session
    });
  } catch (error) {
    next(error);
  }
};

// Get attendance history for the logged-in faculty
const getAttendanceHistory = async (req, res, next) => {
  try {
    const sessions = await AttendanceSession.find({
      faculty: req.user._id
    })
      .populate('subject', 'name code')
      .populate('section', 'name')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      sessions
    });
  } catch (error) {
    next(error);
  }
};

// Get correction requests for the logged-in faculty
const getCorrectionRequests = async (req, res, next) => {
  try {
    const sessions = await AttendanceSession.find({
      faculty: req.user._id
    }).select('_id');

    const sessionIds = sessions.map(session => session._id);

    const requests = await CorrectionRequest.find({
      session: { $in: sessionIds }
    })
      .populate('student', 'name email studentProfile.rollNumber')
      .populate('subject', 'name code')
      .populate('session', 'date')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests
    });
  } catch (error) {
    next(error);
  }
};

// Approve or reject a student correction request
const reviewCorrectionRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { status, facultyComment } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be Approved or Rejected.'
      });
    }

    const request = await CorrectionRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Correction request not found.'
      });
    }

    // Verify that this faculty marked the attendance session
    const session = await AttendanceSession.findOne({
      _id: request.session,
      faculty: req.user._id
    });

    if (!session) {
      return res.status(403).json({
        success: false,
        message: 'You cannot review this request.'
      });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'This request has already been reviewed.'
      });
    }

    if (status === 'Approved') {
      if (!request.requestedStatus) {
        return res.status(400).json({
          success: false,
          message: 'Requested attendance status is missing.'
        });
      }

      const record = await AttendanceRecord.findOne({
        _id: request.attendanceRecord,
        session: request.session,
        student: request.student
      });

      if (!record) {
        return res.status(404).json({
          success: false,
          message: 'Attendance record not found.'
        });
      }

      // Update the student's attendance
      record.status = request.requestedStatus;
      await record.save();

      // Recalculate session totals
      const records = await AttendanceRecord.find({
        session: request.session
      });

      session.totalStudents = records.length;
      session.totalPresent = records.filter(
        r => r.status === 'Present'
      ).length;
      session.totalAbsent = records.filter(
        r => r.status === 'Absent'
      ).length;
      session.totalLate = records.filter(
        r => r.status === 'Late'
      ).length;

      await session.save();
    }

    // Save review details
    request.status = status;
    request.reviewedBy = req.user._id;
    request.facultyComment = facultyComment || '';
    request.reviewedAt = new Date();

    await request.save();

    res.status(200).json({
      success: true,
      message: `Correction request ${status.toLowerCase()} successfully.`,
      request
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFacultyAssignments,
  getAttendanceStudents,
  markAttendance,
  getAttendanceHistory,
  getCorrectionRequests,
  reviewCorrectionRequest
};

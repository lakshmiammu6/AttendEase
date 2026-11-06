
const {
  AttendanceRecord,
  AttendanceSession,
  CorrectionRequest,
  Subject
} = require('../models');

// Get attendance analytics for the logged-in student
const getStudentAnalytics = async (req, res) => {
  try {
    const student = req.user;

    const allSubjects = await Subject.find({
      department: student.studentProfile.department,
      semester: student.studentProfile.semester
    }).select('name code');

    const records = await AttendanceRecord.find({
      student: student._id
    }).populate('subject', 'name code');

    let totalClasses = records.length;
    let present = 0;
    let absent = 0;
    let late = 0;

    const subjectMap = {};

    allSubjects.forEach((subject) => {
      subjectMap[subject._id.toString()] = {
        subject: subject.name,
        code: subject.code,
        totalClasses: 0,
        present: 0,
        absent: 0,
        late: 0
      };
    });

    records.forEach((record) => {
      const status = record.status;

      if (status === 'Present') present++;
      else if (status === 'Absent') absent++;
      else if (status === 'Late') late++;

      const subjectId = record.subject?._id?.toString();

      if (!subjectId) return;

      if (!subjectMap[subjectId]) {
        subjectMap[subjectId] = {
          subject: record.subject.name,
          code: record.subject.code,
          totalClasses: 0,
          present: 0,
          absent: 0,
          late: 0
        };
      }

      const item = subjectMap[subjectId];
      item.totalClasses++;

      if (status === 'Present') item.present++;
      else if (status === 'Absent') item.absent++;
      else if (status === 'Late') item.late++;
    });

    const attended = present + late;

    const overallPercentage = totalClasses > 0
      ? ((attended / totalClasses) * 100).toFixed(2)
      : 0;

    const subjectStats = Object.values(subjectMap).map((item) => ({
      ...item,
      attendancePercentage: item.totalClasses > 0
        ? (((item.present + item.late) / item.totalClasses) * 100).toFixed(2)
        : 0
    }));

    res.status(200).json({
      success: true,
      analytics: {
        totalClasses,
        classesAttended: attended,
        classesMissed: absent,
        lateClasses: late,
        overallPercentage,
        subjectStats
      }
    });
  } catch (error) {
    console.error('Student analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch student analytics.'
    });
  }
};

// Get attendance history for the logged-in student
const getMyAttendance = async (req, res, next) => {
  try {
    const records = await AttendanceRecord.find({
      student: req.user._id
    })
      .populate('subject', 'name code')
      .populate('session', 'date timeSlot')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      records
    });
  } catch (error) {
    next(error);
  }
};

// Submit an attendance correction request
const submitCorrectionRequest = async (req, res, next) => {
  try {
    const { attendanceRecordId, reason, requestedStatus } = req.body;

    if (!attendanceRecordId || !reason || !requestedStatus) {
      return res.status(400).json({
        success: false,
        message: 'Attendance record, reason and requested status are required.'
      });
    }

    if (!['Present', 'Absent', 'Late'].includes(requestedStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid requested attendance status.'
      });
    }

    const record = await AttendanceRecord.findOne({
      _id: attendanceRecordId,
      student: req.user._id
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found.'
      });
    }

    if (record.status === requestedStatus) {
      return res.status(400).json({
        success: false,
        message: 'Your attendance already has this status.'
      });
    }

    const existingRequest = await CorrectionRequest.findOne({
      student: req.user._id,
      attendanceRecord: record._id,
      status: 'Pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'A pending correction request already exists for this attendance.'
      });
    }

    const session = await AttendanceSession.findById(record.session);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Attendance session not found.'
      });
    }

    const correctionRequest = await CorrectionRequest.create({
      student: req.user._id,
      attendanceRecord: record._id,
      session: record.session,
      subject: record.subject,
      reason,
      requestedStatus
    });

    res.status(201).json({
      success: true,
      message: 'Correction request submitted successfully.',
      correctionRequest
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentAnalytics,
  getMyAttendance,
  submitCorrectionRequest
};

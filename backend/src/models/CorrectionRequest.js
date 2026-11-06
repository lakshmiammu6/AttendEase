
const mongoose = require('mongoose');

const correctionRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
      index: true
    },

    attendanceRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AttendanceRecord',
      required: [true, 'Attendance record reference is required']
    },

    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AttendanceSession',
      required: [true, 'Attendance session reference is required']
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject reference is required']
    },

    reason: {
      type: String,
      required: [true, 'Please explain the reason for the correction request'],
      trim: true,
      maxlength: [500, 'Reason cannot exceed 500 characters']
    },

    // Attendance status requested by the student
    requestedStatus: {
      type: String,
      enum: ['Present', 'Absent', 'Late'],
      required: true
    },

    status: {
      type: String,
      enum: {
        values: ['Pending', 'Approved', 'Rejected'],
        message: '{VALUE} is not a valid status'
      },
      default: 'Pending',
      index: true
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    facultyComment: {
      type: String,
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },

    reviewedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate pending correction requests
correctionRequestSchema.index(
  { student: 1, attendanceRecord: 1, status: 1 }
);

module.exports = mongoose.model(
  'CorrectionRequest',
  correctionRequestSchema
);

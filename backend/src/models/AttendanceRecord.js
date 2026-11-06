const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AttendanceSession',
      required: [true, 'Session reference is required'],
      index: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
      index: true
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject reference is required'],
      index: true
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: [true, 'Section reference is required']
    },
    date: {
      type: Date,
      required: [true, 'Date is required']
    },
    status: {
      type: String,
      enum: {
        values: ['Present', 'Absent', 'Late'],
        message: '{VALUE} is not a valid attendance status'
      },
      default: 'Absent'
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Marked by user reference is required']
    },
    remarks: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate attendance records for the same student in the same session
attendanceRecordSchema.index({ session: 1, student: 1 }, { unique: true });

// High performance index for student attendance percentage and shortage queries
attendanceRecordSchema.index({ student: 1, subject: 1, status: 1 });

module.exports = mongoose.model('AttendanceRecord', attendanceRecordSchema);

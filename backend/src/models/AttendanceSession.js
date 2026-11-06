const mongoose = require('mongoose');

const attendanceSessionSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Faculty reference is required']
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject reference is required']
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: [true, 'Section reference is required']
    },
    date: {
      type: Date,
      required: [true, 'Class date is required']
    },
    timeSlot: {
      type: String,
      required: [true, 'Class time slot is required (e.g. 09:00 AM - 10:00 AM)'],
      trim: true
    },
    totalStudents: {
      type: Number,
      default: 0
    },
    totalPresent: {
      type: Number,
      default: 0
    },
    totalAbsent: {
      type: Number,
      default: 0
    },
    totalLate: {
      type: Number,
      default: 0
    },
    // Integration Hook: Supports manual entry, CSV/Excel imports, or future API sync
    source: {
      type: String,
      enum: ['MANUAL', 'CSV_IMPORT', 'API_SYNC'],
      default: 'MANUAL'
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Fast lookups for timetable and session history
attendanceSessionSchema.index({ section: 1, subject: 1, date: -1 });

module.exports = mongoose.model('AttendanceSession', attendanceSessionSchema);

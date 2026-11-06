const mongoose = require('mongoose');

/**
 * AttendanceAuditLog Schema:
 * Preserves an immutable historical audit trail of every status change made
 * to an attendance record. Answers: WHO changed it, WHAT was changed,
 * WHEN was it changed, and WHY.
 */
const attendanceAuditLogSchema = new mongoose.Schema(
  {
    attendanceRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AttendanceRecord',
      required: true,
      index: true
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AttendanceSession',
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    previousStatus: {
      type: String,
      enum: ['None', 'Present', 'Absent', 'Late'],
      required: true
    },
    newStatus: {
      type: String,
      enum: ['Present', 'Absent', 'Late'],
      required: true
    },
    action: {
      type: String,
      enum: [
        'INITIAL_MARKING',
        'CORRECTION_APPROVED',
        'MANUAL_FACULTY_OVERRIDE',
        'ADMIN_OVERRIDE',
        'PORTAL_SYNC'
      ],
      required: true
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reason: {
      type: String,
      trim: true
    },
    correctionRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CorrectionRequest'
    },
    ipAddress: {
      type: String
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false } // Audit logs are append-only; never updated
  }
);

attendanceAuditLogSchema.index({ attendanceRecord: 1, createdAt: -1 });

module.exports = mongoose.model('AttendanceAuditLog', attendanceAuditLogSchema);

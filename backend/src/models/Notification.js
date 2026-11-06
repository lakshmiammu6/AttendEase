const mongoose = require('mongoose');

/**
 * Notification Schema:
 * Handles in-app alerts for students, faculty, and admins.
 * Includes built-in duplicate prevention via `dedupKey`.
 */
const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Notification recipient is required'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true
    },
    type: {
      type: String,
      enum: {
        values: ['LOW_ATTENDANCE', 'CORRECTION_STATUS', 'ASSIGNMENT', 'SYSTEM'],
        message: '{VALUE} is not a valid notification type'
      },
      required: true
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    },
    readAt: {
      type: Date
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    // Duplicate Prevention Key:
    // e.g. "LOW_ATTENDANCE_studentId_subjectId_YYYY-MM-DD" or "UNRESOLVED_LOW_ATTENDANCE_studentId_subjectId"
    // Using a sparse unique index ensures MongoDB automatically rejects duplicate alerts.
    dedupKey: {
      type: String,
      sparse: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

// High performance index for fetching a user's unread notifications
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

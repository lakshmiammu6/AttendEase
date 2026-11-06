const User = require('./User');
const Department = require('./Department');
const Section = require('./Section');
const Subject = require('./Subject');
const FacultyAssignment = require('./FacultyAssignment');
const AttendanceSession = require('./AttendanceSession');
const AttendanceRecord = require('./AttendanceRecord');
const AttendanceAuditLog = require('./AttendanceAuditLog');
const CorrectionRequest = require('./CorrectionRequest');
const Notification = require('./Notification');

module.exports = {
  User,
  Department,
  Section,
  Subject,
  FacultyAssignment,
  AttendanceSession,
  AttendanceRecord,
  AttendanceAuditLog,
  CorrectionRequest,
  Notification
};

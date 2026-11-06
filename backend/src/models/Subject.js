const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide subject name (e.g. Deep Learning)'],
      trim: true
    },
    code: {
      type: String,
      required: [true, 'Please provide unique subject code (e.g. CS601)'],
      unique: true,
      uppercase: true,
      trim: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department reference is required']
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: 1,
      max: 8
    },
    credits: {
      type: Number,
      default: 3,
      min: 1
    },
    // Integration Hook: externalCode allows synchronization with existing college portal/ERP
    externalCode: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Subject', subjectSchema);

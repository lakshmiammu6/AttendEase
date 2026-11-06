const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Do not return password by default in queries
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'faculty', 'admin'],
        message: '{VALUE} is not a valid user role'
      },
      default: 'student'
    },
    phone: {
      type: String,
      trim: true
    },
    avatar: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    },
    // Integration Hook: externalId allows mapping to existing college portal / ERP (e.g. USN / PRN)
    externalId: {
      type: String,
      trim: true,
      index: true
    },
    // Details populated only if role === 'student'
    studentProfile: {
      rollNumber: {
        type: String,
        trim: true,
        uppercase: true,
        sparse: true, // Allows null/empty for faculty & admin while staying unique for students
        unique: true
      },
      department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
      },
      section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section'
      },
      semester: {
        type: Number,
        min: 1,
        max: 8
      },
      batchYear: {
        type: String, // e.g. "2023-2027"
        trim: true
      }
    },
    // Details populated only if role === 'faculty'
    facultyProfile: {
      employeeId: {
        type: String,
        trim: true,
        uppercase: true,
        sparse: true,
        unique: true
      },
      department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
      },
      designation: {
        type: String,
        trim: true,
        default: 'Assistant Professor'
      }
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving if it has been modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to check password validity during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

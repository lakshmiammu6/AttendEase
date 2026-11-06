
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('./db');

const {
  User,
  Department,
  Section,
  Subject,
  FacultyAssignment
} = require('../models');

const seedInitialData = async () => {
  try {
    await connectDB();

    console.log('[Seed] Checking existing data...');

    // 1. Admin environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@attendease.edu';
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'College Super Admin';

    if (!adminPassword) {
      throw new Error(
        'ADMIN_INITIAL_PASSWORD is not set in your .env file!'
      );
    }

    // 2. Create AIML Department
    let aimlDept = await Department.findOne({ code: 'AIML' });

    if (!aimlDept) {
      aimlDept = await Department.create({
        name: 'Artificial Intelligence and Machine Learning',
        code: 'AIML',
        description: "Vignan's Foundation for Science, Technology & Research - Department of AIML"
      });

      console.log('Created AIML Department');
    }

    // 3. Create Sections
    const sectionNames = ['Section A', 'Section B', 'Section C'];
    const seededSections = [];

    for (const sName of sectionNames) {
      let sec = await Section.findOne({
        department: aimlDept._id,
        name: sName,
        semester: 6,
        academicYear: '2026-2027'
      });

      if (!sec) {
        sec = await Section.create({
          name: sName,
          department: aimlDept._id,
          semester: 6,
          academicYear: '2026-2027'
        });

        console.log(`Created ${sName}`);
      }

      seededSections.push(sec);
    }

    const sectionA = seededSections[0];

    // 4. Create Subjects
    const initialSubjects = [
      { name: 'Deep Learning', code: 'AIML301', credits: 4 },
      { name: 'Web Technology', code: 'AIML302', credits: 4 },
      { name: 'Computer Vision', code: 'AIML303', credits: 3 },
      { name: 'MLOps', code: 'AIML304', credits: 3 }
    ];

    const seededSubjects = [];

    for (const sub of initialSubjects) {
      let subjectDoc = await Subject.findOne({ code: sub.code });

      if (!subjectDoc) {
        subjectDoc = await Subject.create({
          name: sub.name,
          code: sub.code,
          department: aimlDept._id,
          semester: 6,
          credits: sub.credits
        });

        console.log(`Created Subject: ${sub.name}`);
      }

      seededSubjects.push(subjectDoc);
    }

    // 5. Create or Update Admin
    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      adminUser = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isActive: true
      });

      console.log('Created Admin');
    } else {
      adminUser.password = adminPassword;
      adminUser.isActive = true;
      await adminUser.save();

      console.log('Updated Admin');
    }

    // 6. Create or Update Faculty
    const facultyEmail = 'faculty@attendease.edu';

    let facultyUser = await User.findOne({ email: facultyEmail });

    if (!facultyUser) {
      facultyUser = await User.create({
        name: 'Dr. Gayatri',
        email: facultyEmail,
        password: adminPassword,
        role: 'faculty',
        isActive: true,
        facultyProfile: {
          employeeId: 'VIGNAN-AIML-001',
          department: aimlDept._id,
          designation: 'Associate Professor'
        }
      });

      console.log('Created Faculty: Dr. Gayatri');
    } else {
      facultyUser.name = 'Dr. Gayatri';
      facultyUser.isActive = true;
      await facultyUser.save();

      console.log('Updated Faculty name to Dr. Gayatri');
    }

    // 7. Assign Faculty to Subjects in Section A
    for (const sub of seededSubjects.slice(0, 2)) {
      const exists = await FacultyAssignment.findOne({
        faculty: facultyUser._id,
        subject: sub._id,
        section: sectionA._id,
        academicYear: '2026-2027'
      });

      if (!exists) {
        await FacultyAssignment.create({
          faculty: facultyUser._id,
          subject: sub._id,
          section: sectionA._id,
          academicYear: '2026-2027'
        });

        console.log(`Assigned Faculty to ${sub.name}`);
      }
    }

    // 8. Create or Update Sample Students
    const sampleStudents = [
      {
        name: 'Lakshmi',
        email: 'john@student.edu',
        roll: '231FA04001'
      },
      {
        name: 'Sarah Connor',
        email: 'sarah@student.edu',
        roll: '231FA04002'
      }
    ];

    for (const stud of sampleStudents) {
      let studentUser = await User.findOne({
        email: stud.email
      });

      if (!studentUser) {
        await User.create({
          name: stud.name,
          email: stud.email,
          password: adminPassword,
          role: 'student',
          isActive: true,
          studentProfile: {
            rollNumber: stud.roll,
            department: aimlDept._id,
            section: sectionA._id,
            semester: 6,
            batchYear: '2023-2027'
          }
        });

        console.log(`Created Student: ${stud.name}`);
      } else {
        studentUser.name = stud.name;
        studentUser.isActive = true;
        await studentUser.save();

        console.log(`Updated Student name to ${stud.name}`);
      }
    }

    console.log('Seed completed successfully!');

    process.exit(0);

  } catch (err) {
    console.error('Error during seeding:', err.message);
    process.exit(1);
  }
};

seedInitialData();

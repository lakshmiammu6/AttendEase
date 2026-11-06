const { Section, User } = require('../models');

/**
 * @desc    Get all active sections with student counts
 * @route   GET /api/sections
 * @access  Private (Admin, Faculty)
 */
const getSections = async (req, res, next) => {
  try {
    const sections = await Section.find({ isActive: true })
      .populate('department', 'name code')
      .sort({ name: 1 });

    // Calculate actual student counts for each section from MongoDB
    const sectionsWithCounts = await Promise.all(
      sections.map(async (sec) => {
        const count = await User.countDocuments({
          role: 'student',
          'studentProfile.section': sec._id
        });
        return {
          ...sec.toObject(),
          studentsCount: count
        };
      })
    );

    res.status(200).json({
      success: true,
      count: sectionsWithCounts.length,
      sections: sectionsWithCounts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get students belonging to a specific section (by Section ID) with search & pagination
 * @route   GET /api/sections/:id/students
 * @access  Private (Admin, Faculty)
 */
const getSectionStudents = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { search, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Verify section exists
    const section = await Section.findById(id).populate('department', 'name code');
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found.'
      });
    }

    // Base query for students in this section
    const query = {
      role: 'student',
      'studentProfile.section': section._id
    };

    // Add search by student name, roll number, or email
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { 'studentProfile.rollNumber': searchRegex }
      ];
    }

    const total = await User.countDocuments(query);
    const students = await User.find(query)
      .select('-password')
      .populate('studentProfile.department', 'name code')
      .populate('studentProfile.section', 'name semester')
      .sort({ 'studentProfile.rollNumber': 1, name: 1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      section: {
        _id: section._id,
        name: section.name,
        semester: section.semester,
        academicYear: section.academicYear,
        department: section.department
      },
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1
      },
      students
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get students belonging to a section by Section Name (e.g. "Section A")
 * @route   GET /api/sections/by-name/:name/students
 * @access  Private (Admin, Faculty)
 */
const getSectionStudentsByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const { search, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Normalize name e.g. "Section A"
    const section = await Section.findOne({
      name: new RegExp(`^${name.trim()}$`, 'i'),
      isActive: true
    }).populate('department', 'name code');

    if (!section) {
      return res.status(404).json({
        success: false,
        message: `Section "${name}" not found.`
      });
    }

    const query = {
      role: 'student',
      'studentProfile.section': section._id
    };

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { 'studentProfile.rollNumber': searchRegex }
      ];
    }

    const total = await User.countDocuments(query);
    const students = await User.find(query)
      .select('-password')
      .populate('studentProfile.department', 'name code')
      .populate('studentProfile.section', 'name semester')
      .sort({ 'studentProfile.rollNumber': 1, name: 1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      section: {
        _id: section._id,
        name: section.name,
        semester: section.semester,
        academicYear: section.academicYear,
        department: section.department
      },
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1
      },
      students
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSections,
  getSectionStudents,
  getSectionStudentsByName
};

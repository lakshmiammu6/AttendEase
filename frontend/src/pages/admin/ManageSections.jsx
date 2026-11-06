import React, { useState, useEffect, useCallback } from 'react';
import {
  Layers,
  PlusCircle,
  Users,
  Search,
  CheckCircle2,
  Calendar,
  X,
  Mail,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Inbox,
  AlertCircle
} from 'lucide-react';
import { sectionService } from '../../services/sectionService';

// Fallback academic meta for Vignan University AIML sections
const defaultSectionMetadata = {
  'Section A': {
    classIncharge: 'Dr. Alan Turing',
    classRepresentative: 'Rahul Varma (231FA04001)',
    room: 'AB-301 (Aryabhata Block)'
  },
  'Section B': {
    classIncharge: 'Dr. Grace Hopper',
    classRepresentative: 'Sneha Reddy (231FA04043)',
    room: 'AB-302 (Aryabhata Block)'
  },
  'Section C': {
    classIncharge: 'Prof. John McCarthy',
    classRepresentative: 'Karthik Krishna (231FA04085)',
    room: 'AB-303 (Aryabhata Block)'
  }
};

const ManageSections = () => {
  const [sections, setSections] = useState([
    { _id: '1', name: 'Section A', semester: 6, academicYear: '2026-2027', studentsCount: 0 },
    { _id: '2', name: 'Section B', semester: 6, academicYear: '2026-2027', studentsCount: 0 },
    { _id: '3', name: 'Section C', semester: 6, academicYear: '2026-2027', studentsCount: 0 }
  ]);
  const [activeSection, setActiveSection] = useState('Section A');
  const [students, setStudents] = useState([]);
  const [loadingSections, setLoadingSections] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Search & Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [newSection, setNewSection] = useState({
    name: '',
    semester: '6',
    year: '3rd Year',
    academicYear: '2026-2027',
    classIncharge: 'Dr. Alan Turing',
    room: 'AB-304'
  });

  // 1. Fetch sections and live counts from MongoDB backend
  const fetchSections = useCallback(async () => {
    try {
      setLoadingSections(true);
      setErrorMsg('');
      const data = await sectionService.getSections();

      if (data.success && data.sections && data.sections.length > 0) {
        setSections(data.sections);
        // Ensure active section exists in list
        const exists = data.sections.some((s) => s.name === activeSection);
        if (!exists && data.sections[0]) {
          setActiveSection(data.sections[0].name);
        }
      }
    } catch (err) {
      console.warn('[ManageSections] Could not load dynamic sections, using defaults:', err.message);
    } finally {
      setLoadingSections(false);
    }
  }, [activeSection]);

  useEffect(() => {
    fetchSections();
  }, []);

  // 2. Fetch actual student records for the active section from MongoDB
  const fetchStudents = useCallback(async () => {
    try {
      setLoadingStudents(true);
      setErrorMsg('');

      // Find matching section in current state
      const currentSec = sections.find((s) => s.name === activeSection);

      let data;
      if (currentSec && currentSec._id && currentSec._id.length > 5) {
        data = await sectionService.getSectionStudents(currentSec._id, {
          search: searchTerm,
          page,
          limit
        });
      } else {
        data = await sectionService.getSectionStudentsByName(activeSection, {
          search: searchTerm,
          page,
          limit
        });
      }

      if (data.success) {
        setStudents(data.students || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error('[ManageSections] Error fetching students:', err.message);
      setStudents([]);
      setErrorMsg(err.response?.data?.message || 'Failed to load students for this section.');
    } finally {
      setLoadingStudents(false);
    }
  }, [activeSection, sections, searchTerm, page, limit]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Handle Section Change
  const handleSelectSection = (sectionName) => {
    if (sectionName !== activeSection) {
      setActiveSection(sectionName);
      setPage(1); // Reset to page 1
      setSearchTerm(''); // Clear search on section switch
    }
  };

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleAddSection = (e) => {
    e.preventDefault();
    if (!newSection.name.trim()) return;

    const created = {
      _id: Date.now().toString(),
      name: newSection.name.trim(),
      semester: parseInt(newSection.semester, 10),
      academicYear: newSection.academicYear,
      studentsCount: 0
    };

    setSections((prev) => [...prev, created]);
    setIsModalOpen(false);
    setAlertMsg(`Section "${created.name}" created for 3rd Year AIML!`);
    setNewSection({
      name: '',
      semester: '6',
      year: '3rd Year',
      academicYear: '2026-2027',
      classIncharge: 'Dr. Alan Turing',
      room: 'AB-304'
    });
    setTimeout(() => setAlertMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-purple-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-brand-950/20 border border-purple-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-200 bg-white/10 px-2.5 py-0.5 rounded border border-white/15">
                VIGNAN UNIVERSITY
              </span>
              <span className="text-xs text-purple-200 font-semibold">
                AIML 3rd Year &bull; Cohorts
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">Sections Management</h2>
            <p className="text-xs sm:text-sm text-purple-200 mt-1">
              Live student rosters directly synchronized from MongoDB database.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-brand-950 font-bold text-xs shadow-md hover:bg-purple-50 transition border border-white"
          >
            <PlusCircle className="w-4 h-4 text-brand-700" />
            <span>Create New Section</span>
          </button>
        </div>
      </div>

      {/* Alert Banners */}
      {alertMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{alertMsg}</span>
          </div>
          <button onClick={() => setAlertMsg('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-red-700 hover:text-red-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Section Summary Cards (Live counts from MongoDB) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {sections.map((sec) => {
          const meta = defaultSectionMetadata[sec.name] || {
            classIncharge: 'Assigned Faculty',
            classRepresentative: 'Pending Election',
            room: 'Aryabhata Block'
          };
          const isSelected = activeSection === sec.name;

          return (
            <div
              key={sec.name}
              onClick={() => handleSelectSection(sec.name)}
              className={`cursor-pointer p-5 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-purple-50/70 border-brand-500 shadow-md ring-2 ring-brand-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs font-black uppercase px-2.5 py-1 rounded-md border ${
                    isSelected
                      ? 'bg-brand-700 text-white border-brand-700 shadow-sm shadow-brand-700/20'
                      : 'bg-brand-100/80 text-brand-800 border-brand-200'
                  }`}
                >
                  {sec.name}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Sem {sec.semester || 6} &bull; 3rd Year
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-800 mb-1">
                {sec.studentsCount !== undefined ? sec.studentsCount : 0} Enrolled
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Active students registered in MongoDB
              </p>

              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Incharge:</span>
                  <strong className="text-slate-800">{meta.classIncharge}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Classroom:</span>
                  <strong className="text-slate-800">{meta.room}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Roster Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Header & Search Filter */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                {activeSection}
              </span>
              <h3 className="text-base font-bold text-slate-800">Student Roster</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing live records from MongoDB database for {activeSection}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name or reg no..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-8 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Table Content */}
        {loadingStudents ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-500">
              Fetching student records for {activeSection} from MongoDB...
            </p>
          </div>
        ) : students.length === 0 ? (
          /* Empty State (Requirements 7 & 8) */
          <div className="py-16 px-4 text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-brand-600 flex items-center justify-center mx-auto mb-3 border border-purple-100">
              <Inbox className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-800">
              No Students Enrolled in {activeSection}
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {searchTerm
                ? `No student records match "${searchTerm}" in ${activeSection}.`
                : `There are currently no registered student records in ${activeSection} in the database. When students are enrolled in this section, their details will display here.`}
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setPage(1);
                }}
                className="mt-4 px-3.5 py-1.5 text-xs font-semibold text-brand-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        ) : (
          /* Complete Student List */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Reg No.</th>
                  <th className="py-3 px-6">Full Name</th>
                  <th className="py-3 px-6">Email Address</th>
                  <th className="py-3 px-6">Department &amp; Term</th>
                  <th className="py-3 px-6">Enrolled Section</th>
                  <th className="py-3 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {students.map((student) => {
                  const regNo =
                    student.studentProfile?.rollNumber ||
                    student.externalId ||
                    'N/A';
                  const deptCode =
                    student.studentProfile?.department?.code || 'AIML';
                  const sem = student.studentProfile?.semester || 6;
                  const secName =
                    student.studentProfile?.section?.name || activeSection;

                  return (
                    <tr key={student._id} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 px-6 font-mono text-xs font-bold text-brand-800">
                        {regNo}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-800 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-brand-50 border border-brand-200 text-brand-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{student.name}</span>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 font-mono">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{student.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600">
                        {deptCode} &bull; Sem {sem} (3rd Year)
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-purple-50 text-brand-800 border border-purple-200">
                          {secName}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {student.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar (Requirement 6) */}
        {!loadingStudents && pagination.total > 0 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing{' '}
              <strong className="text-slate-800">
                {(pagination.page - 1) * pagination.limit + 1}
              </strong>{' '}
              to{' '}
              <strong className="text-slate-800">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </strong>{' '}
              of <strong className="text-slate-800">{pagination.total}</strong> registered students
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <span className="px-2 font-semibold text-slate-700">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium transition"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Section Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Create New Cohort Section</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSection} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Section Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Section D"
                  value={newSection.name}
                  onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Semester
                  </label>
                  <select
                    value={newSection.semester}
                    onChange={(e) => setNewSection({ ...newSection, semester: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="5">Semester 5</option>
                    <option value="6">Semester 6</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={newSection.academicYear}
                    onChange={(e) => setNewSection({ ...newSection, academicYear: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Class Incharge Faculty
                </label>
                <select
                  value={newSection.classIncharge}
                  onChange={(e) => setNewSection({ ...newSection, classIncharge: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="Dr. Alan Turing">Dr. Alan Turing</option>
                  <option value="Dr. Grace Hopper">Dr. Grace Hopper</option>
                  <option value="Prof. John McCarthy">Prof. John McCarthy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Assigned Lecture Hall / Room
                </label>
                <input
                  type="text"
                  placeholder="e.g. AB-304"
                  value={newSection.room}
                  onChange={(e) => setNewSection({ ...newSection, room: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 rounded-xl shadow-md transition"
                >
                  Create Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSections;

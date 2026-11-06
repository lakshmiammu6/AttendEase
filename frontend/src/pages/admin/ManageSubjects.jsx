
import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  GraduationCap
} from 'lucide-react';

import api from '../../services/api';

const ManageSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [departmentId, setDepartmentId] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('All');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [alertMsg, setAlertMsg] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    semester: '6',
    credits: '3'
  });

  // Fetch subjects
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/admin/subjects');

      if (response.data.success) {
        setSubjects(response.data.subjects || []);
      } else {
        setError('Unable to load subjects.');
      }
    } catch (err) {
      console.error('Fetch subjects error:', err);
      setError(
        err.response?.data?.message ||
        'Failed to load subjects.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch AIML department ID
  const fetchDepartment = async () => {
    try {
      const response = await api.get('/admin/departments');

      if (response.data.success) {
        const departments = response.data.departments || [];

        const aimlDepartment = departments.find(
          department =>
            department.code?.toUpperCase() === 'AIML' ||
            department.name?.toLowerCase().includes('aiml')
        );

        if (aimlDepartment) {
          setDepartmentId(aimlDepartment._id);
        } else {
          setError('AIML department was not found.');
        }
      }
    } catch (err) {
      console.error('Fetch department error:', err);
      setError(
        err.response?.data?.message ||
        'Failed to load department.'
      );
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchDepartment();
  }, []);

  // Input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add subject to MongoDB
  const handleAddSubject = async (e) => {
    e.preventDefault();

    if (!departmentId) {
      setError('AIML department ID is not available.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setAlertMsg('');

      const response = await api.post('/admin/subjects', {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        departmentId,
        semester: Number(formData.semester),
        credits: Number(formData.credits)
      });

      if (response.data.success) {
        setAlertMsg('Subject added successfully!');

        setFormData({
          name: '',
          code: '',
          semester: '6',
          credits: '3'
        });

        setIsModalOpen(false);

        await fetchSubjects();
      }
    } catch (err) {
      console.error('Add subject error:', err);

      setError(
        err.response?.data?.message ||
        'Failed to add subject. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  // Search and filter
  const filteredSubjects = subjects.filter(sub => {
    const name = (sub.name || '').toLowerCase();
    const code = (sub.code || '').toLowerCase();

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      code.includes(searchTerm.toLowerCase());

    const matchesSemester =
      selectedSemester === 'All' ||
      String(sub.semester) === selectedSemester;

    return matchesSearch && matchesSemester;
  });

  const totalCredits = subjects.reduce(
    (sum, subject) => sum + Number(subject.credits || 0),
    0
  );

  const activeSubjects = subjects.filter(
    subject => subject.isActive
  ).length;

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-purple-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-200 bg-white/10 px-2.5 py-0.5 rounded">
                VIGNAN UNIVERSITY
              </span>

              <span className="text-xs text-purple-200 font-semibold">
                Dept. of AIML • Curriculum
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black">
              Manage Subjects
            </h2>

            <p className="text-xs sm:text-sm text-purple-200 mt-1">
              Manage course details, credits, faculty assignments and sections.
            </p>
          </div>

          <div className="flex gap-2">

            <button
              onClick={fetchSubjects}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 border border-white/20"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <button
              onClick={() => {
                setError('');
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-brand-950 font-bold text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              Add New Subject
            </button>

          </div>
        </div>
      </div>

      {/* Success Message */}
      {alertMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {alertMsg}
          </div>

          <button onClick={() => setAlertMsg('')}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>

          <button onClick={() => setError('')}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">
            Total Subjects
          </span>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {subjects.length}
          </p>
          <span className="text-[11px] text-slate-500">
            MongoDB records
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">
            Total Credits
          </span>
          <p className="text-2xl font-bold text-brand-700 mt-1">
            {totalCredits} Credits
          </p>
          <span className="text-[11px] text-slate-500">
            All subjects
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">
            Active Courses
          </span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {activeSubjects}
          </p>
          <span className="text-[11px] text-slate-500">
            Currently active
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">
            Department
          </span>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            AIML
          </p>
          <span className="text-[11px] text-slate-500">
            VIGNAN UNIVERSITY
          </span>
        </div>

      </div>

      {/* Subjects Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

            <input
              type="text"
              placeholder="Search by subject name or code..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />

            <span className="text-xs font-semibold text-slate-600">
              Semester:
            </span>

            <select
              value={selectedSemester}
              onChange={e => setSelectedSemester(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white"
            >
              <option value="All">All Semesters</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">

            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b">
              <tr>
                <th className="py-3 px-6">Subject Code & Name</th>
                <th className="py-3 px-6">Semester</th>
                <th className="py-3 px-6">Credits</th>
                <th className="py-3 px-6">Assigned Faculty</th>
                <th className="py-3 px-6">Enrolled Sections</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium">

              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400">
                    Loading subjects from database...
                  </td>
                </tr>
              ) : filteredSubjects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10">
                    <GraduationCap className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-500">
                      No subjects found
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try changing your search or semester filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSubjects.map(sub => (
                  <tr key={sub._id} className="hover:bg-slate-50/70 transition">

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-brand-700 flex items-center justify-center">
                          <BookOpen className="w-4 h-4" />
                        </div>

                        <div>
                          <div className="font-bold text-slate-800">
                            {sub.name}
                          </div>
                          <span className="text-[11px] font-mono text-brand-700 font-semibold">
                            {sub.code}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      Semester {sub.semester}
                    </td>

                    <td className="py-4 px-6">
                      {sub.credits} Credits
                    </td>

                    <td className="py-4 px-6 font-semibold text-slate-700">
                      {sub.faculty || 'Not Assigned'}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {(sub.enrolledSections || 'Not Assigned')
                          .split(', ')
                          .map(section => (
                            <span
                              key={section}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {section}
                            </span>
                          ))}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          sub.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                      >
                        {sub.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* Add Subject Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">

          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border">

            <div className="flex items-center justify-between pb-4 border-b">
              <h3 className="text-base font-bold text-slate-800">
                Add New Academic Subject
              </h3>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubject} className="space-y-4 mt-4">

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Subject Name
                </label>

                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Natural Language Processing"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Subject Code
                  </label>

                  <input
                    type="text"
                    required
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="e.g. AIML305"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Credits
                  </label>

                  <input
                    type="number"
                    required
                    min="1"
                    max="6"
                    name="credits"
                    value={formData.credits}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>

              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Semester
                </label>

                <select
                  required
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl"
                >
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                  <option value="7">Semester 7</option>
                  <option value="8">Semester 8</option>
                </select>
              </div>

              <p className="text-xs text-slate-500">
                New subjects will be saved to the AIML department in MongoDB.
              </p>

              <div className="pt-3 flex items-center justify-end gap-2 border-t">

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || !departmentId}
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 rounded-xl disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Subject'}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageSubjects;

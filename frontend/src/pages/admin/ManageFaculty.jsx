
import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Mail,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  X,
  UserPlus
} from 'lucide-react';
import api from '../../services/api';
import FacultyAssignmentModal from './FacultyAssignmentModal';

const initialForm = {
  name: '',
  email: '',
  password: '',
  employeeId: '',
  departmentId: '',
  designation: 'Assistant Professor'
};

const ManageFaculty = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const [formData, setFormData] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [departmentLoading, setDepartmentLoading] = useState(false);

  // Fetch faculty members
  const fetchFaculty = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/admin/faculty');
      const facultyData = response.data.faculty || [];

      const formattedFaculty = facultyData.map((faculty) => ({
        id: faculty._id,
        name: faculty.name || 'Unnamed Faculty',
        employeeId: faculty.employeeId || 'Not Assigned',
        email: faculty.email || 'No Email',
        designation: faculty.designation || 'Assistant Professor',
        department: faculty.department || 'AIML',
        subjects: (faculty.subjects || []).map((subject) =>
          `${subject.name} (${subject.code})`
        ),
        sections: (faculty.sections || []).map((section) =>
          section.toLowerCase().startsWith('section')
            ? section
            : `Section ${section}`
        ),
        status: faculty.isActive ? 'Active' : 'Inactive'
      }));

      setFacultyList(formattedFaculty);
    } catch (err) {
      console.error('Faculty fetch error:', err);
      setError(
        err.response?.data?.message ||
        'Unable to load faculty members. Please check your connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      setDepartmentLoading(true);
      const response = await api.get('/admin/departments');
      setDepartments(response.data.departments || []);
    } catch (err) {
      console.error('Department fetch error:', err);
      setFormError(
        err.response?.data?.message || 'Unable to load departments.'
      );
    } finally {
      setDepartmentLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
    fetchDepartments();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setFormError('');
    setFormSuccess('');
  };

  // Add faculty member
  const handleAddFaculty = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setFormError('');
      setFormSuccess('');

      const response = await api.post('/admin/faculty', formData);

      setFormSuccess(
        response.data.message || 'Faculty added successfully.'
      );

      setFormData(initialForm);
      await fetchFaculty();

      setTimeout(() => {
        setShowAddForm(false);
        setFormSuccess('');
      }, 1000);
    } catch (err) {
      console.error('Add faculty error:', err);
      setFormError(
        err.response?.data?.message ||
        'Unable to add faculty member. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Close Add Faculty form
  const closeAddForm = () => {
    if (submitting) return;

    setShowAddForm(false);
    setFormData(initialForm);
    setFormError('');
    setFormSuccess('');
  };

  // Search faculty
  const filteredFaculty = facultyList.filter((faculty) => {
    const search = searchTerm.toLowerCase();

    return (
      faculty.name.toLowerCase().includes(search) ||
      faculty.employeeId.toLowerCase().includes(search) ||
      faculty.email.toLowerCase().includes(search)
    );
  });

  // Statistics
  const totalFaculty = facultyList.length;

  const totalSubjectMappings = facultyList.reduce(
    (total, faculty) => total + faculty.subjects.length,
    0
  );

  const allSections = [
    ...new Set(facultyList.flatMap((faculty) => faculty.sections))
  ];

  const activeFaculty = facultyList.filter(
    (faculty) => faculty.status === 'Active'
  ).length;

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
                AIML Academic Faculty
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black">
              Manage Faculty
            </h2>

            <p className="text-xs sm:text-sm text-purple-200 mt-1">
              View and manage faculty members, subjects and sections.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setShowAddForm(true);
                setFormError('');
                setFormSuccess('');
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500 text-white font-bold text-xs shadow-md hover:bg-purple-600 transition"
            >
              <Plus className="w-4 h-4" />
              Add Faculty
            </button>

            <button
              onClick={fetchFaculty}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-brand-950 font-bold text-xs shadow-md hover:bg-purple-50 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </div>

          <button onClick={fetchFaculty} className="underline font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">
            Total Faculty
          </span>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {loading ? '...' : totalFaculty}
          </p>
          <span className="text-[11px] text-slate-500">
            Department of AIML
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">
            Subject Mappings
          </span>
          <p className="text-2xl font-bold text-brand-700 mt-1">
            {loading ? '...' : totalSubjectMappings}
          </p>
          <span className="text-[11px] text-slate-500">
            Total assigned subjects
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">
            Sections Covered
          </span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {loading ? '...' : allSections.length}
          </p>
          <span className="text-[11px] text-slate-500">
            {loading
              ? 'Loading...'
              : allSections.join(', ') || 'No sections assigned'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-400">
            Active Faculty
          </span>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            {loading ? '...' : activeFaculty}
          </p>
          <span className="text-[11px] text-slate-500">
            Currently active accounts
          </span>
        </div>

      </div>

      {/* Faculty Directory */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

            <input
              type="text"
              placeholder="Search by name, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <span className="text-xs font-semibold text-brand-800 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            {loading ? 'Loading...' : `${filteredFaculty.length} Instructors Listed`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">

            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-6">Faculty Name &amp; ID</th>
                <th className="py-3 px-6">Designation</th>
                <th className="py-3 px-6">Assigned Subjects</th>
                <th className="py-3 px-6">Assigned Sections</th>
                <th className="py-3 px-6">Contact Email</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium">

              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading faculty members...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-red-500">
                    Unable to load faculty data.
                  </td>
                </tr>
              ) : filteredFaculty.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    {facultyList.length === 0
                      ? 'No faculty members found in the database.'
                      : 'No faculty members match your search.'}
                  </td>
                </tr>
              ) : (
                filteredFaculty.map((faculty) => (
                  <tr key={faculty.id} className="hover:bg-slate-50/70 transition">

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-100 text-brand-800 font-bold flex items-center justify-center text-sm border border-purple-200">
                          {faculty.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <div className="font-bold text-slate-800">
                            {faculty.name}
                          </div>
                          <span className="text-[11px] font-mono text-brand-700 font-semibold">
                            {faculty.employeeId}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-700 font-semibold">
                      {faculty.designation}
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {faculty.subjects.length > 0 ? (
                          faculty.subjects.map((subject) => (
                            <span
                              key={subject}
                              className="inline-block mr-1 mb-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200"
                            >
                              {subject}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">
                            No subjects assigned
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {faculty.sections.length > 0 ? (
                          faculty.sections.map((section) => (
                            <span
                              key={section}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {section}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">
                            No sections assigned
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{faculty.email}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
                          faculty.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {faculty.status}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedFaculty(faculty)}
                        className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold hover:bg-purple-100 whitespace-nowrap"
                      >
                        Assign Subjects
                      </button>
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* Add Faculty Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Add New Faculty
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter the faculty member's details.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeAddForm}
                disabled={submitting}
                className="p-2 rounded-lg hover:bg-slate-200 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFaculty} className="p-5 space-y-4">

              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
                  {formSuccess}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter faculty name"
                  required
                  maxLength={100}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="faculty@vignan.ac.in"
                  required
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Employee ID *
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  placeholder="e.g. VIGNAN-AIML-002"
                  required
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Initial Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  required
                  autoComplete="new-password"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Department *
                </label>
                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleInputChange}
                  required
                  disabled={departmentLoading}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">
                    {departmentLoading
                      ? 'Loading departments...'
                      : 'Select Department'}
                  </option>

                  {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.name} ({department.code})
                    </option>
                  ))}
                </select>

                {!departmentLoading && departments.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    No active departments found.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Designation
                </label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Professor">Professor</option>
                  <option value="Head of Department">Head of Department</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeAddForm}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    departmentLoading ||
                    departments.length === 0
                  }
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-purple-700 text-white text-sm font-bold hover:bg-purple-800 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add Faculty
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Faculty Assignment Modal */}
      {selectedFaculty && (
        <FacultyAssignmentModal
          faculty={selectedFaculty}
          onClose={() => setSelectedFaculty(null)}
          onAssigned={fetchFaculty}
        />
      )}

    </div>
  );
};

export default ManageFaculty;

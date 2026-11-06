
import React, { useEffect, useState } from 'react';
import { X, BookOpen, RefreshCw, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

const FacultyAssignmentModal = ({ faculty, onClose, onAssigned }) => {
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjectId, setSubjectId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await api.get(
          `/admin/faculty/${faculty.id}/assignment-options`
        );

        setSubjects(response.data.subjects || []);
        setSections(response.data.sections || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Unable to load subjects and sections.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [faculty.id]);

  const selectedSection = sections.find(
    section => section._id === sectionId
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subjectId || !sectionId) {
      setError('Please select both subject and section.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      await api.post(
        `/admin/faculty/${faculty.id}/assignments`,
        {
          subjectId,
          sectionId,
          academicYear: selectedSection.academicYear
        }
      );

      setSuccess('Subject and section assigned successfully!');

      await onAssigned();

      setTimeout(onClose, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to assign subject. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

        <div className="flex items-center justify-between p-5 border-b bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Assign Subjects
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Faculty: {faculty.name}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={submitting}
            className="p-2 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
              {success}
            </div>
          )}

          {loading ? (
            <div className="py-8 text-center text-slate-500">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
              Loading AIML subjects and sections...
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Subject *
                </label>

                <select
                  value={subjectId}
                  onChange={e => setSubjectId(e.target.value)}
                  required
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="">Choose a subject</option>

                  {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name} ({subject.code}) - Semester {subject.semester}
                    </option>
                  ))}
                </select>

                {subjects.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    No active AIML subjects found.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Section *
                </label>

                <select
                  value={sectionId}
                  onChange={e => setSectionId(e.target.value)}
                  required
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="">Choose a section</option>

                  {sections.map(section => (
                    <option key={section._id} value={section._id}>
                      {section.name} - Semester {section.semester} ({section.academicYear})
                    </option>
                  ))}
                </select>

                {sections.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    No active AIML sections found.
                  </p>
                )}
              </div>

              {selectedSection && (
                <div className="p-3 bg-purple-50 rounded-lg text-sm text-purple-800">
                  Academic Year: <strong>{selectedSection.academicYear}</strong>
                </div>
              )}
            </>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-lg border text-sm font-bold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                submitting ||
                subjects.length === 0 ||
                sections.length === 0
              }
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-700 text-white text-sm font-bold hover:bg-purple-800 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  Assign Subject
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default FacultyAssignmentModal;


import React, { useEffect, useState } from 'react';
import { attendanceService } from '../../services/attendanceService';

const MarkAttendance = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(
    new Date().toLocaleDateString('en-CA')
  );
  const [timeSlot, setTimeSlot] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const result = await attendanceService.getAssignments();
        setAssignments(result.assignments || []);
      } catch (error) {
        setMessage(
          error.response?.data?.message || 'Unable to load assigned subjects.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, []);

  const handleAssignmentChange = async (assignmentId) => {
    setSelectedAssignment(assignmentId);
    setStudents([]);
    setAttendance({});
    setMessage('');

    if (!assignmentId) return;

    const assignment = assignments.find(
      (item) => item._id === assignmentId
    );

    try {
      const result = await attendanceService.getStudents(
        assignment.section._id
      );

      setStudents(result.students || []);

      const initialAttendance = {};
      (result.students || []).forEach((student) => {
        initialAttendance[student._id] = 'Present';
      });

      setAttendance(initialAttendance);
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Unable to load students.'
      );
    }
  };

  const updateStatus = (studentId, status) => {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: status
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedAssignment || students.length === 0 || !timeSlot.trim()) {
      setMessage('Please select a subject, students and class time.');
      return;
    }

    const assignment = assignments.find(
      (item) => item._id === selectedAssignment
    );

    setSaving(true);
    setMessage('');

    try {
      await attendanceService.markAttendance({
        subjectId: assignment.subject._id,
        sectionId: assignment.section._id,
        date,
        timeSlot,
        attendance: students.map((student) => ({
          studentId: student._id,
          status: attendance[student._id]
        }))
      });

      setMessage('Attendance saved successfully!');
      setStudents([]);
      setAttendance({});
      setSelectedAssignment('');
      setTimeSlot('');
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to save attendance.'
      );
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(attendance).filter(
    (status) => status === 'Present'
  ).length;

  const absentCount = Object.values(attendance).filter(
    (status) => status === 'Absent'
  ).length;

  const lateCount = Object.values(attendance).filter(
    (status) => status === 'Late'
  ).length;

  if (loading) {
    return <p className="p-6">Loading assigned subjects...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Mark Attendance
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Select your assigned subject and record student attendance.
        </p>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-purple-50 text-purple-800 text-sm">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Subject and Section
            </label>

            <select
              value={selectedAssignment}
              onChange={(e) => handleAssignmentChange(e.target.value)}
              className="w-full border rounded-lg p-3"
              required
            >
              <option value="">Select assigned subject</option>
              {assignments.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.subject?.name} - {item.section?.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Class Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border rounded-lg p-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Class Time
              </label>
              <input
                type="text"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                placeholder="09:00 AM - 10:00 AM"
                className="w-full border rounded-lg p-3"
                required
              />
            </div>
          </div>
        </div>

        {students.length > 0 && (
          <div className="bg-white border rounded-xl p-5">
            <div className="flex flex-wrap justify-between gap-3 mb-5">
              <h2 className="font-bold text-lg">Student Attendance</h2>
              <span className="text-sm text-slate-500">
                Total: {students.length}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 mb-5 text-sm font-semibold">
              <span className="text-green-700">Present: {presentCount}</span>
              <span className="text-red-600">Absent: {absentCount}</span>
              <span className="text-amber-600">Late: {lateCount}</span>
            </div>

            <div className="space-y-3">
              {students.map((student, index) => (
                <div
                  key={student._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {index + 1}. {student.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {student.studentProfile?.rollNumber || student.email}
                    </p>
                  </div>

                  <select
                    value={attendance[student._id] || 'Present'}
                    onChange={(e) =>
                      updateStatus(student._id, e.target.value)
                    }
                    className="border rounded-lg p-2 text-sm"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                  </select>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Submit Attendance'}
            </button>
          </div>
        )}

        {assignments.length === 0 && (
          <p className="text-amber-700 bg-amber-50 p-4 rounded-lg">
            No subjects have been assigned to this faculty account yet.
          </p>
        )}
      </form>
    </div>
  );
};

export default MarkAttendance;

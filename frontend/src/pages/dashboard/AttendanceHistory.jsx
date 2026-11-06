import React, { useEffect, useState } from 'react';
import api from '../../services/api';

function AttendanceHistory() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/attendance/history');
        setSessions(response.data.sessions || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Unable to load attendance history.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <p>Loading attendance history...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-700">
        Attendance History
      </h1>
      <p className="text-gray-500 mb-6">
        View your previously marked attendance sessions.
      </p>

      {error && (
        <p className="text-red-600 mb-4">{error}</p>
      )}

      {!error && sessions.length === 0 && (
        <p className="text-gray-600">
          No attendance records found.
        </p>
      )}

      {sessions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-purple-100 text-left">
                <th className="p-3">Date</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Section</th>
                <th className="p-3">Total Students</th>
                <th className="p-3">Present</th>
                <th className="p-3">Absent</th>
                <th className="p-3">Late</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session._id} className="border-b">
                  <td className="p-3">
                    {new Date(session.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {session.subject?.name || '—'}
                  </td>
                  <td className="p-3">
                    {session.section?.name || '—'}
                  </td>
                  <td className="p-3">{session.totalStudents}</td>
                  <td className="p-3">{session.totalPresent}</td>
                  <td className="p-3">{session.totalAbsent}</td>
                  <td className="p-3">{session.totalLate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AttendanceHistory;
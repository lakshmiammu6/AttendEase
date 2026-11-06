
import React, { useEffect, useState } from 'react';
import api from '../../services/api';

function StudentAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/students/analytics');
        setAnalytics(response.data.analytics);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Unable to load student analytics.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-6">Loading your analytics...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!analytics) {
    return <div className="p-6">No analytics available.</div>;
  }

  const subjects = analytics.subjectStats || [];

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold text-purple-700 mb-2">
        Student Analytics
      </h1>

      <p className="text-gray-500 mb-6">
        View your attendance performance and academic statistics.
      </p>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white shadow rounded-xl p-5">
          <h2 className="text-gray-500">Overall Attendance</h2>
          <p className="text-3xl font-bold text-purple-700 mt-3">
            {Number(analytics.overallPercentage || 0).toFixed(2)}%
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-5">
          <h2 className="text-gray-500">Classes Attended</h2>
          <p className="text-3xl font-bold text-green-600 mt-3">
            {analytics.classesAttended || 0}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-5">
          <h2 className="text-gray-500">Classes Missed</h2>
          <p className="text-3xl font-bold text-red-600 mt-3">
            {analytics.classesMissed || 0}
          </p>
        </div>

      </div>

      {/* Subject-wise Attendance */}
      <div className="bg-white shadow rounded-xl p-6 mt-6">

        <h2 className="text-lg font-semibold text-purple-700 mb-4">
          Subject-wise Attendance
        </h2>

        {subjects.length === 0 ? (
          <p className="text-gray-500">
            No attendance records are available yet.
          </p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="bg-purple-100">
                  <th className="p-3">Subject</th>
                  <th className="p-3">Total Classes</th>
                  <th className="p-3">Attended</th>
                  <th className="p-3">Absent</th>
                  <th className="p-3">Attendance %</th>
                </tr>
              </thead>

              <tbody>
                {subjects.map((subject, index) => {

                  const total = Number(subject.totalClasses || 0);
                  const attended =
                    Number(subject.present || 0) +
                    Number(subject.late || 0);
                  const absent = Number(subject.absent || 0);

                  const notMarked = total === 0;

                  const percentage = notMarked
                    ? null
                    : Number(
                        ((attended / total) * 100).toFixed(2)
                      );

                  return (
                    <tr
                      key={subject.code || index}
                      className="border-b hover:bg-purple-50 transition"
                    >

                      <td className="p-3 font-medium text-gray-800">
                        {subject.subject}
                        {subject.code && (
                          <span className="block text-xs text-gray-400">
                            {subject.code}
                          </span>
                        )}
                      </td>

                      <td className="p-3">{total}</td>

                      <td className="p-3 text-green-600 font-medium">
                        {attended}
                      </td>

                      <td className="p-3 text-red-600 font-medium">
                        {absent}
                      </td>

                      <td className="p-3">
                        {notMarked ? (
                          <span className="text-slate-500 font-medium">
                            Not Yet Marked
                          </span>
                        ) : (
                          <span className={`font-semibold ${
                            percentage < 75
                              ? 'text-red-600'
                              : 'text-green-600'
                          }`}>
                            {percentage.toFixed(2)}%
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>

          </div>
        )}

        <p className="text-xs text-gray-400 mt-4">
          Subjects with zero recorded classes are displayed as Not Yet Marked.
        </p>

      </div>

    </div>
  );
}

export default StudentAnalytics;

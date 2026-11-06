
import React, { useEffect, useState } from 'react';
import api from '../../services/api';

function StudentCorrectionRequests() {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState('');
  const [requestedStatus, setRequestedStatus] = useState('Present');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchAttendance = async () => {
    try {
      const response = await api.get('/students/attendance');
      setRecords(response.data.records || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load your attendance records.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const submitRequest = async (e) => {
    e.preventDefault();

    if (!selectedRecord || !reason.trim()) {
      setError('Please select an attendance record and enter a reason.');
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/students/corrections', {
        attendanceRecordId: selectedRecord,
        requestedStatus,
        reason: reason.trim()
      });

      setMessage(
        response.data.message || 'Correction request submitted successfully.'
      );

      setSelectedRecord('');
      setRequestedStatus('Present');
      setReason('');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to submit correction request.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading your attendance records...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-2">
        Attendance Correction Request
      </h1>

      <p className="text-gray-500 mb-6">
        Found an error in your attendance? Submit a request to your faculty.
      </p>

      {error && (
        <p className="text-red-600 bg-red-50 p-3 rounded mb-4">
          {error}
        </p>
      )}

      {message && (
        <p className="text-green-700 bg-green-50 p-3 rounded mb-4">
          {message}
        </p>
      )}

      {records.length === 0 ? (
        <p className="text-gray-600">
          No attendance records are available for correction.
        </p>
      ) : (
        <form
          onSubmit={submitRequest}
          className="bg-white shadow rounded-xl p-6 max-w-2xl"
        >
          <label className="block font-medium mb-2">
            Select Attendance Record
          </label>

          <select
            value={selectedRecord}
            onChange={(e) => setSelectedRecord(e.target.value)}
            className="w-full border rounded-lg p-3 mb-5"
            required
          >
            <option value="">Choose a record</option>

            {records.map((record) => (
              <option key={record._id} value={record._id}>
                {record.subject?.name || 'Subject'} -{' '}
                {record.date
                  ? new Date(record.date).toLocaleDateString()
                  : 'Date unavailable'}{' '}
                - Current: {record.status}
              </option>
            ))}
          </select>

          <label className="block font-medium mb-2">
            Correct Attendance Status
          </label>

          <select
            value={requestedStatus}
            onChange={(e) => setRequestedStatus(e.target.value)}
            className="w-full border rounded-lg p-3 mb-5"
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>

          <label className="block font-medium mb-2">
            Reason for Correction
          </label>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why your attendance needs correction..."
            maxLength={500}
            rows={4}
            className="w-full border rounded-lg p-3 mb-5"
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Correction Request'}
          </button>
        </form>
      )}
    </div>
  );
}

export default StudentCorrectionRequests;


import React, { useEffect, useState } from 'react';
import api from '../../services/api';

function CorrectionRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchRequests = async () => {
    try {
      const response = await api.get('/attendance/corrections');
      setRequests(response.data.requests || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load correction requests.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const reviewRequest = async (requestId, status) => {
    try {
      setError('');
      setMessage('');

      await api.patch(
        `/attendance/corrections/${requestId}/review`,
        {
          status,
          facultyComment: status === 'Approved'
            ? 'Correction approved.'
            : 'Correction rejected.'
        }
      );

      setMessage(`Request ${status.toLowerCase()} successfully.`);
      await fetchRequests();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to review this request.'
      );
    }
  };

  if (loading) {
    return <p className="p-6">Loading correction requests...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-700">
        Attendance Correction Requests
      </h1>

      <p className="text-gray-500 mb-6">
        Review and manage student attendance correction requests.
      </p>

      {error && (
        <p className="text-red-600 mb-4">{error}</p>
      )}

      {message && (
        <p className="text-green-600 mb-4">{message}</p>
      )}

      {requests.length === 0 ? (
        <p className="text-gray-600">
          No correction requests found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-purple-100 text-left">
                <th className="p-3">Student</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Date</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Requested Status</th>
                <th className="p-3">Current Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => (
                <tr key={request._id} className="border-b">
                  <td className="p-3">
                    {request.student?.name || '—'}
                  </td>

                  <td className="p-3">
                    {request.subject?.name || '—'}
                  </td>

                  <td className="p-3">
                    {request.session?.date
                      ? new Date(request.session.date).toLocaleDateString()
                      : '—'}
                  </td>

                  <td className="p-3">
                    {request.reason || '—'}
                  </td>

                  <td className="p-3">
                    {request.requestedStatus || 'Not specified'}
                  </td>

                  <td className="p-3">
                    {request.status}
                  </td>

                  <td className="p-3">
                    {request.status === 'Pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => reviewRequest(request._id, 'Approved')}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => reviewRequest(request._id, 'Rejected')}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span>Reviewed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CorrectionRequests;

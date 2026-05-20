import { useState, useEffect } from 'react';
import { getContactSubmissions, deleteContactSubmission, markSubmissionAsRead } from '../services/firebaseService';

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const data = await getContactSubmissions();
      setSubmissions(data);
    } catch (err) {
      setError('Failed to load submissions: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (submissionId) => {
    try {
      await markSubmissionAsRead(submissionId);
      await loadSubmissions();
    } catch (err) {
      setError('Failed to mark as read: ' + err.message);
    }
  };

  const handleDeleteSubmission = async (submissionId) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await deleteContactSubmission(submissionId);
        setSuccess('Submission deleted successfully!');
        await loadSubmissions();
      } catch (err) {
        setError('Failed to delete submission: ' + err.message);
      }
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filter === 'unread') return !sub.read;
    if (filter === 'read') return sub.read;
    return true;
  });

  const unreadCount = submissions.filter(sub => !sub.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Contact Submissions</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            All ({submissions.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'unread' 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'read' 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            Read ({submissions.length - unreadCount})
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-400 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 border border-green-400 text-green-400 p-4 rounded-lg">
          {success}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-400">Loading submissions...</div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="text-center text-gray-400 py-8">No {filter !== 'all' ? filter : ''} submissions</div>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <div 
              key={submission.id} 
              className={`border rounded-lg p-6 transition ${
                submission.read 
                  ? 'bg-slate-800/30 border-slate-600' 
                  : 'bg-slate-800/50 border-blue-400/30'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-blue-400">{submission.subject}</h3>
                  <p className="text-gray-400 text-sm">From: {submission.email}</p>
                  <p className="text-gray-400 text-sm">Name: {submission.name}</p>
                  {submission.phone && <p className="text-gray-400 text-sm">Phone: {submission.phone}</p>}
                </div>
                <div className="flex gap-2">
                  {!submission.read && (
                    <button
                      onClick={() => handleMarkAsRead(submission.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-semibold text-sm transition"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteSubmission(submission.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded font-semibold text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="bg-slate-900/50 p-4 rounded">
                <p className="text-gray-300 whitespace-pre-wrap">{submission.message}</p>
              </div>
              <p className="text-gray-500 text-xs mt-4">
                {new Date(submission.createdAt.toDate?.() || submission.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

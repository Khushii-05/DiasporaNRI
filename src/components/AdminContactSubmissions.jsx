import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';
import { deleteContactSubmission, getContactSubmissions, updateContactRead } from '../services/contactService';

export default function AdminContactSubmissions() {
  const { currentUser } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    loadSubmissions();
  }, [currentUser]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      if (!currentUser) {
        setSubmissions([]);
        return;
      }

      const token = await currentUser.getIdToken();
      const data = await getContactSubmissions(token);
      const normalized = data.map(item => ({
        id: item.id || item._id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        subject: item.subject,
        message: item.message,
        read: item.read,
        createdAt: item.createdAt,
        media: item.media
          ? {
              name: item.media.name,
              type: item.media.type,
              size: item.media.size,
              fileUrl: item.media.fileUrl,
              fileKey: item.media.fileKey
            }
          : null
      }));
      setSubmissions(normalized);
    } catch (err) {
      setError('Failed to load submissions: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (submissionId, currentRead) => {
    try {
      const token = await currentUser.getIdToken();
      await updateContactRead(submissionId, !currentRead, token);
      setSuccess(`Marked as ${!currentRead ? 'read' : 'unread'}!`);
      await loadSubmissions();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to update submission: ' + err.message);
    }
  };

  const handleDelete = async (submissionId) => {
    if (window.confirm('Delete this submission permanently? This action cannot be undone.')) {
      try {
        const token = await currentUser.getIdToken();
        await deleteContactSubmission(submissionId, token);
        setSuccess('Submission deleted successfully!');
        await loadSubmissions();
        setTimeout(() => setSuccess(''), 2000);
      } catch (err) {
        setError('Failed to delete submission: ' + err.message);
      }
    }
  };

  const getFilteredSubmissions = () => {
    if (filter === 'unread') return submissions.filter(s => !s.read);
    if (filter === 'read') return submissions.filter(s => s.read);
    return submissions;
  };

  const isImageFile = (filename) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const ext = filename?.toLowerCase().split('.').pop() || '';
    return imageExtensions.includes(ext);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredSubmissions = getFilteredSubmissions();
  const unreadCount = submissions.filter(s => !s.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Icon name="email" className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-white">Contact Submissions</h2>
        </div>
        <div className="text-sm text-gray-400">
          Total: <span className="text-white font-bold">{submissions.length}</span>
          {unreadCount > 0 && (
            <>
              {' '} • Unread: <span className="text-red-400 font-bold">{unreadCount}</span>
            </>
          )}
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

      {/* Filter Buttons */}
      <div className="flex gap-3">
        {[
          { id: 'all', label: 'All', iconName: 'list' },
          { id: 'unread', label: 'Unread', iconName: 'bell' },
          { id: 'read', label: 'Read', iconName: 'check' }
        ].map(btn => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
              filter === btn.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            <Icon name={btn.iconName} className="w-5 h-5" />
            {btn.label}
          </button>
        ))}
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading submissions...</div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">
            {filter === 'all' ? 'No submissions yet' : `No ${filter} submissions`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map(submission => (
            <div
              key={submission.id}
              className={`border rounded-lg overflow-hidden transition ${
                submission.read
                  ? 'bg-slate-800/30 border-slate-700/50'
                  : 'bg-slate-800/50 border-blue-400/50'
              }`}
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
                className="w-full p-6 text-left hover:bg-slate-700/20 transition flex justify-between items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {!submission.read && (
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    )}
                    <h3 className="text-lg font-bold text-white">{submission.name}</h3>
                    {submission.media && (
                      <span className="text-xs bg-purple-600/50 text-purple-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <Icon name="attachment" className="w-4 h-4" />
                        Has attachment
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {submission.email}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{submission.subject}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(submission.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(submission.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </button>

              {/* Expanded Content */}
              {expandedId === submission.id && (
                <div className="px-6 pb-6 border-t border-slate-700">
                  {/* Message */}
                  <div className="mt-4">
                    <h4 className="text-gray-400 font-semibold mb-2">Message:</h4>
                    <p className="text-gray-300 bg-slate-900/50 p-4 rounded-lg whitespace-pre-wrap">
                      {submission.message}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <a
                        href={`mailto:${submission.email}`}
                        className="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        {submission.email}
                      </a>
                    </div>
                    {submission.phone && (
                      <div>
                        <p className="text-gray-400 text-sm">Phone</p>
                        <a
                          href={`tel:${submission.phone}`}
                          className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                          {submission.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Media Info */}
                  {submission.media && (
                    <div className="mt-6">
                      <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                            <Icon name="attachment" className="w-5 h-5" />
                            Attachment
                          </div>
                          {submission.media.fileUrl && (
                            <a
                              href={submission.media.fileUrl}
                              download={submission.media.name}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition flex items-center gap-1"
                            >
                              <Icon name="download" className="w-4 h-4" />
                              Download
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mb-1">{submission.media.name}</p>
                        <p className="text-xs text-gray-500 mb-3">
                          {submission.media.type} • {formatFileSize(submission.media.size)}
                        </p>

                        {/* Image Preview */}
                        {isImageFile(submission.media.name) && submission.media.fileUrl && (
                          <div className="mt-3">
                            <img
                              src={submission.media.fileUrl}
                              alt={submission.media.name}
                              className="max-w-xs max-h-64 rounded-lg object-cover border border-slate-600"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => handleMarkAsRead(submission.id, submission.read)}
                      className={`flex-1 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                        submission.read
                          ? 'bg-gray-600 hover:bg-gray-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      <Icon name={submission.read ? 'restore' : 'check'} className="w-5 h-5" />
                      {submission.read ? 'Mark Unread' : 'Mark Read'}
                    </button>
                    <button
                      onClick={() => handleDelete(submission.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                    >
                      <Icon name="delete" className="w-5 h-5" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

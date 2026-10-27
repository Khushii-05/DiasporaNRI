import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';
import {
  createAnnouncement,
  deleteAnnouncement,
  getAdminAnnouncements
} from '../services/announcementService';

export default function AdminAnnouncementManager() {
  const { currentUser } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!currentUser) return undefined;
    let cancelled = false;

    const load = async () => {
      try {
        const token = await currentUser.getIdToken();
        const items = await getAdminAnnouncements(token);
        if (!cancelled) setAnnouncements(items);
      } catch (loadError) {
        if (!cancelled) setError(loadError.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!text.trim() || !currentUser) return;

    try {
      setSubmitting(true);
      setError('');
      const token = await currentUser.getIdToken();
      const announcement = await createAnnouncement(text.trim(), token);
      setAnnouncements((items) => [announcement, ...items]);
      setText('');
      setSuccess('Announcement added');
      setTimeout(() => setSuccess(''), 2500);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!currentUser || !window.confirm('Delete this announcement?')) return;
    try {
      setError('');
      const token = await currentUser.getIdToken();
      await deleteAnnouncement(id, token);
      setAnnouncements((items) => items.filter((item) => item._id !== id));
      setSuccess('Announcement deleted');
      setTimeout(() => setSuccess(''), 2500);
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-3">
          <Icon name="bell" className="h-8 w-8 text-cyan-400" />
          <h2 className="text-3xl font-bold text-white">Announcements</h2>
        </div>
        <p className="text-gray-400">Manage the messages shown in the scrolling announcement bar.</p>
      </div>

      {error && <div className="rounded-lg border border-red-400 bg-red-500/20 p-4 text-red-400">{error}</div>}
      {success && <div className="rounded-lg border border-green-400 bg-green-500/20 p-4 text-green-400">{success}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={text}
          maxLength={240}
          onChange={(event) => setText(event.target.value)}
          placeholder="e.g. Trusted support for NRIs across India"
          className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={submitting || !text.trim()}
          className="flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="plus" className="h-5 w-5" />
          {submitting ? 'Adding...' : 'Add Announcement'}
        </button>
      </form>

      <div className="space-y-3">
        {loading ? (
          <p className="text-gray-400">Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p className="text-gray-400">No announcements added yet. The default message is shown publicly.</p>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement._id} className="flex items-start justify-between gap-4 rounded-lg border border-slate-700 bg-slate-900/60 p-4">
              <p className="text-gray-200">{announcement.text}</p>
              <button
                type="button"
                onClick={() => handleDelete(announcement._id)}
                className="flex flex-none items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <Icon name="delete" className="h-4 w-4" />
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

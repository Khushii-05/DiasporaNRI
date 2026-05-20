import { useState, useEffect } from 'react';
import { getMedia, addMedia, deleteMedia, updateMedia } from '../services/firebaseService';

export default function MediaManager() {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'news' // news, image, video, podcast
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load media on mount
  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const data = await getMedia();
      setMediaItems(data);
    } catch (err) {
      setError('Failed to load media: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedia = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title) {
      setError('Title is required');
      return;
    }

    try {
      await addMedia(formData, selectedFile);
      setSuccess('Media added successfully!');
      setFormData({ title: '', description: '', type: 'news' });
      setSelectedFile(null);
      setShowForm(false);
      await loadMedia();
    } catch (err) {
      setError('Failed to add media: ' + err.message);
    }
  };

  const handleDeleteMedia = async (mediaId, fileUrl) => {
    if (window.confirm('Are you sure you want to delete this media?')) {
      try {
        await deleteMedia(mediaId, fileUrl);
        setSuccess('Media deleted successfully!');
        await loadMedia();
      } catch (err) {
        setError('Failed to delete media: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Media Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          {showForm ? 'Cancel' : 'Add Media'}
        </button>
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

      {/* Add Media Form */}
      {showForm && (
        <div className="bg-slate-800/50 border border-blue-400/30 p-6 rounded-lg">
          <form onSubmit={handleAddMedia} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter media title"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 focus:border-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter media description"
                rows="4"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 focus:border-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 focus:border-blue-400 focus:outline-none"
              >
                <option value="news">News</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="podcast">Podcast</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Upload File</label>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition"
            >
              Add Media
            </button>
          </form>
        </div>
      )}

      {/* Media List */}
      {loading ? (
        <div className="text-center text-gray-400">Loading media...</div>
      ) : mediaItems.length === 0 ? (
        <div className="text-center text-gray-400 py-8">No media found. Add your first media item!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item) => (
            <div key={item.id} className="bg-slate-800/50 border border-blue-400/30 rounded-lg overflow-hidden hover:border-blue-400/60 transition">
              {item.fileUrl && (
                <div className="h-40 bg-slate-900 overflow-hidden flex items-center justify-center">
                  {item.type === 'image' ? (
                    <img src={item.fileUrl} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <p className="text-sm font-semibold">{item.type.toUpperCase()}</p>
                    </div>
                  )}
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold text-blue-400 mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteMedia(item.id, item.fileUrl)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded font-semibold text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

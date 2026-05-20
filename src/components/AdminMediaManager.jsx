import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';
import { addMedia, deleteMedia, getMedia } from '../services/mediaService';

export default function AdminMediaManager() {
  const { currentUser } = useAuth();
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'image'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('File size must be less than 10MB');
        return;
      }

      setMediaFile(file);
      setError('');

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setMediaPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setMediaPreview('');
      }
    }
  };

  const handleRemoveFile = () => {
    setMediaFile(null);
    setMediaPreview('');
    const fileInput = document.querySelector('#media-file-input');
    if (fileInput) fileInput.value = '';
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMedia = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    setLoadingSubmit(true);

    try {
      if (!currentUser) {
        setError('You must be logged in to add media');
        return;
      }

      const token = await currentUser.getIdToken();
      await addMedia(formData, mediaFile, token);
      setSuccess('Media added successfully!');
      setFormData({ title: '', description: '', type: 'image' });
      setMediaFile(null);
      setMediaPreview('');
      setShowForm(false);
      await loadMedia();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add media: ' + err.message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    if (window.confirm('Delete this media? This action cannot be undone.')) {
      try {
        if (!currentUser) {
          setError('You must be logged in to delete media');
          return;
        }

        const token = await currentUser.getIdToken();
        await deleteMedia(mediaId, token);
        setSuccess('Media deleted successfully!');
        await loadMedia();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete media: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Icon name="media" className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-white">Media Management</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2"
        >
          <Icon name={showForm ? 'close' : 'plus'} className="w-5 h-5" />
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
        <div className="bg-slate-800/50 border border-blue-400/30 p-8 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-6">Add New Media</h3>
          <form onSubmit={handleAddMedia} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="e.g., Company Launch Event, News Article"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 focus:border-blue-400 focus:outline-none transition"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Describe the media content..."
                rows="4"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 focus:border-blue-400 focus:outline-none transition resize-none"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleFormChange}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 focus:border-blue-400 focus:outline-none transition"
              >
                <option value="image">📷 Image</option>
                <option value="news">📰 News Article</option>
                <option value="video">🎥 Video</option>
                <option value="article">📄 Article</option>
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Upload File/Image</label>
              {mediaFile ? (
                <div className="bg-slate-700/30 border border-blue-400/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {mediaPreview ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-600 flex items-center justify-center">
                          <Icon name="attachment" className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-white truncate">{mediaFile.name}</p>
                        <p className="text-xs text-gray-400">{(mediaFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-red-400 hover:text-red-300 font-semibold transition flex items-center gap-1"
                    >
                      <Icon name="close" className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-blue-400/30 rounded-lg p-6 text-center hover:border-blue-400/60 transition cursor-pointer">
                  <input
                    type="file"
                    id="media-file-input"
                    onChange={handleFileChange}
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    className="hidden"
                  />
                  <label htmlFor="media-file-input" className="cursor-pointer">
                    <div className="text-3xl mb-2">📤</div>
                    <p className="text-sm font-medium text-gray-300 mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">Images, Videos, PDFs (Max 10MB)</p>
                  </label>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loadingSubmit}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Icon name="save" className="w-5 h-5" />
              {loadingSubmit ? 'Uploading...' : 'Add Media'}
            </button>
          </form>
        </div>
      )}

      {/* Media List */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading media...</div>
      ) : mediaItems.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No media yet. Click "Add Media" to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mediaItems.map(item => (
            <div key={item.id} className="bg-slate-800/50 border border-blue-400/30 p-6 rounded-lg hover:border-blue-400/60 transition">
              {item.fileUrl && item.type === 'image' && (
                <div className="h-40 bg-slate-900 rounded-lg mb-4 overflow-hidden">
                  <img src={item.fileUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="mb-2 inline-block bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold">
                {item.type.toUpperCase()}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{item.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDeleteMedia(item.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  <Icon name="delete" className="w-5 h-5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

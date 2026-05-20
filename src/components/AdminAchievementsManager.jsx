import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';
import { addAchievement, deleteAchievement, getAchievements } from '../services/achievementsService';

export default function AdminAchievementsManager() {
  const { currentUser } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [achievementFile, setAchievementFile] = useState(null);
  const [achievementPreview, setAchievementPreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const data = await getAchievements();
      setAchievements(data);
    } catch (err) {
      setError('Failed to load achievements: ' + err.message);
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

      setAchievementFile(file);
      setError('');

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAchievementPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setAchievementPreview('');
      }
    }
  };

  const handleRemoveFile = () => {
    setAchievementFile(null);
    setAchievementPreview('');
    const fileInput = document.querySelector('#achievement-file-input');
    if (fileInput) fileInput.value = '';
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddAchievement = async (e) => {
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
        setError('You must be logged in to add achievements');
        return;
      }

      const token = await currentUser.getIdToken();
      await addAchievement(formData, achievementFile, token);
      setSuccess('Achievement added successfully!');
      setFormData({ 
        title: '', 
        description: '', 
        date: new Date().toISOString().split('T')[0]
      });
      setAchievementFile(null);
      setAchievementPreview('');
      setShowForm(false);
      await loadAchievements();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add achievement: ' + err.message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleDeleteAchievement = async (achievementId) => {
    if (window.confirm('Delete this achievement? This action cannot be undone.')) {
      try {
        if (!currentUser) {
          setError('You must be logged in to delete achievements');
          return;
        }

        const token = await currentUser.getIdToken();
        await deleteAchievement(achievementId, token);
        setSuccess('Achievement deleted successfully!');
        await loadAchievements();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete achievement: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Icon name="award" className="w-8 h-8 text-yellow-400" />
          <h2 className="text-3xl font-bold text-white">Achievements Management</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2"
        >
          <Icon name={showForm ? 'close' : 'plus'} className="w-5 h-5" />
          {showForm ? 'Cancel' : 'Add Achievement'}
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

      {/* Add Achievement Form */}
      {showForm && (
        <div className="bg-slate-800/50 border border-blue-400/30 p-8 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-6">Add New Achievement</h3>
          <form onSubmit={handleAddAchievement} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="e.g., Award Won, Milestone Reached"
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
                placeholder="Describe this achievement..."
                rows="4"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 focus:border-blue-400 focus:outline-none transition resize-none"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 focus:border-blue-400 focus:outline-none transition"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Upload Certificate/Image</label>
              {achievementFile ? (
                <div className="bg-slate-700/30 border border-blue-400/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {achievementPreview ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <img src={achievementPreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-600 flex items-center justify-center">
                          <Icon name="award" className="w-6 h-6 text-yellow-400" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-white truncate">{achievementFile.name}</p>
                        <p className="text-xs text-gray-400">{(achievementFile.size / 1024 / 1024).toFixed(2)} MB</p>
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
                    id="achievement-file-input"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden"
                  />
                  <label htmlFor="achievement-file-input" className="cursor-pointer">
                      <Icon name="award" className="text-4xl mb-2 text-yellow-400" />
                    <p className="text-sm font-medium text-gray-300 mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">Images or PDFs (Max 10MB)</p>
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
              {loadingSubmit ? 'Uploading...' : 'Add Achievement'}
            </button>
          </form>
        </div>
      )}

      {/* Achievements List */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading achievements...</div>
      ) : achievements.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No achievements yet. Click "Add Achievement" to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map(item => (
            <div key={item.id} className="bg-slate-800/50 border border-blue-400/30 p-6 rounded-lg hover:border-blue-400/60 transition">
              {item.fileUrl && (
                <div className="h-40 bg-slate-900 rounded-lg mb-4 overflow-hidden">
                  <img src={item.fileUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="mb-2 text-xs font-semibold text-gray-400">
                📅 {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{item.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDeleteAchievement(item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
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

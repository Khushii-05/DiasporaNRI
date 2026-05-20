import { useState, useEffect } from 'react';
import { getAchievements, addAchievement, deleteAchievement } from '../services/firebaseService';

export default function AchievementsManager() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleAddAchievement = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.date) {
      setError('Title and date are required');
      return;
    }

    try {
      await addAchievement(formData);
      setSuccess('Achievement added successfully!');
      setFormData({ title: '', description: '', date: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      await loadAchievements();
    } catch (err) {
      setError('Failed to add achievement: ' + err.message);
    }
  };

  const handleDeleteAchievement = async (achievementId) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        await deleteAchievement(achievementId);
        setSuccess('Achievement deleted successfully!');
        await loadAchievements();
      } catch (err) {
        setError('Failed to delete achievement: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Achievements Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
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

      {showForm && (
        <div className="bg-slate-800/50 border border-blue-400/30 p-6 rounded-lg">
          <form onSubmit={handleAddAchievement} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter achievement title"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 focus:border-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter achievement description"
                rows="4"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 focus:border-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 focus:border-blue-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition"
            >
              Add Achievement
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-400">Loading achievements...</div>
      ) : achievements.length === 0 ? (
        <div className="text-center text-gray-400 py-8">No achievements yet. Add your first milestone!</div>
      ) : (
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="bg-slate-800/50 border border-blue-400/30 p-6 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-blue-400">{achievement.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{achievement.description}</p>
                  <p className="text-cyan-400 text-sm mt-2">{new Date(achievement.date).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleDeleteAchievement(achievement.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition"
                >
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

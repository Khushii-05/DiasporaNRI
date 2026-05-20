import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import AdminMediaManager from '../components/AdminMediaManager';
import AdminAchievementsManager from '../components/AdminAchievementsManager';
import AdminContactSubmissions from '../components/AdminContactSubmissions';
import AdminContentManager from '../components/AdminContentManager';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', iconName: 'list' },
    { id: 'media', label: 'Media', iconName: 'media' },
    { id: 'achievements', label: 'Achievements', iconName: 'award' },
    { id: 'content', label: 'Content', iconName: 'edit' },
    { id: 'submissions', label: 'Contact Submissions', iconName: 'email' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="bg-slate-900 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center flex-wrap gap-3">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap w-full sm:w-auto justify-end">
            <span className="text-gray-300 text-sm sm:text-base truncate">{currentUser?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 sm:px-6 py-2 rounded-lg font-semibold transition text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Tab Navigation */}
        <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-4 border-b border-slate-700\">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold transition border-b-2 flex items-center gap-2 text-sm sm:text-base whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.id === 'overview' ? (
                <Icon name="list" className="w-5 h-5" />
              ) : (
                <Icon name={tab.iconName} className="w-5 h-5" />
              )}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-slate-800/30 rounded-lg">
          {activeTab === 'overview' && (
            <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Welcome to Admin Dashboard</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-slate-800/50 border border-blue-400/30 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-gray-400 mb-2 text-sm">Admin Email</h3>
                  <p className="text-2xl font-bold text-blue-400">{currentUser?.email}</p>
                </div>
                <div className="bg-slate-800/50 border border-blue-400/30 p-6 rounded-lg">
                  <h3 className="text-gray-400 mb-2">Account Status</h3>
                  <p className="text-2xl font-bold text-green-400">Active</p>
                </div>
                <div className="bg-slate-800/50 border border-blue-400/30 p-6 rounded-lg">
                  <h3 className="text-gray-400 mb-2">Last Login</h3>
                  <p className="text-2xl font-bold text-cyan-400">Now</p>
                </div>
              </div>

              <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-8">
                <h3 className="text-xl font-bold mb-4 text-blue-300">Quick Access</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab('media')}
                    className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg font-semibold transition text-left"
                  >
                    <Icon name="media" className="w-6 h-6 mr-2" />
                    Manage Media & News
                  </button>
                  <button
                    onClick={() => setActiveTab('achievements')}
                    className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg font-semibold transition text-left"
                  >
                    <Icon name="award" className="w-6 h-6 mr-2" />
                    Manage Achievements
                  </button>
                  <button
                    onClick={() => setActiveTab('submissions')}
                    className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg font-semibold transition text-left"
                  >
                    <Icon name="email" className="w-6 h-6 mr-2" />
                    View Contact Messages
                  </button>
                  <button
                    onClick={() => setActiveTab('content')}
                    className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg font-semibold transition text-left"
                  >
                    <Icon name="edit" className="w-6 h-6 mr-2" />
                    Edit Website Content
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && <div className="p-8"><AdminMediaManager /></div>}

          {activeTab === 'achievements' && <div className="p-8"><AdminAchievementsManager /></div>}

          {activeTab === 'content' && <div className="p-8"><AdminContentManager /></div>}

          {activeTab === 'submissions' && <div className="p-8"><AdminContactSubmissions /></div>}
        </div>
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { getAchievements } from '../services/achievementsService';
import { getPageContent, mapBlocksToValues } from '../services/contentService';

export default function Achievements() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});

  useEffect(() => {
    loadAchievements();
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const blocks = await getPageContent('achievements');
      setContent(mapBlocksToValues(blocks));
    } catch (error) {
      // Use fallback text when content API is unavailable
    }
  };

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const data = await getAchievements();
      setMilestones(data);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [];
  const getValue = (key, fallback) => content[key] || fallback;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {getValue('achievements_title', 'Our Achievements')}
          </h1>
          <p className="text-xl text-gray-300">
            {getValue('achievements_subtitle', 'Milestones that define our journey')}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-400">Loading achievements...</p>
          </div>
        ) : milestones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <h2 className="text-3xl font-bold mb-2 text-white">
              {getValue('achievements_empty_title', 'Coming Soon')}
            </h2>
            <p className="text-gray-400 text-lg">
              {getValue('achievements_empty_body', 'Our achievements and milestones will be showcased here')}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:p-6 sm:p-8 mb-20">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-blue-400/30 p-6 rounded-lg text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">{stat.number}</div>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mb-12 sm:mb-12 sm:mb-16">
              <h2 className="text-3xl font-bold mb-12 text-white">Timeline</h2>
              <div className="space-y-8">
                {milestones.map((milestone, idx) => (
                  <div key={milestone.id || milestone._id} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="text-3xl mb-2">⭐</div>
                      {idx < milestones.length - 1 && (
                        <div className="w-1 h-24 bg-gradient-to-b from-blue-400 to-transparent"></div>
                      )}
                    </div>
                    <div className="bg-slate-800/50 border border-blue-400/30 p-6 rounded-lg flex-1">
                      <h3 className="text-lg font-bold text-blue-400 mb-1">{new Date(milestone.date).getFullYear()}</h3>
                      <h4 className="text-xl font-bold text-white mb-2">{milestone.title}</h4>
                      <p className="text-gray-300 mb-4">{milestone.description}</p>
                      {milestone.fileUrl && (
                        <div className="mt-4 rounded-lg overflow-hidden bg-slate-900/50">
                          {milestone.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <img src={milestone.fileUrl} alt={milestone.title} className="w-full h-auto max-h-96 object-cover rounded-lg" />
                          ) : (
                            <a href={milestone.fileUrl} target="_blank" rel="noopener noreferrer" className="block p-4 text-blue-400 hover:text-cyan-400 underline">
                              <Icon name="download" className="w-4 h-4" />
                              View Attachment
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}



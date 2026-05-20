import { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { getMedia } from '../services/mediaService';
import { usePageContent } from '../hooks/usePageContent';

export default function Media() {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getValue } = usePageContent('media');

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const data = await getMedia();
      setMediaItems(data);
    } catch (error) {
      console.error('Error loading media:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="mb-12 sm:mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {content.media_title || 'Media & Resources'}
          </h1>
          <p className="text-xl text-gray-300">
            {content.media_subtitle || 'Latest news, insights, and publications'}
          </p>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-400">Loading media...</p>
          </div>
        ) : mediaItems.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold mb-2 text-white">
              {content.media_empty_title || 'No Media Yet'}
            </h2>
            <p className="text-gray-400 text-lg">
              {content.media_empty_body || 'Media content will appear here soon'}
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-8 text-white">Recent Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:p-6 sm:p-8 mb-12 sm:mb-12 sm:mb-16">
              {mediaItems.map((item) => (
                <div key={item.id} className="bg-slate-800/50 border border-blue-400/30 p-6 rounded-lg hover:border-blue-400/60 transition">
                  {item.fileUrl && item.type === 'image' && (
                    <div className="h-40 bg-slate-900 rounded-lg mb-4 overflow-hidden">
                      <img src={item.fileUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="mb-2 inline-block bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold">
                    {item.type}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                  {item.fileUrl && (
                    <a 
                      href={item.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold"
                    >
                      View File →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}



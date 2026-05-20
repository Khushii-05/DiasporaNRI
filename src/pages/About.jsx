import { useEffect, useState } from 'react';
import { getPageContent, mapBlocksToValues } from '../services/contentService';

export default function About() {
  const [content, setContent] = useState({});

  useEffect(() => {
    const loadContent = async () => {
      try {
        const blocks = await getPageContent('about');
        setContent(mapBlocksToValues(blocks));
      } catch (error) {
        // Use fallback text when content API is unavailable
      }
    };

    loadContent();
  }, []);

  const getValue = (key, fallback) => content[key] || fallback;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {getValue('about_title', 'About DiasporaNRI')}
          </h1>
          <p className="text-xl text-gray-300">
            {getValue('about_subtitle', 'Connecting NRIs with their homeland through trusted professional support.')}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-slate-800/50 border border-blue-400/30 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">
              {getValue('mission_title', 'Our Mission')}
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              {getValue(
                'mission_p1',
                'To deliver trustworthy, transparent, and professional support services that help NRIs and overseas Indians stay confidently connected with their homeland.'
              )}
            </p>
            <p className="text-gray-400">
              {getValue(
                'mission_p2',
                'We bridge the gap between overseas Indians and their native country by offering dependable coordination, verified assistance, and professional guidance.'
              )}
            </p>
          </div>

          <div className="bg-slate-800/50 border border-cyan-400/30 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">
              {getValue('vision_title', 'Our Vision')}
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              {getValue(
                'vision_p1',
                'To create a trusted global bridge between NRIs and their motherland by delivering reliable assistance, emotional connection, and professional support under one unified platform.'
              )}
            </p>
            <p className="text-gray-400">
              {getValue(
                'vision_p2',
                'No matter where you live in the world, your connection to your homeland should always remain strong, secure, and supported.'
              )}
            </p>
          </div>
        </div>

        {/* Who We Are */}
        <div className="bg-slate-800/50 border border-blue-400/30 p-8 rounded-lg mb-16">
          <h2 className="text-3xl font-bold mb-6 text-white">
            {getValue('who_title', 'Who We Are')}
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            {getValue(
              'who_p1',
              'DiasporaNRI.com is a dedicated support platform created to assist NRIs, overseas Indians, and global families in managing matters related to their homeland with trust, professionalism, and convenience.'
            )}
          </p>
          <p className="text-gray-300 leading-relaxed mb-4">
            {getValue(
              'who_p2',
              'DiasporaNRI.com is a brand initiative and subsidiary venture of Apana Bazar E-Commerce Private Limited. Our objective is to bridge the gap between overseas Indians and their native country by offering dependable coordination, verified assistance, and professional guidance through a strong support network across India.'
            )}
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="bg-slate-800/50 border border-cyan-400/30 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-8 text-white">
            {getValue('why_title', 'Why Choose DiasporaNRI?')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: getValue('why_1_title', 'Professional & Confidential'),
                desc: getValue('why_1_desc', 'Trusted assistance with complete privacy')
              },
              {
                title: getValue('why_2_title', 'Pan-India Network'),
                desc: getValue('why_2_desc', 'Representatives across all major cities')
              },
              {
                title: getValue('why_3_title', 'Verified Experts'),
                desc: getValue('why_3_desc', 'Lawyers, CAs, consultants & professionals')
              },
              {
                title: getValue('why_4_title', 'Fast & Transparent'),
                desc: getValue('why_4_desc', 'Quick coordination with clear communication')
              },
              {
                title: getValue('why_5_title', 'Personalized Support'),
                desc: getValue('why_5_desc', 'Customized solutions for every requirement')
              },
              {
                title: getValue('why_6_title', 'Ground-Level Assistance'),
                desc: getValue('why_6_desc', 'Local support across India 24/7')
              }
            ].map((item, idx) => (
              <div key={idx} className="border-l-4 border-blue-400 pl-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

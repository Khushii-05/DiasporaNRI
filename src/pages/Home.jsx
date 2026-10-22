import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePageContent } from '../hooks/usePageContent';

export default function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { content, getValue } = usePageContent('home');

  const handlePartnershipClick = (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/signup', { state: { from: '/partnership' } });
    } else {
      navigate('/partnership');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-white">
        <div className="grid grid-cols-1 gap-8 sm:gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              {currentUser
                ? getValue('hero_title_logged_in', `Welcome, ${currentUser.displayName || currentUser.email}!`)
                : getValue('hero_title', 'Welcome to DiasporaNRI')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
              {getValue(
                'hero_body',
                'DiasporaNRI.com is your trusted platform providing comprehensive support services for NRIs and global Indians. Manage your property, legal matters, banking, investments, family support, and more with professional assistance and peace of mind.'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a href="/contact" className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 sm:px-8 py-3 rounded-lg font-semibold text-center sm:text-left hover:shadow-lg hover:shadow-blue-500/50 transition">
                {getValue('cta_primary', 'Get Started')}
              </a>
              <a href="/about" className="border-2 border-blue-400 px-6 sm:px-8 py-3 rounded-lg font-semibold text-center sm:text-left hover:bg-blue-400 hover:text-white transition">
                {getValue('cta_secondary', 'Learn More')}
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          {getValue('features_title', 'Why Choose Us')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: getValue('feature_1_title', 'Property Management'),
              desc: getValue('feature_1_desc', 'Expert assistance for property & land matters')
            },
            {
              title: getValue('feature_2_title', 'Legal Support'),
              desc: getValue('feature_2_desc', 'Professional legal guidance and documentation')
            },
            {
              title: getValue('feature_3_title', 'Business & Finance'),
              desc: getValue('feature_3_desc', 'Banking, investment & business setup support')
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-blue-400/30 p-8 rounded-lg hover:border-blue-400/60 transition">
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Partnership Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/50 rounded-lg p-8 sm:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Partner With Us</h2>
              <p className="text-gray-300 text-lg mb-6">
                Join our growing network of professional partners and expand your business opportunities. We offer exclusive partnership programs for qualified businesses and consultants.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  Business growth opportunities
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  Comprehensive support system
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  Professional collaboration network
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  Transparent partnership terms
                </li>
              </ul>
              <button onClick={handlePartnershipClick} className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition cursor-pointer">
                Apply for Partnership
              </button>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-8">
              <h3 className="text-xl font-bold text-white mb-6">Partnership Categories</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">•</span> Business Associates
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">•</span> Marketing Partners
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">•</span> Healthcare Partners
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">•</span> Franchise Partners
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">•</span> Insurance Associates
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">•</span> Consultants & Advisors
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">•</span> Investors & Strategic Partners
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

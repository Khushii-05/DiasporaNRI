import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePageContent } from '../hooks/usePageContent';

export default function Home() {
  const { currentUser } = useAuth();
  const { content, getValue } = usePageContent('home');

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
    </div>
  );
}

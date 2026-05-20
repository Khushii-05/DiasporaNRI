import { useEffect, useState } from 'react';
import { getPageContent, mapBlocksToValues } from '../services/contentService';

export default function Services() {
  const [content, setContent] = useState({});

  useEffect(() => {
    const loadContent = async () => {
      try {
        const blocks = await getPageContent('services');
        setContent(mapBlocksToValues(blocks));
      } catch (error) {
        // Use fallback text when content API is unavailable
      }
    };

    loadContent();
  }, []);

  const getValue = (key, fallback) => content[key] || fallback;

  const services = [
    {
      title: 'Property & Land Management',
      description: 'Expert assistance for property matters and land management',
      features: ['Property Documentation', 'Land Verification', 'Transaction Support']
    },
    {
      title: 'Legal Support & Documentation',
      description: 'Professional legal guidance and comprehensive documentation',
      features: ['Legal Consultation', 'Document Preparation', 'Power of Attorney']
    },
    {
      title: 'Government & Administrative',
      description: 'Coordination with government agencies and administrative bodies',
      features: ['Government Filing', 'Admin Liaison', 'Permit Assistance']
    },
    {
      title: 'Banking & Financial Services',
      description: 'Banking, investment, and comprehensive financial guidance',
      features: ['Account Management', 'Investment Guidance', 'Financial Planning']
    },
    {
      title: 'Family Support & Representation',
      description: 'Local representation and family-related assistance',
      features: ['Family Representation', 'Local Coordination', '24/7 Support']
    },
    {
      title: 'Medical & Emergency Assistance',
      description: 'Emergency medical support and healthcare coordination',
      features: ['Hospital Coordination', 'Medical Records', 'Emergency Response']
    },
    {
      title: 'Business Setup & Trade',
      description: 'Guidance for business setup and international trade',
      features: ['Business Registration', 'Trade Facilitation', 'Compliance Support']
    },
    {
      title: 'Real Estate & Asset Monitoring',
      description: 'Continuous monitoring and management of assets',
      features: ['Property Monitoring', 'Asset Tracking', 'Maintenance Support']
    },
    {
      title: 'Verification & POA Services',
      description: 'Power of Attorney and comprehensive verification services',
      features: ['POA Drafting', 'Verification Services', 'Notarization']
    },
    {
      title: 'Tax & Compliance Assistance',
      description: 'Professional taxation and regulatory compliance support',
      features: ['Tax Planning', 'Compliance Filing', 'Returns Preparation']
    },
    {
      title: 'Education & Admission Support',
      description: 'Assistance with education and admission matters for families',
      features: ['School Admission', 'Document Support', 'Coordination']
    },
    {
      title: 'Senior Citizen & Parent Care',
      description: 'Specialized care coordination and support for aging parents',
      features: ['Care Coordination', 'Medical Support', 'Wellness Programs']
    },
    {
      title: 'Travel, Visa & Immigration',
      description: 'Comprehensive travel and immigration assistance',
      features: ['Visa Support', 'Travel Planning', 'Document Processing']
    },
    {
      title: 'Cultural & Community Networking',
      description: 'Connect with cultural and community networks',
      features: ['Community Events', 'Networking Support', 'Cultural Activities']
    },
    {
      title: 'Event Management & Hospitality',
      description: 'Professional event management and hospitality services',
      features: ['Event Planning', 'Coordination', 'Logistics Support']
    },
    {
      title: 'Employment & Skill Development',
      description: 'Career guidance and skill development assistance',
      features: ['Job Support', 'Skill Training', 'Career Guidance']
    },
    {
      title: 'Dispute Resolution & Mediation',
      description: 'Professional mediation and dispute resolution services',
      features: ['Mediation Services', 'Negotiation Support', 'Resolution Assistance']
    },
    {
      title: 'Trusted Service Partner Network',
      description: 'Access to our extensive network of verified service partners',
      features: ['Partner Access', 'Verified Professionals', 'Quality Assurance']
    },
    {
      title: 'Special Requirements Support',
      description: 'Custom solutions for any unique or special needs',
      features: ['Customized Solutions', 'Special Projects', 'Unique Assistance']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="mb-12 sm:mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {getValue('services_title', 'Our Services')}
          </h1>
          <p className="text-xl text-gray-300">
            {getValue('services_subtitle', 'Comprehensive support for every NRI need')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:p-6 sm:p-8 mb-12 sm:mb-12 sm:mb-16">
          {services.map((service, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-blue-400/30 p-6 sm:p-6 sm:p-8 rounded-lg hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/20 transition">
              <h3 className="text-xl font-bold mb-3 text-blue-400">{service.title}</h3>
              <p className="text-gray-300 mb-4">{service.description}</p>
              <div className="space-y-2">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-cyan-400">•</span>
                    <span className="text-gray-400 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-400/30 p-12 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">
            {getValue('services_cta_title', 'Need Assistance?')}
          </h2>
          <p className="text-gray-300 mb-6">
            {getValue('services_cta_body', 'Contact our support team for professional and reliable assistance')}
          </p>
          <a href="/contact" className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition">
            {getValue('services_cta_button', 'Get Support Today')}
          </a>
        </div>
      </div>
    </div>
  );
}



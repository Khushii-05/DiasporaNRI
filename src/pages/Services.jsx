import { usePageContent } from '../hooks/usePageContent';
import AnimatedList from '../components/AnimatedList';

export default function Services() {
  const { getValue } = usePageContent('services');

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
          <h1 className="text-4xl sm:text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
            {getValue('services_title', 'Our Services')}
          </h1>
          <p className="text-xl text-white">
            {getValue('services_subtitle', 'Comprehensive support for every NRI need')}
          </p>
        </div>

        <div className="mb-12 sm:mb-16">
          <AnimatedList items={services} />
        </div>

        {/* CTA Section */}
        <div className="bg-slate-800/60 border border-blue-400/30 p-12 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            {getValue('services_cta_title', 'Need Assistance?')}
          </h2>
          <p className="text-gray-300 mb-6">
            {getValue('services_cta_body', 'Contact our support team for professional and reliable assistance')}
          </p>
          <a href="/contact" className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-blue-500/50 transition">
            {getValue('services_cta_button', 'Get Support Today')}
          </a>
        </div>
      </div>
    </div>
  );
}

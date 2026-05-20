import { usePageContent } from '../hooks/usePageContent';

export default function Associates() {
  const { content, getValue } = usePageContent('associates');

  const professionals = [
    {
      name: 'Senior Advocates & Legal Consultants',
      category: 'Legal',
      description: 'Experienced legal experts for property, corporate, and personal matters'
    },
    {
      name: 'Chartered Accountants (CA)',
      category: 'Finance & Tax',
      description: 'Professional tax advisors and financial compliance experts'
    },
    {
      name: 'Company Secretaries',
      category: 'Compliance',
      description: 'Corporate governance and compliance specialists'
    },
    {
      name: 'Property & Real Estate Consultants',
      category: 'Real Estate',
      description: 'Land, property, and real estate transaction experts'
    },
    {
      name: 'Banking & Financial Advisors',
      category: 'Finance',
      description: 'Investment and banking guidance professionals'
    },
    {
      name: 'Documentation & Verification Specialists',
      category: 'Verification',
      description: 'Document preparation and verification experts'
    },
    {
      name: 'Immigration & Visa Consultants',
      category: 'Immigration',
      description: 'Visa, travel, and immigration assistance experts'
    },
    {
      name: 'Investment & Business Strategy Experts',
      category: 'Business',
      description: 'Business setup and strategic investment advisors'
    },
    {
      name: 'Government Liaison Professionals',
      category: 'Government',
      description: 'Administrative and government coordination specialists'
    },
    {
      name: 'Insurance & Risk Management',
      category: 'Insurance',
      description: 'Insurance and risk management professionals'
    },
    {
      name: 'Medical & Emergency Coordinators',
      category: 'Healthcare',
      description: 'Medical and emergency assistance specialists'
    },
    {
      name: 'Education & Career Experts',
      category: 'Education',
      description: 'Education guidance and career development professionals'
    },
    {
      name: 'Dispute Resolution Professionals',
      category: 'Legal',
      description: 'Mediation and dispute resolution experts'
    },
    {
      name: 'Technology & Cyber Security',
      category: 'Technology',
      description: 'Tech solutions and cyber security consultants'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="mb-12 sm:mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {getValue('associates_title', 'Our Professional Network')}
          </h1>
          <p className="text-xl text-gray-300">
            {getValue('associates_subtitle', 'Trusted experts and verified professionals across India')}
          </p>
        </div>

        {/* Professionals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:p-6 sm:p-8 mb-12 sm:mb-12 sm:mb-16">
          {professionals.map((prof, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-blue-400/30 p-6 sm:p-6 sm:p-8 rounded-lg hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/20 transition">
              <h3 className="text-xl font-bold mb-2 text-blue-400">{prof.name}</h3>
              <p className="text-cyan-400 text-sm font-semibold mb-3">{prof.category}</p>
              <p className="text-gray-300">{prof.description}</p>
            </div>
          ))}
        </div>

        {/* Pan-India Representation */}
        <div className="bg-slate-800/50 border border-blue-400/30 p-12 rounded-lg mb-12 sm:mb-12 sm:mb-16">
          <h2 className="text-3xl font-bold mb-8 text-white">
            {getValue('associates_pan_title', 'Pan-India Representation')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:p-6 sm:p-8">
            {[
              { title: 'State Representatives', desc: 'Coverage across all Indian states' },
              { title: 'District Coordinators', desc: 'Local coordination at district level' },
              { title: 'Local Service Associates', desc: 'Ground-level support and assistance' },
              { title: 'Legal & Admin Partners', desc: 'Professional partners for government coordination' }
            ].map((item, idx) => (
              <div key={idx} className="border-l-4 border-cyan-400 pl-6">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Commitment */}
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-400/30 p-12 rounded-lg">
          <h2 className="text-3xl font-bold mb-6 text-white">
            {getValue('associates_commitment_title', 'Our Commitment')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Trusted Professional Assistance',
              'Confidential & Ethical Services',
              'Timely Coordination & Execution',
              'Transparent Communication',
              'Personalized Support',
              'Strong Local Network'
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <p className="text-gray-300">• {item}</p>
              </div>
            ))}
          </div>
          <p className="text-cyan-400 italic mt-8 text-center font-semibold">
            {getValue('associates_commitment_tagline', 'Global Presence. Local Support. Trusted Connections.')}
          </p>
        </div>
      </div>
    </div>
  );
}



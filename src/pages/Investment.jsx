import { usePageContent } from '../hooks/usePageContent';

export default function Investment() {
  const { content, getValue } = usePageContent('investment');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="mb-12 sm:mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            {getValue('investment_title', 'Investment Opportunities')}
          </h1>
          <p className="text-xl text-gray-300">
            {getValue('investment_subtitle', 'Strategic investment opportunities with verified partners')}
          </p>
        </div>

        {/* Coming Soon */}
        <div className="bg-slate-800/50 border border-blue-400/30 p-16 rounded-lg text-center mb-12 sm:mb-12 sm:mb-16">
          <h2 className="text-3xl font-bold mb-4 text-white">
            {getValue('investment_coming_title', 'Coming Soon')}
          </h2>
          <p className="text-gray-300 text-lg">
            {getValue('investment_coming_body', 'Exclusive investment opportunities will be available soon. Check back for verified and official investment options.')}
          </p>
        </div>

        {/* Investment Process */}
        <div className="bg-slate-800/50 border border-blue-400/30 p-12 rounded-lg mb-12 sm:mb-12 sm:mb-16">
          <h2 className="text-3xl font-bold mb-8 text-white">
            {getValue('investment_process_title', 'Our Investment Process')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:p-6 sm:p-8">
            {[
              { step: '01', title: 'Assessment', desc: 'Evaluate your investment goals and risk profile' },
              { step: '02', title: 'Analysis', desc: 'Detailed market and opportunity analysis' },
              { step: '03', title: 'Structure', desc: 'Customize investment terms and structure' },
              { step: '04', title: 'Management', desc: 'Ongoing portfolio monitoring and support' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold text-blue-300 mb-3">{item.step}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Disclosure */}
        <div className="bg-slate-800/40 border border-blue-400/30 p-6 sm:p-6 sm:p-8 rounded-lg mb-12 sm:mb-12 sm:mb-16">
          <h3 className="text-xl font-bold mb-4 text-blue-300">
            {getValue('investment_disclosure_title', 'Important Disclosure')}
          </h3>
          <p className="text-gray-300">
            {getValue(
              'investment_disclosure_body',
              'All investments carry risk. Past performance is not indicative of future results. Please consult with a qualified financial advisor before making investment decisions.'
            )}
          </p>
        </div>

        {/* CTA */}
        <div className="bg-slate-800/60 border border-blue-400/30 p-12 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            {getValue('investment_cta_title', 'Ready to Invest?')}
          </h2>
          <p className="text-gray-300 mb-6">
            {getValue('investment_cta_body', 'Schedule a consultation with our investment advisors')}
          </p>
          <a href="/contact" className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-blue-500/50 transition">
            {getValue('investment_cta_button', 'Schedule Consultation')}
          </a>
        </div>
      </div>
    </div>
  );
}



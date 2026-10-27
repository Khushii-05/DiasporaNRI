import { usePageContent } from '../hooks/usePageContent';

export default function About() {
  const { getValue } = usePageContent('about');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="mb-14 max-w-3xl sm:mb-20">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300/90">
            Our story
          </p>
          <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            {getValue('about_title', 'About DiasporaNRI')}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-white sm:text-xl">
            {getValue('about_subtitle', 'Connecting NRIs with their homeland through trusted professional support.')}
          </p>
        </div>

        {/* Main Content */}
        <div className="mb-16 grid grid-cols-1 border-y border-blue-400/30 md:grid-cols-2 sm:mb-20">
          <div className="border-b border-blue-400/30 py-8 sm:py-10 md:border-b-0 md:pr-12">
            <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-cyan-400">01</p>
            <h2 className="mb-5 text-2xl font-bold text-blue-300">
              {getValue('mission_title', 'Our Mission')}
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-gray-300 sm:text-base">
              {getValue(
                'mission_p1',
                'To deliver trustworthy, transparent, and professional support services that help NRIs and overseas Indians stay confidently connected with their homeland.'
              )}
            </p>
            <p className="text-sm leading-relaxed text-gray-300 sm:text-base">
              {getValue(
                'mission_p2',
                'We bridge the gap between overseas Indians and their native country by offering dependable coordination, verified assistance, and professional guidance.'
              )}
            </p>
          </div>

          <div className="py-8 sm:py-10 md:border-l md:border-blue-400/30 md:pl-12">
            <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-cyan-400">02</p>
            <h2 className="mb-5 text-2xl font-bold text-blue-300">
              {getValue('vision_title', 'Our Vision')}
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-gray-300 sm:text-base">
              {getValue(
                'vision_p1',
                'To create a trusted global bridge between NRIs and their motherland by delivering reliable assistance, emotional connection, and professional support under one unified platform.'
              )}
            </p>
            <p className="text-sm leading-relaxed text-gray-300 sm:text-base">
              {getValue(
                'vision_p2',
                'No matter where you live in the world, your connection to your homeland should always remain strong, secure, and supported.'
              )}
            </p>
          </div>
        </div>

        {/* Who We Are */}
        <div className="mb-16 max-w-5xl border-b border-blue-400/30 pb-10 sm:mb-20">
          <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-cyan-400">03</p>
          <h2 className="mb-6 text-3xl font-bold text-white">
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
        <div className="border-t border-blue-400/30 pt-8">
          <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-cyan-400">04</p>
          <h2 className="mb-10 text-3xl font-bold text-white">
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
                <h3 className="text-lg font-semibold text-blue-300 mb-2">{item.title}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

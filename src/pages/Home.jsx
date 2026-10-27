import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePageContent } from '../hooks/usePageContent';
import TextType from '../components/TextType';
import SocialFollowLoop from '../components/SocialFollowLoop';

export default function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { getValue } = usePageContent('home');

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
      <section
        className="relative isolate overflow-hidden text-white"
        style={{ backgroundImage: 'url("/leagal%20stock%20photo.jpg")', backgroundPosition: 'center right', backgroundSize: 'cover' }}
      >
        <div className="absolute inset-0 -z-10 bg-slate-950/55" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/75 via-slate-950/55 to-slate-900/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/10 via-transparent to-slate-950/45" />

        <div className="relative mx-auto grid min-h-[520px] max-w-7xl grid-cols-1 items-center px-4 py-20 sm:px-6 sm:py-24 lg:min-h-[620px] lg:grid-cols-[minmax(0,1.05fr)_minmax(260px,0.65fr)]">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300/90">
              Trusted support across borders
            </p>
            <TextType
              as="h1"
              text={currentUser
                ? getValue('hero_title_logged_in', `Welcome, ${currentUser.displayName || currentUser.email}!`)
                : getValue('hero_title', 'Welcome to DiasporaNRI')}
              typingSpeed={55}
              pauseDuration={2200}
              loop={false}
              className="mb-5 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            />
            <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg md:text-xl">
              {getValue(
                'hero_body',
                'DiasporaNRI.com is your trusted platform providing comprehensive support services for NRIs and global Indians. Manage your property, legal matters, banking, investments, family support, and more with professional assistance and peace of mind.'
              )}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <a href="/contact" className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 text-center font-semibold shadow-lg shadow-blue-950/30 transition hover:from-blue-400 hover:to-cyan-400 sm:px-8 sm:text-left">
                {getValue('cta_primary', 'Get Started')}
              </a>
              <a href="/about" className="rounded-lg border border-slate-400/70 bg-slate-950/20 px-6 py-3 text-center font-semibold backdrop-blur-sm transition hover:border-cyan-300 hover:bg-slate-900/60 sm:px-8 sm:text-left">
                {getValue('cta_secondary', 'Learn More')}
              </a>
            </div>
          </div>
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
            <div className="border-l border-cyan-400/40 pl-6 sm:pl-8">
              <h3 className="mb-6 text-xl font-bold text-white">Partnership Categories</h3>
              <ul className="grid gap-3 text-gray-300 sm:grid-cols-2">
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

      <SocialFollowLoop />
    </div>
  );
}

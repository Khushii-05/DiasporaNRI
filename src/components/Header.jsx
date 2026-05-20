import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import GooeyNav from './GooeyNav';
import DefaultProfilePicture from './DefaultProfilePicture';

export default function Header() {
  const { currentUser, logout, isAdmin, adminLoading, verifyAdmin } = useAuth();
  const [profilePicture, setProfilePicture] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (currentUser && isAdmin === null && !adminLoading) {
      verifyAdmin();
    }
  }, [currentUser, isAdmin, adminLoading, verifyAdmin]);

  useEffect(() => {
    if (currentUser) {
      // Load profile picture from Firestore
      const loadProfilePicture = async () => {
        try {
          const profileDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (profileDoc.exists() && profileDoc.data().profilePicture) {
            setProfilePicture(profileDoc.data().profilePicture);
          } else if (currentUser.photoURL) {
            setProfilePicture(currentUser.photoURL);
          } else {
            setProfilePicture('');
          }
        } catch (error) {
          console.error('Error loading profile picture:', error);
        }
      };
      loadProfilePicture();
    }
  }, [currentUser]);
  
  const navItems = [
    { element: <Link to="/">Home</Link> },
    { element: <Link to="/about">About Us</Link> },
    { element: <Link to="/services">Services</Link> },
    { element: <Link to="/associates">Associates</Link> },
    { element: <Link to="/investment">Investment</Link> },
    { element: <Link to="/achievements">Achievements</Link> },
    { element: <Link to="/media">Media</Link> },
    { element: <Link to="/contact">Contact</Link> }
  ];

  const navLinks = ['/', '/about', '/services', '/associates', '/investment', '/achievements', '/media', '/contact'];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-slate-900 shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Logo - Left */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition flex-shrink-0">
          <img src="/diaspora-nri-logo.png" alt="DiasporaNRI Logo" className="h-28 sm:h-32 md:h-40" />
        </Link>
        
        {/* Navigation - Center (hidden on mobile, shown on md+) */}
        <div className="hidden md:flex flex-1 justify-center">
          <GooeyNav items={navItems} navLinks={navLinks} />
        </div>

        {/* Auth Buttons + Hamburger - Right */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Auth Links (hidden on mobile) */}
          <div className="hidden sm:flex items-center gap-4">
            {currentUser ? (
              isAdmin ? (
                <Link 
                  to="/dashboard" 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base hover:shadow-lg hover:shadow-blue-500/50 transition"
                >
                  Dashboard
                </Link>
              ) : (
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 hover:opacity-80 transition"
                >
                  <span className="text-gray-300 hover:text-white font-medium transition hidden sm:inline text-sm sm:text-base">Profile</span>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-slate-700 border border-blue-400">
                    {profilePicture ? (
                      <img 
                        src={profilePicture} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <DefaultProfilePicture />
                    )}
                  </div>
                </Link>
              )
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white font-medium transition text-sm sm:text-base"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base hover:shadow-lg hover:shadow-blue-500/50 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-slate-800 rounded-lg transition"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Mobile Profile Icon */}
          {currentUser && !isAdmin && (
            <Link 
              to="/profile"
              className="md:hidden w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-slate-700 border border-blue-400"
            >
              {profilePicture ? (
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="scale-75">
                  <DefaultProfilePicture />
                </div>
              )}
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 py-4">
          <nav className="flex flex-col gap-3 mb-4">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={navLinks[index]}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-700 transition text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.element.props.children}
              </Link>
            ))}
          </nav>

          {/* Mobile Auth Buttons */}
          <div className="flex sm:hidden flex-col gap-2 border-t border-slate-700 pt-4">
            {currentUser ? (
              isAdmin ? (
                <Link 
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-semibold text-center hover:shadow-lg hover:shadow-blue-500/50 transition text-sm"
                >
                  Dashboard
                </Link>
              ) : (
                <Link 
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-semibold text-center hover:shadow-lg hover:shadow-blue-500/50 transition text-sm"
                >
                  My Profile
                </Link>
              )
            ) : (
              <>
                <Link 
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-2 border-blue-400 text-blue-400 px-4 py-2 rounded-lg font-semibold text-center hover:bg-blue-400 hover:text-white transition text-sm"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-semibold text-center hover:shadow-lg hover:shadow-blue-500/50 transition text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

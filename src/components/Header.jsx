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
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo - Top Left Corner */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition flex-shrink-0">
          <img src="/diaspora-nri-logo.png" alt="DiasporaNRI Logo" className="h-28" />
        </Link>
        
        {/* Navigation - Center */}
        <div className="flex-1 flex justify-center">
          <GooeyNav items={navItems} navLinks={navLinks} />
        </div>

        {/* Auth Buttons - Right */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            isAdmin ? (
              <Link 
                to="/dashboard" 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition"
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                to="/profile" 
                className="flex items-center gap-2 hover:opacity-80 transition"
              >
                <span className="text-gray-300 hover:text-white font-medium transition">Profile</span>
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
                className="text-gray-300 hover:text-white font-medium transition"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

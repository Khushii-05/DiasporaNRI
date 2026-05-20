import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

// Helper function to verify admin for a specific user (without relying on context)
async function verifyAdminForUser(user) {
  if (!user) return false;
  
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  
  try {
    const token = await user.getIdToken();
    const response = await fetch(`${apiBaseUrl}/admin/check`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return Boolean(data.isAdmin);
  } catch (error) {
    console.error('Admin verification error:', error.message);
    return false;
  }
}

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser, isAdmin, adminLoading, verifyAdmin } = useAuth();

  useEffect(() => {
    const resolveAdmin = async () => {
      if (!currentUser) {
        return;
      }

      if (isAdmin === null && !adminLoading) {
        await verifyAdmin();
      }
    };

    resolveAdmin();
  }, [currentUser, isAdmin, adminLoading, verifyAdmin]);

  useEffect(() => {
    if (!currentUser || isAdmin === null) {
      return;
    }

    if (isAdmin) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  }, [currentUser, isAdmin, navigate]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const normalizedEmail = email.toLowerCase().trim();
      
      // Sign out current user first to ensure clean admin login
      if (auth.currentUser) {
        await auth.signOut();
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      // Use the new user credential directly to verify admin
      const isAdmin = await verifyAdminForUser(userCredential.user);

      if (!isAdmin) {
        setError('You do not have admin access. Please contact the administrator.');
        await auth.signOut();
        return;
      }

      console.log('✅ Admin logged in:', userCredential.user.email);
      navigate('/dashboard');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setError('Admin account not found');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // Sign out current user first to ensure clean admin login
      if (auth.currentUser) {
        await auth.signOut();
      }

      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const userEmail = userCredential.user.email.toLowerCase();
      // Use the new user credential directly to verify admin
      const isAdmin = await verifyAdminForUser(userCredential.user);

      if (!isAdmin) {
        setError('You do not have admin access. Please contact the administrator.');
        await auth.signOut();
        return;
      }

      console.log('✅ Admin logged in via Google:', userEmail);
      navigate('/dashboard');
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 border border-blue-400/30 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">Admin Login</h1>
          <p className="text-gray-400 text-center mb-8">Access admin dashboard</p>

          {error && (
            <div className="bg-red-500/20 border border-red-400/30 text-red-400 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 focus:border-blue-400 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 focus:border-blue-400 focus:outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login as Admin'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800/50 text-gray-400">Or</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          <p className="text-center text-gray-400 mt-6">
            Not an admin?{' '}
            <Link to="/login" className="text-blue-400 hover:text-cyan-400 font-medium transition">
              User Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

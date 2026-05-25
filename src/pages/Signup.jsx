import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  if (currentUser) {
    navigate('/');
    return null;
  }

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: fullName
      });
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-palette-secondary via-palette-secondary to-palette-secondary flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-palette-accent1 border border-palette-primary/30 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">Create Account</h1>
          <p className="text-slate-900 text-center mb-8">Join DiasporaNRI today</p>

          {error && (
            <div className="bg-red-500/20 border border-red-400/30 text-red-400 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <label className="block text-slate-900 mb-2 font-medium">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-palette-secondary border border-palette-secondary text-slate-900 rounded-lg px-4 py-2 focus:border-palette-primary focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-slate-900 mb-2 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-palette-secondary border border-palette-secondary text-slate-900 rounded-lg px-4 py-2 focus:border-palette-primary focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-slate-900 mb-2 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-palette-secondary border border-palette-secondary text-slate-900 rounded-lg px-4 py-2 focus:border-palette-primary focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-slate-900 mb-2 font-medium">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-palette-secondary border border-palette-secondary text-slate-900 rounded-lg px-4 py-2 focus:border-palette-primary focus:outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-palette-primary to-palette-primary text-slate-900 font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-palette-primary/50 transition disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-palette-primary/30"></div>
            <span className="px-3 text-slate-900">OR</span>
            <div className="flex-1 border-t border-palette-primary/30"></div>
          </div>

          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full bg-white text-palette-primary font-semibold py-2 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign Up with Google
          </button>

          <p className="text-center text-slate-900 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-palette-primary hover:text-palette-primary font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

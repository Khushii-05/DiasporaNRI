import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [loadingReset, setLoadingReset] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  if (currentUser) {
    navigate('/');
    return null;
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (!resetEmail) {
      setResetError('Please enter your email address');
      return;
    }

    setLoadingReset(true);

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess('Password reset email sent! Check your inbox for instructions.');
      setResetEmail('');
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetSuccess('');
      }, 3000);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setResetError('No account found with this email');
      } else {
        setResetError('Error sending reset email: ' + error.message);
      }
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-palette-secondary via-palette-secondary to-palette-secondary flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-palette-accent1 border border-palette-primary/30 rounded-lg p-8">
          {!showForgotPassword ? (
            <>
              {/* Login Form */}
              <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">Welcome Back</h1>
              <p className="text-slate-900 text-center mb-8">Sign in to your DiasporaNRI account</p>

              {error && (
                <div className="bg-red-500/20 border border-red-400/30 text-red-400 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleEmailLogin} className="space-y-4">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-palette-primary to-palette-primary text-slate-900 font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-palette-primary/50 transition disabled:opacity-50"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="w-full text-palette-primary hover:text-palette-primary font-medium transition text-sm"
                >
                  Forgot your password?
                </button>
              </form>

              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-palette-primary/30"></div>
                <span className="px-3 text-slate-900">OR</span>
                <div className="flex-1 border-t border-palette-primary/30"></div>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-palette-secondary hover:bg-palette-secondary text-slate-900 font-bold py-2 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 mb-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>

              <p className="text-center text-slate-900 mt-6 mb-6 text-sm">
                <Link to="/admin-login" className="text-palette-primary hover:text-palette-primary font-medium transition">
                  Admin Login
                </Link>
              </p>

              <p className="text-center text-slate-900">
                Don't have an account?{' '}
                <Link to="/signup" className="text-palette-primary hover:text-palette-primary font-medium transition">
                  Sign up
                </Link>
              </p>
            </>
          ) : (
            <>
              {/* Forgot Password Form */}
              <h1 className="text-3xl font-bold text-white mb-2 text-center">Reset Password</h1>
              <p className="text-gray-400 text-center mb-8">Enter your email and we'll send you a link to reset your password</p>

              {resetError && (
                <div className="bg-red-500/20 border border-red-400/30 text-red-400 p-4 rounded-lg mb-6">
                  {resetError}
                </div>
              )}

              {resetSuccess && (
                <div className="bg-green-500/20 border border-green-400/30 text-green-400 p-4 rounded-lg mb-6">
                  {resetSuccess}
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-slate-900 mb-2 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-palette-secondary border border-palette-secondary text-slate-900 rounded-lg px-4 py-2 focus:border-palette-primary focus:outline-none transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingReset}
                  className="w-full bg-gradient-to-r from-palette-primary to-palette-primary text-slate-900 font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-palette-primary/50 transition disabled:opacity-50"
                >
                  {loadingReset ? 'Sending Email...' : 'Send Reset Link'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetError('');
                    setResetSuccess('');
                    setResetEmail('');
                  }}
                  className="w-full text-palette-primary hover:text-palette-primary font-medium transition text-sm"
                >
                  Back to Login
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

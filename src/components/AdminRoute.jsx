import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AdminRoute({ children }) {
  const { currentUser, loading, isAdmin, adminLoading, verifyAdmin } = useAuth();

  useEffect(() => {
    if (currentUser && isAdmin === null && !adminLoading) {
      verifyAdmin();
    }
  }, [currentUser, isAdmin, adminLoading, verifyAdmin]);

  if (loading || adminLoading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

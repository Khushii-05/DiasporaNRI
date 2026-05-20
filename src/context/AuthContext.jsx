import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAdmin(null);
      setLoading(false);
    }, (error) => {
      setError(error.message);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setIsAdmin(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const verifyAdmin = useCallback(async () => {
    if (!currentUser) {
      setIsAdmin(false);
      return false;
    }

    try {
      setAdminLoading(true);
      const token = await currentUser.getIdToken();
      const response = await fetch(`${apiBaseUrl}/admin/check`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        setIsAdmin(false);
        return false;
      }

      const data = await response.json();
      setIsAdmin(Boolean(data.isAdmin));
      return Boolean(data.isAdmin);
    } catch (verifyError) {
      setIsAdmin(false);
      setError(verifyError.message);
      return false;
    } finally {
      setAdminLoading(false);
    }
  }, [apiBaseUrl, currentUser]);

  const value = {
    currentUser,
    loading,
    error,
    logout,
    isAdmin,
    adminLoading,
    verifyAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

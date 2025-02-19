import { auth, db } from '../config/firebase';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize from localStorage if available
    const cachedUser = localStorage.getItem('userData');
    return cachedUser ? JSON.parse(cachedUser) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem('userData');
  });
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    auth.signOut();
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('userData');
    toast.info('You have been logged out');
  };

  const login = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  // Auth state observer
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get cached user data first for immediate display
          const cachedUser = localStorage.getItem('userData');
          if (cachedUser && isMounted) {
            const userData = JSON.parse(cachedUser);
            setUser(userData);
            setIsLoggedIn(true);
          }

          // Then fetch fresh data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists() && isMounted) {
            const userData = userDoc.data() as User;
            setUser(userData);
            setIsLoggedIn(true);
            localStorage.setItem('userData', JSON.stringify(userData));
          }
        } else {
          if (isMounted) {
            setUser(null);
            setIsLoggedIn(false);
            localStorage.removeItem('userData');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (isMounted) {
          setUser(null);
          setIsLoggedIn(false);
          localStorage.removeItem('userData');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const contextValue = {
    user,
    isLoggedIn,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
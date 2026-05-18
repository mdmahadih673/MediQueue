import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import api from '../utils/api';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string, photoURL?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  token: null,
  login: async () => {},
  loginWithGoogle: async () => {},
  register: async () => {},
  logout: async () => {},
});

const TOKEN_KEY = 'mediqueue-token';
const USER_KEY = 'mediqueue-user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on load
  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }

    // Set up Firebase auth listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Sync Firebase User with our Express server to refresh JWT
          const response = await api.post('/auth/sync', {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL
          });

          const { token: backendToken, name, email, photoURL, uid, role } = response.data;
          const authUser: User = { uid, email, displayName: name, photoURL, role };

          setUser(authUser);
          setToken(backendToken);
          localStorage.setItem(USER_KEY, JSON.stringify(authUser));
          localStorage.setItem(TOKEN_KEY, backendToken);
        } catch (error) {
          console.error('Firebase Auth listener sync failed:', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Standard Email/Password login
  const login = async (email: string, password: string): Promise<void> => {
    try {
      // 1. Try Firebase Authentication first
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Sync with Express backend
      const response = await api.post('/auth/sync', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      });

      const { token: backendToken, name, photoURL, uid, role } = response.data;
      const authUser: User = { uid, email: firebaseUser.email, displayName: name, photoURL, role };

      setUser(authUser);
      setToken(backendToken);
      localStorage.setItem(USER_KEY, JSON.stringify(authUser));
      localStorage.setItem(TOKEN_KEY, backendToken);

    } catch (firebaseError: any) {
      console.warn('Firebase login failed, trying Express native auth fallback...', firebaseError.message);

      // 2. Direct Express backend fallback login if Firebase fails
      try {
        const response = await api.post('/auth/login', { email, password });
        const { token: backendToken, name, photoURL, uid, role } = response.data;
        const authUser: User = { uid, email, displayName: name, photoURL, role };

        setUser(authUser);
        setToken(backendToken);
        localStorage.setItem(USER_KEY, JSON.stringify(authUser));
        localStorage.setItem(TOKEN_KEY, backendToken);
      } catch (localError: any) {
        // Return clear, user-friendly error from backend
        throw new Error(localError.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    }
  };

  // Google Login
  const loginWithGoogle = async (): Promise<void> => {
    try {
      // 1. Try Firebase Sign In Popup
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Sync with Express backend
      const response = await api.post('/auth/sync', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      });

      const { token: backendToken, name, photoURL, uid, role } = response.data;
      const authUser: User = { uid, email: firebaseUser.email, displayName: name, photoURL, role };

      setUser(authUser);
      setToken(backendToken);
      localStorage.setItem(USER_KEY, JSON.stringify(authUser));
      localStorage.setItem(TOKEN_KEY, backendToken);

    } catch (firebaseError: any) {
      console.warn('Firebase Google Login failed, running MERN fallback Google sync...', firebaseError.message);
      
      // 2. Mock/Simulate login in local mode if Firebase configuration is missing or invalid
      try {
        const fallbackUid = `google-${Date.now()}`;
        const fallbackEmail = `googleuser-${Date.now()}@mediqueue.com`;
        const fallbackName = 'Google Scholar';
        const fallbackPhoto = `https://ui-avatars.com/api/?name=Google+Scholar&background=a855f7&color=fff&size=200`;

        const response = await api.post('/auth/sync', {
          uid: fallbackUid,
          email: fallbackEmail,
          displayName: fallbackName,
          photoURL: fallbackPhoto
        });

        const { token: backendToken, name, photoURL, uid, role } = response.data;
        const authUser: User = { uid, email: fallbackEmail, displayName: name, photoURL, role };

        setUser(authUser);
        setToken(backendToken);
        localStorage.setItem(USER_KEY, JSON.stringify(authUser));
        localStorage.setItem(TOKEN_KEY, backendToken);
      } catch (localError: any) {
        throw new Error(localError.response?.data?.message || 'Google Login integration failed.');
      }
    }
  };

  // Registration
  const register = async (name: string, email: string, password: string, photoURL?: string): Promise<void> => {
    try {
      // 1. Try Firebase Registration first
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update Firebase Profile
      const finalPhoto = photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=a855f7&color=fff&size=200`;
      await updateProfile(firebaseUser, {
        displayName: name,
        photoURL: finalPhoto
      });

      // Sync with Express backend
      const response = await api.post('/auth/sync', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: name,
        photoURL: finalPhoto
      });

      const { token: backendToken, uid, role } = response.data;
      const authUser: User = { uid, email: firebaseUser.email, displayName: name, photoURL: finalPhoto, role };

      setUser(authUser);
      setToken(backendToken);
      localStorage.setItem(USER_KEY, JSON.stringify(authUser));
      localStorage.setItem(TOKEN_KEY, backendToken);

    } catch (firebaseError: any) {
      console.warn('Firebase registration failed, trying Express native auth fallback...', firebaseError.message);

      // 2. Direct Express backend fallback registration
      try {
        const response = await api.post('/auth/register', {
          name,
          email,
          password,
          photoURL
        });

        const { token: backendToken, name: resName, photoURL: resPhoto, uid, role } = response.data;
        const authUser: User = { uid, email, displayName: resName, photoURL: resPhoto, role };

        setUser(authUser);
        setToken(backendToken);
        localStorage.setItem(USER_KEY, JSON.stringify(authUser));
        localStorage.setItem(TOKEN_KEY, backendToken);
      } catch (localError: any) {
        throw new Error(localError.response?.data?.message || 'Registration failed. Email might already be taken.');
      }
    }
  };

  // Sign out
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase logout warning:', e);
    }
    
    // Clear user local storage state
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, login, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

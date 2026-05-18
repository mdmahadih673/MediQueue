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
const ADMIN_EMAIL = 'mdmahadih673@gmail.com';

const getRole = (email: string | null | undefined, role?: string) =>
  email?.toLowerCase() === ADMIN_EMAIL ? 'admin' : (role || 'user');

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const saveSession = (authUser: User, authToken: string) => {
    setUser(authUser);
    setToken(authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    localStorage.setItem(TOKEN_KEY, authToken);
  };

  const syncWithBackend = async (firebaseUser: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  }): Promise<{ user: User; token: string } | null> => {
    try {
      const response = await api.post('/auth/sync', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      });

      const { token: backendToken, name, email, photoURL, uid, role } = response.data;
      return {
        token: backendToken,
        user: { uid, email, displayName: name, photoURL, role: getRole(email, role) }
      };
    } catch (error) {
      console.warn('Backend auth sync unavailable. Using Firebase session only.', error);
      return null;
    }
  };

  const buildFirebaseSession = async (firebaseUser: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    getIdToken?: () => Promise<string>;
  }): Promise<{ user: User; token: string }> => {
    const idToken = firebaseUser.getIdToken
      ? await firebaseUser.getIdToken()
      : `firebase-${firebaseUser.uid}`;

    return {
      token: idToken,
      user: {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'MediQueue User',
        photoURL: firebaseUser.photoURL,
        role: getRole(firebaseUser.email),
      }
    };
  };

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
        const synced = await syncWithBackend(firebaseUser);
        const session = synced || await buildFirebaseSession(firebaseUser);
        saveSession(session.user, session.token);
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
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

      const synced = await syncWithBackend(firebaseUser);
      const session = synced || await buildFirebaseSession(firebaseUser);
      saveSession(session.user, session.token);

    } catch (firebaseError: any) {
      console.warn('Firebase login failed, trying Express native auth fallback...', firebaseError.message);

      // 2. Direct Express backend fallback login if Firebase fails
      try {
        const response = await api.post('/auth/login', { email, password });
        const { token: backendToken, name, photoURL, uid, role } = response.data;
        const authUser: User = { uid, email, displayName: name, photoURL, role: getRole(email, role) };
        saveSession(authUser, backendToken);
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

      const synced = await syncWithBackend(firebaseUser);
      const session = synced || await buildFirebaseSession(firebaseUser);
      saveSession(session.user, session.token);

    } catch (firebaseError: any) {
      console.warn('Firebase Google Login failed:', firebaseError.message);
      throw new Error(firebaseError.message || 'Google Login integration failed.');
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

      const synced = await syncWithBackend({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: name,
        photoURL: finalPhoto
      });
      const session = synced || await buildFirebaseSession({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: name,
        photoURL: finalPhoto,
        getIdToken: () => firebaseUser.getIdToken()
      });
      saveSession(session.user, session.token);

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
        const authUser: User = { uid, email, displayName: resName, photoURL: resPhoto, role: getRole(email, role) };
        saveSession(authUser, backendToken);
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

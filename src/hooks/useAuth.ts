import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { Role } from '../types';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { setUser, setLoading, logout: logoutStore } = useAuthStore();

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // If we have a firebase user but no user in store, fetch from backend
          const res = await authApi.getMe();
          if (res.success) {
            setUser(res.data);
          }
        } catch (error) {
          console.error('Failed to sync user profile:', error);
          // If profile fetch fails, user might not be synced yet (e.g., after social login or if sync failed)
        }
      } else {
        logoutStore();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading, logoutStore]);

  const login = async (email: string, pass: string) => {
    if (!auth) {
      toast.error("Firebase not initialized");
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      // 1. Firebase Login
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      
      // 2. Fetch profile from backend to ensure we have the role
      const res = await authApi.getMe();
      if (res.success) {
        setUser(res.data);
        toast.success("Login successful");
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Login failed";
      setAuthError(msg);
      toast.error(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (email: string, pass: string, name: string, role: Role) => {
    if (!auth) {
      toast.error("Firebase not initialized");
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      // 1. Firebase Register
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;

      // 2. Sync with backend
      const res = await authApi.sync({
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email!,
        role,
        display_name: name
      });

      if (res.success) {
        setUser(res.data);
        toast.success("Account created successfully");
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Registration failed";
      setAuthError(msg);
      toast.error(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      logoutStore();
      toast.success("Logged out");
    } catch (err: any) {
      toast.error("Logout failed");
    }
  };

  return { login, register, logout, loading: authLoading, error: authError };
};

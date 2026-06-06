import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { auth, onAuthStateChanged, signOut as firebaseSignOut } from '../lib/firebase';
import { authApi, getFirebaseToken, setTokens, clearTokens, getRefreshToken } from '../lib/api';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  firebaseUser: null,
  role: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_FIREBASE_USER':
      return { ...state, firebaseUser: action.payload, isLoading: false };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        role: action.payload.role,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      dispatch({ type: 'SET_FIREBASE_USER', payload: firebaseUser });
      if (!firebaseUser) {
        const storedRole = localStorage.getItem('user_role');
        if (storedRole) {
          const accessToken = localStorage.getItem(`${storedRole}_access_token`);
          if (accessToken) {
            return;
          }
        }
        dispatch({ type: 'LOGOUT' });
      }
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email, password, role) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { signInWithEmailAndPassword } = await import('../lib/firebase');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseToken = await getFirebaseToken(userCredential.user);
      if (!firebaseToken) throw new Error('Failed to get authentication token');

      const response = await authApi.login(firebaseToken);
      const { access_token, refresh_token, user } = response.data;

      localStorage.setItem('user_role', role);
      setTokens(access_token, refresh_token, role);

      dispatch({
        type: 'SET_USER',
        payload: { user: { ...user, email: userCredential.user.email }, role },
      });

      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const register = useCallback(async (firebaseAction, profileData, role) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const userCredential = await firebaseAction;
      const firebaseToken = await getFirebaseToken(userCredential.user);
      if (!firebaseToken) throw new Error('Failed to get authentication token');

      const registerFn = role === 'student'
        ? authApi.registerStudent
        : authApi.registerRecruiter;

      const response = await registerFn(firebaseToken, profileData);
      const { access_token, refresh_token, user } = response.data;

      localStorage.setItem('user_role', role);
      setTokens(access_token, refresh_token, role);

      dispatch({
        type: 'SET_USER',
        payload: { user: { ...user, email: userCredential.user.email }, role },
      });

      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await authApi.logout(refreshToken).catch(() => {});
      }
    } finally {
      await firebaseSignOut(auth).catch(() => {});
      clearTokens();
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
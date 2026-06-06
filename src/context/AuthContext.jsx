import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
/* eslint-disable no-empty */
import {
  auth,
  onAuthStateChanged,
  waitForAuthReady,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut as firebaseSignOut,
} from '../lib/firebase';
import {
  authApi,
  silentRefresh,
  ApiError,
  setTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  hasStoredSession,
  getStoredUser,
  getStoredRole,
  setStoredUser,
  setStoredRole,
} from '../lib/api';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  firebaseUser: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
  isRetrying: false,
  retryMessage: null,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload.user,
        role: action.payload.role,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'SET_FIREBASE_USER':
      return { ...state, firebaseUser: action.payload };
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
      return { ...state, error: action.payload, isLoading: false, isRetrying: false };
    case 'SET_RETRYING':
      return { ...state, isRetrying: action.payload.isRetrying, retryMessage: action.payload.message || null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
}

function log(level, message, meta = {}) {
  const entry = { level, message, timestamp: new Date().toISOString(), ...meta };
  if (level === 'error') console.error(JSON.stringify(entry));
  else if (level === 'warn') console.warn(JSON.stringify(entry));
  else console.log(JSON.stringify(entry));
}

async function getFirebaseTokenWithRetry(firebaseUser) {
  if (!firebaseUser) return null;

  const uid = firebaseUser.uid;
  const email = firebaseUser.email || 'unknown';

  async function fetchToken() {
    const token = await firebaseUser.getIdToken(true);
    if (!token || typeof token !== 'string') {
      throw new Error('getIdToken returned invalid token');
    }
    return token;
  }

  try {
    const token = await fetchToken();
    log('info', 'Firebase token obtained', {
      uid,
      email,
      token_length: token.length,
    });
    return token;
  } catch (error) {
    log('warn', 'Firebase token fetch attempt 1 failed', {
      uid,
      error: error.code || error.message,
    });
    await new Promise((r) => setTimeout(r, 1500));
    try {
      const token = await fetchToken();
      log('info', 'Firebase token obtained on retry', {
        uid,
        email,
        token_length: token.length,
      });
      return token;
    } catch (retryError) {
      log('error', 'Firebase token fetch failed after retry', {
        uid,
        error: retryError.code || retryError.message,
      });
      return null;
    }
  }
}

async function exchangeToken(endpoint, firebaseToken, profileData) {
  const fn = endpoint === 'login'
    ? () => authApi.login(firebaseToken)
    : endpoint === 'registerStudent'
      ? () => authApi.registerStudent(firebaseToken, profileData)
      : () => authApi.registerRecruiter(firebaseToken, profileData);

  try {
    return await fn();
  } catch (error) {
    if (
      error.error_code === 'TOKEN_USED_TOO_EARLY' ||
      (error.message && error.message.includes('used too early'))
    ) {
      log('warn', 'Token used too early, will retry after 2s', {
        endpoint,
        error_code: error.error_code,
      });
      return { retryable: true };
    }
    throw error;
  }
}

async function waitForAuthStability() {
  try {
    await waitForAuthReady();
  } catch {}
  await new Promise((r) => setTimeout(r, 300));
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const initDone = useRef(false);
  const firebaseUnsub = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      log('info', 'Auth startup: initialization started');

      // ---------------------------------------------------------------
      // Phase 1: Try to restore session from stored tokens
      // ---------------------------------------------------------------
      if (hasStoredSession()) {
        log('info', 'Auth startup: stored session found');

        // Step A: Call /auth/me with the stored access token.
        // If the token is expired, the API interceptor will automatically
        // attempt a token refresh and retry the /auth/me call.
        let meData = null;
        try {
          const meRes = await authApi.me();
          const body = meRes.data || meRes;
          meData = { user: body.user, role: body.user?.role };
          log('info', 'Auth startup: /auth/me success', { role: meData.role });
        } catch (meErr) {
          log('warn', 'Auth startup: /auth/me failed', {
            status: meErr.status,
            code: meErr.error_code,
          });
        }

        // If /auth/me succeeded, use the fresh server data
        if (meData?.user && meData?.role) {
          setStoredUser(meData.user);
          setStoredRole(meData.role);
          if (!cancelled) {
            dispatch({ type: 'RESTORE_SESSION', payload: meData });
            log('info', 'Auth startup: session restored via /auth/me', { role: meData.role });
          }
          return;
        }

        // Step B: Check if the interceptor already cleared our session
        // (happens when token refresh failed and redirect to /session-expired)
        if (!getAccessToken()) {
          log('warn', 'Auth startup: interceptor cleared session, page may redirect');
          return;
        }

        // Step C: Try silent refresh (bypass interceptor) then /auth/me again
        const storedRefresh = getRefreshToken();
        if (storedRefresh) {
          const refreshData = await silentRefresh(storedRefresh);
          if (refreshData?.access_token) {
            const newRefresh = refreshData.refresh_token || storedRefresh;
            setTokens(refreshData.access_token, newRefresh);
            log('info', 'Auth startup: /auth/refresh success', {
              token_length: refreshData.access_token.length,
            });

            try {
              const meRes2 = await authApi.me();
              const body2 = meRes2.data || meRes2;
              const user = body2.user;
              const role = user?.role;
              if (user && role) {
                setStoredUser(user);
                setStoredRole(role);
                if (!cancelled) {
                  dispatch({ type: 'RESTORE_SESSION', payload: { user, role } });
                  log('info', 'Auth startup: /auth/me success after refresh', { role });
                }
                return;
              }
            } catch (meErr2) {
              log('error', 'Auth startup: /auth/me failed after silent refresh', {
                status: meErr2.status,
              });
            }
          }
        }

        // Step D: All restore attempts exhausted
        log('warn', 'Auth startup: all session restore attempts failed');
        clearTokens();
      } else {
        log('info', 'Auth startup: no stored session found');
      }

      // ---------------------------------------------------------------
      // Phase 2: No session restored. Wait for Firebase auth to init.
      // This covers the case where Firebase has a persisted session
      // but the app's session storage doesn't have matching tokens.
      // ---------------------------------------------------------------
      try {
        await waitForAuthReady();
      } catch {}

      if (!cancelled) {
        dispatch({ type: 'SET_LOADING', payload: false });
        initDone.current = true;
        log('info', 'Auth startup: complete (no session, awaiting Firebase or user action)');
      }
    }

    initialize();

    firebaseUnsub.current = onAuthStateChanged(auth, (firebaseUser) => {
      dispatch({ type: 'SET_FIREBASE_USER', payload: firebaseUser });
    });

    return () => {
      cancelled = true;
      if (firebaseUnsub.current) {
        firebaseUnsub.current();
      }
    };
  }, []);

  const login = useCallback(async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_RETRYING', payload: { isRetrying: false, message: null } });

    try {
      log('info', 'Firebase sign-in starting', { email });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      log('info', 'Firebase sign-in OK', { uid: fbUser.uid, email: fbUser.email });

      await waitForAuthStability();

      const firebaseToken = await getFirebaseTokenWithRetry(fbUser);
      if (!firebaseToken) {
        throw new Error('Failed to obtain Firebase authentication token');
      }

      let result = await exchangeToken('login', firebaseToken);

      if (result && result.retryable) {
        dispatch({
          type: 'SET_RETRYING',
          payload: {
            isRetrying: true,
            message: 'Signing in\u2026 syncing credentials. Please wait a moment.',
          },
        });
        await new Promise((r) => setTimeout(r, 2000));
        const retryToken = await getFirebaseTokenWithRetry(fbUser);
        if (!retryToken) {
          throw new Error('Failed to obtain Firebase token on retry');
        }
        result = await exchangeToken('login', retryToken);
        if (result && result.retryable) {
          throw new ApiError(
            'Authentication sync timed out. Please try again.',
            401,
            { error_code: 'TOKEN_USED_TOO_EARLY' },
          );
        }
      }

      const { access_token, refresh_token, user } = result.data;

      const role = user.role || 'student';

      setTokens(access_token, refresh_token);
      setStoredUser(user);
      setStoredRole(role);

      dispatch({
        type: 'SET_USER',
        payload: { user, role },
      });

      log('info', 'Login complete', { uid: fbUser.uid, role });

      return { user, role };
    } catch (error) {
      const message = error.message || error.code || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    }
  }, []);

  const register = useCallback(async (email, password, profileData, role) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_RETRYING', payload: { isRetrying: false, message: null } });

    const endpoint = role === 'student' ? 'registerStudent' : 'registerRecruiter';

    try {
      log('info', 'Firebase registration starting', { email, role });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;

      await sendEmailVerification(fbUser).catch(() => {});
      log('info', 'Firebase user created', { uid: fbUser.uid, email: fbUser.email });

      await waitForAuthStability();

      const firebaseToken = await getFirebaseTokenWithRetry(fbUser);
      if (!firebaseToken) {
        throw new Error('Failed to obtain Firebase authentication token');
      }

      let result = await exchangeToken(endpoint, firebaseToken, profileData);

      if (result && result.retryable) {
        dispatch({
          type: 'SET_RETRYING',
          payload: {
            isRetrying: true,
            message: 'Signing in\u2026 syncing credentials. Please wait a moment.',
          },
        });
        await new Promise((r) => setTimeout(r, 2000));
        const retryToken = await getFirebaseTokenWithRetry(fbUser);
        if (!retryToken) {
          throw new Error('Failed to obtain Firebase token on retry');
        }
        result = await exchangeToken(endpoint, retryToken, profileData);
        if (result && result.retryable) {
          throw new Error('Authentication sync timed out. Please try again.');
        }
      }

      const { access_token, refresh_token, user } = result.data;
      const userRole = user.role || role;

      setTokens(access_token, refresh_token);
      setStoredUser(user);
      setStoredRole(userRole);

      dispatch({
        type: 'SET_USER',
        payload: { user, role: userRole },
      });

      log('info', 'Registration complete', { uid: fbUser.uid, role: userRole });

      return { user, role: userRole };
    } catch (error) {
      const message = error.message || error.code || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    log('info', 'Logout triggered', { reason: 'user action' });
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await authApi.logout(refreshToken).catch(() => {});
      }
    } finally {
      clearTokens();
      try {
        await firebaseSignOut(auth);
      } catch {}
      dispatch({ type: 'LOGOUT' });
      log('info', 'Logout complete');
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

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function getAccessToken() {
  return (
    localStorage.getItem('student_access_token') ||
    localStorage.getItem('recruiter_access_token')
  );
}

function getRefreshToken() {
  return (
    localStorage.getItem('student_refresh_token') ||
    localStorage.getItem('recruiter_refresh_token')
  );
}

function setTokens(access, refresh, role) {
  localStorage.setItem(`${role}_access_token`, access);
  localStorage.setItem(`${role}_refresh_token`, refresh);
}

function clearTokens() {
  localStorage.removeItem('student_access_token');
  localStorage.removeItem('student_refresh_token');
  localStorage.removeItem('recruiter_access_token');
  localStorage.removeItem('recruiter_refresh_token');
  localStorage.removeItem('user_role');
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const accessToken = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  let response = await fetch(url, config);

  if (response.status === 401 && accessToken) {
    const refreshed = await attemptTokenRefresh();
    if (refreshed) {
      headers.Authorization = `Bearer ${getAccessToken()}`;
      config.headers = headers;
      response = await fetch(url, config);
    } else {
      clearTokens();
      window.location.href = '/session-expired';
      throw new ApiError('Session expired', 401, null);
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.message || data.detail || 'Something went wrong',
      response.status,
      data
    );
  }

  return data;
}

async function attemptTokenRefresh() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    const role = localStorage.getItem('user_role') || 'student';
    setTokens(data.data.access_token, data.data.refresh_token, role);
    return true;
  } catch {
    return false;
  }
}

async function getFirebaseToken(firebaseUser) {
  if (!firebaseUser) {
    console.error('[Auth] getFirebaseToken called with null/undefined user');
    return null;
  }

  const uid = firebaseUser.uid;
  const email = firebaseUser.email || 'unknown';

  async function fetchToken() {
    const token = await firebaseUser.getIdToken(true);
    if (!token || typeof token !== 'string') {
      throw new Error('getIdToken returned invalid token');
    }
    console.log(`[Auth] Token OK: uid=${uid}, email=${email}, token_length=${token.length}`);
    return token;
  }

  try {
    return await fetchToken();
  } catch (error) {
    console.warn(
      `[Auth] Token fetch failed (attempt 1): uid=${uid}, error=${error.code || error.message}`
    );
    console.log(`[Auth] Retrying token fetch for uid=${uid} after 1.5s delay...`);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const token = await fetchToken();
      return token;
    } catch (retryError) {
      console.error(
        `[Auth] Token fetch failed (attempt 2): uid=${uid}, error=${retryError.code || retryError.message}`
      );
      return null;
    }
  }
}

export const api = {
  get: (endpoint, options = {}) =>
    request(endpoint, { ...options, method: 'GET' }),

  post: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: 'POST', body }),

  put: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: 'PUT', body }),

  patch: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: 'PATCH', body }),

  delete: (endpoint, options = {}) =>
    request(endpoint, { ...options, method: 'DELETE' }),
};

export const authApi = {
  registerStudent: (firebaseToken, data) =>
    api.post('/auth/student/register', {
      firebase_token: firebaseToken,
      ...data,
    }),

  registerRecruiter: (firebaseToken, data) =>
    api.post('/auth/recruiter/register', {
      firebase_token: firebaseToken,
      ...data,
    }),

  login: (firebaseToken) =>
    api.post('/auth/login', { firebase_token: firebaseToken }),

  refresh: (refreshToken) =>
    api.post('/auth/refresh', { refresh_token: refreshToken }),

  logout: (refreshToken) =>
    api.post('/auth/logout', { refresh_token: refreshToken }),

  health: () => api.get('/health'),
};

export { getFirebaseToken, setTokens, clearTokens, getAccessToken, getRefreshToken };
export default api;
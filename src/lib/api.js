/* eslint-disable no-empty */
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

let inMemoryAccessToken = null;
let inMemoryRefreshToken = null;
let refreshPromise = null;

function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function log(level, message, meta = {}) {
  const entry = { level, message, timestamp: new Date().toISOString(), ...meta };
  if (level === 'error') {
    console.error(JSON.stringify(entry));
  } else if (level === 'warn') {
    console.warn(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.error_code = data?.error_code || null;
    this.errors = data?.errors || [];
  }
}

function loadFromStorage() {
  try {
    inMemoryAccessToken = sessionStorage.getItem('access_token');
    inMemoryRefreshToken = sessionStorage.getItem('refresh_token');
  } catch {
    inMemoryAccessToken = null;
    inMemoryRefreshToken = null;
  }
}

function saveToStorage() {
  try {
    if (inMemoryAccessToken) {
      sessionStorage.setItem('access_token', inMemoryAccessToken);
    } else {
      sessionStorage.removeItem('access_token');
    }
    if (inMemoryRefreshToken) {
      sessionStorage.setItem('refresh_token', inMemoryRefreshToken);
    } else {
      sessionStorage.removeItem('refresh_token');
    }
  } catch {}
}

export function setTokens(accessToken, refreshToken) {
  inMemoryAccessToken = accessToken;
  inMemoryRefreshToken = refreshToken;
  saveToStorage();
}

export function getAccessToken() {
  if (!inMemoryAccessToken) loadFromStorage();
  return inMemoryAccessToken;
}

export function getRefreshToken() {
  if (!inMemoryRefreshToken) loadFromStorage();
  return inMemoryRefreshToken;
}

export function clearTokens() {
  inMemoryAccessToken = null;
  inMemoryRefreshToken = null;
  refreshPromise = null;
  try {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
  } catch {}
}

export function hasStoredSession() {
  try {
    return !!(sessionStorage.getItem('refresh_token') && sessionStorage.getItem('user') && sessionStorage.getItem('role'));
  } catch {
    return false;
  }
}

export function getStoredUser() {
  try {
    const raw = sessionStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getStoredRole() {
  try {
    return sessionStorage.getItem('role');
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  try {
    sessionStorage.setItem('user', JSON.stringify(user));
  } catch {}
}

export function setStoredRole(role) {
  try {
    sessionStorage.setItem('role', role);
  } catch {}
}

async function attemptTokenRefresh() {
  if (refreshPromise) return refreshPromise;

  const token = getRefreshToken();
  if (!token) return false;

  const requestId = generateRequestId();

  refreshPromise = (async () => {
    log('info', 'Attempting token refresh', { request_id: requestId });
    try {
      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: token }),
      });

      if (!response.ok) {
        log('warn', 'Token refresh failed', {
          request_id: requestId,
          status: response.status,
        });
        return false;
      }

      const data = await response.json();
      const newAccess = data.data?.access_token;
      const newRefresh = data.data?.refresh_token;

      if (!newAccess) {
        log('error', 'Refresh response missing access_token', { request_id: requestId });
        return false;
      }

      setTokens(newAccess, newRefresh || token);
      log('info', 'Token refresh succeeded', {
        request_id: requestId,
        token_length: newAccess.length,
      });
      return true;
    } catch (err) {
      log('error', 'Token refresh network error', {
        request_id: requestId,
        message: err.message,
      });
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function normalizeError(status, body, requestId) {
  const errorCode = body?.error_code || null;
  const message = body?.message || body?.detail || 'Something went wrong';

  log('warn', 'API error', {
    request_id: requestId,
    status,
    error_code: errorCode,
  });

  return new ApiError(message, status, body);
}

async function request(endpoint, options = {}) {
  const requestId = generateRequestId();
  const url = `${BASE_URL}${endpoint}`;
  const accessToken = getAccessToken();

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options.headers,
  };

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  let config = { ...options, headers };

  if (config.body && typeof config.body === 'object' && !isFormData) {
    config.body = JSON.stringify(config.body);
  }

  log('info', 'API request', {
    request_id: requestId,
    method: options.method || 'GET',
    endpoint,
  });

  let response = await fetch(url, config);

  if (response.status === 401 && accessToken) {
    const errorBody = await response.json().catch(() => ({}));
    const errorCode = errorBody?.error_code;

    if (errorCode === 'TOKEN_USED_TOO_EARLY') {
      log('warn', 'Token used too early', { request_id: requestId });
      const error = new ApiError(
        errorBody?.message || 'Token used too early',
        401,
        errorBody,
      );
      error.retryable = true;
      throw error;
    }

    const refreshed = await attemptTokenRefresh();
    if (refreshed) {
      const newAccess = getAccessToken();
      config.headers = {
        ...headers,
        Authorization: `Bearer ${newAccess}`,
      };
      if (isFormData) {
        delete config.headers['Content-Type'];
      }
      log('info', 'Retrying request after token refresh', {
        request_id: requestId,
        endpoint,
      });
      response = await fetch(url, config);
    } else {
      log('warn', 'Token refresh failed, clearing session', { request_id: requestId });
      clearTokens();
      window.location.href = '/session-expired';
      throw new ApiError('Session expired. Please sign in again.', 401, {
        error_code: 'TOKEN_REVOKED',
      });
    }
  }

  const responseBody = await response.json().catch(() => null);

  if (!response.ok) {
    throw normalizeError(response.status, responseBody || {}, requestId);
  }

  log('info', 'API response', {
    request_id: requestId,
    status: response.status,
  });

  return responseBody;
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

  upload: (endpoint, formData, options = {}) =>
    request(endpoint, { ...options, method: 'POST', body: formData }),
};

export async function silentRefresh(refreshToken) {
  const url = `${BASE_URL}/auth/refresh`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    log('warn', 'Silent refresh failed', {
      status: response.status,
      error_code: errorBody?.error_code,
    });
    return null;
  }
  const json = await response.json();
  const data = json.data || json;
  log('info', 'Silent refresh succeeded', {
    has_access: !!data.access_token,
  });
  return data;
}

export const authApi = {
  health: () => api.get('/health'),

  me: () => api.get('/auth/me'),

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
};

export default api;

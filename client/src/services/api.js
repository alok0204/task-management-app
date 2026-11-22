const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const getAuthToken = () => {
  return localStorage.getItem('taskflow_token');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('taskflow_token', token);
  } else {
    localStorage.removeItem('taskflow_token');
  }
};

export async function apiRequest(endpoint, { method = 'GET', body = null, headers = {} } = {}) {
  const token = getAuthToken();
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const config = {
    method,
    headers: defaultHeaders,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.errors = data.errors || null;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
      // Clear token on 401
      setAuthToken(null);
    }
    throw error;
  }
}

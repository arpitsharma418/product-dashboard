import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// attach stored jwt authentication token to authorization header
api.interceptors.request.use(
  (config) => {
    try {
      const storedAuth = localStorage.getItem('dummyjson_auth');
      if (storedAuth) {
        const { token, accessToken } = JSON.parse(storedAuth);
        const authToken = accessToken || token;
        if (authToken) {
          config.headers.Authorization = `Bearer ${authToken}`;
        }
      }
    } catch (e) {
      console.error('Failed to parse auth token from localStorage', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// uniform error format and 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const status = error.response ? error.response.status : null;
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred.';

    if (status === 401) {
      localStorage.removeItem('dummyjson_auth');
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    return Promise.reject({
      status,
      message,
      originalError: error,
    });
  }
);

export default api;


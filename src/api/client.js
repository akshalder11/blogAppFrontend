import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getToken = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token || null;
  } catch {
    return null;
  }
};

const getUserId = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.id || null;
  } catch {
    return null;
  }
};

const normalizeError = (err, fallback = 'Request failed') => {
  return (
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    err?.message ||
    fallback
  );
};

const request = async (
  method,
  url,
  { data, params, headers = {}, auth = false, attachUser = false, fallbackMessage } = {}
) => {
  const config = {
    method,
    url,
    params,
    data,
    headers: { ...headers },
  };

  if (auth) {
    const token = getToken();
    if (!token) {
      throw new Error('User not authenticated');
    }
    config.headers.Authorization = `Bearer ${token}`;

    // Optionally attach user.id into payload when requested
    if (attachUser && data && typeof data === 'object' && !data.user) {
      const userId = getUserId();
      if (userId) {
        config.data = { ...data, user: { id: userId } };
      }
    }
  }

  try {
    const res = await instance(config);
    return res.data;
  } catch (err) {
    // Optional: surface useful debug info during development
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('API Error:', {
        url: `${API_BASE_URL}${url}`,
        method,
        response: err.response?.data,
        status: err.response?.status,
      });
    }
    throw new Error(normalizeError(err, fallbackMessage));
  }
};

export const api = {
  get: (url, options) => request('get', url, options),
  post: (url, data, options) => request('post', url, { ...options, data }),
  put: (url, data, options) => request('put', url, { ...options, data }),
  delete: (url, options) => request('delete', url, options),
};

export default api;

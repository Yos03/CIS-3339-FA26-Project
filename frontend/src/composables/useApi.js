import axios from 'axios';

// One shared Axios client keeps API requests consistent across the frontend.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_ROOT_API || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach the current token at request time so restored sessions and login/logout
// changes are reflected without relying on stale Axios default headers.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');

  config.headers = config.headers || {};
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

export function useApi() {
  return apiClient;
}

export default useApi;

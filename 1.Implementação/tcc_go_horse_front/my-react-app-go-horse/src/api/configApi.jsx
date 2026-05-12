export const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

export function buildUrl(path) {
  if (!path) return BASE_URL;
  return `${BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
export function getAuthHeaders() {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

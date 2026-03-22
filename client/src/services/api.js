import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error.response?.data || { message: 'Network error' });
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me').catch(() => api.get('/users/profile/me')),
  refreshToken: (token) => api.post('/auth/refresh-token', { refreshToken: token }),
  sendVerification: () => api.post('/auth/send-verification'),
  verifyEmail: (token) => api.post(`/auth/verify-email/${token}`),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
};

export const userAPI = {
  getProfile: (id) => api.get(`/users/profile/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  getUserByGithub: (username) => api.get(`/users/github/${username}`),
  linkGitHub: (username) => api.post('/users/link-github', { username }),
  getVerifiedStatus: () => api.get('/users/verified-status'),
  getUserSkills: () => api.get('/users/skills'),
  searchUsers: (params) => api.get('/users/search', { params }),
};

export const projectAPI = {
  create: (data) => api.post('/projects', data),
  getAll: (params) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  addCollaborator: (id, data) => api.post(`/projects/${id}/collaborators`, data),
  removeCollaborator: (id, userId) => api.delete(`/projects/${id}/collaborators/${userId}`),
  getMatches: () => api.get('/projects/match'),
  search: (q) => api.get('/projects/search', { params: { q } }),
};

export const jobAPI = {
  create: (data) => api.post('/jobs', data),
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  apply: (id) => api.post(`/jobs/${id}/apply`),
  getApplications: (id) => api.get(`/jobs/${id}/applications`),
  recommend: () => api.get('/jobs/recommend'),
};

export const activityAPI = {
  create: (data) => api.post('/activities', data),
  getFeed: (params) => api.get('/activities/feed', { params }),
  getUserActivities: (userId) => api.get(`/activities/user/${userId}`),
  filter: (params) => api.get('/activities/filter', { params }),
  delete: (id) => api.delete(`/activities/${id}`),
};

export default api;

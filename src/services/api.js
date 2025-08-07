import axios from 'axios';

const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }
  return `http://${hostname}:3001`;
};

const API_BASE = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
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
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error.response?.data?.message || error.message);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  validateToken: (token) => api.get('/auth/validate', { 
    headers: { Authorization: `Bearer ${token}` } 
  }),
};

export const usersAPI = {
  getOnlineUsers: () => api.get('/users/online').catch(() => []),
  updateProfile: (data) => api.put('/users/profile', data),
  getUserById: (id) => api.get(`/users/${id}`).catch(() => null),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const roomsAPI = {
  getRooms: () => api.get('/rooms').catch(() => []),
  createRoom: (roomData) => api.post('/rooms', roomData),
  joinRoom: (roomId) => api.post(`/rooms/${roomId}/join`),
};

export const messagesAPI = {
  getRecentMessages: () => api.get('/messages/recent').catch(() => []),
  getMessagesByRoom: (roomId) => api.get(`/messages/room/${roomId}`).catch(() => []),
  sendPrivateMessage: (recipientId, content) => 
    api.post('/messages/private', { recipientId, content }),
};

export const appAPI = {
  getEvents: () => api.get('/events').catch(() => []),
};

export const networkAPI = {
  checkConnection: async () => {
    try {
      const response = await api.get('/health');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },
  getNetworkInfo: () => ({
    hostname: window.location.hostname,
    port: '3001',
    protocol: 'http',
    fullUrl: API_BASE,
    socketUrl: API_BASE,
  }),
};
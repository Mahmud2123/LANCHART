const API_BASE = 'http://localhost:3001';

export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      throw new Error((await response.json()).message || 'Authentication failed');
    }
    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error((await response.json()).message || 'Registration failed');
    }
    return response.json();
  },
};

export const roomsAPI = {
  getRooms: async (category) => {
    const token = localStorage.getItem('token');
    const url = category ? `${API_BASE}/rooms?category=${category}` : `${API_BASE}/rooms`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error((await response.json()).message || 'Failed to fetch rooms');
    }
    return response.json();
  },

  createRoom: async (roomData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/rooms/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(roomData),
    });
    if (!response.ok) {
      throw new Error((await response.json()).message || 'Failed to create room');
    }
    return response.json();
  },
};

export const usersAPI = {
  getOnlineUsers: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/users/online`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error((await response.json()).message || 'Failed to fetch online users');
    }
    return response.json();
  },

  uploadAvatar: async (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE}/users/upload-avatar`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) {
      throw new Error((await response.json()).message || 'Failed to upload avatar');
    }
    return response.json();
  },
};

export const messagesAPI = {
  sendPrivateMessage: async (recipientId, content) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/messages/private`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ recipientId, content }),
    });
    if (!response.ok) {
      throw new Error((await response.json()).message || 'Failed to send private message');
    }
    return response.json();
  },
};
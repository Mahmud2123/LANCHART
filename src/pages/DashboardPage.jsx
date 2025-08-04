import React, { useState, useEffect } from 'react';
import { LogOut, User, Settings, MessageSquare, Sun, Moon } from 'lucide-react';
import { roomsAPI, usersAPI } from '../services/api';
import axios from 'axios';

function DashboardPage({ user, darkMode, setDarkMode, onLogout, onNavigateToProfile, onNavigateToSettings, onNavigateToRooms, onNavigateToChat }) {
  const [rooms, setRooms] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsResponse, onlineUsersResponse] = await Promise.all([
          roomsAPI.getRooms(),
          usersAPI.getOnlineUsers(),
        ]);
        setRooms(roomsResponse);
        setOnlineUsers(onlineUsersResponse);

        // Fetch recent messages (assuming an endpoint exists)
        const messagesResponse = await axios.get('http://localhost:3001/messages/recent', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setRecentMessages(messagesResponse.data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:3001/auth/logout',
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      localStorage.removeItem('token');
      onLogout();
    } catch (err) {
      setError('Failed to logout');
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 relative z-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Welcome, {user.username}!
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={onNavigateToProfile}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
          >
            <User size={20} />
          </button>
          <button
            onClick={onNavigateToSettings}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={onNavigateToRooms}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
          >
            <MessageSquare size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="p-3 rounded-full bg-red-500/20 border border-red-500/50 text-white hover:bg-red-500/30 transition-all duration-300"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-center animate-pulse">
          {error}
        </div>
      )}

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Rooms */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-bold text-white mb-4">Your Rooms</h2>
          <div className="space-y-4">
            {rooms.slice(0, 3).map((room) => (
              <button
                key={room.id}
                onClick={() => {
                  localStorage.setItem('selectedRoomId', room.id);
                  onNavigateToChat();
                }}
                className="w-full p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 text-left"
              >
                <h3 className="text-lg font-semibold text-white">{room.name}</h3>
                <p className="text-white/60 text-sm">{room.description}</p>
                <p className="text-white/80 text-sm">Members: {room.memberCount}</p>
              </button>
            ))}
            <button
              onClick={onNavigateToRooms}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold"
            >
              View All Rooms
            </button>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Messages</h2>
          <div className="space-y-4">
            {recentMessages.slice(0, 3).map((msg) => (
              <div key={msg.id} className="p-3 bg-white/5 rounded-xl">
                <span className="font-semibold text-purple-400">{msg.user.username}: </span>
                <span className="text-white/80">{msg.content}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Online Users */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-bold text-white mb-4">Online Users</h2>
          <div className="space-y-4">
            {onlineUsers.map((onlineUser) => (
              <div key={onlineUser.id} className="flex items-center p-3 bg-white/5 rounded-xl">
                <img
                  src={onlineUser.avatar}
                  alt={onlineUser.username}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="text-white font-semibold">{onlineUser.username}</p>
                  <p className="text-white/60 text-sm">{onlineUser.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
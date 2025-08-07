// pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { LogOut, User, Settings, MessageSquare, Sun, Moon, Users, Clock, TrendingUp, Activity } from 'lucide-react';
import { roomsAPI, usersAPI, messagesAPI } from '../services/api';

function DashboardPage({ user, darkMode, setDarkMode, onLogout, onNavigateToProfile, onNavigateToSettings, onNavigateToRooms, onNavigateToChat }) {
  const [rooms, setRooms] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalUsers: 0,
    messagesCount: 0,
    activeToday: 0
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [roomsResponse, onlineUsersResponse, messagesResponse] = await Promise.all([
          roomsAPI.getRooms(),
          usersAPI.getOnlineUsers(),
          messagesAPI.getRecentMessages(),
        ]);
        
        setRooms(roomsResponse || []);
        setOnlineUsers(onlineUsersResponse || []);
        setRecentMessages(messagesResponse || []);
        
        // Calculate stats
        setStats({
          totalRooms: roomsResponse?.length || 0,
          totalUsers: onlineUsersResponse?.length || 0,
          messagesCount: messagesResponse?.length || 0,
          activeToday: onlineUsersResponse?.filter(u => u.isOnline)?.length || 0
        });
        
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      onLogout();
    } catch (err) {
      setError('Failed to logout');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen p-6 relative z-10">
        <div className="flex items-center justify-center flex-1">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="ml-4 text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-6 relative z-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl font-extrabold text-white mb-2">
            Welcome back, 
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              {user.username}
            </span>
            ! 👋
          </h1>
          <p className="text-white/70 text-lg">Ready to connect and chat?</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={onNavigateToProfile}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            <User size={20} />
          </button>
          <button
            onClick={onNavigateToSettings}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={onNavigateToRooms}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            <MessageSquare size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="p-3 rounded-full bg-red-500/20 border border-red-500/50 text-white hover:bg-red-500/30 transition-all duration-300 hover:scale-110"
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm font-medium">Total Rooms</p>
              <p className="text-3xl font-bold text-white">{stats.totalRooms}</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-2xl">
              <MessageSquare className="text-purple-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm font-medium">Online Users</p>
              <p className="text-3xl font-bold text-white">{stats.activeToday}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-2xl">
              <Users className="text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm font-medium">Recent Messages</p>
              <p className="text-3xl font-bold text-white">{stats.messagesCount}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-2xl">
              <TrendingUp className="text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm font-medium">Your Status</p>
              <p className="text-lg font-semibold text-white">{user.status || 'Available'}</p>
            </div>
            <div className="p-3 bg-pink-500/20 rounded-2xl">
              <Activity className="text-pink-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Recent Rooms */}
        <div className="lg:col-span-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <MessageSquare className="mr-3 text-purple-400" size={24} />
            Your Rooms
          </h2>
          <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
            {rooms.slice(0, 5).map((room) => (
              <button
                key={room.id}
                onClick={() => {
                  localStorage.setItem('selectedRoomId', room.id);
                  onNavigateToChat();
                }}
                className="w-full p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {room.name}
                    </h3>
                    <p className="text-white/60 text-sm line-clamp-2">{room.description}</p>
                    <div className="flex items-center mt-2 text-white/50 text-xs">
                      <Users size={12} className="mr-1" />
                      {room.memberCount || 0} members
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </button>
            ))}
            {rooms.length === 0 && (
              <div className="text-center text-white/60 py-8">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                <p>No rooms available</p>
              </div>
            )}
          </div>
          <button
            onClick={onNavigateToRooms}
            className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold hover:scale-105"
          >
            View All Rooms
          </button>
        </div>

        {/* Recent Messages */}
        <div className="lg:col-span-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Clock className="mr-3 text-blue-400" size={24} />
            Recent Activity
          </h2>
          <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                <div className="flex items-start space-x-3">
                  <img
                    src={msg.user?.avatar || 'https://via.placeholder.com/40'}
                    alt={msg.user?.username || 'User'}
                    className="w-10 h-10 rounded-full ring-2 ring-purple-500/30"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-purple-400 text-sm">
                        {msg.user?.username || 'Unknown'}
                      </span>
                      <span className="text-white/40 text-xs">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm mt-1 line-clamp-2">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {recentMessages.length === 0 && (
              <div className="text-center text-white/60 py-8">
                <Clock size={48} className="mx-auto mb-4 opacity-50" />
                <p>No recent messages</p>
              </div>
            )}
          </div>
        </div>

        {/* Online Users */}
        <div className="lg:col-span-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Users className="mr-3 text-green-400" size={24} />
            Online Now ({onlineUsers.length})
          </h2>
          <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
            {onlineUsers.map((onlineUser) => (
              <div key={onlineUser.id} className="flex items-center p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 group">
                <div className="relative">
                  <img
                    src={onlineUser.avatar || 'https://via.placeholder.com/40'}
                    alt={onlineUser.username}
                    className="w-12 h-12 rounded-full ring-2 ring-green-500/30"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white/20 animate-pulse"></div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-white font-semibold group-hover:text-green-300 transition-colors">
                    {onlineUser.username}
                  </p>
                  <p className="text-white/60 text-sm">{onlineUser.status || 'Available'}</p>
                </div>
                <button className="p-2 bg-green-500/20 rounded-full hover:bg-green-500/30 transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <MessageSquare size={16} className="text-green-400" />
                </button>
              </div>
            ))}
            {onlineUsers.length === 0 && (
              <div className="text-center text-white/60 py-8">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p>No users online</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={onNavigateToChat}
          className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 hover:scale-105 group"
        >
          <MessageSquare className="text-purple-400 group-hover:text-purple-300 mb-3" size={32} />
          <h3 className="text-white font-semibold text-lg mb-2">Start Chatting</h3>
          <p className="text-white/70 text-sm">Jump into conversations</p>
        </button>

        <button
          onClick={onNavigateToRooms}
          className="p-6 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 hover:scale-105 group"
        >
          <Users className="text-blue-400 group-hover:text-blue-300 mb-3" size={32} />
          <h3 className="text-white font-semibold text-lg mb-2">Explore Rooms</h3>
          <p className="text-white/70 text-sm">Find new communities</p>
        </button>

        <button
          onClick={onNavigateToProfile}
          className="p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300 hover:scale-105 group"
        >
          <User className="text-green-400 group-hover:text-green-300 mb-3" size={32} />
          <h3 className="text-white font-semibold text-lg mb-2">Profile Settings</h3>
          <p className="text-white/70 text-sm">Customize your presence</p>
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default DashboardPage;
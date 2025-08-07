// pages/RoomsPage.jsx
import React, { useState, useEffect } from 'react';
import { roomsAPI, usersAPI, messagesAPI } from '../services/api';
import { Sun, Moon, ArrowLeft, PlusCircle, MessageSquare, Users, Search, Filter, Hash, Globe, Lock, Star } from 'lucide-react';

function RoomsPage({ darkMode, setDarkMode, onBack, onSelectRoom }) {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ 
    name: '', 
    description: '', 
    category: 'general',
    isPrivate: false 
  });
  const [isCreating, setIsCreating] = useState(false);
  const [privateMessageUser, setPrivateMessageUser] = useState(null);
  const [privateMessage, setPrivateMessage] = useState('');

  const categories = [
    { id: 'all', name: 'All Rooms', icon: Globe },
    { id: 'general', name: 'General', icon: Hash },
    { id: 'tech', name: 'Technology', icon: '💻' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'private', name: 'Private', icon: Lock },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [roomsResponse, onlineUsersResponse] = await Promise.all([
          roomsAPI.getRooms(),
          usersAPI.getOnlineUsers(),
        ]);
        setRooms(roomsResponse || []);
        setOnlineUsers(onlineUsersResponse || []);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load data');
        console.error('Rooms fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter rooms based on search and category
  useEffect(() => {
    let filtered = rooms;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(room =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(room => 
        room.category === selectedCategory || 
        (selectedCategory === 'private' && room.isPrivate)
      );
    }

    setFilteredRooms(filtered);
  }, [rooms, searchTerm, selectedCategory]);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!createForm.name.trim()) {
      setError('Room name is required');
      return;
    }
    
    setIsCreating(true);
    try {
      const newRoom = await roomsAPI.createRoom(createForm);
      setRooms(prev => [newRoom, ...prev]);
      setCreateForm({ name: '', description: '', category: 'general', isPrivate: false });
      setShowCreateModal(false);
      setError('');
      
      // Navigate to the new room
      localStorage.setItem('selectedRoomId', newRoom.id);
      onSelectRoom();
    } catch (err) {
      setError(err.message || 'Failed to create room');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendPrivateMessage = async () => {
    if (!privateMessage.trim() || !privateMessageUser) return;
    
    try {
      const newRoom = await messagesAPI.sendPrivateMessage(privateMessageUser.id, privateMessage);
      setPrivateMessage('');
      setPrivateMessageUser(null);
      setRooms(prev => [newRoom, ...prev]);
      localStorage.setItem('selectedRoomId', newRoom.id);
      onSelectRoom();
    } catch (err) {
      setError(err.message || 'Failed to send private message');
    }
  };

  const joinRoom = (room) => {
    localStorage.setItem('selectedRoomId', room.id);
    onSelectRoom();
  };

  const getRoomIcon = (room) => {
    if (room.isPrivate) return <Lock size={16} className="text-yellow-400" />;
    
    const categoryIcons = {
      general: <Hash size={16} className="text-blue-400" />,
      tech: '💻',
      gaming: '🎮',
      music: '🎵',
      sports: '⚽',
    };
    
    return categoryIcons[room.category] || <Hash size={16} className="text-blue-400" />;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen p-6 relative z-10">
        <div className="flex items-center justify-center flex-1">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="ml-4 text-white text-lg">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-6 relative z-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 mr-4"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Explore Rooms
            </h1>
            <p className="text-white/70 mt-1">Discover communities and start conversations</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-110"
          >
            <PlusCircle size={20} />
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-center animate-pulse">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-4 overflow-x-auto pb-2">
          <Filter className="text-white/60 flex-shrink-0" size={20} />
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 flex-shrink-0 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:scale-105'
                }`}
              >
                {typeof IconComponent === 'string' ? (
                  <span className="text-sm">{IconComponent}</span>
                ) : (
                  <IconComponent size={16} />
                )}
                <span className="text-sm">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1">
        {/* Main Rooms Grid */}
        <div className="xl:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {selectedCategory === 'all' ? 'All Rooms' : categories.find(c => c.id === selectedCategory)?.name} 
              <span className="text-white/60 text-lg ml-2">({filteredRooms.length})</span>
            </h2>
          </div>
          
          {filteredRooms.length > 0 ? (
            <div className="grid gap-4">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:scale-105 transition-all duration-300 cursor-pointer"
                  onClick={() => joinRoom(room)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {getRoomIcon(room)}
                        <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
                          {room.name}
                        </h3>
                        {room.isPrivate && (
                          <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-yellow-300 text-xs">
                            Private
                          </span>
                        )}
                      </div>
                      
                      <p className="text-white/70 text-sm mb-4 line-clamp-2">
                        {room.description || 'No description available'}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-white/50 text-sm">
                          <div className="flex items-center">
                            <Users size={14} className="mr-1" />
                            {room.memberCount || 0} members
                          </div>
                          <div className="flex items-center">
                            <MessageSquare size={14} className="mr-1" />
                            Active now
                          </div>
                        </div>
                        
                        <button className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 opacity-0 group-hover:opacity-100">
                          Join Room
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white/60 py-16">
              <MessageSquare size={64} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No rooms found</h3>
              <p className="mb-6">
                {searchTerm ? 'Try a different search term' : 'Be the first to create a room in this category'}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold"
              >
                Create New Room
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Community Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Total Rooms</span>
                <span className="text-2xl font-bold text-purple-400">{rooms.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Online Users</span>
                <span className="text-2xl font-bold text-green-400">{onlineUsers.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Active Rooms</span>
                <span className="text-2xl font-bold text-blue-400">{filteredRooms.length}</span>
              </div>
            </div>
          </div>

          {/* Online Users */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Users className="mr-2 text-green-400" size={20} />
              Online Users ({onlineUsers.length})
            </h3>
            
            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
              {onlineUsers.map((onlineUser) => (
                <div key={onlineUser.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 group">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={onlineUser.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + onlineUser.username}
                        alt={onlineUser.username}
                        className="w-10 h-10 rounded-full ring-2 ring-green-500/30"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white/20"></div>
                    </div>
                    <div>
                      <p className="text-white font-semibold group-hover:text-green-300 transition-colors">
                        {onlineUser.username}
                      </p>
                      <p className="text-white/60 text-sm">{onlineUser.status || 'Available'}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPrivateMessageUser(onlineUser);
                    }}
                    className="p-2 bg-green-500/20 rounded-full hover:bg-green-500/30 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <MessageSquare size={16} className="text-green-400" />
                  </button>
                </div>
              ))}
              
              {onlineUsers.length === 0 && (
                <div className="text-center text-white/60 py-8">
                  <Users size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No users online</p>
                </div>
              )}
            </div>
          </div>

          {/* Featured Rooms */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Star className="mr-2 text-yellow-400" size={20} />
              Featured
            </h3>
            
            <div className="space-y-3">
              {rooms.slice(0, 3).map((room) => (
                <button
                  key={room.id}
                  onClick={() => joinRoom(room)}
                  className="w-full p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {getRoomIcon(room)}
                    <h4 className="font-semibold text-white text-sm group-hover:text-purple-300">{room.name}</h4>
                  </div>
                  <p className="text-white/60 text-xs line-clamp-2">{room.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Room</h2>
            
            <form onSubmit={handleCreateRoom} className="space-y-5">
              <div>
                <input
                  type="text"
                  placeholder="Room Name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  required
                />
              </div>
              
              <div>
                <textarea
                  placeholder="Description (optional)"
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 resize-none"
                  rows={3}
                />
              </div>
              
              <div>
                <select
                  value={createForm.category}
                  onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                >
                  <option value="general" className="bg-gray-800">General</option>
                  <option value="tech" className="bg-gray-800">Technology</option>
                  <option value="gaming" className="bg-gray-800">Gaming</option>
                  <option value="music" className="bg-gray-800">Music</option>
                  <option value="sports" className="bg-gray-800">Sports</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={createForm.isPrivate}
                  onChange={(e) => setCreateForm({ ...createForm, isPrivate: e.target.checked })}
                  className="w-5 h-5 rounded border-2 border-white/20 bg-white/10 checked:bg-purple-500 checked:border-purple-500 focus:ring-2 focus:ring-purple-500"
                />
                <label htmlFor="isPrivate" className="text-white text-sm">Make this room private</label>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={isCreating || !createForm.name.trim()}
                  className="flex-1 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 font-semibold"
                >
                  {isCreating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Room'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateForm({ name: '', description: '', category: 'general', isPrivate: false });
                  }}
                  className="flex-1 p-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Private Message Modal */}
      {privateMessageUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">
              Message {privateMessageUser.username}
            </h2>
            
            <div className="flex items-center space-x-3 mb-6 p-4 bg-white/5 rounded-xl">
              <img
                src={privateMessageUser.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + privateMessageUser.username}
                alt={privateMessageUser.username}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="text-white font-semibold">{privateMessageUser.username}</p>
                <p className="text-white/60 text-sm">{privateMessageUser.status}</p>
              </div>
            </div>
            
            <textarea
              value={privateMessage}
              onChange={(e) => setPrivateMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 resize-none"
              rows={4}
            />
            
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleSendPrivateMessage}
                disabled={!privateMessage.trim()}
                className="flex-1 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 font-semibold"
              >
                Send Message
              </button>
              <button
                onClick={() => {
                  setPrivateMessageUser(null);
                  setPrivateMessage('');
                }}
                className="flex-1 p-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

export default RoomsPage;
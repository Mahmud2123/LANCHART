import React, { useState, useEffect } from 'react';
import { roomsAPI, usersAPI, messagesAPI } from '../services/api';
import { Sun, Moon, ArrowLeft, PlusCircle, MessageSquare } from 'lucide-react';

function RoomsPage({ darkMode, setDarkMode, onBack, onSelectRoom }) {
  const [rooms, setRooms] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', description: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [privateMessageUser, setPrivateMessageUser] = useState(null);
  const [privateMessage, setPrivateMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsResponse, onlineUsersResponse] = await Promise.all([
          roomsAPI.getRooms(),
          usersAPI.getOnlineUsers(),
        ]);
        setRooms(roomsResponse);
        setOnlineUsers(onlineUsersResponse);
      } catch (err) {
        setError(err.message || 'Failed to load data');
      }
    };
    fetchData();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!createForm.name.trim()) {
      setError('Room name is required');
      return;
    }
    setIsCreating(true);
    try {
      const newRoom = await roomsAPI.createRoom(createForm);
      setRooms((prev) => [...prev, newRoom]);
      setCreateForm({ name: '', description: '' });
      setShowCreateModal(false);
      setError('');
      onSelectRoom();
      localStorage.setItem('selectedRoomId', newRoom.id);
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
      setRooms((prev) => [...prev, newRoom]);
      onSelectRoom();
      localStorage.setItem('selectedRoomId', newRoom.id);
    } catch (err) {
      setError(err.message || 'Failed to send private message');
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 relative z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md"></div>
      <div className="flex justify-between items-center mb-8 relative z-10">
        <button
          onClick={onBack}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-4xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Rooms
        </h1>
        <div className="flex space-x-4">
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

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-center animate-pulse">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold text-white mb-4">Available Rooms</h2>
          <div className="grid gap-4">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => {
                  onSelectRoom();
                  localStorage.setItem('selectedRoomId', room.id);
                }}
                className="p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white hover:bg-white/20 hover:scale-105 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold">{room.name}</h3>
                <p className="text-white/60 text-sm">{room.description}</p>
                <p className="text-white/80 text-sm mt-2">Members: {room.memberCount}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Online Users</h2>
          <div className="space-y-4">
            {onlineUsers.map((onlineUser) => (
              <div key={onlineUser.id} className="flex items-center p-3 bg-white/10 backdrop-blur-lg rounded-xl hover:bg-white/20 transition-all duration-300">
                <img
                  src={onlineUser.avatar}
                  alt={onlineUser.username}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div className="flex-1">
                  <p className="text-white font-semibold">{onlineUser.username}</p>
                  <p className="text-white/60 text-sm">{onlineUser.status}</p>
                </div>
                <button
                  onClick={() => setPrivateMessageUser(onlineUser)}
                  className="p-2 bg-purple-500/20 rounded-full hover:bg-purple-500/30 transition-all duration-300"
                >
                  <MessageSquare size={16} className="text-purple-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Room</h2>
            <form onSubmit={handleCreateRoom} className="space-y-5">
              <input
                type="text"
                placeholder="Room Name"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                rows={3}
              />
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isCreating || !createForm.name.trim()}
                  className="flex-1 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50"
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
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 p-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {privateMessageUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">Message {privateMessageUser.username}</h2>
            <textarea
              value={privateMessage}
              onChange={(e) => setPrivateMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              rows={4}
            />
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleSendPrivateMessage}
                disabled={!privateMessage.trim()}
                className="flex-1 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50"
              >
                Send
              </button>
              <button
                onClick={() => setPrivateMessageUser(null)}
                className="flex-1 p-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomsPage;
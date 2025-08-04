import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { LogOut, User, Settings, MessageSquare, Sun, Moon } from 'lucide-react';

const socket = io('http://localhost:3001', {
  auth: { token: localStorage.getItem('token') },
});

function ChatPage({ user, darkMode, setDarkMode, onLogout, onNavigateToProfile, onNavigateToSettings, onNavigateToRooms }) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:3001/rooms', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setRooms(response.data);
        const storedRoomId = localStorage.getItem('selectedRoomId');
        if (storedRoomId) {
          const room = response.data.find((r) => r.id === parseInt(storedRoomId));
          setSelectedRoom(room || response.data[0]);
        } else if (response.data.length > 0) {
          setSelectedRoom(response.data[0]);
        }
      } catch (err) {
        setError('Failed to load rooms');
      }
    };
    fetchRooms();

    socket.on('connect_error', (err) => {
      setError('Failed to connect to chat server');
    });

    return () => {
      socket.off('connect_error');
    };
  }, []);

  useEffect(() => {
    if (!selectedRoom) return;

    socket.emit('joinRoom', selectedRoom.id);

    socket.on('messages', (msgs) => {
      setMessages(msgs);
      scrollToBottom();
    });

    socket.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    socket.on('userJoined', ({ userId, username }) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), content: `${username} joined the room`, user: { username: 'System' } },
      ]);
      scrollToBottom();
    });

    socket.on('userLeft', ({ userId, username }) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), content: `${username} left the room`, user: { username: 'System' } },
      ]);
      scrollToBottom();
    });

    socket.on('userTyping', ({ username, isTyping }) => {
      if (isTyping) {
        setTypingUsers((prev) => [...new Set([...prev, username])]);
      } else {
        setTypingUsers((prev) => prev.filter((u) => u !== username));
      }
    });

    socket.on('error', ({ message }) => {
      setError(message);
    });

    return () => {
      socket.emit('leaveRoom', selectedRoom.id);
      socket.off();
    };
  }, [selectedRoom]);

  useEffect(() => {
    if (!selectedRoom) return;
    socket.emit('typing', { roomId: selectedRoom.id, isTyping });
  }, [isTyping, selectedRoom]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedRoom) return;
    socket.emit('sendMessage', { content: messageInput, roomId: selectedRoom.id });
    setMessageInput('');
    setIsTyping(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:3001/auth/logout',
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      localStorage.removeItem('token');
      socket.disconnect();
      onLogout();
    } catch (err) {
      setError('Failed to logout');
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 relative z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md"></div>
      <div className="flex justify-between items-center mb-8 relative z-10">
        <h1 className="text-4xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          LANChart Chat
        </h1>
        <div className="flex space-x-4">
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

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-center animate-pulse">
          {error}
        </div>
      )}

      <div className="mb-6 relative z-10">
        <h2 className="text-2xl font-bold text-white mb-3">Rooms</h2>
        <div className="flex space-x-3 overflow-x-auto py-2">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`py-3 px-5 rounded-xl transition-all duration-300 ${
                selectedRoom?.id === room.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:scale-105'
              }`}
            >
              {room.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 overflow-y-auto relative z-10">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-3 p-3 rounded-xl ${
              msg.user.username === 'System'
                ? 'text-white/60 italic text-center'
                : msg.user.username === user.username
                ? 'bg-purple-500/20 ml-auto max-w-md text-right'
                : 'bg-white/20 mr-auto max-w-md'
            } transition-all duration-300`}
          >
            <div className="flex items-center space-x-2">
              <img src={msg.user.avatar} alt={msg.user.username} className="w-8 h-8 rounded-full" />
              <span className="font-semibold text-purple-400">{msg.user.username}</span>
            </div>
            <p className="text-white mt-1">{msg.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {typingUsers.length > 0 && (
        <div className="text-white/60 mt-3 relative z-10">
          {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
        </div>
      )}

      {selectedRoom && (
        <div className="mt-6 flex space-x-3 relative z-10">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => {
              setMessageInput(e.target.value);
              setIsTyping(e.target.value.trim() !== '');
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
            placeholder="Type a message..."
            className="flex-1 p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
          />
          <button
            onClick={sendMessage}
            className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatPage;
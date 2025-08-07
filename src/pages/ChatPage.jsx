// pages/ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { LogOut, User, Settings, MessageSquare, Sun, Moon, Send, Smile, Paperclip, MoreVertical, ArrowLeft } from 'lucide-react';
import { roomsAPI } from '../services/api';

function ChatPage({ user, darkMode, setDarkMode, onLogout, onNavigateToProfile, onNavigateToSettings, onNavigateToRooms, onBack }) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const connectSocket = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      try {
        socketRef.current = io('http://localhost:3001', {
          auth: { token },
          transports: ['websocket', 'polling'],
          timeout: 20000,
          forceNew: true
        });

        socketRef.current.on('connect', () => {
          console.log('Connected to chat server');
          setConnectionStatus('connected');
          setRetryCount(0);
          setError('');
        });

        socketRef.current.on('connect_error', (err) => {
          console.error('Socket connection error:', err);
          setConnectionStatus('error');
          setError(`Connection failed: ${err.message}`);
          
          // Retry logic
          if (retryCount < 3) {
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
              connectSocket();
            }, 2000 * (retryCount + 1));
          }
        });

        socketRef.current.on('disconnect', (reason) => {
          console.log('Disconnected:', reason);
          setConnectionStatus('disconnected');
          if (reason === 'io server disconnect') {
            connectSocket();
          }
        });

        socketRef.current.on('messages', (msgs) => {
          setMessages(msgs || []);
          scrollToBottom();
        });

        socketRef.current.on('newMessage', (msg) => {
          setMessages((prev) => [...prev, msg]);
          scrollToBottom();
        });

        socketRef.current.on('userJoined', ({ userId, username }) => {
          setMessages((prev) => [
            ...prev,
            { 
              id: Date.now(), 
              content: `${username} joined the room`, 
              user: { username: 'System', avatar: '' },
              timestamp: new Date().toISOString()
            },
          ]);
          scrollToBottom();
        });

        socketRef.current.on('userLeft', ({ userId, username }) => {
          setMessages((prev) => [
            ...prev,
            { 
              id: Date.now(), 
              content: `${username} left the room`, 
              user: { username: 'System', avatar: '' },
              timestamp: new Date().toISOString()
            },
          ]);
          scrollToBottom();
        });

        socketRef.current.on('userTyping', ({ username, isTyping }) => {
          if (isTyping) {
            setTypingUsers((prev) => [...new Set([...prev, username])]);
          } else {
            setTypingUsers((prev) => prev.filter((u) => u !== username));
          }
        });

        socketRef.current.on('roomUsers', (users) => {
          setOnlineUsers(users || []);
        });

        socketRef.current.on('error', ({ message }) => {
          setError(message);
        });

      } catch (err) {
        console.error('Socket initialization error:', err);
        setError('Failed to initialize chat connection');
      }
    };

    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [retryCount]);

  // Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await roomsAPI.getRooms();
        setRooms(response || []);
        
        const storedRoomId = localStorage.getItem('selectedRoomId');
        if (storedRoomId && response) {
          const room = response.find((r) => r.id === parseInt(storedRoomId));
          setSelectedRoom(room || response[0]);
        } else if (response && response.length > 0) {
          setSelectedRoom(response[0]);
        }
      } catch (err) {
        setError('Failed to load rooms');
        console.error('Rooms fetch error:', err);
      }
    };
    
    fetchRooms();
  }, []);

  // Handle room selection
  useEffect(() => {
    if (!selectedRoom || !socketRef.current) return;

    socketRef.current.emit('joinRoom', selectedRoom.id);
    localStorage.setItem('selectedRoomId', selectedRoom.id);

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leaveRoom', selectedRoom.id);
      }
    };
  }, [selectedRoom]);

  // Handle typing indicator
  useEffect(() => {
    if (!selectedRoom || !socketRef.current) return;
    
    socketRef.current.emit('typing', { roomId: selectedRoom.id, isTyping });
  }, [isTyping, selectedRoom]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedRoom || !socketRef.current) return;
    
    socketRef.current.emit('sendMessage', { 
      content: messageInput, 
      roomId: selectedRoom.id 
    });
    setMessageInput('');
    setIsTyping(false);
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const handleLogout = async () => {
    try {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
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

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <div className="flex flex-col h-screen p-6 relative z-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 mr-4"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              LANChart Chat
            </h1>
            <div className="flex items-center mt-2">
              <div className={`w-3 h-3 rounded-full mr-2 ${getConnectionStatusColor()}`}></div>
              <span className="text-white/70 text-sm capitalize">{connectionStatus}</span>
              {retryCount > 0 && (
                <span className="text-white/50 text-sm ml-2">(Retry {retryCount}/3)</span>
              )}
            </div>
          </div>
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

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Sidebar - Rooms */}
        <div className="w-80 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 flex flex-col">
          <h2 className="text-2xl font-bold text-white mb-4">Rooms</h2>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`w-full p-4 rounded-xl transition-all duration-300 text-left ${
                  selectedRoom?.id === room.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:scale-102'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{room.name}</h3>
                    <p className="text-sm opacity-80 line-clamp-2">{room.description}</p>
                  </div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </button>
            ))}
          </div>

          {/* Online Users in Current Room */}
          {selectedRoom && onlineUsers.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">
                Online ({onlineUsers.length})
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                {onlineUsers.map((onlineUser) => (
                  <div key={onlineUser.id} className="flex items-center space-x-2">
                    <img
                      src={onlineUser.avatar || 'https://via.placeholder.com/24'}
                      alt={onlineUser.username}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-white/80 text-sm">{onlineUser.username}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl flex flex-col">
          {/* Chat Header */}
          {selectedRoom && (
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedRoom.name}</h3>
                  <p className="text-white/60 text-sm">{selectedRoom.description}</p>
                </div>
                <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <MoreVertical className="text-white/60" size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            {selectedRoom ? (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.user.username === user.username ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        msg.user.username === 'System'
                          ? 'bg-white/10 text-white/60 italic text-center mx-auto text-sm'
                          : msg.user.username === user.username
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md'
                          : 'bg-white/20 text-white rounded-bl-md'
                      } transition-all duration-300 hover:scale-105`}
                    >
                      {msg.user.username !== 'System' && msg.user.username !== user.username && (
                        <div className="flex items-center space-x-2 mb-2">
                          <img
                            src={msg.user.avatar || 'https://via.placeholder.com/24'}
                            alt={msg.user.username}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="font-semibold text-purple-300 text-sm">
                            {msg.user.username}
                          </span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      {msg.user.username !== 'System' && (
                        <p className="text-xs opacity-60 mt-1">
                          {formatTime(msg.timestamp)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white/60">
                  <MessageSquare size={64} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Select a room to start chatting</h3>
                  <p>Choose from the rooms on the left to begin your conversation</p>
                </div>
              </div>
            )}
          </div>

          {/* Typing Indicator */}
          {typingUsers.length > 0 && selectedRoom && (
            <div className="px-6 py-2 border-t border-white/10">
              <div className="flex items-center space-x-2 text-white/60 text-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span>
                  {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
                </span>
              </div>
            </div>
          )}

          {/* Message Input */}
          {selectedRoom && (
            <div className="p-6 border-t border-white/10">
              <div className="flex items-center space-x-4">
                <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110">
                  <Paperclip className="text-white/60" size={20} />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={handleInputChange}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                    disabled={connectionStatus !== 'connected'}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-white/10 transition-all duration-300">
                    <Smile className="text-white/60" size={20} />
                  </button>
                </div>
                
                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim() || connectionStatus !== 'connected'}
                  className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Send size={20} />
                </button>
              </div>
              
              {connectionStatus !== 'connected' && (
                <p className="text-center text-white/60 text-sm mt-2">
                  {connectionStatus === 'error' ? 'Reconnecting...' : 'Connecting to chat...'}
                </p>
              )}
            </div>
          )}
        </div>
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
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}

export default ChatPage;
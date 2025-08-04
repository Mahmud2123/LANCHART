import React, { useState, useEffect } from 'react';
import './App.css';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import RoomsPage from './pages/RoomsPage';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState('auth');

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:3001/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
          setCurrentPage('chat');
        })
        .catch(() => {
          localStorage.removeItem('token');
          setCurrentPage('auth');
        });
    }
  }, []);

  const navigateToChat = () => setCurrentPage('chat');
  const navigateToAuth = () => {
    setCurrentPage('auth');
    setUser(null);
    localStorage.removeItem('token');
  };
  const navigateToProfile = () => setCurrentPage('profile');
  const navigateToSettings = () => setCurrentPage('settings');
  const navigateToRooms = () => setCurrentPage('rooms');

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {currentPage === 'auth' && (
          <AuthPage setUser={setUser} darkMode={darkMode} setDarkMode={setDarkMode} onLogin={navigateToChat} />
        )}
        {currentPage === 'chat' && (
          <ChatPage
            user={user}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onLogout={navigateToAuth}
            onNavigateToProfile={navigateToProfile}
            onNavigateToSettings={navigateToSettings}
            onNavigateToRooms={navigateToRooms}
          />
        )}
        {currentPage === 'profile' && (
          <ProfilePage
            user={user}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onBack={navigateToChat}
            setUser={setUser}
          />
        )}
        {currentPage === 'settings' && (
          <SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} onBack={navigateToChat} />
        )}
        {currentPage === 'rooms' && (
          <RoomsPage
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onBack={navigateToChat}
            onSelectRoom={navigateToChat}
          />
        )}
      </div>
    </div>
  );
}

export default App;
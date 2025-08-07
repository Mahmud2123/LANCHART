// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { authAPI } from './services/api';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import RoomsPage from './pages/RoomsPage';
import './App.css';

// Axios interceptor for handling token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);

  const validateToken = async (token) => {
    try {
      const response = await authAPI.validateToken(token);
      return response.user;
    } catch (error) {
      console.error('Token validation failed:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          // Parse saved user data
          const userData = JSON.parse(savedUser);
          
          // Check token expiration
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          } else {
            // Validate token with backend
            const validatedUser = await validateToken(token);
            if (validatedUser) {
              setUser(validatedUser);
            } else {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
            }
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <AuthPage onLogin={handleLogin} darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </div>
    );
  }

  const renderCurrentPage = () => {
    const commonProps = {
      user,
      setUser,
      darkMode,
      setDarkMode,
      onLogout: handleLogout,
      onNavigateToProfile: () => setCurrentPage('profile'),
      onNavigateToSettings: () => setCurrentPage('settings'),
      onNavigateToRooms: () => setCurrentPage('rooms'),
      onNavigateToChat: () => setCurrentPage('chat'),
      onNavigateToDashboard: () => setCurrentPage('dashboard'),
      onBack: () => setCurrentPage('dashboard'),
    };

    switch (currentPage) {
      case 'chat':
        return <ChatPage {...commonProps} />;
      case 'profile':
        return <ProfilePage {...commonProps} />;
      case 'settings':
        return <SettingsPage {...commonProps} />;
      case 'rooms':
        return <RoomsPage {...commonProps} onSelectRoom={() => setCurrentPage('chat')} />;
      case 'dashboard':
      default:
        return <DashboardPage {...commonProps} />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
        
        {renderCurrentPage()}
      </div>
    </div>
  );
}

export default App;
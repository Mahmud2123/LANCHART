import React, { useState } from 'react';
import { ArrowLeft, Bell, Shield, Palette, Globe, Sun, Moon } from 'lucide-react';

function SettingsPage({ darkMode, setDarkMode, onBack }) {
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [language, setLanguage] = useState('English');

  return (
    <div className="min-h-screen relative z-10 p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md"></div>
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 mr-4"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-4xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Settings
            </h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Palette className="mr-3 text-purple-400" size={24} />
              Appearance
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-white">Dark Mode</span>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full transition-all duration-300 ${
                  darkMode ? 'bg-purple-500' : 'bg-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                    darkMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                ></div>
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Bell className="mr-3 text-purple-400" size={24} />
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Push Notifications</span>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    notifications ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                      notifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  ></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Sound Effects</span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    soundEnabled ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                      soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Globe className="mr-3 text-purple-400" size={24} />
              Language & Region
            </h3>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            >
              <option value="English">English</option>
              <option value="Spanish">Español</option>
              <option value="French">Français</option>
              <option value="German">Deutsch</option>
            </select>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Shield className="mr-3 text-purple-400" size={24} />
              Privacy & Security
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300">
                Change Password
              </button>
              <button className="w-full text-left p-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300">
                Two-Factor Authentication
              </button>
              <button className="w-full text-left p-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300">
                Block List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
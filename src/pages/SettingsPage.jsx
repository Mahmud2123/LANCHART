import React, { useState } from 'react';
import { ArrowLeft, Bell, Shield, Palette, Globe, Sun, Moon, Volume2, VolumeX, Smartphone, Monitor, Eye, EyeOff, Key, Users, MessageSquare } from 'lucide-react';

function SettingsPage({ darkMode, setDarkMode, onBack }) {
  const [settings, setSettings] = useState({
    notifications: {
      pushNotifications: true,
      emailNotifications: false,
      soundEffects: true,
      desktopNotifications: true,
      messagePreview: true,
    },
    privacy: {
      showOnlineStatus: true,
      allowDirectMessages: true,
      showTypingIndicator: true,
      dataCollection: false,
    },
    appearance: {
      darkMode: darkMode,
      fontSize: 'medium',
      theme: 'default',
      compactMode: false,
    },
    general: {
      language: 'English',
      timezone: 'Auto',
      enterToSend: true,
      showEmojis: true,
    }
  });

  const [activeSection, setActiveSection] = useState('appearance');

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));

    // Handle special cases
    if (section === 'appearance' && key === 'darkMode') {
      setDarkMode(value);
    }
  };

  const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!checked)}
      className={`w-12 h-6 rounded-full transition-all duration-300 ${
        checked ? 'bg-purple-500' : 'bg-white/20'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div
        className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
          checked ? 'translate-x-6' : 'translate-x-0.5'
        }`}
      />
    </button>
  );

  const sections = [
    {
      id: 'appearance',
      name: 'Appearance',
      icon: Palette,
      color: 'purple',
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      color: 'blue',
    },
    {
      id: 'privacy',
      name: 'Privacy & Security',
      icon: Shield,
      color: 'green',
    },
    {
      id: 'general',
      name: 'General',
      icon: Globe,
      color: 'orange',
    },
  ];

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
        <div className="flex items-center">
          {darkMode ? <Moon className="mr-3 text-purple-400" size={20} /> : <Sun className="mr-3 text-yellow-400" size={20} />}
          <div>
            <span className="text-white font-medium">Dark Mode</span>
            <p className="text-white/60 text-sm">Switch between light and dark themes</p>
          </div>
        </div>
        <ToggleSwitch
          checked={settings.appearance.darkMode}
          onChange={(value) => updateSetting('appearance', 'darkMode', value)}
        />
      </div>

      <div className="p-4 bg-white/5 rounded-xl">
        <div className="flex items-center mb-4">
          <Eye className="mr-3 text-purple-400" size={20} />
          <span className="text-white font-medium">Font Size</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {['small', 'medium', 'large'].map((size) => (
            <button
              key={size}
              onClick={() => updateSetting('appearance', 'fontSize', size)}
              className={`p-3 rounded-lg capitalize transition-all duration-300 ${
                settings.appearance.fontSize === size
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-white/5 rounded-xl">
        <div className="flex items-center mb-4">
          <Monitor className="mr-3 text-purple-400" size={20} />
          <span className="text-white font-medium">Theme</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'default', name: 'Default', gradient: 'from-purple-500 to-pink-500' },
            { id: 'ocean', name: 'Ocean', gradient: 'from-blue-500 to-cyan-500' },
            { id: 'sunset', name: 'Sunset', gradient: 'from-orange-500 to-red-500' },
            { id: 'forest', name: 'Forest', gradient: 'from-green-500 to-emerald-500' },
          ].map((theme) => (
            <button
              key={theme.id}
              onClick={() => updateSetting('appearance', 'theme', theme.id)}
              className={`p-3 rounded-lg transition-all duration-300 ${
                settings.appearance.theme === theme.id
                  ? 'ring-2 ring-white/50'
                  : 'hover:scale-105'
              }`}
            >
              <div className={`w-full h-8 rounded bg-gradient-to-r ${theme.gradient} mb-2`} />
              <span className="text-white text-sm">{theme.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
        <div className="flex items-center">
          <Smartphone className="mr-3 text-purple-400" size={20} />
          <div>
            <span className="text-white font-medium">Compact Mode</span>
            <p className="text-white/60 text-sm">Reduce spacing for more content</p>
          </div>
        </div>
        <ToggleSwitch
          checked={settings.appearance.compactMode}
          onChange={(value) => updateSetting('appearance', 'compactMode', value)}
        />
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
        <div className="flex items-center">
          <Bell className="mr-3 text-blue-400" size={20} />
          <div>
            <span className="text-white font-medium">Push Notifications</span>
            <p className="text-white/60 text-sm">Receive notifications on this device</p>
          </div>
        </div>
        <ToggleSwitch
          checked={settings.notifications.pushNotifications}
          onChange={(value) => updateSetting('notifications', 'pushNotifications', value)}
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
        <div className="flex items-center">
          <Monitor className="mr-3 text-blue-400" size={20} />
          <div>
            <span className="text-white font-medium">Desktop Notifications</span>
            <p className="text-white/60 text-sm">Show notifications on desktop</p>
          </div>
        </div>
        <ToggleSwitch
          checked={settings.notifications.desktopNotifications}
          onChange={(value) => updateSetting('notifications', 'desktopNotifications', value)}
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
        <div className="flex items-center">
          {settings.notifications.soundEffects ? (
            <Volume2 className="mr-3 text-blue-400" size={20} />
          ) : (
            <VolumeX className="mr-3 text-blue-400" size={20} />
          )}
          <div>
            <span className="text-white font-medium">Sound Effects</span>
            <p className="text-white/60 text-sm">Play sounds for notifications</p>
          </div>
        </div>
        <ToggleSwitch
          checked={settings.notifications.soundEffects}
          onChange={(value) => updateSetting('notifications', 'soundEffects', value)}
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
        <div className="flex items-center">
          <MessageSquare className="mr-3 text-blue-400" size={20} />
          <div>
            <span className="text-white font-medium">Email Notifications</span>
            <p className="text-white/60 text-sm">Receive email updates</p>
          </div>
        </div>
        <ToggleSwitch
          checked={settings.notifications.emailNotifications}
          onChange={(value) => updateSetting('notifications', 'emailNotifications', value)}
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
        <div className="flex items-center">
          <Eye className="mr-3 text-blue-400" size={20} />
          <div>
            <span className="text-white font-medium">Message Preview</span>
            <p className="text-white/60 text-sm">Show message content in notifications</p>
          </div>
        </div>
        <ToggleSwitch
          checked={settings.notifications.messagePreview}
          onChange={(value) => updateSetting('notifications', 'messagePreview', value)}
        />
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
        <div className="flex items-center">
          <Users className="mr-3 text-green-400" size={20} />
          <div>
            <span className="text-white font-medium">Show Online Status</span>
            <p className="text-white/60 text-sm">Let others see when you're online</p>
          </div>
        </div>
        <ToggleSwitch
          checked={settings.privacy.showOnlineStatus}
          onChange={(value) => updateSetting('privacy', 'showOnlineStatus', value)}
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
        <div className="flex items-center">
          <MessageSquare className="mr-3 text-green-400" size={20} />
          <div>
            <span className="text-white font-medium">Allow Direct Messages</span>
            <p className="text-white/60 text-sm">Allow users to message you directly</p>
          </div>
        </div>
        <ToggleSwitch
          checked={settings.privacy.allowDirectMessages}
          onChange={(value) => updateSetting('privacy', 'allowDirectMessages', value)}
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
        <div className="flex items-center">
          <Eye className="mr-3 text-green-400" size={20} />
          <div>
            <span className="text-white font-medium">Show Typing Indicator</span>
            <p className="text-white/60 text-sm">Show when you're typing</p>
          </div>
        </div>
        <ToggleSwitch
          checked={settings.privacy.showTypingIndicator}
          onChange={(value) => updateSetting('privacy', 'showTypingIndicator', value)}
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
        <div className="flex items-center">
          <Shield className="mr-3 text-green-400" size={20} />
          <div>
            <span className="text-white font-medium">Data Collection</span>
            <p className="text-white/60 text-sm">Allow analytics and usage data</p>
          </div>
        </div>
        <ToggleSwitch
          checked={settings.privacy.dataCollection}
          onChange={(value) => updateSetting('privacy', 'dataCollection', value)}
        />
      </div>

      <div className="space-y-3">
        <h4 className="text-white font-semibold">Security Actions</h4>
        <button className="w-full text-left p-4 text-white hover:bg-white/10 rounded-xl transition-all duration-300 flex items-center">
          <Key className="mr-3 text-green-400" size={20} />
          <div>
            <span className="font-medium">Change Password</span>
            <p className="text-white/60 text-sm">Update your account password</p>
          </div>
        </button>
        <button className="w-full text-left p-4 text-white hover:bg-white/10 rounded-xl transition-all duration-300 flex items-center">
          <Shield className="mr-3 text-green-400" size={20} />
          <div>
            <span className="font-medium">Two-Factor Authentication</span>
            <p className="text-white/60 text-sm">Add an extra layer of security</p>
          </div>
        </button>
        <button className="w-full text-left p-4 text-white hover:bg-white/10 rounded-xl transition-all duration-300 flex items-center">
          <EyeOff className="mr-3 text-green-400" size={20} />
          <div>
            <span className="font-medium">Blocked Users</span>
            <p className="text-white/60 text-sm">Manage your block list</p>
          </div>
        </button>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="p-4 bg-white/5 rounded-xl">
        <div className="flex items-center mb-4">
          <Globe className="mr-3 text-orange-400" size={20} />
          <span className="text-white font-medium">Language</span>
        </div>
        <select
          value={settings.general.language}
          onChange={(e) => updateSetting('general', 'language', e.target.value)}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
        >
          <option value="English" className="bg-gray-800">English</option>
          <option value="Spanish" className="bg-gray-800">Español</option>
          <option value="French" className="bg-gray-800">Français</option>
          <option value="German" className="bg-gray-800">Deutsch</option>
          <option value="Chinese" className="bg-gray-800">中文</option>
          <option value="Japanese" className="bg-gray-800">日本語</option>
        </select>
      </div>

      <div className="p-4 bg-white/5 rounded-xl">
        <div className="flex items-center mb-4">
          <Globe className="mr-3 text-orange-400" size={20} />
          <span className="text-white font-medium">Timezone</span>
        </div>
        <select
          value={settings.general.timezone}
          onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
        >
          <option value="Auto" className="bg-gray-800">Auto-detect</option>
          <option value="UTC" className="bg-gray-800">UTC</option>
          <option value="EST" className="bg-gray-800">Eastern Time</option>
          <option value="PST" className="bg-gray-800">Pacific Time</option>
          <option value="GMT" className="bg-gray-800">Greenwich Mean Time</option>
        </select>
      </div>

      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
        <div className="flex items-center">
          <MessageSquare className="mr-3 text-orange-400" size={20} />
          <div>
            <span className="text-white font-medium">Enter to Send</span>
            <p className="text-white/60 text-sm">Send message with Enter key</p>
          </div>
        </div>
        <ToggleSwitch
          checked={settings.general.enterToSend}
          onChange={(value) => updateSetting('general', 'enterToSend', value)}
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
        <div className="flex items-center">
          <span className="mr-3 text-orange-400 text-xl">😊</span>
          <div>
            <span className="text-white font-medium">Show Emojis</span>
            <p className="text-white/60 text-sm">Display emoji picker in chat</p>
          </div>
        </div>
        <ToggleSwitch
          checked={settings.general.showEmojis}
          onChange={(value) => updateSetting('general', 'showEmojis', value)}
        />
      </div>

      <div className="space-y-3">
        <h4 className="text-white font-semibold">App Information</h4>
        <div className="p-4 bg-white/5 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60">Version</span>
            <span className="text-white">2.1.0</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60">Build</span>
            <span className="text-white">2024.01.15</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60">Platform</span>
            <span className="text-white">Web</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'appearance':
        return renderAppearanceSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'general':
        return renderGeneralSettings();
      default:
        return renderAppearanceSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-12"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/5 to-transparent transform skew-y-12"></div>
      </div>
      
      <div className="min-h-screen relative z-10 p-6">
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 mr-4"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-4xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  Settings
                </h1>
                <p className="text-white/70 mt-1">Customize your LANChart experience</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 sticky top-6">
                <h3 className="text-xl font-bold text-white mb-6">Categories</h3>
                <div className="space-y-2">
                  {sections.map((section) => {
                    const IconComponent = section.icon;
                    const isActive = activeSection === section.id;
                    
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center p-4 rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'bg-purple-500 text-white shadow-lg scale-105'
                            : 'text-white/70 hover:bg-white/10 hover:text-white hover:scale-102'
                        }`}
                      >
                        <IconComponent 
                          size={20} 
                          className={`mr-3 ${isActive ? 'text-white' : 'text-purple-400'}`} 
                        />
                        <span className="font-medium">{section.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8">
                <div className="flex items-center mb-8">
                  {(() => {
                    const section = sections.find(s => s.id === activeSection);
                    const IconComponent = section?.icon;
                    return (
                      <>
                        {IconComponent && <IconComponent className="mr-3 text-purple-400" size={28} />}
                        <h2 className="text-3xl font-bold text-white">{section?.name}</h2>
                      </>
                    );
                  })()}
                </div>
                
                {renderActiveSection()}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => {
                // Here you would normally save settings to backend
                console.log('Settings saved:', settings);
                alert('Settings saved successfully!');
              }}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold hover:scale-105 shadow-lg"
            >
              Save All Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
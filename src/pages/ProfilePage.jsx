// pages/ProfilePage.jsx
import React, { useState, useRef } from 'react';
import { usersAPI } from '../services/api';
import { ArrowLeft, Camera, Sun, Moon, Save, X, Edit3, User, Mail, FileText, Activity, Upload, Check } from 'lucide-react';

function ProfilePage({ user, darkMode, setDarkMode, onBack, setUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user.username || '',
    email: user.email || '',
    bio: user.bio || 'Love coding and chatting! 💻✨',
    status: user.status || 'Available',
    avatar: user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user.username || 'default'),
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const updatedUser = await usersAPI.updateProfile(profileData);
      setUser({ ...user, ...updatedUser });
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      username: user.username || '',
      email: user.email || '',
      bio: user.bio || 'Love coding and chatting! 💻✨',
      status: user.status || 'Available',
      avatar: user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user.username || 'default'),
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const avatarUrl = await usersAPI.uploadAvatar(file);
      const newProfileData = { ...profileData, avatar: avatarUrl };
      setProfileData(newProfileData);
      
      // Update user immediately for avatar
      setUser({ ...user, avatar: avatarUrl });
      setSuccess('Avatar updated successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-400';
      case 'Busy': return 'bg-red-400';
      case 'Away': return 'bg-yellow-400';
      case 'Do Not Disturb': return 'bg-red-600';
      default: return 'bg-gray-400';
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
    if (error) setError('');
    if (success) setSuccess('');
  };

  return (
    <div className="min-h-screen relative z-10 p-6">
      <div className="max-w-4xl mx-auto relative z-10">
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
                Profile Settings
              </h1>
              <p className="text-white/70 mt-1">Manage your account and preferences</p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-center animate-shake">
            <div className="flex items-center justify-center">
              <X className="mr-2" size={16} />
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-center animate-bounce">
            <div className="flex items-center justify-center">
              <Check className="mr-2" size={16} />
              {success}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:shadow-xl transition-all duration-300">
            {/* Profile Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center space-x-6">
                <div className="relative group">
                  <img
                    src={profileData.avatar}
                    alt={profileData.username}
                    className="w-24 h-24 rounded-full ring-4 ring-purple-500/50 transition-all duration-300 group-hover:ring-purple-400"
                  />
                  <div
                    className={`absolute -bottom-2 -right-2 w-6 h-6 ${getStatusColor(profileData.status)} rounded-full border-4 border-white/20`}
                  ></div>
                  
                  {/* Upload overlay */}
                  <div 
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <Camera className="text-white" size={20} />
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{profileData.username}</h2>
                  <p className="text-white/60 mb-3">{profileData.email}</p>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(profileData.status)}`}></div>
                    <span className="text-white/80 text-sm">{profileData.status}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                  isEditing 
                    ? 'bg-red-500/20 border border-red-500/50 text-red-300' 
                    : 'bg-purple-500/20 border border-purple-500/50 text-purple-300'
                }`}
              >
                {isEditing ? <X size={20} /> : <Edit3 size={20} />}
              </button>
            </div>

            {/* Profile Form */}
            <div className="space-y-6">
              {/* Username */}
              <div className="relative">
                <label className="block text-white/80 text-sm font-semibold mb-3 flex items-center">
                  <User className="mr-2" size={16} />
                  Username
                </label>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-300 hover:bg-white/15"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <label className="block text-white/80 text-sm font-semibold mb-3 flex items-center">
                  <Mail className="mr-2" size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-300 hover:bg-white/15"
                />
              </div>

              {/* Bio */}
              <div className="relative">
                <label className="block text-white/80 text-sm font-semibold mb-3 flex items-center">
                  <FileText className="mr-2" size={16} />
                  Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  maxLength={200}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 resize-none transition-all duration-300 hover:bg-white/15"
                />
                <div className="text-right text-white/50 text-xs mt-2">
                  {profileData.bio.length}/200 characters
                </div>
              </div>

              {/* Status */}
              <div className="relative">
                <label className="block text-white/80 text-sm font-semibold mb-3 flex items-center">
                  <Activity className="mr-2" size={16} />
                  Status
                </label>
                <select
                  value={profileData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-300 hover:bg-white/15"
                >
                  <option value="Available" className="bg-gray-800">🟢 Available</option>
                  <option value="Busy" className="bg-gray-800">🔴 Busy</option>
                  <option value="Away" className="bg-gray-800">🟡 Away</option>
                  <option value="Do Not Disturb" className="bg-gray-800">⛔ Do Not Disturb</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex space-x-4 mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={20} />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 py-4 px-6 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold hover:scale-105 disabled:opacity-50 flex items-center justify-center"
                >
                  <X className="mr-2" size={20} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Stats & Activities Sidebar */}
          <div className="space-y-6">
            {/* Activity Stats */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Activity className="mr-3 text-purple-400" size={20} />
                Activity Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-white/80">Messages Sent</span>
                  <span className="text-2xl font-bold text-purple-400">127</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-white/80">Rooms Joined</span>
                  <span className="text-2xl font-bold text-pink-400">15</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-white/80">Days Active</span>
                  <span className="text-2xl font-bold text-blue-400">7</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-white/80">Hours Online</span>
                  <span className="text-2xl font-bold text-green-400">42</span>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-6">Account Info</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Member Since</span>
                  <span className="text-white/80">
                    {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Last Login</span>
                  <span className="text-white/80">Today</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Account Type</span>
                  <span className="text-purple-400 font-semibold">Premium</span>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-6">Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
                  <div className="text-2xl mr-3">🏆</div>
                  <div>
                    <p className="text-white font-semibold text-sm">Early Adopter</p>
                    <p className="text-white/60 text-xs">Joined in the first week</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                  <div className="text-2xl mr-3">💬</div>
                  <div>
                    <p className="text-white font-semibold text-sm">Chatterbox</p>
                    <p className="text-white/60 text-xs">Sent 100+ messages</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                  <div className="text-2xl mr-3">👥</div>
                  <div>
                    <p className="text-white font-semibold text-sm">Social Butterfly</p>
                    <p className="text-white/60 text-xs">Joined 10+ rooms</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default ProfilePage;
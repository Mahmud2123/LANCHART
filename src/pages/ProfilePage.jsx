import React, { useState } from 'react';
import { usersAPI } from '../services/api';
import { ArrowLeft, Camera, Sun, Moon } from 'lucide-react';

function ProfilePage({ user, darkMode, setDarkMode, onBack, setUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user.username,
    email: user.email || '',
    bio: user.bio || 'Love coding and chatting! 💻✨',
    status: user.status || 'Available',
    avatar: user.avatar || 'https://via.placeholder.com/150',
  });
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        throw new Error((await response.json()).message || 'Failed to update profile');
      }
      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const avatarUrl = await usersAPI.uploadAvatar(file);
      setProfileData({ ...profileData, avatar: avatarUrl });
      setUser({ ...user, avatar: avatarUrl });
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

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
              Profile Settings
            </h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-center animate-pulse">
            {error}
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 mb-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center mb-8">
            <div className="relative">
              <img
                src={profileData.avatar}
                alt={profileData.username}
                className="w-24 h-24 rounded-full ring-4 ring-purple-500/50"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 p-2 bg-purple-500 rounded-full text-white hover:bg-purple-600 transition-all duration-300 ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <Camera size={16} />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
            <div className="ml-6 flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{profileData.username}</h2>
              <p className="text-white/60">{profileData.email}</p>
              <div className="flex items-center mt-2">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    profileData.status === 'Available' ? 'bg-green-400' :
                    profileData.status === 'Busy' ? 'bg-red-400' :
                    profileData.status === 'Away' ? 'bg-yellow-400' : 'bg-gray-400'
                  }`}
                ></div>
                <span className="text-white/80 text-sm">{profileData.status}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">Username</label>
              <input
                type="text"
                value={profileData.username}
                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                disabled={!isEditing}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isEditing}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                disabled={!isEditing}
                rows={3}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 resize-none transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">Status</label>
              <select
                value={profileData.status}
                onChange={(e) => setProfileData({ ...profileData, status: e.target.value })}
                disabled={!isEditing}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-300"
              >
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Away">Away</option>
                <option value="Do Not Disturb">Do Not Disturb</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-4 mt-8">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold hover:scale-105"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 px-6 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold hover:scale-105"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold hover:scale-105"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold text-white mb-4">Activity Stats</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">127</div>
              <div className="text-white/60 text-sm">Messages Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400">15</div>
              <div className="text-white/60 text-sm">Rooms Joined</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">7</div>
              <div className="text-white/60 text-sm">Days Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
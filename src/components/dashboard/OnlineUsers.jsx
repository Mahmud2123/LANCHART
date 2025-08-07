import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usersAPI } from '../../services/api';
import { User, Zap, Crown, Star, Users } from 'lucide-react';

function OnlineUsers() {
  const { t } = useTranslation();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        setLoading(true);
        const users = await usersAPI.getOnlineUsers();
        setOnlineUsers(users || []);
        setError('');
      } catch (err) {
        setError(err.message || t('failedToLoadUsers'));
      } finally {
        setLoading(false);
      }
    };

    fetchOnlineUsers();
    
    // Set up polling for online users
    const interval = setInterval(fetchOnlineUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bauchi-secondary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="text-bauchi-accent" size={18} />
          <h3 className="font-medium text-gray-900 dark:text-white">
            {t('onlineMembers')}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-sm text-bauchi-green">
          <Zap size={14} />
          <span>{onlineUsers.length}</span>
        </div>
      </div>

      {onlineUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No users online currently
        </div>
      ) : (
        <div className="space-y-3">
          {onlineUsers.slice(0, 6).map((user) => (
            <div key={user.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg transition-colors">
              <div className="relative">
                <div className="w-10 h-10 bg-bauchi-secondary/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-bauchi-secondary">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-bauchi-green rounded-full border border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.username}
                  </p>
                  {user.isAdmin && <Crown className="text-bauchi-gold" size={12} />}
                  {user.isPremium && <Star className="text-bauchi-purple" size={12} />}
                </div>
                <p className="text-xs text-bauchi-green flex items-center gap-1">
                  <Zap size={10} />
                  {t('onlineNow')}
                </p>
              </div>
            </div>
          ))}
          {onlineUsers.length > 6 && (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              +{onlineUsers.length - 6} more online
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OnlineUsers;
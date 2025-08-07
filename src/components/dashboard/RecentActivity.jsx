import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { messagesAPI, usersAPI } from '../../services/api';
import { Clock, MessageSquare, User, Heart, Hash, CheckCheck } from 'lucide-react';

function RecentActivity() {
  const { t } = useTranslation();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [messagesResponse, onlineUsersResponse] = await Promise.all([
          messagesAPI.getRecentMessages(),
          usersAPI.getOnlineUsers(),
        ]);
        
        // Process messages into activity items
        const processedActivities = (messagesResponse || []).map(message => ({
          id: message.id,
          type: 'message',
          user: message.user,
          content: message.content,
          timestamp: message.timestamp,
          roomId: message.roomId,
        }));
        
        setActivities(processedActivities.slice(0, 5));
        setError('');
      } catch (err) {
        setError(err.message || t('failedToLoadActivity'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'message': return <MessageSquare className="text-bauchi-secondary" size={16} />;
      case 'like': return <Heart className="text-red-400" size={16} />;
      case 'join': return <User className="text-bauchi-accent" size={16} />;
      default: return <Hash className="text-bauchi-gold" size={16} />;
    }
  };

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
      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No recent activity found
        </div>
      ) : (
        activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg transition-colors">
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.user?.username || 'Unknown user'}
                </p>
                {activity.type === 'message' && (
                  <CheckCheck className="text-bauchi-green" size={12} />
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                {activity.type === 'message' 
                  ? activity.content.length > 50 
                    ? `${activity.content.substring(0, 50)}...` 
                    : activity.content
                  : t(activity.type)}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock size={12} />
                <span>
                  {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default RecentActivity;
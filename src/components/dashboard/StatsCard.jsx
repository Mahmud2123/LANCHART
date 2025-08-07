import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

function StatsCard({ label, value, icon, trend }) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="text-green-500" size={16} />;
      case 'down':
        return <ArrowDown className="text-red-500" size={16} />;
      default:
        return <Minus className="text-gray-500" size={16} />;
    }
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-100 dark:border-dark-700 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          {getTrendIcon()}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
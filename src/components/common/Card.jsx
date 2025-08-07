import React from 'react';

export default function Card({ children, className = '', title, actions }) {
  return (
    <div className={`bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-100 dark:border-dark-700 ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-dark-700">
          {title && <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>}
          {actions && <div className="flex space-x-2">{actions}</div>}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
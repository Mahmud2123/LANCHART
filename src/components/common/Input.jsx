import React from 'react';
import clsx from 'clsx';

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  className = '',
  required = false,
  ...props
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className={clsx(
          'block w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm',
          'focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white',
          className
        )}
        {...props}
      />
    </div>
  );
}
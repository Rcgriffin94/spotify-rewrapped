import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'green' | 'white' | 'gray';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8', 
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
};

const colorClasses = {
  green: 'border-green-400',
  white: 'border-white',
  gray: 'border-gray-400'
};

export default function Spinner({ 
  size = 'md', 
  color = 'green', 
  className = '' 
}: SpinnerProps) {
  return (
    <div 
      className={`
        animate-spin rounded-full border-b-2 
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

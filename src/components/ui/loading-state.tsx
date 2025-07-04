import React from 'react';
import Spinner from './spinner';

export interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function LoadingState({ 
  message = 'Loading...', 
  size = 'lg',
  className = ''
}: LoadingStateProps) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <Spinner size={size} color="green" />
        <span className="text-white text-lg">{message}</span>
      </div>
    </div>
  );
}

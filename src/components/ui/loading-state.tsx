import React from 'react';
import Spinner from './spinner';

export interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showProgress?: boolean;
  retryCount?: number;
}

export default function LoadingState({ 
  message = 'Loading...', 
  size = 'lg',
  className = '',
  showProgress = false,
  retryCount = 0
}: LoadingStateProps) {
  const progressMessage = retryCount > 0 
    ? `${message} (Attempt ${retryCount + 1})`
    : message;

  return (
    <div 
      className={`flex items-center justify-center py-12 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={progressMessage}
    >
      <div className="flex flex-col items-center gap-4">
        <Spinner size={size} color="green" />
        <div className="text-center">
          <span className="text-white text-lg font-medium">{progressMessage}</span>
          {showProgress && retryCount > 0 && (
            <p className="text-gray-400 text-sm mt-2">
              Retrying connection...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

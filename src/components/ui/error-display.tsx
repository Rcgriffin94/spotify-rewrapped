import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';

export interface ErrorDisplayProps {
  error: string | Error;
  title?: string;
  onRetry?: () => void;
  className?: string;
  retryCount?: number;
  isRetrying?: boolean;
}

export default function ErrorDisplay({ 
  error, 
  title = 'Error', 
  onRetry,
  className = '',
  retryCount = 0,
  isRetrying = false
}: ErrorDisplayProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  // Determine error type for better messaging
  const isAuthError = errorMessage.includes('401') || errorMessage.includes('unauthorized');
  const isNetworkError = errorMessage.includes('fetch') || errorMessage.includes('network');
  const isServerError = errorMessage.includes('500') || errorMessage.includes('502') || errorMessage.includes('503');
  
  const getErrorSuggestion = () => {
    if (isAuthError) {
      return 'Your session may have expired. Please try signing in again.';
    }
    if (isNetworkError) {
      return 'Please check your internet connection and try again.';
    }
    if (isServerError) {
      return 'Spotify servers may be temporarily unavailable. Please try again in a moment.';
    }
    return 'This issue is usually temporary. Please try again.';
  };
  
  return (
    <Card 
      className={`bg-red-900/50 border-red-700 text-white ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <CardHeader>
        <CardTitle className="text-red-400 flex items-center gap-2">
          <svg 
            className="w-5 h-5" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-red-100 font-medium">{errorMessage}</p>
          <p className="text-red-200 text-sm">{getErrorSuggestion()}</p>
          
          {retryCount > 0 && (
            <p className="text-red-300 text-xs">
              Previous attempts: {retryCount}
            </p>
          )}
          
          {onRetry && (
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 disabled:bg-red-800 disabled:cursor-not-allowed rounded-md transition-colors text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label={isRetrying ? 'Retrying...' : 'Try again'}
            >
              {isRetrying ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                  </svg>
                  Retrying...
                </span>
              ) : (
                'Try Again'
              )}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

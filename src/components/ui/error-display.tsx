import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';

export interface ErrorDisplayProps {
  error: string | Error;
  title?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorDisplay({ 
  error, 
  title = 'Error', 
  onRetry,
  className = ''
}: ErrorDisplayProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  return (
    <Card className={`bg-red-900/50 border-red-700 text-white ${className}`}>
      <CardHeader>
        <CardTitle className="text-red-400 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-100 mb-4">{errorMessage}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-md transition-colors text-white font-medium"
          >
            Try Again
          </button>
        )}
      </CardContent>
    </Card>
  );
}

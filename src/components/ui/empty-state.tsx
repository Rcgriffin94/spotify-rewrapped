import React from 'react';

interface EmptyStateProps {
  type: 'tracks' | 'artists' | 'recent' | 'stats';
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  action,
  className = ''
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case 'tracks':
        return {
          title: title || 'No Tracks Found',
          description: description || 'We couldn\'t find any tracks for the selected time period. Try adjusting your date range or check back after listening to more music.',
          icon: (
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          )
        };
      case 'artists':
        return {
          title: title || 'No Artists Found',
          description: description || 'We couldn\'t find any artists for the selected time period. Try adjusting your date range or explore new music to see your top artists.',
          icon: (
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )
        };
      case 'recent':
        return {
          title: title || 'No Recent Activity',
          description: description || 'We don\'t see any recent listening activity. Start playing some music on Spotify to see your recent tracks here.',
          icon: (
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      case 'stats':
        return {
          title: title || 'No Statistics Available',
          description: description || 'We need more listening data to generate meaningful statistics. Keep enjoying music and check back soon!',
          icon: (
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )
        };
      default:
        return {
          title: title || 'No Data',
          description: description || 'No data available at the moment.',
          icon: (
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          )
        };
    }
  };

  const content = getDefaultContent();

  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center bg-gray-800/50 rounded-lg border border-gray-700 ${className}`}>
      <div className="text-gray-400 mb-6">
        {content.icon}
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-3">
        {content.title}
      </h3>
      
      <p className="text-gray-400 max-w-md mb-6 leading-relaxed">
        {content.description}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          {action.label}
        </button>
      )}
      
      {type !== 'recent' && !action && (
        <div className="text-sm text-gray-500 mt-4">
          <p>💡 Tip: Listen to more music on Spotify to see data here</p>
        </div>
      )}
    </div>
  );
};

export default EmptyState;

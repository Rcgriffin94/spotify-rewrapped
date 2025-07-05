import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  className = '',
}) => {
  return (
    <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
          <p className="text-2xl font-bold text-white mb-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-4 text-spotify-green">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;

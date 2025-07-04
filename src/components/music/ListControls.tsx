import React, { useState } from 'react';

// Type definitions for the component
export interface ListControlsProps {
  onTimeRangeChange: (timeRange: 'short_term' | 'medium_term' | 'long_term') => void;
  onLimitChange: (limit: number) => void;
  timeRange: 'short_term' | 'medium_term' | 'long_term';
  limit: number;
  isLoading?: boolean;
}

export interface TimeRangeOption {
  value: 'short_term' | 'medium_term' | 'long_term';
  label: string;
  description: string;
}

export interface LimitOption {
  value: number;
  label: string;
}

const timeRangeOptions: TimeRangeOption[] = [
  {
    value: 'short_term',
    label: 'Last 4 weeks',
    description: 'Your top songs from the last month'
  },
  {
    value: 'medium_term',
    label: 'Last 6 months',
    description: 'Your top songs from the last 6 months'
  },
  {
    value: 'long_term',
    label: 'All time',
    description: 'Your all-time favorite songs'
  }
];

const limitOptions: LimitOption[] = [
  { value: 10, label: '10 songs' },
  { value: 25, label: '25 songs' },
  { value: 50, label: '50 songs' },
  { value: 100, label: '100 songs' }
];

export default function ListControls({
  onTimeRangeChange,
  onLimitChange,
  timeRange,
  limit,
  isLoading = false
}: ListControlsProps) {
  const handleTimeRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTimeRange = event.target.value as 'short_term' | 'medium_term' | 'long_term';
    onTimeRangeChange(newTimeRange);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    onLimitChange(newLimit);
  };

  return (
    <div className="bg-black/50 border border-green-800 rounded-lg p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
        {/* Time Range Selector */}
        <div className="flex-1 min-w-0">
          <label htmlFor="time-range" className="block text-sm font-medium text-green-400 mb-2">
            Time Period
          </label>
          <select
            id="time-range"
            value={timeRange}
            onChange={handleTimeRangeChange}
            disabled={isLoading}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 
                     focus:ring-2 focus:ring-green-500 focus:border-green-500 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:border-gray-600 transition-colors"
          >
            {timeRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            {timeRangeOptions.find(opt => opt.value === timeRange)?.description}
          </p>
        </div>

        {/* Count Selector */}
        <div className="flex-1 min-w-0">
          <label htmlFor="limit" className="block text-sm font-medium text-green-400 mb-2">
            Number of Songs
          </label>
          <select
            id="limit"
            value={limit}
            onChange={handleLimitChange}
            disabled={isLoading}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 
                     focus:ring-2 focus:ring-green-500 focus:border-green-500 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:border-gray-600 transition-colors"
          >
            {limitOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Choose how many songs to display
          </p>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center text-green-400 text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400 mr-2"></div>
            Loading...
          </div>
        )}
      </div>
    </div>
  );
}

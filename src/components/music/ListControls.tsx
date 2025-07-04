import React, { useState } from 'react';

// Type definitions for the component
export interface ListControlsProps {
  onTimeRangeChange: (timeRange: 'short_term' | 'medium_term' | 'long_term' | 'custom') => void;
  onLimitChange: (limit: number) => void;
  onDateRangeChange: (startDate: string, endDate: string) => void;
  timeRange: 'short_term' | 'medium_term' | 'long_term' | 'custom';
  limit: number;
  startDate?: string;
  endDate?: string;
  isLoading?: boolean;
}

export interface TimeRangeOption {
  value: 'short_term' | 'medium_term' | 'long_term' | 'custom';
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
  },
  {
    value: 'custom',
    label: 'Custom range',
    description: 'Select your own date range (last 50 days only)'
  }
];

const limitOptions: LimitOption[] = [
  { value: 10, label: '10 songs' },
  { value: 25, label: '25 songs' },
  { value: 50, label: '50 songs' }
];

export default function ListControls({
  onTimeRangeChange,
  onLimitChange,
  onDateRangeChange,
  timeRange,
  limit,
  startDate,
  endDate,
  isLoading = false
}: ListControlsProps) {
  // Helper function to get max date (today)
  const getMaxDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Helper function to get min date (50 days ago)
  const getMinDate = () => {
    const fiftyDaysAgo = new Date();
    fiftyDaysAgo.setDate(fiftyDaysAgo.getDate() - 50);
    return fiftyDaysAgo.toISOString().split('T')[0];
  };

  const handleTimeRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTimeRange = event.target.value as 'short_term' | 'medium_term' | 'long_term' | 'custom';
    onTimeRangeChange(newTimeRange);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    onLimitChange(newLimit);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = event.target.value;
    // Always call the callback with the new start date, even if end date isn't set yet
    onDateRangeChange(newStartDate, endDate || '');
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = event.target.value;
    // Always call the callback with the new end date, even if start date isn't set yet
    onDateRangeChange(startDate || '', newEndDate);
  };

  return (
    <div className="bg-black/50 border border-green-800 rounded-lg p-6 mb-6">
      <div className="flex flex-col gap-6">
        {/* First row: Time Range and Count */}
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

        {/* Second row: Custom Date Range (only show when custom is selected) */}
        {timeRange === 'custom' && (
          <div className="border-t border-gray-700 pt-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              {/* Start Date */}
              <div className="flex-1 min-w-0 spotify-date-picker">
                <label htmlFor="start-date" className="block text-sm font-medium text-green-400 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={startDate || ''}
                  onChange={handleStartDateChange}
                  min={getMinDate()}
                  max={endDate || getMaxDate()}
                  disabled={isLoading}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 
                           focus:ring-2 focus:ring-green-500 focus:border-green-500 
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:border-gray-600 transition-colors"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Earliest date: {getMinDate()}
                </p>
              </div>

              {/* End Date */}
              <div className="flex-1 min-w-0 spotify-date-picker">
                <label htmlFor="end-date" className="block text-sm font-medium text-green-400 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  id="end-date"
                  value={endDate || ''}
                  onChange={handleEndDateChange}
                  min={startDate || getMinDate()}
                  max={getMaxDate()}
                  disabled={isLoading}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 
                           focus:ring-2 focus:ring-green-500 focus:border-green-500 
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:border-gray-600 transition-colors"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Latest date: {getMaxDate()}
                </p>
              </div>
            </div>
            
            {/* Custom date range notice */}
            <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-md">
              <p className="text-yellow-400 text-sm">
                ⚠️ <strong>Note:</strong> Custom date ranges are currently limited to the last 50 days due to Spotify API constraints. 
                This feature is in development and will analyze your recently played tracks to calculate top songs for your selected period.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

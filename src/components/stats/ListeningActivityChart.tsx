import React from 'react';

interface ListeningActivityChartProps {
  hourlyDistribution: Record<string, number>;
  dayOfWeekDistribution: Record<string, number>;
  timeRange?: { earliest: string; latest: string; daysCovered: number };
  className?: string;
}

export const ListeningActivityChart: React.FC<ListeningActivityChartProps> = ({
  hourlyDistribution,
  dayOfWeekDistribution,
  timeRange,
  className = '',
}) => {
  // Prepare hourly data (0-23 hours)
  const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
    hour: hour.toString().padStart(2, '0'),
    count: hourlyDistribution[hour.toString().padStart(2, '0')] || 0,
  }));

  const maxHourlyCount = Math.max(...hourlyData.map(h => h.count));

  // Prepare daily data
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dailyData = dayOrder.map(day => ({
    day: day.slice(0, 3), // Abbreviated day name
    count: dayOfWeekDistribution[day] || 0,
  }));

  const maxDailyCount = Math.max(...dailyData.map(d => d.count));

  return (
    <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-6">Listening Activity</h3>
      
      {/* Time Range Info */}
      {timeRange && timeRange.daysCovered > 0 && (
        <div className="mb-4 text-sm text-gray-400">
          Based on your last 50 tracks over {timeRange.daysCovered} day{timeRange.daysCovered !== 1 ? 's' : ''} 
          {timeRange.earliest && timeRange.latest && (
            <span className="text-xs text-gray-500 block">
              {new Date(timeRange.earliest).toLocaleDateString()} - {new Date(timeRange.latest).toLocaleDateString()}
            </span>
          )}
        </div>
      )}
      
      {/* Hourly Distribution */}
      <div className="mb-8">
        <h4 className="text-md font-medium text-gray-300 mb-3">By Hour of Day</h4>
        <div className="relative h-32 bg-gray-700/20 rounded p-2 flex items-end justify-between">
          {hourlyData.map((item) => {
            const height = maxHourlyCount > 0 ? (item.count / maxHourlyCount) * 100 : 0;
            const barHeight = item.count > 0 ? Math.max(height, 5) : 0;
            
            return (
              <div
                key={item.hour}
                className="relative flex flex-col items-center justify-end group"
                style={{ 
                  width: 'calc(100% / 24)',
                  height: '100%',
                  minWidth: '8px'
                }}
              >
                {/* Bar */}
                {item.count > 0 && (
                  <div
                    className="w-4/5 rounded-t transition-all duration-300 hover:opacity-80 hover:scale-105"
                    style={{ 
                      height: `${barHeight}%`,
                      backgroundColor: '#1db954',
                      minHeight: '4px'
                    }}
                    title={`${item.hour}:00 - ${item.count} plays`}
                  />
                )}
                
                {/* Show count on hover or for significant bars */}
                {item.count > 0 && (
                  <span className="text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 bg-gray-900 px-1 rounded">
                    {item.count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Time labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-4 px-2">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:00</span>
        </div>
      </div>

      {/* Daily Distribution */}
      <div>
        <h4 className="text-md font-medium text-gray-300 mb-4">By Day of Week</h4>
        <div className="space-y-3">
          {dailyData.map((item) => {
            const width = maxDailyCount > 0 ? (item.count / maxDailyCount) * 100 : 0;
            return (
              <div key={item.day} className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-400 w-10 text-right">
                  {item.day}
                </span>
                <div className="flex-1 bg-gray-700 rounded-full h-4 relative group">
                  <div
                    className="h-4 rounded-full transition-all duration-300 group-hover:opacity-80"
                    style={{ 
                      width: `${Math.max(width, item.count > 0 ? 8 : 0)}%`,
                      backgroundColor: '#1db954'
                    }}
                    title={`${item.count} plays`}
                  />
                  {/* Show count inside bar if there's space, otherwise outside */}
                  {item.count > 0 && (
                    <span className={`absolute text-xs font-medium transition-opacity ${
                      width > 15 
                        ? 'text-black left-2 top-1/2 -translate-y-1/2' 
                        : 'text-gray-300 -right-8 top-1/2 -translate-y-1/2'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ListeningActivityChart;

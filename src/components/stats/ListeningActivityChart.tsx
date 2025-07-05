import React from 'react';

interface ListeningActivityChartProps {
  hourlyDistribution: Record<string, number>;
  dayOfWeekDistribution: Record<string, number>;
  className?: string;
}

export const ListeningActivityChart: React.FC<ListeningActivityChartProps> = ({
  hourlyDistribution,
  dayOfWeekDistribution,
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
      
      {/* Hourly Distribution */}
      <div className="mb-8">
        <h4 className="text-md font-medium text-gray-300 mb-3">By Hour of Day</h4>
        <div className="flex items-end space-x-1 h-24">
          {hourlyData.map((item) => {
            const height = maxHourlyCount > 0 ? (item.count / maxHourlyCount) * 100 : 0;
            return (
              <div
                key={item.hour}
                className="flex-1 flex flex-col items-center group"
              >
                <div
                  className="w-full bg-spotify-green rounded-t transition-all duration-300 hover:bg-spotify-green/80"
                  style={{ height: `${height}%` }}
                  title={`${item.hour}:00 - ${item.count} plays`}
                />
                <span className="text-xs text-gray-500 mt-1">
                  {parseInt(item.hour) % 6 === 0 ? item.hour : ''}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>00:00</span>
          <span>12:00</span>
          <span>23:00</span>
        </div>
      </div>

      {/* Daily Distribution */}
      <div>
        <h4 className="text-md font-medium text-gray-300 mb-3">By Day of Week</h4>
        <div className="space-y-2">
          {dailyData.map((item) => {
            const width = maxDailyCount > 0 ? (item.count / maxDailyCount) * 100 : 0;
            return (
              <div key={item.day} className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-400 w-8">
                  {item.day}
                </span>
                <div className="flex-1 bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-spotify-green h-3 rounded-full transition-all duration-300"
                    style={{ width: `${width}%` }}
                    title={`${item.count} plays`}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">
                  {item.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ListeningActivityChart;

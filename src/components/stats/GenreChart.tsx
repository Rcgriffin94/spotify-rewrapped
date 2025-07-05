import React from 'react';

interface GenreChartProps {
  genres: {
    genre: string;
    count: number;
    percentage: number;
  }[];
  className?: string;
}

export const GenreChart: React.FC<GenreChartProps> = ({
  genres,
  className = '',
}) => {
  if (!genres || genres.length === 0) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}>
        <h3 className="text-lg font-semibold text-white mb-4">Top Genres</h3>
        <p className="text-gray-400">No genre data available</p>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">Top Genres</h3>
      <div className="space-y-3">
        {genres.map((genre, index) => (
          <div key={genre.genre} className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <span className="text-sm font-medium text-gray-400 w-6">
                {index + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white capitalize">
                    {genre.genre}
                  </span>
                  <span className="text-xs text-gray-400">
                    {genre.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-spotify-green h-2 rounded-full transition-all duration-300"
                    style={{ width: `${genre.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenreChart;

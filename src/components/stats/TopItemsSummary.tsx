import React from 'react';
import Image from 'next/image';
import { SpotifyTrack, SpotifyArtist } from '@/types/spotify';

interface TopItemsSummaryProps {
  monthlyTopTrack?: SpotifyTrack | null;
  allTimeTopTrack?: SpotifyTrack | null;
  monthlyTopArtist?: SpotifyArtist | null;
  allTimeTopArtist?: SpotifyArtist | null;
  className?: string;
}

export const TopItemsSummary: React.FC<TopItemsSummaryProps> = ({
  monthlyTopTrack,
  allTimeTopTrack,
  monthlyTopArtist,
  allTimeTopArtist,
  className = '',
}) => {
  return (
    <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-6">Your Top Favorites</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Tracks */}
        <div>
          <h4 className="text-md font-medium text-gray-300 mb-4">Top Tracks</h4>
          <div className="space-y-4">
            {/* Monthly Top Track */}
            {monthlyTopTrack ? (
              <div>
                <p className="text-xs text-gray-500 mb-2">This Month</p>
                <div className="flex items-center space-x-3">
                  {monthlyTopTrack.album.images[0] && (
                    <Image
                      src={monthlyTopTrack.album.images[0].url}
                      alt={monthlyTopTrack.album.name}
                      width={48}
                      height={48}
                      className="rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {monthlyTopTrack.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {monthlyTopTrack.artists.map(artist => artist.name).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-500 mb-2">This Month</p>
                <p className="text-sm text-gray-400">No data available</p>
              </div>
            )}

            {/* All-Time Top Track */}
            {allTimeTopTrack ? (
              <div>
                <p className="text-xs text-gray-500 mb-2">All Time</p>
                <div className="flex items-center space-x-3">
                  {allTimeTopTrack.album.images[0] && (
                    <Image
                      src={allTimeTopTrack.album.images[0].url}
                      alt={allTimeTopTrack.album.name}
                      width={48}
                      height={48}
                      className="rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {allTimeTopTrack.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {allTimeTopTrack.artists.map(artist => artist.name).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-500 mb-2">All Time</p>
                <p className="text-sm text-gray-400">No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Artists */}
        <div>
          <h4 className="text-md font-medium text-gray-300 mb-4">Top Artists</h4>
          <div className="space-y-4">
            {/* Monthly Top Artist */}
            {monthlyTopArtist ? (
              <div>
                <p className="text-xs text-gray-500 mb-2">This Month</p>
                <div className="flex items-center space-x-3">
                  {monthlyTopArtist.images[0] && (
                    <Image
                      src={monthlyTopArtist.images[0].url}
                      alt={monthlyTopArtist.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {monthlyTopArtist.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {monthlyTopArtist.followers.total.toLocaleString()} followers
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-500 mb-2">This Month</p>
                <p className="text-sm text-gray-400">No data available</p>
              </div>
            )}

            {/* All-Time Top Artist */}
            {allTimeTopArtist ? (
              <div>
                <p className="text-xs text-gray-500 mb-2">All Time</p>
                <div className="flex items-center space-x-3">
                  {allTimeTopArtist.images[0] && (
                    <Image
                      src={allTimeTopArtist.images[0].url}
                      alt={allTimeTopArtist.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {allTimeTopArtist.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {allTimeTopArtist.followers.total.toLocaleString()} followers
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-500 mb-2">All Time</p>
                <p className="text-sm text-gray-400">No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopItemsSummary;

import React, { useState } from 'react';
import { SpotifyTrackData } from '../types';
import { fetchArtistTracks } from '../services/spotifyService';
import Button from './ui/Button';
import Input from './ui/Input';
import ArtistSongsModal from './ArtistSongsModal';

interface SpotifyArtistImportWidgetProps {
  onSongSelected: (data: SpotifyTrackData) => void;
}

const SpotifyArtistImportWidget: React.FC<SpotifyArtistImportWidgetProps> = ({ onSongSelected }) => {
  const [artistId, setArtistId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedSongs, setFetchedSongs] = useState<SpotifyTrackData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFetch = async () => {
    if (!artistId) {
      setError('Please enter a Spotify Artist URL or ID.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchArtistTracks(artistId);
      setFetchedSongs(data);
      setIsModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSongSelect = (song: SpotifyTrackData) => {
    onSongSelected(song);
    setIsModalOpen(false);
    setArtistId(''); // Clear input after selection
    setFetchedSongs([]);
  };

  return (
    <>
      <ArtistSongsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        songs={fetchedSongs}
        onSongSelect={handleSongSelect}
      />
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h3 className="text-md font-semibold text-white mb-2">Import by Artist</h3>
        <p className="text-sm text-gray-400 mb-4">Enter a Spotify Artist URL or ID to fetch their top tracks and select one to register.</p>
        <div className="space-y-4">
          <Input 
            label="Spotify Artist (URL or ID)"
            id="spotify-artist-identifier"
            type="text"
            value={artistId}
            onChange={(e) => setArtistId(e.target.value)}
            placeholder="e.g., https://open.spotify.com/artist/..."
          />
          <div>
              <Button onClick={handleFetch} isLoading={isLoading}>
                  Fetch Songs
              </Button>
          </div>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>
    </>
  );
};

export default SpotifyArtistImportWidget;
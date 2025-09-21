
import React, { useState } from 'react';
import { SpotifyTrackData } from '../types';
import { fetchTrackData } from '../services/spotifyService';
import Button from './ui/Button';
import Input from './ui/Input';

interface SpotifyFetchWidgetProps {
  onDataFetched: (data: SpotifyTrackData) => void;
}

/**
 * This component provides a UI for fetching song metadata from the backend Spotify service.
 * It handles user input for a Spotify identifier (URL, ID, or ISRC), manages loading and error states during the API call,
 * and passes the successfully fetched data to the parent component via the `onDataFetched` prop.
 */
const SpotifyFetchWidget: React.FC<SpotifyFetchWidgetProps> = ({ onDataFetched }) => {
  const [identifier, setIdentifier] = useState('');
  const [artistHint, setArtistHint] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFetch = async () => {
    if (!identifier) {
      setError('Please enter a Spotify URL, ID, or ISRC.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const data = await fetchTrackData(identifier, artistHint);
      onDataFetched(data);
      setSuccessMessage('Track data loaded successfully!');
      setIdentifier(''); // Clear inputs on success
      setArtistHint('');
      setTimeout(() => setSuccessMessage(null), 3000); // Clear message after 3 seconds
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <h3 className="text-md font-semibold text-white mb-2">Fetch from Spotify</h3>
      <p className="text-sm text-gray-400 mb-4">Enter a Spotify Track URL/ID or an ISRC to auto-fill song details.</p>
      <div className="space-y-4">
        <Input 
          label="Spotify Identifier (URL, ID, or ISRC)"
          id="spotify-identifier"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="e.g., https://open.spotify.com/track/..."
        />
        <Input
          label="Artist Hint (Optional, for ISRC search)"
          id="artist-hint"
          type="text"
          value={artistHint}
          onChange={(e) => setArtistHint(e.target.value)}
          placeholder="Helps find the correct track when using ISRC"
        />
        <div>
            <Button onClick={handleFetch} isLoading={isLoading}>
                Fetch
            </Button>
        </div>
      </div>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      {successMessage && <p className="text-green-400 text-sm mt-2">{successMessage}</p>}
    </div>
  );
};

export default SpotifyFetchWidget;

import React from 'react';
import { SpotifyTrackData } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface ArtistSongsModalProps {
  isOpen: boolean;
  onClose: () => void;
  songs: SpotifyTrackData[];
  onSongSelect: (song: SpotifyTrackData) => void;
}

const ArtistSongsModal: React.FC<ArtistSongsModalProps> = ({ isOpen, onClose, songs, onSongSelect }) => {
  if (!songs.length) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Select a Song to Import`}>
        <div className="max-h-[60vh] overflow-y-auto pr-2">
            <ul className="space-y-4">
                {songs.map((song) => (
                    <li key={song.spotify_track_id} className="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-4 min-w-0">
                            <img src={song.cover_art_url} alt={song.title} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="font-semibold text-white truncate">{song.title}</p>
                                <p className="text-sm text-gray-400 truncate">{song.artists.join(', ')}</p>
                                <p className="text-xs text-gray-500">{song.release_date}</p>
                            </div>
                        </div>
                        <Button variant="secondary" size="sm" onClick={() => onSongSelect(song)} className="flex-shrink-0 ml-4">
                            Select
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    </Modal>
  );
};

export default ArtistSongsModal;
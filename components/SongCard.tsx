import React from 'react';
import { Song } from '../types';
import Button from './ui/Button';

const IconPlay = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const IconPause = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

interface SongCardProps {
  song: Song;
  onLicenseClick: (song: Song) => void;
  isPlaying: boolean;
  onPlayPause: (song: Song) => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onLicenseClick, isPlaying, onPlayPause }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
      <img src={song.cover_art_url} alt={`${song.title} cover art`} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-white truncate flex-1">{song.title}</h3>
            {song.preview_url && (
                <button
                    onClick={() => onPlayPause(song)}
                    className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
                    aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
                >
                    {isPlaying ? <IconPause /> : <IconPlay />}
                </button>
            )}
        </div>
        <p className="text-sm text-gray-300 truncate">{song.artists.join(', ')}</p>
        
        <div className="mt-3 border-t border-gray-700 pt-3 text-xs text-gray-400 space-y-1">
          <div className="flex justify-between items-center">
            <span className="font-semibold">ISRC</span>
            <span className="font-mono bg-gray-700 px-2 py-0.5 rounded">{song.isrc}</span>
          </div>
          {song.release_date && (
            <div className="flex justify-between items-center">
              <span className="font-semibold">Released</span>
              <span>{song.release_date}</span>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs bg-gray-700 text-gray-200 px-2 py-1 rounded-full">{song.genre}</span>
            {song.mood_tags.slice(0, 2).map(tag => (
                 <span key={tag} className="text-xs bg-indigo-900 text-indigo-200 px-2 py-1 rounded-full">{tag}</span>
            ))}
        </div>
        <div className="mt-auto pt-4">
            <Button className="w-full" onClick={() => onLicenseClick(song)}>
                License This Song
            </Button>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
import React, { useState, useMemo, useRef, useEffect } from 'react';
import SongCard from '../components/SongCard';
import { Song, SongStatus } from '../types';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { GENRES } from '../constants';
import LicenseSongModal from '../components/LicenseSongModal';
import Pagination from '../components/ui/Pagination';

const BASE_MOCK_SONGS: Song[] = [
  {
    id: '1', ownerUserId: 'u1', title: 'Cosmic Drift', artists: ['Stellar Fusion'], duration_ms: 210000, genre: 'Electronic', isrc: 'GB-LFP-24-12345',
    cover_art_url: 'https://picsum.photos/seed/cosmic/400', status: SongStatus.REGISTERED, available_for_sync: true, 
    mood_tags: ['Uplifting', 'Driving', 'Synthwave'], tempo: 120, writers: [],
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    release_date: '2024-05-20',
  },
  {
    id: '2', ownerUserId: 'u2', title: 'Lagos Midnight', artists: ['AfroBeats Collective'], duration_ms: 180000, genre: 'Afrobeats', isrc: 'NG-ABC-24-00001',
    cover_art_url: 'https://picsum.photos/seed/lagos/400', status: SongStatus.REGISTERED, available_for_sync: true, 
    mood_tags: ['Energetic', 'Vibrant', 'Nightlife'], tempo: 110, writers: [],
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    release_date: '2024-03-15',
  },
  {
    id: '3', ownerUserId: 'u3', title: 'Quiet Reflection', artists: ['Einaudi Reworks'], duration_ms: 240000, genre: 'Classical', isrc: 'DE-CDE-24-54321',
    cover_art_url: 'https://picsum.photos/seed/quiet/400', status: SongStatus.REGISTERED, available_for_sync: true, 
    mood_tags: ['Pensive', 'Emotional', 'Cinematic'], tempo: 80, writers: [],
    preview_url: null,
    release_date: '2023-11-01',
  },
  {
    id: '4', ownerUserId: 'u1', title: 'Highway Blues', artists: ['The Dust Devils'], duration_ms: 200000, genre: 'Rock', isrc: 'US-XYZ-24-98765',
    cover_art_url: 'https://picsum.photos/seed/highway/400', status: SongStatus.REGISTERED, available_for_sync: true, 
    mood_tags: ['Gritty', 'Road Trip', 'Raw'], tempo: 130, writers: [],
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    release_date: '2024-01-30',
  },
  {
    id: '5', ownerUserId: 'u2', title: 'Island Groove', artists: ['Bob\'s Successors'], duration_ms: 195000, genre: 'Reggae', isrc: 'JM-RAS-24-11223',
    cover_art_url: 'https://picsum.photos/seed/island/400', status: SongStatus.REGISTERED, available_for_sync: true, 
    mood_tags: ['Relaxed', 'Sunny', 'Positive'], tempo: 90, writers: [],
    preview_url: null,
    release_date: '2022-07-22',
  },
   {
    id: '6', ownerUserId: 'u3', title: 'City Lights', artists: ['Jazz Masters'], duration_ms: 280000, genre: 'Jazz', isrc: 'US-JAZ-24-55555',
    cover_art_url: 'https://picsum.photos/seed/jazz/400', status: SongStatus.REGISTERED, available_for_sync: true, 
    mood_tags: ['Sophisticated', 'Cool', 'Urban'], tempo: 100, writers: [],
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    release_date: '2023-09-10',
  }
];

// Expand mock data for pagination demonstration
const MOCK_SONGS: Song[] = Array.from({ length: 4 }).flatMap((_, index) => 
  BASE_MOCK_SONGS.map((song, songIndex) => ({
    ...song,
    id: `${song.id}-${index}-${songIndex}`,
    title: `${song.title} ${index > 0 ? `#${index + 1}`: ''}`.trim()
  }))
);


const SuccessAlert: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => (
    <div className="fixed top-20 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center z-50 animate-fade-in-down">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-xl font-bold">&times;</button>
    </div>
);


const SyncCatalog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [selectedMood, setSelectedMood] = useState('ALL');
  const [sortOption, setSortOption] = useState('date_desc');
  const [songToLicense, setSongToLicense] = useState<Song | null>(null);
  const [licenseSuccess, setLicenseSuccess] = useState(false);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const SONGS_PER_PAGE = 10;

  useEffect(() => {
    // Cleanup audio on component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlayPause = (song: Song) => {
    // If clicking the currently playing song, pause it.
    if (audioRef.current && playingSongId === song.id) {
      audioRef.current.pause();
      setPlayingSongId(null);
      return;
    }
    
    // If another song is playing, pause it first.
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // If the clicked song has a preview, play it.
    if (song.preview_url) {
      audioRef.current = new Audio(song.preview_url);
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      setPlayingSongId(song.id);
      
      // When the song ends, reset the playing state.
      audioRef.current.onended = () => {
        setPlayingSongId(null);
      };
    } else {
        // If no preview URL, ensure nothing is marked as playing.
        setPlayingSongId(null);
    }
  };


  const moodTags = useMemo(() => {
    const allTags = new Set<string>();
    MOCK_SONGS.forEach(song => song.mood_tags.forEach(tag => allTags.add(tag)));
    return ['ALL', ...Array.from(allTags).sort()];
  }, []);
  
  const filteredAndSortedSongs = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    
    let songs = MOCK_SONGS.filter(song => {
      const matchesQuery = lowercasedQuery === '' || 
        song.title.toLowerCase().includes(lowercasedQuery) ||
        song.artists.some(artist => artist.toLowerCase().includes(lowercasedQuery)) ||
        song.genre.toLowerCase().includes(lowercasedQuery) ||
        song.mood_tags.some(tag => tag.toLowerCase().includes(lowercasedQuery));
      
      const matchesGenre = selectedGenre === 'ALL' || song.genre === selectedGenre;
      
      const matchesMood = selectedMood === 'ALL' || song.mood_tags.includes(selectedMood);

      return matchesQuery && matchesGenre && matchesMood;
    });

    // Apply sorting
    songs.sort((a, b) => {
      const hasA = !!a.release_date;
      const hasB = !!b.release_date;
      if (hasA && !hasB) return -1;
      if (!hasA && hasB) return 1;
      if (!hasA && !hasB) return 0;
      
      const dateA = new Date(a.release_date!).getTime();
      const dateB = new Date(b.release_date!).getTime();

      switch (sortOption) {
        case 'date_asc':
          return dateA - dateB;
        case 'date_desc':
          return dateB - dateA;
        default:
          return 0;
      }
    });

    return songs;

  }, [searchQuery, selectedGenre, selectedMood, sortOption]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGenre, selectedMood, sortOption]);

  const totalPages = Math.ceil(filteredAndSortedSongs.length / SONGS_PER_PAGE);

  const paginatedSongs = useMemo(() => {
    const startIndex = (currentPage - 1) * SONGS_PER_PAGE;
    return filteredAndSortedSongs.slice(startIndex, startIndex + SONGS_PER_PAGE);
  }, [filteredAndSortedSongs, currentPage]);


  const handleOpenLicenseModal = (song: Song) => {
    setSongToLicense(song);
  };

  const handleCloseLicenseModal = () => {
    setSongToLicense(null);
  };

  const handleConfirmLicense = (details: { name: string; email: string; project: string }) => {
    console.log('License request submitted for:', songToLicense?.title, 'with details:', details);
    handleCloseLicenseModal();
    setLicenseSuccess(true);
    setTimeout(() => setLicenseSuccess(false), 5000); // Hide success message after 5 seconds
  };

  return (
    <>
      <LicenseSongModal
        isOpen={!!songToLicense}
        onClose={handleCloseLicenseModal}
        onSubmit={handleConfirmLicense}
        song={songToLicense}
      />
       {licenseSuccess && (
        <SuccessAlert 
          message="License request sent! Our team will be in touch."
          onClose={() => setLicenseSuccess(false)}
        />
      )}
      <div className="space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">Sync Licensing Catalog</h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            High-quality, pre-cleared music for your film, TV, advertising, and game projects.
          </p>
        </div>
        
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input 
              label="Search Title, Artist, Genre, Mood..."
              id="search"
              placeholder="e.g., Cosmic Drift, Afrobeats"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select
              label="Filter by Genre"
              id="genre-filter"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="ALL">All Genres</option>
              {GENRES.map(genre => <option key={genre} value={genre}>{genre}</option>)}
            </Select>
            <Select
              label="Filter by Mood"
              id="mood-filter"
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
            >
              {moodTags.map(tag => <option key={tag} value={tag}>{tag === 'ALL' ? 'All Moods' : tag}</option>)}
            </Select>
            <Select
              label="Sort by"
              id="sort-order"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="date_desc">Release Date (Newest)</option>
              <option value="date_asc">Release Date (Oldest)</option>
            </Select>
          </div>
        </Card>
        
        {filteredAndSortedSongs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedSongs.map(song => (
                <SongCard 
                  key={song.id} 
                  song={song} 
                  onLicenseClick={handleOpenLicenseModal}
                  isPlaying={playingSongId === song.id}
                  onPlayPause={handlePlayPause}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-white">No Songs Found</h3>
            <p className="text-gray-400 mt-2">Try adjusting your search filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default SyncCatalog;


import React, { useState } from 'react';
import { Song, SpotifyTrackData, Writer, SongStatus, UserRole, User } from '../types';
import SpotifyFetchWidget from '../components/SpotifyFetchWidget';
import WriterRepeater from '../components/WriterRepeater';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { GENRES } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { generateContractPdf } from '../utils/contractGenerator';
import { useContractTemplate } from '../contexts/ContractContext';
import PreviewContractModal from '../components/PreviewContractModal';
import { useSongs } from '../contexts/SongContext';
import SpotifyArtistImportWidget from '../components/SpotifyArtistImportWidget';
import SpotifyBulkImportWidget from '../components/SpotifyBulkImportWidget';

const SubmissionSuccess: React.FC<{ song: Song }> = ({ song }) => {
    return (
        <div className="text-center max-w-2xl mx-auto">
            <Card>
                <h2 className="text-2xl font-bold text-green-400 mb-4">Submission Successful!</h2>
                <p className="text-gray-300 mb-2">
                    Your song, "{song.title}", has been submitted for review.
                </p>
                <p className="text-gray-400 mb-6">
                    As per our terms, an exclusive publishing agreement has been generated. Please download a copy for your records. This is also available to the publishing administrator.
                </p>
                <Button onClick={() => generateContractPdf(song.title, song.contract_text!)}>
                    Download Publishing Agreement
                </Button>
                <Link to="/dashboard" className="ml-4">
                    <Button variant="secondary">Back to Dashboard</Button>
                </Link>
            </Card>
        </div>
    );
};


const NewSong: React.FC = () => {
  const { user } = useAuth();
  const { contractTemplate } = useContractTemplate();
  const { addSong } = useSongs();
  const [song, setSong] = useState<Partial<Song> & { artistOrWriterRole?: UserRole }>({
    title: '',
    duration_ms: 0,
    genre: GENRES[0],
    isrc: '',
    cover_art_url: 'https://picsum.photos/seed/placeholder/640',
    status: SongStatus.PENDING,
    available_for_sync: false,
    writers: [],
    artists: [],
    artistOrWriterRole: UserRole.ARTIST,
  });
  const [writers, setWriters] = useState<Writer[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedSong, setSubmittedSong] = useState<Song | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  
  const handleDataFetched = (data: SpotifyTrackData) => {
    setSong(prev => ({
      ...prev,
      title: data.title,
      duration_ms: data.duration_ms,
      isrc: data.isrc,
      cover_art_url: data.cover_art_url,
      album: data.album,
      release_date: data.release_date,
      artists: data.artists
    }));
  };

  const handleInputChange = (field: string, value: any) => {
    setSong(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // In a real app, this would be captured from the server request.
    const mockIpAddress = `192.168.1.${Math.floor(Math.random() * 254) + 1} (Simulated IP)`; 

    // Generate contract text
    const submissionDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const writerNames = writers.map(w => w.name).join(', ') || 'N/A';
    const artistNames = song.artists?.join(', ') || 'N/A';
    const generatedContractText = contractTemplate
        .replace(/\[SONG_TITLE\]/g, song.title || 'Untitled')
        .replace(/\[ARTIST_NAMES\]/g, artistNames)
        .replace(/\[WRITER_NAMES\]/g, writerNames)
        .replace(/\[SUBMITTER_NAME\]/g, user.name)
        .replace(/\[SUBMISSION_DATE\]/g, submissionDate)
        .replace(/\[SIGNING_IP_ADDRESS\]/g, mockIpAddress);

    const finalSongData: Song = {
      ...(song as Song),
      writers,
      id: uuidv4(),
      ownerUserId: user.id,
      ownerName: user.name,
      contract_text: generatedContractText,
    };
    addSong(finalSongData);
    setSubmittedSong(finalSongData);
    setIsSubmitted(true);
  };
  
  const totalSplit = writers.reduce((sum, writer) => sum + Number(writer.split_percent || 0), 0);

  if (!user) {
    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold">Please log in</h1>
            <p className="text-gray-400">You need to be logged in to register a song.</p>
            <Link to="/login" className="mt-4 inline-block"><Button>Go to Login</Button></Link>
        </div>
    )
  }

  if (isSubmitted && submittedSong) {
    return <SubmissionSuccess song={submittedSong} />;
  }

  return (
    <>
      <PreviewContractModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        song={{...song, writers}}
        user={user}
        contractTemplate={contractTemplate}
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Register a New Song</h1>
        
        <Card className="mb-8">
          <SpotifyBulkImportWidget />
        </Card>

        <div className="text-center my-6">
            <div className="inline-flex items-center justify-center w-full">
                <hr className="w-full h-px my-8 bg-gray-700 border-0" />
                <span className="absolute px-3 font-medium text-gray-400 -translate-x-1/2 bg-gray-900 left-1/2 whitespace-nowrap">
                    OR REGISTER A SINGLE SONG MANUALLY
                </span>
            </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <div className="space-y-6">
                <SpotifyFetchWidget onDataFetched={handleDataFetched} />
                <SpotifyArtistImportWidget onSongSelected={handleDataFetched} />
            </div>
          </Card>

          <Card title="Song Details">
            {/* This section contains all core song metadata. Each input is wired to the `song` state object via the `handleInputChange` handler. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input for the song's title. Correctly updates the `title` field in the state. */}
              <Input
                label="Song Title"
                id="title"
                value={song.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
              {/* Input for the song's artists. Correctly updates the `artists` array in the state. */}
              <Input
                label="Artist(s)"
                id="artists"
                value={song.artists?.join(', ') || ''}
                onChange={(e) => handleInputChange('artists', e.target.value.split(',').map(s => s.trim()))}
                placeholder="Artist One, Artist Two"
                required
              />
              {/* Input for the ISRC. Correctly updates the `isrc` field in the state. */}
              <Input
                label="ISRC"
                id="isrc"
                value={song.isrc || ''}
                onChange={(e) => handleInputChange('isrc', e.target.value)}
              />
              {/* Dropdown for the genre. Correctly updates the `genre` field in the state. */}
              <Select
                label="Genre"
                id="genre"
                value={song.genre}
                onChange={(e) => handleInputChange('genre', e.target.value)}
              >
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </Select>

              {user?.role === UserRole.ADMIN && (
                <Select
                  label="Artist/Writer Role"
                  id="artistOrWriterRole"
                  value={song.artistOrWriterRole}
                  onChange={(e) => handleInputChange('artistOrWriterRole', e.target.value as UserRole)}
                >
                  <option value={UserRole.ARTIST}>Artist</option>
                  <option value={UserRole.WRITER}>Writer</option>
                </Select>
              )}

              {/* Input for the cover art URL. Correctly updates the `cover_art_url` field in the state. */}
              <Input
                label="Cover Art URL"
                id="cover_art_url"
                value={song.cover_art_url || ''}
                onChange={(e) => handleInputChange('cover_art_url', e.target.value)}
              />
              {/* This checkbox correctly updates the boolean `available_for_sync` field in the song state. */}
              <div className="md:col-span-2 flex items-center space-x-3">
                <input type="checkbox" id="available_for_sync" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={song.available_for_sync}
                  onChange={(e) => handleInputChange('available_for_sync', e.target.checked)}
                />
                <label htmlFor="available_for_sync" className="text-sm text-gray-300">Available for Sync Licensing</label>
              </div>
            </div>
          </Card>
          
          <Card>
            <WriterRepeater writers={writers} setWriters={setWriters} />
          </Card>

          <Card title="Agreement">
            <div className="flex items-start space-x-3">
              <input
                id="agree-to-terms"
                type="checkbox"
                className="h-4 w-4 mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 flex-shrink-0"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <div>
                <label htmlFor="agree-to-terms" className="text-sm font-medium text-white">
                  I have reviewed and agree to the terms of the Publishing Agreement.
                </label>
                <p className="text-xs text-gray-400">
                  By submitting, you and all contributing writers agree to be bound by this exclusive agreement.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="mt-2"
                  onClick={() => setIsPreviewModalOpen(true)}
                  disabled={!user}
                >
                  Preview Agreement
                </Button>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
              <Button type="submit" disabled={totalSplit !== 100 || !agreeToTerms}>
                  Submit for Review
              </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewSong;
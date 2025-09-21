import React, { useState } from 'react';
import { SpotifyTrackData, Song, SongStatus, Revision } from '../types';
import { importArtistCatalog } from '../services/spotifyService';
import { useAuth } from '../hooks/useAuth';
import { useSongs } from '../contexts/SongContext';
import { useContractTemplate } from '../contexts/ContractContext';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';
import { v4 as uuidv4 } from 'uuid';

const SpotifyBulkImportWidget: React.FC = () => {
    const [artistId, setArtistId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fetchedSongs, setFetchedSongs] = useState<SpotifyTrackData[]>([]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const { user } = useAuth();
    const { bulkAddRegisteredSongs } = useSongs();
    const { contractTemplate } = useContractTemplate();
    
    const handleFetch = async () => {
        if (!artistId) {
            setError('Please enter a Spotify Artist URL or ID.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const data = await importArtistCatalog(artistId);
            setFetchedSongs(data);
            setIsConfirmModalOpen(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleConfirmImport = () => {
        if (!user || fetchedSongs.length === 0) return;

        const songsToRegister: Song[] = fetchedSongs.map(trackData => {
            const newRevision: Revision = {
                timestamp: new Date().toISOString(),
                userId: user.id,
                userName: user.name,
                notes: `Song imported from Spotify artist profile.`
            };
            
            const submissionDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            const generatedContractText = contractTemplate
                .replace(/\[SONG_TITLE\]/g, trackData.title || 'Untitled')
                .replace(/\[ARTIST_NAMES\]/g, trackData.artists?.join(', ') || 'N/A')
                .replace(/\[WRITER_NAMES\]/g, 'N/A (To be added)')
                .replace(/\[SUBMITTER_NAME\]/g, user.name)
                .replace(/\[SUBMISSION_DATE\]/g, submissionDate)
                .replace(/\[SIGNING_IP_ADDRESS\]/g, 'N/A (Bulk Import)');

            return {
                id: uuidv4(),
                ownerUserId: user.id,
                ownerName: user.name,
                title: trackData.title,
                duration_ms: trackData.duration_ms,
                genre: 'Pop', // Using a default genre as Spotify API doesn't provide it per track
                isrc: trackData.isrc,
                cover_art_url: trackData.cover_art_url,
                spotify_track_id: trackData.spotify_track_id,
                album: trackData.album,
                release_date: trackData.release_date,
                status: SongStatus.REGISTERED,
                available_for_sync: true,
                mood_tags: [],
                writers: [],
                artists: trackData.artists,
                preview_url: trackData.preview_url,
                revisionHistory: [newRevision],
                contract_text: generatedContractText,
            };
        });
        
        bulkAddRegisteredSongs(songsToRegister);
        
        setIsConfirmModalOpen(false);
        setArtistId('');
        setFetchedSongs([]);
        setSuccessMessage(`${songsToRegister.length} songs were successfully imported into your sync catalog!`);
        setTimeout(() => setSuccessMessage(null), 5000);
    };

    return (
        <>
            <Modal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                title="Confirm Song Import"
            >
                <div className="space-y-4">
                    <p>We found <span className="font-bold text-white">{fetchedSongs.length}</span> songs for this artist.</p>
                    <p className="text-sm text-gray-400">
                        These songs will be added to your catalog as "Registered" and made available for sync licensing. 
                        Please note that writer information is not available from Spotify and must be added manually for each song to be eligible for publishing administration.
                    </p>
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="secondary" onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleConfirmImport}>Confirm Import</Button>
                    </div>
                </div>
            </Modal>
            
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-md font-semibold text-white mb-2">Bulk Import from Spotify Artist</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Enter your Spotify Artist URL or ID to automatically import your songs into the sync catalog.
                </p>
                <div className="space-y-4">
                    <Input 
                        label="Spotify Artist (URL or ID)"
                        id="spotify-bulk-import-identifier"
                        type="text"
                        value={artistId}
                        onChange={(e) => setArtistId(e.target.value)}
                        placeholder="e.g., https://open.spotify.com/artist/..."
                    />
                    <div>
                        <Button onClick={handleFetch} isLoading={isLoading}>
                            Import Catalog
                        </Button>
                    </div>
                </div>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                {successMessage && <p className="text-green-400 text-sm mt-2">{successMessage}</p>}
            </div>
        </>
    );
};

export default SpotifyBulkImportWidget;

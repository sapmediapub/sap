
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Song, UserRole, Writer, SongStatus } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { WRITER_ROLE_OPTIONS, GENRES } from '../constants';
import { useSongs } from '../contexts/SongContext';
import { useAuth } from '../hooks/useAuth';
import EditWritersModal from '../components/Admin/EditWritersModal';
import ViewContractModal from '../components/ViewContractModal';

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-400">{label}</p>
    <div className="text-md text-white mt-1">{value}</div>
  </div>
);

const SongDetails: React.FC = () => {
  const { songId } = useParams<{ songId: string }>();
  const { getSongById, updateSong } = useSongs();
  const { user } = useAuth();
  
  const originalSong = songId ? getSongById(songId) : undefined;
  
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editableSong, setEditableSong] = useState<Partial<Song>>(originalSong || {});
  const [isWritersModalOpen, setIsWritersModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  useEffect(() => {
    if (originalSong) {
      setEditableSong(originalSong);
    }
  }, [originalSong]);

  if (!originalSong) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-500">Song Not Found</h1>
        <p className="text-gray-400 mt-2">The song you are looking for does not exist.</p>
        <Link to="/dashboard" className="mt-4 inline-block">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  // --- Access Control Check ---
  const isOwner = originalSong.ownerUserId === user?.id;
  const isAdmin = user?.role === UserRole.ADMIN;

  if (!isOwner && !isAdmin) {
    return (
        <div className="text-center max-w-lg mx-auto">
            <Card>
                <div className="flex justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
                <p className="text-gray-400 mb-6">You do not have permission to view this song's details.</p>
                <Link to="/dashboard">
                    <Button>Return to Dashboard</Button>
                </Link>
            </Card>
        </div>
    );
  }
  // --- End Access Control Check ---
  
  const generateRevisionNote = (oldSong: Song, newSong: Partial<Song>): string => {
    const changes: string[] = [];
    if (oldSong.title !== newSong.title) changes.push('Title');
    if (oldSong.artists.join(', ') !== newSong.artists?.join(', ')) changes.push('Artists');
    if (oldSong.status !== newSong.status) changes.push('Status');
    if (oldSong.genre !== newSong.genre) changes.push('Genre');
    if (oldSong.isrc !== newSong.isrc) changes.push('ISRC');
    if (oldSong.release_date !== newSong.release_date) changes.push('Release Date');
    if (oldSong.album !== newSong.album) changes.push('Album');
    if (oldSong.available_for_sync !== newSong.available_for_sync) changes.push('Sync Availability');
    
    if (changes.length === 0) return 'Admin made no changes to details.';
    return `Admin updated: ${changes.join(', ')}.`;
  };
  
  const handleSaveDetails = () => {
    if (originalSong) {
      const { id, writers, revisionHistory, ownerUserId, ownerName, duration_ms, ...cleanedEditableSong } = editableSong;
      const revisionNote = generateRevisionNote(originalSong, cleanedEditableSong);
      updateSong(originalSong.id, cleanedEditableSong, revisionNote);
    }
    setIsEditingDetails(false);
  };

  const handleCancelEditDetails = () => {
    setEditableSong(originalSong);
    setIsEditingDetails(false);
  };
  
  const handleSaveWriters = (newWriters: Writer[]) => {
    if (originalSong) {
        updateSong(originalSong.id, { writers: newWriters }, 'Admin updated writer information.');
    }
    setIsWritersModalOpen(false);
  };

  const handleDetailChange = (field: keyof Song, value: any) => {
    setEditableSong(prev => ({...prev, [field]: value }));
  };

  const formatTimestamp = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <ViewContractModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        contractText={originalSong.contract_text}
        songTitle={originalSong.title}
      />
      {isAdmin && (
        <EditWritersModal
            isOpen={isWritersModalOpen}
            onClose={() => setIsWritersModalOpen(false)}
            initialWriters={originalSong.writers}
            onSave={handleSaveWriters}
        />
      )}
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          {isEditingDetails && isAdmin ? (
            <Input 
              label="Song Title" 
              id="title" 
              value={editableSong.title || ''} 
              onChange={e => handleDetailChange('title', e.target.value)} 
              className="text-3xl font-bold !p-0 !bg-transparent !border-0"
            />
          ) : (
            <h1 className="text-3xl font-bold text-white">{originalSong.title}</h1>
          )}
          {isEditingDetails && isAdmin ? (
             <Input 
              label="Artist(s)" 
              id="artists" 
              value={editableSong.artists?.join(', ') || ''} 
              onChange={e => handleDetailChange('artists', e.target.value.split(',').map(s => s.trim()))} 
              className="text-lg !p-0 !bg-transparent !border-0"
            />
          ) : (
            <p className="text-lg text-gray-300">{originalSong.artists.join(', ')}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
              <img src={originalSong.cover_art_url} alt={`${originalSong.title} cover art`} className="rounded-lg shadow-lg w-full" />
          </div>
          <div className="md:col-span-2">
              <Card title="Core Details">
                {isEditingDetails && isAdmin ? (
                  <div className="space-y-4">
                    <Select label="Status" id="status" value={editableSong.status} onChange={e => handleDetailChange('status', e.target.value as SongStatus)}>
                      {Object.values(SongStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                    <Select label="Genre" id="genre" value={editableSong.genre} onChange={e => handleDetailChange('genre', e.target.value)}>
                      {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                    </Select>
                    <Input label="ISRC" id="isrc" value={editableSong.isrc} onChange={e => handleDetailChange('isrc', e.target.value)} />
                    <Input label="Release Date" id="release_date" type="date" value={editableSong.release_date} onChange={e => handleDetailChange('release_date', e.target.value)} />
                    <Input label="Album" id="album" value={editableSong.album} onChange={e => handleDetailChange('album', e.target.value)} />
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" id="available_for_sync" className="h-4 w-4 rounded" checked={editableSong.available_for_sync} onChange={e => handleDetailChange('available_for_sync', e.target.checked)} />
                      <label htmlFor="available_for_sync">Available for Sync</label>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                      <DetailItem label="Status" value={<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${originalSong.status === 'REGISTERED' ? 'bg-green-900 text-green-200' : originalSong.status === 'PENDING' ? 'bg-yellow-900 text-yellow-200' : 'bg-red-900 text-red-200'}`}>{originalSong.status}</span>} />
                      <DetailItem label="Genre" value={originalSong.genre} />
                      <DetailItem label="ISRC" value={<span className="font-mono bg-gray-700 px-2 py-0.5 rounded text-sm">{originalSong.isrc || 'N/A'}</span>} />
                      <DetailItem label="Duration" value={`${Math.floor(originalSong.duration_ms / 60000)}:${('0' + Math.floor((originalSong.duration_ms % 60000) / 1000)).slice(-2)}`} />
                      <DetailItem label="Release Date" value={originalSong.release_date} />
                      <DetailItem label="Album" value={originalSong.album} />
                      <DetailItem label="Sync Available" value={originalSong.available_for_sync ? 'Yes' : 'No'} />
                      <DetailItem label="Submitted By" value={originalSong.ownerName} />
                  </div>
                )}
                <div className="mt-6 pt-4 border-t border-gray-600 flex justify-end gap-2">
                    {originalSong.contract_text && (isOwner || isAdmin) && !isEditingDetails && (
                        <Button variant="secondary" onClick={() => setIsContractModalOpen(true)}>View Agreement</Button>
                    )}
                    {isAdmin && (
                        <>
                            {isEditingDetails ? (
                            <>
                                <Button variant="secondary" onClick={handleCancelEditDetails}>Cancel</Button>
                                <Button onClick={handleSaveDetails}>Save Changes</Button>
                            </>
                            ) : (
                            <Button onClick={() => setIsEditingDetails(true)}>Edit Details</Button>
                            )}
                        </>
                    )}
                </div>
              </Card>
          </div>
        </div>
        
        <Card title="Writers & Splits">
          {originalSong.writers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">IPI/CAE</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">PRO</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Role</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-300 uppercase">Split %</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {originalSong.writers.map(writer => (
                    <tr key={writer.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{writer.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{writer.ipi_cae}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{writer.pro}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{WRITER_ROLE_OPTIONS[writer.role as keyof typeof WRITER_ROLE_OPTIONS]}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-indigo-300">{writer.split_percent.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400">No writer information available for this song.</p>
          )}
           {isAdmin && (
                <div className="mt-6 pt-4 border-t border-gray-600 flex justify-end">
                    <Button onClick={() => setIsWritersModalOpen(true)}>Manage Writers</Button>
                </div>
            )}
        </Card>

        <Card title="Revision History">
          {originalSong.revisionHistory && originalSong.revisionHistory.length > 0 ? (
            <ul className="space-y-4">
              {[...originalSong.revisionHistory].reverse().map((rev, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                    {rev.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-white">
                      <span className="font-semibold">{rev.userName}</span>
                    </p>
                    <p className="text-xs text-gray-400">{formatTimestamp(rev.timestamp)}</p>
                    <p className="text-sm text-gray-300 mt-1 italic">"{rev.notes}"</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No revision history found for this song.</p>
          )}
        </Card>
      </div>
    </>
  );
};

export default SongDetails;

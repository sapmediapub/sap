import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Song, SongStatus, Revision } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import RejectSongModal from '../../components/Admin/RejectSongModal';
import { generateContractPdf } from '../../utils/contractGenerator';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import { useContractTemplate } from '../../contexts/ContractContext';
import { useSongs } from '../../contexts/SongContext';
import Pagination from '../../components/ui/Pagination';

const SongApprovals: React.FC = () => {
  const { pendingSongs, approveSong, rejectSong } = useSongs();
  const [songToReject, setSongToReject] = useState<Song | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const SONGS_PER_PAGE = 10;
  const { user } = useAuth();

  const filteredSongs = useMemo(() => {
    if (!searchQuery) {
      return pendingSongs;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return pendingSongs.filter(song =>
      song.title.toLowerCase().includes(lowercasedQuery) ||
      song.artists.some(artist => artist.toLowerCase().includes(lowercasedQuery))
    );
  }, [pendingSongs, searchQuery]);
  
  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredSongs.length / SONGS_PER_PAGE);

  const paginatedSongs = useMemo(() => {
    const startIndex = (currentPage - 1) * SONGS_PER_PAGE;
    return filteredSongs.slice(startIndex, startIndex + SONGS_PER_PAGE);
  }, [filteredSongs, currentPage]);

  const paginationInfo = useMemo(() => {
    const totalCount = filteredSongs.length;
    if (totalCount === 0) return '';
    const startIndex = (currentPage - 1) * SONGS_PER_PAGE + 1;
    const endIndex = Math.min(currentPage * SONGS_PER_PAGE, totalCount);
    return `Showing ${startIndex} to ${endIndex} of ${totalCount} songs`;
  }, [filteredSongs.length, currentPage]);

  const handleApprove = (songId: string) => {
    if (!user) return;
    approveSong(songId);
  };

  const handleRejectSubmit = (reason: string) => {
    if (!songToReject || !user) return;
    rejectSong(songToReject.id, reason);
    setSongToReject(null);
  };

  const handleDownloadContract = (song: Song) => {
    if (!song.contract_text) {
        alert("Contract text for this song is not available.");
        return;
    }
    generateContractPdf(song.title, song.contract_text);
  };


  return (
    <>
      {songToReject && (
        <RejectSongModal
          isOpen={!!songToReject}
          onClose={() => setSongToReject(null)}
          onSubmit={handleRejectSubmit}
          songTitle={songToReject.title}
        />
      )}
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white">Song Approvals</h1>
        
        <Card>
          <div className="mb-4">
            <Input
              label="Search by Title or Artist"
              id="search-songs"
              type="text"
              placeholder="Search pending songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {filteredSongs.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Song Title</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Artist(s)</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Submitted By</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contract</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {paginatedSongs.map(song => (
                      <tr key={song.id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          <Link to={`/songs/${song.id}`} className="hover:text-indigo-400 hover:underline">
                            {song.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{song.artists.join(', ')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{song.ownerName || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <Button variant="secondary" size="sm" onClick={() => handleDownloadContract(song)}>
                              Download
                          </Button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <Button variant="primary" size="sm" onClick={() => handleApprove(song.id)}>Approve</Button>
                          <Button variant="danger" size="sm" onClick={() => setSongToReject(song)}>Reject</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400 mt-8">
                    {paginationInfo}
                </span>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-8">
                <p className="text-gray-400">{searchQuery ? 'No songs match your search.' : 'No pending song approvals.'}</p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default SongApprovals;
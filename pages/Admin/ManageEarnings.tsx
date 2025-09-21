
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Song, Earning } from '../../types';
import { MOCK_SONG_EARNINGS } from '../../mockData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import AddEarningModal from '../../components/Admin/AddEarningModal';
import { v4 as uuidv4 } from 'uuid';
import { useSongs } from '../../contexts/SongContext';

const ManageEarnings: React.FC = () => {
  const { registeredSongs } = useSongs();
  const [earnings, setEarnings] = useState<Earning[]>(MOCK_SONG_EARNINGS);
  const [songToAddEarning, setSongToAddEarning] = useState<Song | null>(null);

  const songEarningsMap = useMemo(() => {
    const map = new Map<string, number>();
    earnings.forEach(earning => {
      map.set(earning.songId, (map.get(earning.songId) || 0) + earning.amount);
    });
    return map;
  }, [earnings]);

  const handleAddEarningSubmit = (earningData: Omit<Earning, 'id' | 'songId'>) => {
    if (!songToAddEarning) return;
    const newEarning: Earning = {
      ...earningData,
      id: uuidv4(),
      songId: songToAddEarning.id,
    };
    setEarnings(prev => [...prev, newEarning]);
    setSongToAddEarning(null); // Close modal
  };

  return (
    <>
      {songToAddEarning && (
        <AddEarningModal
          isOpen={!!songToAddEarning}
          onClose={() => setSongToAddEarning(null)}
          onSubmit={handleAddEarningSubmit}
          song={songToAddEarning}
        />
      )}
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white">Manage Song Earnings</h1>
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Song Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Artist(s)</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Total Earnings</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {registeredSongs.map(song => (
                  <tr key={song.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      <Link to={`/songs/${song.id}`} className="hover:text-indigo-400 hover:underline">
                        {song.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{song.artists.join(', ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-green-400">
                      ${(songEarningsMap.get(song.id) || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="secondary" size="sm" onClick={() => setSongToAddEarning(song)}>
                        Add Earning
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ManageEarnings;

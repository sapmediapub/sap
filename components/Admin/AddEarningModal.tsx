
import React, { useState } from 'react';
import { Song, Earning, Platform, EarningSource } from '../../types';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const PLATFORMS: Platform[] = ['Spotify', 'Apple Music', 'YouTube', 'Tidal', 'Amazon Music', 'Deezer'];

interface AddEarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (earning: Omit<Earning, 'id' | 'songId'>) => void;
  song: Song;
}

const AddEarningModal: React.FC<AddEarningModalProps> = ({ isOpen, onClose, onSubmit, song }) => {
  const [amount, setAmount] = useState('');
  const [platform, setPlatform] = useState<Platform>('Spotify');
  const [source, setSource] = useState<EarningSource>(EarningSource.PERFORMANCE);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      amount: parseFloat(amount),
      platform,
      source,
      date,
    });
    // Reset form for next time
    setAmount('');
    setPlatform('Spotify');
    setSource(EarningSource.PERFORMANCE);
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add Earning for: ${song.title}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Amount"
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <Select
          label="Platform"
          id="platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value as Platform)}
        >
          {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
        </Select>
        <Select
          label="Source"
          id="source"
          value={source}
          onChange={(e) => setSource(e.target.value as EarningSource)}
        >
          {Object.values(EarningSource).map(s => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Input
          label="Date"
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Add Earning
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEarningModal;
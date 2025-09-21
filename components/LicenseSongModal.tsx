import React, { useState } from 'react';
import { Song } from '../types';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';

interface LicenseSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: { name: string; email: string; project: string }) => void;
  song: Song | null;
}

const LicenseSongModal: React.FC<LicenseSongModalProps> = ({ isOpen, onClose, onSubmit, song }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [project, setProject] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !project) return;
    onSubmit({ name, email, project });
  };
  
  if (!song) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Request License for: ${song.title}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <p className="text-sm font-medium text-gray-400">Song</p>
          <p className="text-lg font-semibold text-white">{song.title} by {song.artists.join(', ')}</p>
        </div>
        <p className="text-sm text-gray-300">
          Please provide your details below. Our licensing team will contact you shortly to finalize the agreement and pricing.
        </p>
        <Input
          label="Your Full Name"
          id="lic-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Your Email Address"
          id="lic-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Project Name / Description"
          id="lic-project"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          placeholder="e.g., Independent Film, YouTube Ad"
          required
        />
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Submit Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LicenseSongModal;
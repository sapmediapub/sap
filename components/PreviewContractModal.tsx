

import React from 'react';
import { Song, User } from '../types';
import Modal from './ui/Modal';

interface PreviewContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Partial<Song>;
  user: User;
  contractTemplate: string;
}

const PreviewContractModal: React.FC<PreviewContractModalProps> = ({ isOpen, onClose, song, user, contractTemplate }) => {
    
    const fillTemplate = () => {
        const submissionDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const writerNames = song.writers?.map(w => w.name).join(', ') || 'N/A';
        const artistNames = song.artists?.join(', ') || 'N/A';
        const mockIpAddress = `192.168.1.${Math.floor(Math.random() * 254) + 1} (Simulated IP)`; 

        return contractTemplate
            .replace(/\[SONG_TITLE\]/g, song.title || 'Untitled')
            .replace(/\[ARTIST_NAMES\]/g, artistNames)
            .replace(/\[WRITER_NAMES\]/g, writerNames)
            .replace(/\[SUBMITTER_NAME\]/g, user.name)
            .replace(/\[SUBMISSION_DATE\]/g, submissionDate)
            .replace(/\[SIGNING_IP_ADDRESS\]/g, mockIpAddress);
    }
    
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Publishing Agreement Preview`}>
      <div className="prose prose-invert prose-sm max-w-none bg-gray-900 p-4 rounded-md border border-gray-700 max-h-[60vh] overflow-y-auto">
        <pre className="whitespace-pre-wrap font-sans text-gray-300">{fillTemplate()}</pre>
      </div>
    </Modal>
  );
};

export default PreviewContractModal;
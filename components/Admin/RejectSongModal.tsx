
import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface RejectSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  songTitle: string;
}

const RejectSongModal: React.FC<RejectSongModalProps> = ({ isOpen, onClose, onSubmit, songTitle }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onSubmit(reason);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reject Song: ${songTitle}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="rejection-reason" className="block text-sm font-medium text-gray-300 mb-1">
            Reason for Rejection
          </label>
          <textarea
            id="rejection-reason"
            rows={4}
            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
          <p className="text-xs text-gray-400 mt-1">This reason will be shared with the submitter.</p>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" disabled={!reason.trim()}>
            Confirm Rejection
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RejectSongModal;
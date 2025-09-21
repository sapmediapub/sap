
import React, { useState, useEffect } from 'react';
import { Writer } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import WriterRepeater from '../WriterRepeater';

interface EditWritersModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWriters: Writer[];
  onSave: (writers: Writer[]) => void;
}

const EditWritersModal: React.FC<EditWritersModalProps> = ({ isOpen, onClose, initialWriters, onSave }) => {
  const [writers, setWriters] = useState<Writer[]>(initialWriters);

  useEffect(() => {
    // Reset state if the initial writers change (e.g., opening modal for a different song)
    setWriters(initialWriters);
  }, [initialWriters, isOpen]);
  
  const totalSplit = writers.reduce((sum, writer) => sum + Number(writer.split_percent || 0), 0);

  const handleSave = () => {
    if (totalSplit !== 100) {
        alert("Cannot save. The total writer split must be exactly 100%.");
        return;
    }
    onSave(writers);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Writers & Splits">
      <div className="space-y-6">
        <WriterRepeater writers={writers} setWriters={setWriters} />
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={totalSplit !== 100}>
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditWritersModal;

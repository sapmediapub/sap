
import React from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { generateContractPdf } from '../utils/contractGenerator';

interface ViewContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractText: string | undefined;
  songTitle: string;
}

const ViewContractModal: React.FC<ViewContractModalProps> = ({ isOpen, onClose, contractText, songTitle }) => {
  const handleDownload = () => {
    if (contractText) {
      generateContractPdf(songTitle, contractText);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Publishing Agreement">
      <div className="space-y-4">
        <div className="prose prose-invert prose-sm max-w-none bg-gray-900 p-4 rounded-md border border-gray-700 max-h-[60vh] overflow-y-auto">
          <pre className="whitespace-pre-wrap font-sans text-gray-300">{contractText || 'No contract text available.'}</pre>
        </div>
        <div className="flex justify-end">
            <Button onClick={handleDownload} disabled={!contractText}>
                Download PDF
            </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewContractModal;

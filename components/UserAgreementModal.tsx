
import React from 'react';
import Modal from './ui/Modal';
import { USER_AGREEMENT_TEMPLATE } from '../utils/legalTemplate';

interface UserAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserAgreementModal: React.FC<UserAgreementModalProps> = ({ isOpen, onClose }) => {
  const agreementText = USER_AGREEMENT_TEMPLATE
    .replace(/\[USER_NAME\]/g, 'the undersigned artist/writer')
    .replace(/\[SIGNUP_DATE\]/g, new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Exclusive Publishing Agreement">
      <div className="prose prose-invert prose-sm max-w-none bg-gray-900 p-4 rounded-md border border-gray-700 max-h-[60vh] overflow-y-auto">
        <pre className="whitespace-pre-wrap font-sans text-gray-300">{agreementText}</pre>
      </div>
    </Modal>
  );
};

export default UserAgreementModal;
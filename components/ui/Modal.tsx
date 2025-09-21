import React from 'react';
import Card from './Card';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg"
        onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <Card className="bg-gray-800 border-gray-700 shadow-xl" title={title}>
            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                aria-label="Close modal"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div className="mt-4">
                {children}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default Modal;

import React, { useState } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { startDate: string; endDate: string }) => void;
}

const DateRangeModal: React.FC<DateRangeModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      onSubmit({ startDate, endDate });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Statement Period">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Start Date"
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <Input
          label="End Date"
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Generate Statement
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DateRangeModal;

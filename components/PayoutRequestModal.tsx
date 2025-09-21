import React, 'react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';

interface PayoutRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  availableBalance: number;
}

type PaymentMethod = 'Bank' | 'PayPal' | 'MoMo';

const PayoutRequestModal: React.FC<PayoutRequestModalProps> = ({ isOpen, onClose, onSubmit, availableBalance }) => {
  const [method, setMethod] = React.useState<PaymentMethod>('Bank');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  const renderMethodFields = () => {
    switch (method) {
      case 'Bank':
        return (
          <>
            <Input label="Bank Name" id="bankName" name="bankName" required />
            <Input label="Account Number" id="accountNumber" name="accountNumber" required />
            <Input label="SWIFT / BIC Code" id="swiftCode" name="swiftCode" required />
          </>
        );
      case 'PayPal':
        return <Input label="PayPal Email" id="paypalEmail" name="paypalEmail" type="email" required />;
      case 'MoMo':
        return (
          <>
            <Input label="Mobile Money Provider" id="momoProvider" name="momoProvider" placeholder="e.g., MTN, Vodafone" required />
            <Input label="Phone Number" id="momoNumber" name="momoNumber" type="tel" required />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request a Payout">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <p className="text-sm text-gray-400">Available Balance</p>
            <p className="text-2xl font-bold text-green-400">${availableBalance.toFixed(2)}</p>
        </div>

        <Input 
          label="Amount" 
          id="amount" 
          name="amount" 
          type="number" 
          required 
          placeholder="0.00" 
          step="0.01"
          max={availableBalance}
        />
        
        <Select 
          label="Payment Method" 
          id="method"
          name="method"
          value={method} 
          onChange={(e) => setMethod(e.target.value as PaymentMethod)}
        >
          <option value="Bank">Bank Transfer</option>
          <option value="PayPal">PayPal</option>
          <option value="MoMo">Mobile Money (MoMo)</option>
        </Select>

        <div className="space-y-4">
            {renderMethodFields()}
        </div>

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

export default PayoutRequestModal;

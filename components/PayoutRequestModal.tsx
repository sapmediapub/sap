
import React from 'react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import { useAuth } from '../hooks/useAuth';
import { PaymentMethod } from '../types';

interface PayoutRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: number; method: PaymentMethod, details: any }) => void;
  availableBalance: number;
}


const PayoutRequestModal: React.FC<PayoutRequestModalProps> = ({ isOpen, onClose, onSubmit, availableBalance }) => {
  const { user } = useAuth();
  const [method, setMethod] = React.useState<PaymentMethod>(user?.payoutDetails?.preferredMethod || 'Bank');
  const [formData, setFormData] = React.useState({ ...user?.payoutDetails });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formElements = new FormData(form);
    const amount = formElements.get('amount') as string;
    
    // Extract details based on the selected method
    let details = {};
    switch (method) {
        case 'Bank':
            details = { bankName: formData.bankName, accountNumber: formData.accountNumber, swiftCode: formData.swiftCode };
            break;
        case 'PayPal':
            details = { paypalEmail: formData.paypalEmail };
            break;
        case 'MoMo':
            details = { momoProvider: formData.momoProvider, momoNumber: formData.momoNumber };
            break;
    }

    onSubmit({ amount: parseFloat(amount), method, details });
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const renderMethodFields = () => {
    switch (method) {
      case 'Bank':
        return (
          <>
            <Input label="Bank Name" id="bankName" name="bankName" value={formData.bankName || ''} onChange={(e) => handleFieldChange('bankName', e.target.value)} required />
            <Input label="Account Number" id="accountNumber" name="accountNumber" value={formData.accountNumber || ''} onChange={(e) => handleFieldChange('accountNumber', e.target.value)} required />
            <Input label="SWIFT / BIC Code" id="swiftCode" name="swiftCode" value={formData.swiftCode || ''} onChange={(e) => handleFieldChange('swiftCode', e.target.value)} required />
          </>
        );
      case 'PayPal':
        return <Input label="PayPal Email" id="paypalEmail" name="paypalEmail" type="email" value={formData.paypalEmail || ''} onChange={(e) => handleFieldChange('paypalEmail', e.target.value)} required />;
      case 'MoMo':
        return (
          <>
            <Input label="Mobile Money Provider" id="momoProvider" name="momoProvider" value={formData.momoProvider || ''} placeholder="e.g., MTN, Vodafone" onChange={(e) => handleFieldChange('momoProvider', e.target.value)} required />
            <Input label="Phone Number" id="momoNumber" name="momoNumber" type="tel" value={formData.momoNumber || ''} onChange={(e) => handleFieldChange('momoNumber', e.target.value)} required />
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
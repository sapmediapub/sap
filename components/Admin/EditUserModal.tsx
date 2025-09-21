import React, { useState, useEffect } from 'react';
import { User, UserRole, PayoutDetails } from '../../types';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (user: User) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState<User>(user);

  useEffect(() => {
    setFormData({ ...user, payoutDetails: user.payoutDetails || {} });
  }, [user]);

  const handleChange = (field: keyof User, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayoutChange = (field: keyof PayoutDetails, value: string) => {
    setFormData(prev => ({
        ...prev,
        payoutDetails: {
            ...(prev.payoutDetails || {}),
            [field]: value,
        }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderPayoutFields = () => {
    switch (formData.payoutDetails?.preferredMethod) {
      case 'Bank':
        return (
          <div className="space-y-4 mt-4">
            <Input label="Bank Name" id="bankName" value={formData.payoutDetails?.bankName || ''} onChange={(e) => handlePayoutChange('bankName', e.target.value)} />
            <Input label="Account Number" id="accountNumber" value={formData.payoutDetails?.accountNumber || ''} onChange={(e) => handlePayoutChange('accountNumber', e.target.value)} />
            <Input label="SWIFT / BIC Code" id="swiftCode" value={formData.payoutDetails?.swiftCode || ''} onChange={(e) => handlePayoutChange('swiftCode', e.target.value)} />
          </div>
        );
      case 'PayPal':
        return (
            <div className="space-y-4 mt-4">
                <Input label="PayPal Email" id="paypalEmail" type="email" value={formData.payoutDetails?.paypalEmail || ''} onChange={(e) => handlePayoutChange('paypalEmail', e.target.value)} />
            </div>
        );
      case 'MoMo':
        return (
          <div className="space-y-4 mt-4">
            <Input label="Mobile Money Provider" id="momoProvider" value={formData.payoutDetails?.momoProvider || ''} placeholder="e.g., MTN, Vodafone" onChange={(e) => handlePayoutChange('momoProvider', e.target.value)} />
            <Input label="Phone Number" id="momoNumber" type="tel" value={formData.payoutDetails?.momoNumber || ''} onChange={(e) => handlePayoutChange('momoNumber', e.target.value)} />
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit User: ${user.name}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Full Name"
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
        <Input
          label="Email Address"
          id="email"
          value={formData.email}
          disabled // Usually, email is not editable
          readOnly
        />
         <Select
          label="Role"
          id="role"
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value as UserRole)}
        >
          {Object.values(UserRole).map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </Select>
         <Input
          label="Country"
          id="country"
          value={formData.country}
          onChange={(e) => handleChange('country', e.target.value)}
          required
        />
        
        <div className="pt-4 mt-4 border-t border-gray-700">
            <h3 className="text-md font-semibold text-white mb-4">Payout Details</h3>
            <div className="space-y-4">
                <Select
                    label="Preferred Payout Method"
                    id="preferredMethod"
                    value={formData.payoutDetails?.preferredMethod || ''}
                    onChange={(e) => handlePayoutChange('preferredMethod', e.target.value as any)}
                    >
                    <option value="">Not Set</option>
                    <option value="Bank">Bank Transfer</option>
                    <option value="PayPal">PayPal</option>
                    <option value="MoMo">Mobile Money (MoMo)</option>
                </Select>
                {renderPayoutFields()}
            </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;
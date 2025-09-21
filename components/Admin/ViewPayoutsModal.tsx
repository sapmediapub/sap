import React from 'react';
import { User } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface ViewPayoutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const DetailItem: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-4 py-2">
        <dt className="text-sm font-medium text-gray-400">{label}</dt>
        <dd className="mt-1 text-sm text-white sm:mt-0 col-span-2">{value || <span className="text-gray-500">Not Provided</span>}</dd>
    </div>
);


const ViewPayoutsModal: React.FC<ViewPayoutsModalProps> = ({ isOpen, onClose, user }) => {
    const { payoutDetails } = user;

    const renderDetails = () => {
        if (!payoutDetails || !payoutDetails.preferredMethod) {
            return <p className="text-gray-400">This user has not configured their payout details.</p>;
        }

        return (
            <dl className="divide-y divide-gray-700">
                <DetailItem label="Preferred Method" value={payoutDetails.preferredMethod} />
                {payoutDetails.preferredMethod === 'Bank' && (
                    <>
                        <DetailItem label="Bank Name" value={payoutDetails.bankName} />
                        <DetailItem label="Account Number" value={payoutDetails.accountNumber} />
                        <DetailItem label="SWIFT / BIC Code" value={payoutDetails.swiftCode} />
                    </>
                )}
                {payoutDetails.preferredMethod === 'PayPal' && (
                    <DetailItem label="PayPal Email" value={payoutDetails.paypalEmail} />
                )}
                {payoutDetails.preferredMethod === 'MoMo' && (
                    <>
                        <DetailItem label="Provider" value={payoutDetails.momoProvider} />
                        <DetailItem label="Phone Number" value={payoutDetails.momoNumber} />
                    </>
                )}
            </dl>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Payout Details for ${user.name}`}>
            <div className="space-y-4">
                {renderDetails()}
                <div className="flex justify-end pt-4 mt-4 border-t border-gray-700">
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ViewPayoutsModal;

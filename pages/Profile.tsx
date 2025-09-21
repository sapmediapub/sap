import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, PayoutDetails, PaymentMethod } from '../types';
import { PRO_LIST } from '../constants';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Link } from 'react-router-dom';

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 border-t border-gray-700 first:border-t-0">
        <dt className="text-sm font-medium text-gray-400">{label}</dt>
        <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{value}</dd>
    </div>
);

const Profile: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<User | null>(user);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        // Ensure payoutDetails is an object to prevent errors
        setFormData(user ? { ...user, payoutDetails: user.payoutDetails || {} } : null);
    }, [user]);

    if (!user || !formData) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold">Please log in</h1>
                <p className="text-gray-400">You need to be logged in to view your profile.</p>
                <Link to="/login" className="mt-4 inline-block"><Button>Go to Login</Button></Link>
            </div>
        );
    }

    const handleChange = (field: keyof User, value: string) => {
        setFormData(prev => (prev ? { ...prev, [field]: value } : null));
    };

    const handlePayoutChange = (field: keyof PayoutDetails, value: string) => {
        setFormData(prev => (prev ? {
            ...prev,
            payoutDetails: {
                ...(prev.payoutDetails || {}),
                [field]: value,
            }
        } : null));
    };

    const handleSave = () => {
        if (formData) {
            updateUser(formData);
            setIsEditing(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }
    };

    const handleCancel = () => {
        setFormData(user);
        setIsEditing(false);
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

    const renderPayoutDetails = () => {
        const details = user.payoutDetails;
        if (!details || !details.preferredMethod) {
            return <DetailRow label="Preferred Method" value="Not set" />;
        }
        return (
            <>
                <DetailRow label="Preferred Method" value={details.preferredMethod} />
                {details.preferredMethod === 'Bank' && (
                    <>
                        <DetailRow label="Bank Name" value={details.bankName} />
                        <DetailRow label="Account Number" value={details.accountNumber} />
                        <DetailRow label="SWIFT Code" value={details.swiftCode} />
                    </>
                )}
                {details.preferredMethod === 'PayPal' && <DetailRow label="PayPal Email" value={details.paypalEmail} />}
                {details.preferredMethod === 'MoMo' && (
                    <>
                        <DetailRow label="Provider" value={details.momoProvider} />
                        <DetailRow label="Number" value={details.momoNumber} />
                    </>
                )}
            </>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">My Profile</h1>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                )}
            </div>

            {saveSuccess && (
                <div className="bg-green-800 border border-green-600 text-green-200 p-3 rounded-lg text-sm transition-opacity duration-300">
                    Profile updated successfully!
                </div>
            )}
            
            <Card title="Account Information">
                {isEditing ? (
                    <div className="space-y-4 p-6">
                        <Input label="Full Name" id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required />
                        <Input label="Email Address (Cannot be changed)" id="email" value={formData.email} disabled readOnly />
                        <Input label="Country" id="country" value={formData.country} onChange={(e) => handleChange('country', e.target.value)} required />
                        <Select label="PRO" id="pro" value={formData.pro || ''} onChange={(e) => handleChange('pro', e.target.value)}>
                             <option value="">Select your PRO</option>
                             {PRO_LIST.map((pro) => ( <option key={pro} value={pro}>{pro}</option> ))}
                        </Select>
                        <Input label="IPI/CAE #" id="ipi_cae" value={formData.ipi_cae || ''} onChange={(e) => handleChange('ipi_cae', e.target.value)} />
                    </div>
                ) : (
                    <div className="p-6">
                        <dl>
                            <DetailRow label="Full Name" value={user.name} />
                            <DetailRow label="Email" value={user.email} />
                            <DetailRow label="Role" value={<span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-900 text-indigo-200">{user.role}</span>} />
                            <DetailRow label="Country" value={user.country} />
                            <DetailRow label="PRO" value={user.pro || 'Not set'} />
                            <DetailRow label="IPI/CAE #" value={user.ipi_cae || 'Not set'} />
                        </dl>
                    </div>
                )}
            </Card>

            <Card title="Payout Details">
                <div className="p-6">
                    {isEditing ? (
                        <div className="space-y-4">
                            <Select
                                label="Preferred Payout Method"
                                id="preferredMethod"
                                value={formData.payoutDetails?.preferredMethod || ''}
                                onChange={(e) => handlePayoutChange('preferredMethod', e.target.value as PaymentMethod)}
                            >
                                <option value="">Not Set</option>
                                <option value="Bank">Bank Transfer</option>
                                <option value="PayPal">PayPal</option>
                                <option value="MoMo">Mobile Money (MoMo)</option>
                            </Select>
                            {renderPayoutFields()}
                        </div>
                    ) : (
                        <dl>
                           {renderPayoutDetails()}
                        </dl>
                    )}
                </div>
            </Card>

            {isEditing && (
                <div className="flex justify-end space-x-3 mt-6">
                    <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </div>
            )}
        </div>
    );
};

export default Profile;
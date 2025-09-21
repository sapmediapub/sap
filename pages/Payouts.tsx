
import React, { useState, useMemo } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PayoutRequestModal from '../components/PayoutRequestModal';
import { usePayouts } from '../contexts/PayoutContext';
import { useAuth } from '../hooks/useAuth';
import { Payout, PayoutStatus } from '../types';

const AVAILABLE_BALANCE = 3456.78; // This would come from an API in a real app

const Payouts: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { payouts, requestPayout } = usePayouts();

  const userPayouts = useMemo(() => {
    if (!user) return [];
    // Sort by most recent first
    return payouts.filter(p => p.userId === user.id).sort((a, b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime());
  }, [payouts, user]);

  const handleRequestPayout = (data: { amount: number; method: 'Bank' | 'PayPal' | 'MoMo', details: any }) => {
    if (!user || !user.payoutDetails) {
        alert("Please set up your payout details in your profile first.");
        return;
    }

    const payoutDetails = {
        preferredMethod: data.method,
        ...data.details,
    };
    
    requestPayout(parseFloat(data.amount.toString()), payoutDetails);
    
    alert(`Payout request for $${data.amount} via ${data.method} submitted successfully!`);
    setIsModalOpen(false);
  };
  
  const getStatusColor = (status: PayoutStatus) => {
    switch (status) {
      case PayoutStatus.PAID: return 'bg-green-900 text-green-200';
      case PayoutStatus.APPROVED: return 'bg-blue-900 text-blue-200';
      case PayoutStatus.PENDING: return 'bg-yellow-900 text-yellow-200';
      case PayoutStatus.REJECTED: return 'bg-red-900 text-red-200';
      default: return 'bg-gray-700 text-gray-200';
    }
  };

  return (
    <>
      <PayoutRequestModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRequestPayout}
        availableBalance={AVAILABLE_BALANCE}
      />
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Payouts</h1>
          <p className="text-gray-400">Request payouts for your available balance and view your history.</p>
        </div>

        <Card className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
              <p className="text-gray-400">Available Balance</p>
              <p className="text-4xl font-bold text-green-400">${AVAILABLE_BALANCE.toFixed(2)}</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto">
            Request Payout
          </Button>
        </Card>

        <Card title="Payout History">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date Requested</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Method</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {userPayouts.map((payout: Payout) => (
                  <tr key={payout.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(payout.requestedDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{payout.payoutDetails.preferredMethod}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payout.status)}`}>
                          {payout.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-white">${payout.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Payouts;
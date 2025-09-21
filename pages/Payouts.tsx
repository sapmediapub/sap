import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import PayoutRequestModal from '../components/PayoutRequestModal';

const MOCK_PAYOUTS = [
    { id: 'p1', date: '2024-04-20', amount: 1200.00, status: 'Paid', method: 'Bank Transfer' },
    { id: 'p2', date: '2024-01-18', amount: 850.50, status: 'Paid', method: 'PayPal' },
    { id: 'p3', date: '2023-10-15', amount: 1500.75, status: 'Paid', method: 'Bank Transfer' },
];

const AVAILABLE_BALANCE = 3456.78;

const Payouts: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRequestPayout = (data: any) => {
    console.log('Payout requested:', data);
    alert(`Payout request for $${data.amount} via ${data.method} submitted successfully!`);
    setIsModalOpen(false);
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date Processed</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Method</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {MOCK_PAYOUTS.map((payout) => (
                  <tr key={payout.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{payout.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{payout.method}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-200">
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

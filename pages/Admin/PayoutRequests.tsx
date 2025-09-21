
import React, { useState, useMemo, useEffect } from 'react';
import { Payout, PayoutStatus } from '../../types';
import { usePayouts } from '../../contexts/PayoutContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import RejectPayoutModal from '../../components/Admin/RejectPayoutModal';
import Pagination from '../../components/ui/Pagination';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';

const PayoutManager: React.FC = () => {
  const { payouts, approvePayout, rejectPayout, markAsPaid } = usePayouts();
  const [payoutToReject, setPayoutToReject] = useState<Payout | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<PayoutStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('date_desc');
  const ITEMS_PER_PAGE = 10;

  // Reset pagination when filters or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchQuery, sortOption]);

  const getStatusColor = (status: PayoutStatus) => {
    switch (status) {
      case PayoutStatus.PAID: return 'bg-green-900 text-green-200';
      case PayoutStatus.APPROVED: return 'bg-blue-900 text-blue-200';
      case PayoutStatus.PENDING: return 'bg-yellow-900 text-yellow-200';
      case PayoutStatus.REJECTED: return 'bg-red-900 text-red-200';
      default: return 'bg-gray-700 text-gray-200';
    }
  };

  const filteredAndSortedPayouts = useMemo(() => {
    let filtered = payouts;

    // Apply status filter
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    // Apply search filter
    if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(p => p.userName.toLowerCase().includes(lowercasedQuery));
    }

    // Apply sorting
    return filtered.sort((a, b) => {
        const getDate = (p: Payout) => new Date(p.processedDate || p.requestedDate).getTime();
        switch (sortOption) {
            case 'date_asc': return getDate(a) - getDate(b);
            case 'amount_desc': return b.amount - a.amount;
            case 'amount_asc': return a.amount - b.amount;
            case 'date_desc':
            default: return getDate(b) - getDate(a);
        }
    });
  }, [payouts, filterStatus, searchQuery, sortOption]);

  const totalPages = Math.ceil(filteredAndSortedPayouts.length / ITEMS_PER_PAGE);
  const paginatedPayouts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedPayouts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedPayouts, currentPage]);

  const paginationInfo = useMemo(() => {
    const totalCount = filteredAndSortedPayouts.length;
    if (totalCount === 0) return '';
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalCount);
    return `Showing ${startIndex} to ${endIndex} of ${totalCount} requests`;
  }, [filteredAndSortedPayouts.length, currentPage]);

  const handleRejectSubmit = (reason: string) => {
    if (!payoutToReject) return;
    rejectPayout(payoutToReject.id, reason);
    setPayoutToReject(null);
  };

  return (
    <>
      {payoutToReject && (
        <RejectPayoutModal
          isOpen={!!payoutToReject}
          onClose={() => setPayoutToReject(null)}
          onSubmit={handleRejectSubmit}
          payout={payoutToReject}
        />
      )}
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white">Payout Manager</h1>
        
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
             <div className="md:col-span-1">
                <Input
                    label="Search by User Name"
                    id="payout-search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g., Burna Boy"
                />
            </div>
            <Select
              label="Filter by Status"
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as PayoutStatus | 'ALL')}
            >
              <option value="ALL">All Statuses</option>
              {Object.values(PayoutStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Select>
            <Select label="Sort by" id="sort-order" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="date_desc">Date (Newest First)</option>
                <option value="date_asc">Date (Oldest First)</option>
                <option value="amount_desc">Amount (High to Low)</option>
                <option value="amount_asc">Amount (Low to High)</option>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Payout Method</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions / Notes</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {paginatedPayouts.map(payout => (
                  <tr key={payout.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(payout.processedDate || payout.requestedDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{payout.userName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{payout.payoutDetails.preferredMethod}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payout.status)}`}>
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-green-400">${payout.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {payout.status === PayoutStatus.PENDING && (
                            <div className="flex justify-end gap-2">
                                <Button variant="primary" size="sm" onClick={() => approvePayout(payout.id)}>Approve</Button>
                                <Button variant="danger" size="sm" onClick={() => setPayoutToReject(payout)}>Reject</Button>
                            </div>
                        )}
                        {payout.status === PayoutStatus.APPROVED && (
                            <Button variant="primary" size="sm" onClick={() => markAsPaid(payout.id)}>Mark as Paid</Button>
                        )}
                        {payout.status === PayoutStatus.REJECTED && (
                            <span className="text-gray-400 italic text-xs">{payout.rejectionReason}</span>
                        )}
                         {payout.status === PayoutStatus.PAID && (
                            <span className="text-gray-500 italic text-xs">Payment completed.</span>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAndSortedPayouts.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-400">No payout requests match the current filters.</p>
                </div>
            )}
          </div>
          {filteredAndSortedPayouts.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-400">{paginationInfo}</span>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default PayoutManager;
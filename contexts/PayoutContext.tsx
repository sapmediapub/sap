
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Payout, PayoutStatus, PayoutDetails, UserRole } from '../types';
import { MOCK_PAYOUTS } from '../mockData';
import { useAuth } from '../hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';

interface PayoutContextType {
  payouts: Payout[];
  requestPayout: (amount: number, payoutDetails: PayoutDetails) => void;
  approvePayout: (payoutId: string) => void;
  rejectPayout: (payoutId: string, reason: string) => void;
  markAsPaid: (payoutId: string) => void;
}

const PayoutContext = createContext<PayoutContextType | undefined>(undefined);

export const PayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [payouts, setPayouts] = useState<Payout[]>(MOCK_PAYOUTS);
  const { user } = useAuth();

  const requestPayout = (amount: number, payoutDetails: PayoutDetails) => {
    if (!user) return;
    const newPayout: Payout = {
      id: uuidv4(),
      userId: user.id,
      userName: user.name,
      amount,
      payoutDetails,
      status: PayoutStatus.PENDING,
      requestedDate: new Date().toISOString(),
    };
    setPayouts(prev => [...prev, newPayout]);
  };

  const approvePayout = (payoutId: string) => {
    if (!user || user.role !== UserRole.ADMIN) return;
    setPayouts(payouts.map(p => 
      p.id === payoutId 
        ? { ...p, status: PayoutStatus.APPROVED, processedDate: new Date().toISOString() } 
        : p
    ));
  };

  const rejectPayout = (payoutId: string, reason: string) => {
    if (!user || user.role !== UserRole.ADMIN) return;
    setPayouts(payouts.map(p => 
      p.id === payoutId 
        ? { ...p, status: PayoutStatus.REJECTED, rejectionReason: reason, processedDate: new Date().toISOString() } 
        : p
    ));
  };
  
  const markAsPaid = (payoutId: string) => {
    if (!user || user.role !== UserRole.ADMIN) return;
    setPayouts(payouts.map(p =>
      p.id === payoutId && p.status === PayoutStatus.APPROVED
        ? { ...p, status: PayoutStatus.PAID, processedDate: new Date().toISOString() }
        : p
    ));
  };

  return (
    <PayoutContext.Provider value={{ payouts, requestPayout, approvePayout, rejectPayout, markAsPaid }}>
      {children}
    </PayoutContext.Provider>
  );
};

export const usePayouts = (): PayoutContextType => {
  const context = useContext(PayoutContext);
  if (context === undefined) {
    throw new Error('usePayouts must be used within a PayoutProvider');
  }
  return context;
};